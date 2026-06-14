<?php

namespace App\Services\Support;

use App\Enums\Support\SupportTicketStatus;
use App\Models\Cliente\ClientProfile;
use App\Models\Produtor\ProducerProfile;
use App\Models\Support\SupportTicket;
use App\Models\Support\SupportTicketMessage;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class SupportTicketService
{
    /** Abre um novo chamado */
    public function open(array $data): SupportTicket
    {
        return DB::transaction(function () use ($data) {
            $user = auth()->user();

            $clientProfileId = null;
            $producerProfileId = null;
            $consultorId = null;

            if ($user->role_id === RoleUser::$CLIENTE) {
                $profile = ClientProfile::where('platform_user_id', $user->id)->first();
                $clientProfileId = $profile?->id;
                $consultorId = $profile?->consultor_user_id;
            }

            if ($user->role_id === RoleUser::$PRODUTOR) {
                $profile = ProducerProfile::where('platform_user_id', $user->id)->first();
                $producerProfileId = $profile?->id;
                $consultorId = $profile?->consultor_user_id;
            }

            return SupportTicket::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'category' => $data['category'] ?? 'outros',
                'priority' => $data['priority'] ?? 'normal',
                'status' => SupportTicketStatus::Novo->value,
                'opened_by_user_id' => $user->id,
                'client_profile_id' => $clientProfileId,
                'producer_profile_id' => $producerProfileId,
                'consultor_user_id' => $consultorId,
            ]);
        });
    }

    /** Adiciona mensagem ao chamado */
    public function addMessage(SupportTicket $ticket, string $message, bool $isInternal = false): SupportTicketMessage
    {
        return DB::transaction(function () use ($ticket, $message, $isInternal) {
            $user = auth()->user();
            $isStaff = in_array($user->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR]);

            $msg = SupportTicketMessage::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'message' => $message,
                'is_internal' => $isInternal && $isStaff,
            ]);

            // Marca primeira resposta do staff
            if ($isStaff && ! $ticket->first_response_at) {
                $ticket->update(['first_response_at' => now()]);
            }

            // Muda status automaticamente
            if ($isStaff && $ticket->status === SupportTicketStatus::Novo) {
                $ticket->update(['status' => SupportTicketStatus::EmAtendimento->value]);
            }

            if (! $isStaff && $ticket->status === SupportTicketStatus::AguardandoCliente) {
                $ticket->update(['status' => SupportTicketStatus::EmAtendimento->value]);
            }

            return $msg->load('user');
        });
    }

    /** Muda o status do chamado */
    public function changeStatus(SupportTicket $ticket, SupportTicketStatus $newStatus, ?string $note = null): SupportTicket
    {
        if (! $ticket->canTransitionTo($newStatus)) {
            throw new InvalidArgumentException(
                "Transição de '{$ticket->status->label()}' para '{$newStatus->label()}' não é permitida."
            );
        }

        return DB::transaction(function () use ($ticket, $newStatus, $note) {
            $updates = ['status' => $newStatus->value];

            if ($newStatus === SupportTicketStatus::Resolvido) {
                $updates['resolved_at'] = now();
            }
            if ($newStatus === SupportTicketStatus::Fechado) {
                $updates['closed_at'] = now();
            }

            $ticket->update($updates);

            if ($note) {
                SupportTicketMessage::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => auth()->id(),
                    'message' => $note,
                    'is_internal' => true,
                ]);
            }

            return $ticket->fresh();
        });
    }

    /** Query base filtrada por role */
    public function queryForCurrentUser()
    {
        $user = auth()->user();

        $query = SupportTicket::query()
            ->with(['openedBy', 'assignedTo', 'consultor', 'lastMessage', 'clientProfile', 'producerProfile'])
            ->orderByDesc('created_at');

        return match ((int) $user->role_id) {
            RoleUser::$ADMIN => $query,

            RoleUser::$CONSULTOR => $query->where(function ($q) use ($user) {
                $q->where('consultor_user_id', $user->id)
                    ->orWhere('assigned_to_user_id', $user->id);
            }),

            RoleUser::$CLIENTE => $query->where('opened_by_user_id', $user->id),
            RoleUser::$PRODUTOR => $query->where('opened_by_user_id', $user->id),

            default => $query->whereRaw('1 = 0'),
        };
    }

    /** Quantidade de chamados com status "Novo" visíveis para o usuário atual */
    public function countNew(): int
    {
        return $this->queryForCurrentUser()
            ->where('status', SupportTicketStatus::Novo->value)
            ->count();
    }

    /** Estatísticas de resumo */
    public function getSummary(): array
    {
        $q = $this->queryForCurrentUser();

        return [
            'total' => (clone $q)->count(),
            'novos' => (clone $q)->where('status', SupportTicketStatus::Novo->value)->count(),
            'em_atendimento' => (clone $q)->where('status', SupportTicketStatus::EmAtendimento->value)->count(),
            'aguardando' => (clone $q)->where('status', SupportTicketStatus::AguardandoCliente->value)->count(),
            'resolvidos' => (clone $q)->where('status', SupportTicketStatus::Resolvido->value)->count(),
            'fechados' => (clone $q)->where('status', SupportTicketStatus::Fechado->value)->count(),
            'abertos' => (clone $q)->whereIn('status', [
                SupportTicketStatus::Novo->value,
                SupportTicketStatus::EmAtendimento->value,
                SupportTicketStatus::AguardandoCliente->value,
            ])->count(),
        ];
    }
}

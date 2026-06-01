<?php

namespace App\Http\Controllers\Support;

use App\Enums\Support\SupportTicketCategory;
use App\Enums\Support\SupportTicketPriority;
use App\Enums\Support\SupportTicketStatus;
use App\Http\Controllers\Controller;
use App\Models\Support\SupportTicket;
use App\Services\Support\SupportTicketService;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportTicketController extends Controller
{
    public function __construct(private readonly SupportTicketService $service) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'priority', 'category']);

        $query = $this->service->queryForCurrentUser();

        if (!empty($filters['search'])) {
            $query->where(fn ($q) =>
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('ticket_code', 'like', "%{$filters['search']}%")
            );
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return Inertia::render('Support/Index/Page', [
            'tickets'    => $query->paginate(15)->withQueryString(),
            'filters'    => $filters,
            'summary'    => $this->service->getSummary(),
            'statusOpts' => SupportTicketStatus::options(),
            'roleId'     => auth()->user()->role_id,
        ]);
    }

    public function create()
    {
        return Inertia::render('Support/Create/Page', [
            'categories' => SupportTicketCategory::options(),
            'priorities' => SupportTicketPriority::options(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'min:5', 'max:200'],
            'description' => ['required', 'string', 'min:10'],
            'category'    => ['required', 'string'],
            'priority'    => ['nullable', 'string'],
        ], [
            'title.required'       => 'O título é obrigatório.',
            'title.min'            => 'O título deve ter pelo menos 5 caracteres.',
            'description.required' => 'A descrição é obrigatória.',
            'description.min'      => 'Descreva melhor o problema (mínimo 10 caracteres).',
            'category.required'    => 'Selecione uma categoria.',
        ]);

        $ticket = $this->service->open($data);

        return redirect()
            ->route('support.tickets.show', $ticket->id)
            ->with('success', "Chamado {$ticket->ticket_code} aberto com sucesso.");
    }

    public function show(SupportTicket $ticket)
    {
        $this->authorizeView($ticket);

        $isStaff = in_array(auth()->user()->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR]);

        $ticket->load([
            'openedBy',
            'assignedTo',
            'consultor',
            'clientProfile.contacts',
            'producerProfile.contacts',
            'messages.user',
        ]);

        // Filtra notas internas para não-staff
        if (!$isStaff) {
            $ticket->setRelation(
                'messages',
                $ticket->messages->where('is_internal', false)->values()
            );
        }

        return Inertia::render('Support/Show/Page', [
            'ticket'     => $ticket,
            'statusOpts' => SupportTicketStatus::options(),
            'isStaff'    => $isStaff,
            'roleId'     => auth()->user()->role_id,
            'allowedTransitions' => array_map(
                fn ($s) => $s->value,
                $ticket->status->allowedTransitions()
            ),
        ]);
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $this->authorizeStaff($ticket);

        $data = $request->validate([
            'status' => ['required', 'string'],
            'note'   => ['nullable', 'string', 'max:1000'],
        ]);

        $newStatus = SupportTicketStatus::from($data['status']);

        try {
            $this->service->changeStatus($ticket, $newStatus, $data['note'] ?? null);
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', "Status atualizado para: {$newStatus->label()}.");
    }

    public function addMessage(Request $request, SupportTicket $ticket)
    {
        $this->authorizeView($ticket);

        if ($ticket->isClosed()) {
            return back()->with('error', 'Não é possível responder a um chamado fechado ou cancelado.');
        }

        $isStaff = in_array(auth()->user()->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR]);

        $data = $request->validate([
            'message'     => ['required', 'string', 'min:2'],
            'is_internal' => ['boolean'],
        ], [
            'message.required' => 'A mensagem não pode estar vazia.',
        ]);

        $this->service->addMessage(
            $ticket,
            $data['message'],
            $isStaff && ($data['is_internal'] ?? false),
        );

        return back()->with('success', 'Mensagem enviada.');
    }

    public function cancel(SupportTicket $ticket)
    {
        abort_if(
            $ticket->opened_by_user_id !== auth()->id() && !in_array(auth()->user()->role_id, [1, 2]),
            403
        );

        if ($ticket->isClosed()) {
            return back()->with('error', 'Chamado já está encerrado.');
        }

        $this->service->changeStatus(
            $ticket,
            SupportTicketStatus::Cancelado,
            'Chamado cancelado pelo usuário.'
        );

        return redirect()->route('support.tickets.index')
            ->with('success', 'Chamado cancelado.');
    }

    // ── Private ───────────────────────────────────────────────────────────

    private function authorizeView(SupportTicket $ticket): void
    {
        $user = auth()->user();

        $allowed =
            $user->role_id === RoleUser::$ADMIN ||
            $ticket->opened_by_user_id === $user->id ||
            $ticket->consultor_user_id === $user->id ||
            $ticket->assigned_to_user_id === $user->id;

        abort_if(!$allowed, 403, 'Sem permissão para acessar este chamado.');
    }

    private function authorizeStaff(SupportTicket $ticket): void
    {
        $user = auth()->user();

        $allowed =
            $user->role_id === RoleUser::$ADMIN ||
            $ticket->consultor_user_id === $user->id ||
            $ticket->assigned_to_user_id === $user->id;

        abort_if(!$allowed, 403, 'Apenas staff pode alterar o status do chamado.');
    }
}

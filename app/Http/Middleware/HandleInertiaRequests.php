<?php

namespace App\Http\Middleware;

use App\Enums\Fatura\BillReviewStatus;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Users\User;
use App\Models\WhatsApp\WhatsAppMessageTemplate;
use App\Services\Support\SupportTicketService;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function __construct(private readonly SupportTicketService $supportTicketService) {}

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'nome' => $user->nome,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                    'role_name' => $user->role_name,
                    'consultor_id' => $user->consultor_id,
                    'status' => $user->status,
                    'status_nome' => $user->status_nome,
                    'dados_acesso' => $user->dados_acesso,
                ] : null,
            ],
            'alert' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
                'client_created' => fn () => $request->session()->get('client_created'),
                'client_id' => fn () => $request->session()->get('client_id'),
                'producer_created' => fn () => $request->session()->get('producer_created'),
                'producer_id' => fn () => $request->session()->get('producer_id'),
                'invite_link' => fn () => $request->session()->get('invite_link'),
                'invite_email' => fn () => $request->session()->get('invite_email'),
            ],
            'navBadges' => fn () => $this->resolveNavBadges($user),
            'whatsappTemplates' => fn () => $user ? $this->resolveWhatsAppTemplates() : [],
        ];
    }

    /** Templates ativos de mensagens do WhatsApp, disponíveis para os botões em todo o sistema */
    private function resolveWhatsAppTemplates(): array
    {
        return WhatsAppMessageTemplate::query()
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get(['key', 'name', 'category', 'message', 'available_variables'])
            ->toArray();
    }

    /** Contadores exibidos nos atalhos do menu superior (admin/consultor) */
    private function resolveNavBadges(?User $user): ?array
    {
        if (! $user || ! in_array($user->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true)) {
            return null;
        }

        $pendingReviewBills = ConcessionaireBill::query()
            ->where('review_status', BillReviewStatus::PENDING_REVIEW->value)
            ->when($user->role_id === RoleUser::$CONSULTOR, function ($query) use ($user) {
                $query->whereHas('clientProfile', function ($q) use ($user) {
                    $q->where('consultor_user_id', $user->id);
                });
            })
            ->count();

        return [
            'pendingReviewBills' => $pendingReviewBills,
            'newSupportTickets' => $this->supportTicketService->countNew(),
        ];
    }
}

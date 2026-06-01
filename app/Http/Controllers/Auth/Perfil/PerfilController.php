<?php

namespace App\Http\Controllers\Auth\Perfil;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\src\Roles\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PerfilController extends Controller
{
    public function index()
    {
        $user = auth()->user()->load('consultor');

        $extra = $this->buildRoleExtra($user);

        return Inertia::render('Auth/Perfil/Index/Page', [
            'user'  => $this->userPayload($user),
            'extra' => $extra,
        ]);
    }

    public function updateInfo(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'name'  => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email', 'max:200', "unique:users,email,{$user->id}"],
        ], [
            'name.required'  => 'O nome é obrigatório.',
            'name.min'       => 'O nome deve ter pelo menos 2 caracteres.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email'    => 'Informe um e-mail válido.',
            'email.unique'   => 'Este e-mail já está em uso por outro usuário.',
        ]);

        if ($user->email !== $data['email']) {
            $data['email_verified_at'] = null;
        }

        $user->update($data);

        return back()->with('success', 'Informações atualizadas com sucesso.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'password'              => ['required', Password::min(6)->letters()->numbers(), 'confirmed'],
            'password_confirmation' => ['required'],
        ], [
            'password.required'     => 'A nova senha é obrigatória.',
            'password.min'          => 'A senha deve ter pelo menos 6 caracteres.',
            'password.letters'      => 'A senha deve conter letras.',
            'password.numbers'      => 'A senha deve conter números.',
            'password.confirmed'    => 'As senhas não coincidem.',
            'password_confirmation.required' => 'Confirme a nova senha.',
        ]);

        auth()->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success_senha', 'Senha alterada com sucesso.');
    }

    // ─── Private ──────────────────────────────────────────────────────────

    private function userPayload($user): array
    {
        return [
            'id'               => $user->id,
            'name'             => $user->name,
            'email'            => $user->email,
            'role_id'          => $user->role_id,
            'role_name'        => $user->role_name,
            'status'           => $user->status,
            'status_nome'      => $user->status_nome,
            'cadastrado_em'    => $user->cadastrado_em,
            'email_verified_at'=> $user->email_verified_at?->format('d/m/Y H:i'),
            'consultor'        => $user->consultor ? [
                'id'    => $user->consultor->id,
                'name'  => $user->consultor->name,
                'email' => $user->consultor->email,
            ] : null,
        ];
    }

    private function buildRoleExtra($user): array
    {
        return match ((int) $user->role_id) {
            RoleUser::$ADMIN     => $this->extraAdmin(),
            RoleUser::$CONSULTOR => $this->extraConsultor($user->id),
            RoleUser::$CLIENTE   => $this->extraCliente($user->id),
            RoleUser::$PRODUTOR  => $this->extraProdutor($user->id),
            default              => [],
        };
    }

    private function extraAdmin(): array
    {
        return [
            'label' => 'Administrador',
            'stats' => [],
        ];
    }

    private function extraConsultor(int $userId): array
    {
        $clientesTotal  = ClientProfile::where('consultor_user_id', $userId)->count();
        $clientesAtivos = ClientProfile::where('consultor_user_id', $userId)
            ->where(fn ($q) => $q->where('is_active_client', true)->orWhere('status', 'contrato_assinado'))
            ->count();
        $propostasAbertas = CommercialProposal::where('consultor_user_id', $userId)
            ->whereIn('status', ['emitida', 'enviada', 'em_analise'])
            ->count();

        return [
            'label' => 'Consultor Comercial',
            'stats' => [
                ['label' => 'Total de clientes',     'value' => $clientesTotal],
                ['label' => 'Clientes ativos',       'value' => $clientesAtivos],
                ['label' => 'Propostas em aberto',   'value' => $propostasAbertas],
            ],
        ];
    }

    private function extraCliente(int $userId): array
    {
        $profile = ClientProfile::with('activeDiscountRule', 'activeUsinaLink.usina')
            ->where('platform_user_id', $userId)->first();

        if (!$profile) {
            return ['label' => 'Cliente', 'stats' => []];
        }

        $billsCount = ConcessionaireBill::where('client_profile_id', $profile->id)
            ->where('review_status', 'approved')->count();
        $savings    = (float) CustomerCharge::where('client_profile_id', $profile->id)
            ->whereIn('status', ['paid', 'open', 'waiting_payment', 'overdue'])
            ->sum('discount_amount');

        return [
            'label'   => 'Cliente Consumidor',
            'profile' => [
                'client_code'   => $profile->client_code,
                'display_name'  => $profile->display_name,
                'status'        => $profile->status,
                'discount'      => (float) ($profile->activeDiscountRule?->discount_percent ?? 0),
                'usina_nome'    => $profile->activeUsinaLink?->usina?->usina_nome,
            ],
            'stats' => [
                ['label' => 'Código do cliente',    'value' => $profile->client_code],
                ['label' => 'Desconto ativo',       'value' => ($profile->activeDiscountRule?->discount_percent ?? 0) . '%'],
                ['label' => 'Faturas aprovadas',    'value' => $billsCount],
                ['label' => 'Total economizado',    'value' => 'R$ ' . number_format($savings, 2, ',', '.')],
            ],
        ];
    }

    private function extraProdutor(int $userId): array
    {
        $profile = ProducerProfile::with('usinas')->where('platform_user_id', $userId)->first();

        return [
            'label'   => 'Produtor Solar',
            'profile' => $profile ? [
                'producer_code' => $profile->producer_code,
                'status'        => $profile->status,
            ] : null,
            'stats' => $profile ? [
                ['label' => 'Código',          'value' => $profile->producer_code],
                ['label' => 'Status',          'value' => $profile->status],
                ['label' => 'Usinas',          'value' => $profile->usinas->count()],
            ] : [],
        ];
    }
}

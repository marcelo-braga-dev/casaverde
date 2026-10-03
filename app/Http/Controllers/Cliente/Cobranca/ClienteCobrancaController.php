<?php

namespace App\Http\Controllers\Cliente\Cobranca;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use Inertia\Inertia;

class ClienteCobrancaController extends Controller
{
    private function getProfile(): ?ClientProfile
    {
        return ClientProfile::query()
            ->where('platform_user_id', auth()->id())
            ->first();
    }

    public function index()
    {
        $profile = $this->getProfile();

        $filters = request()->only(['status', 'year']);

        $query = CustomerCharge::query()
            ->where('client_profile_id', $profile?->id ?? 0)
            ->orderByDesc('created_at');

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['year'])) {
            $query->where('reference_year', $filters['year']);
        }

        return Inertia::render('Cliente/Cobrancas/Index/Page', [
            'cobrancas' => $query->paginate(12)->withQueryString(),
            'filters' => $filters,
            'profile' => $profile,
            'totais' => $this->getTotais($profile?->id ?? 0),
        ]);
    }

    public function show(CustomerCharge $cobranca)
    {
        $profile = $this->getProfile();

        abort_if(
            $cobranca->client_profile_id !== $profile?->id,
            403,
            'Acesso não autorizado a esta cobrança.'
        );

        $cobranca->load(['bill.concessionaria', 'adjustments']);

        return Inertia::render('Cliente/Cobrancas/Show/Page', [
            'cobranca' => $cobranca,
            'profile' => $profile,
            'pagamento' => $this->pagamentoDisponivel($cobranca),
        ]);
    }

    // Só os dados de pagamento: o slip completo traz payloads e erros do provider.
    private function pagamentoDisponivel(CustomerCharge $cobranca): ?array
    {
        if (in_array($cobranca->status, ['paid', 'cancelled'], true)) {
            return null;
        }

        $slip = $cobranca->paymentSlips()
            ->whereIn('status', ['pending', 'generated'])
            ->latest('id')
            ->get()
            ->first(fn (PaymentSlip $slip) => $slip->isPayable());

        if (! $slip) {
            return null;
        }

        return [
            'id' => $slip->id,
            'amount' => (float) $slip->amount,
            'due_date' => $slip->effective_due_date,
            'digitable_line' => $slip->digitable_line,
            'pix_copy_paste' => $slip->pix_copy_paste,
            'pdf_url' => $slip->barcode && $slip->digitable_line
                ? route('cliente.cobrancas.boleto.pdf', [$cobranca, $slip])
                : null,
        ];
    }

    private function getTotais(int $clientProfileId): array
    {
        return [
            'pendente' => (float) CustomerCharge::query()
                ->where('client_profile_id', $clientProfileId)
                ->whereIn('status', ['open', 'waiting_payment'])
                ->sum('final_amount'),
            'vencido' => (float) CustomerCharge::query()
                ->where('client_profile_id', $clientProfileId)
                ->where('status', 'overdue')
                ->sum('final_amount'),
            'pago_ano' => (float) CustomerCharge::query()
                ->where('client_profile_id', $clientProfileId)
                ->where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->sum('final_amount'),
        ];
    }
}

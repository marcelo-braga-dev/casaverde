<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Pagamento\GeneratePaymentSlipService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use InvalidArgumentException;
use RuntimeException;

class GeneratePaymentSlipController extends Controller
{
    public function store(Request $request, CustomerCharge $cobranca, GeneratePaymentSlipService $service)
    {
        $validated = $request->validate([
            'provider' => ['nullable', Rule::in(['cora', 'mercado_pago', 'asaas'])],
            'payment_method' => ['nullable', Rule::in(['boleto', 'pix', 'boleto_pix'])],
        ]);

        $provider = $validated['provider'] ?? 'cora';
        // Mercado Pago não suporta um único pagamento com boleto+pix (diferente da Cora);
        // sem escolha explícita, o Pix é o padrão por ser mais rápido para o cliente.
        $paymentMethod = $validated['payment_method'] ?? ($provider === 'mercado_pago' ? 'pix' : 'boleto_pix');

        try {
            $slip = $service->handle($cobranca, $provider, $paymentMethod);

            return redirect()
                ->route('admin.financeiro.pagamentos.show', $slip->id)
                ->with('success', 'Pagamento gerado com sucesso.');
        } catch (InvalidArgumentException|RuntimeException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        } catch (ModelNotFoundException) {
            return redirect()
                ->back()
                ->with('error', "Nenhuma conta de pagamento ativa configurada para o provider \"{$provider}\".");
        }
    }
}

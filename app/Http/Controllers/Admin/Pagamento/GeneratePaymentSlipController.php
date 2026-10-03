<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Exceptions\Payments\PaymentProviderException;
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
        $this->authorize('update', $cobranca);

        $validated = $request->validate([
            'provider' => ['nullable', Rule::in(['mercado_pago'])],
            'payment_method' => ['nullable', Rule::in(['boleto', 'pix'])],
        ]);

        $provider = $validated['provider'] ?? 'mercado_pago';
        // O Mercado Pago não gera boleto e Pix no mesmo pedido; sem escolha explícita, o Pix
        // é o padrão por ser mais rápido para o cliente.
        $paymentMethod = $validated['payment_method'] ?? 'pix';

        try {
            $slip = $service->handle($cobranca, $provider, $paymentMethod);

            return redirect()
                ->route('admin.financeiro.pagamentos.show', $slip->id)
                ->with('success', 'Pagamento gerado com sucesso.');
        } catch (PaymentProviderException) {
            return redirect()
                ->back()
                ->with('error', 'Não foi possível gerar o pagamento junto ao provedor. Consulte o histórico de tentativas em Pagamentos para mais detalhes ou tente novamente.');
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

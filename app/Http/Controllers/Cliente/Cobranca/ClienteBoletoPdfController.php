<?php

namespace App\Http\Controllers\Cliente\Cobranca;

use App\Exceptions\Payments\PaymentSlipPdfUnavailableException;
use App\Http\Controllers\Controller;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\GeneratePaymentSlipPdfService;

class ClienteBoletoPdfController extends Controller
{
    public function __invoke(CustomerCharge $cobranca, PaymentSlip $pagamento, GeneratePaymentSlipPdfService $service)
    {
        $this->authorize('view', $cobranca);
        abort_unless((int) $pagamento->customer_charge_id === (int) $cobranca->id, 404);

        try {
            return $service->stream($pagamento);
        } catch (PaymentSlipPdfUnavailableException $e) {
            return redirect()
                ->route('cliente.cobrancas.show', $cobranca)
                ->with('error', $e->getMessage());
        }
    }
}

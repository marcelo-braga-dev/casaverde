<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Exceptions\Payments\PaymentSlipPdfUnavailableException;
use App\Http\Controllers\Controller;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\GeneratePaymentSlipPdfService;

class DownloadPaymentSlipPdfController extends Controller
{
    public function show(PaymentSlip $pagamento, GeneratePaymentSlipPdfService $service)
    {
        try {
            return $service->stream($pagamento);
        } catch (PaymentSlipPdfUnavailableException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}

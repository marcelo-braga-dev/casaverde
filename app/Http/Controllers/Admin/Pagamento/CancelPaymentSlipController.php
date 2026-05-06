<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\CancelPaymentSlipService;
use InvalidArgumentException;
use RuntimeException;

class CancelPaymentSlipController extends Controller
{
    public function store(PaymentSlip $pagamento, CancelPaymentSlipService $service)
    {
        try {
            $service->handle($pagamento);

            return redirect()
                ->back()
                ->with('success', 'Pagamento cancelado com sucesso.');
        } catch (InvalidArgumentException|RuntimeException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}

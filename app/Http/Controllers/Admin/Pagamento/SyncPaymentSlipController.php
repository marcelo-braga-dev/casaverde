<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Pagamento\SyncPaymentSlipService;
use InvalidArgumentException;
use RuntimeException;

class SyncPaymentSlipController extends Controller
{
    public function store(PaymentSlip $pagamento, SyncPaymentSlipService $service)
    {
        try {
            $service->handle($pagamento);

            return redirect()
                ->back()
                ->with('success', 'Pagamento sincronizado com sucesso.');
        } catch (InvalidArgumentException|RuntimeException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Models\Cobranca\CustomerCharge;
use App\Services\Pagamento\GeneratePaymentSlipService;
use InvalidArgumentException;
use RuntimeException;

class GeneratePaymentSlipController extends Controller
{
    public function store(CustomerCharge $cobranca, GeneratePaymentSlipService $service)
    {
        try {
            $slip = $service->handle($cobranca, 'cora', 'boleto_pix');

            return redirect()
                ->route('admin.financeiro.pagamentos.show', $slip->id)
                ->with('success', 'Pagamento gerado com sucesso.');
        } catch (InvalidArgumentException|RuntimeException $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }
}

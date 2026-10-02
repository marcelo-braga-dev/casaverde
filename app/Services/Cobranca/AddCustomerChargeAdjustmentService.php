<?php

namespace App\Services\Cobranca;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeAdjustment;
use App\Services\Pagamento\ReissuePaymentSlipService;

class AddCustomerChargeAdjustmentService
{
    public function __construct(
        private readonly RecalculateCustomerChargeService $recalculateService,
        private readonly ReissuePaymentSlipService $reissuePaymentSlipService,
    ) {}

    public function handle(CustomerCharge $charge, array $data, ?int $userId): CustomerCharge
    {
        $this->reissuePaymentSlipService->applyChange($charge, function () use ($charge, $data, $userId) {
            CustomerChargeAdjustment::create([
                'customer_charge_id' => $charge->id,
                'created_by_user_id' => $userId,
                ...$data,
            ]);

            $this->recalculateService->handle($charge);
        });

        return $charge->fresh();
    }
}

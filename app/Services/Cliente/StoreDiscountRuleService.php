<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use Illuminate\Support\Facades\DB;

class StoreDiscountRuleService
{
    public function handle(
        ClientProfile $clientProfile,
        float $discountPercent,
        string $startsOn,
        ?string $endsOn = null,
        ?string $notes = null,
    ): ClientDiscountRule {
        return DB::transaction(function () use (
            $clientProfile,
            $discountPercent,
            $startsOn,
            $endsOn,
            $notes
        ) {
            $rule = ClientDiscountRule::create([
                'client_profile_id' => $clientProfile->id,
                'discount_percent' => $discountPercent,
                'starts_on' => $startsOn,
                'ends_on' => $endsOn,
                'notes' => $notes,
                'is_active' => false,
            ]);

            app(UpdateClientActiveDiscountRuleService::class)
                ->handle($clientProfile);

            return $rule;
        });
    }
}

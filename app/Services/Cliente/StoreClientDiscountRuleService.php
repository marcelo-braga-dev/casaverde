<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use Illuminate\Support\Facades\DB;

class StoreClientDiscountRuleService
{
    public function handle(
        ClientProfile $clientProfile,
        float $discountPercent,
        string $startsOn,
        ?string $notes = null
    ): ClientDiscountRule {
        return DB::transaction(function () use ($clientProfile, $discountPercent, $startsOn, $notes) {
            ClientDiscountRule::query()
                ->where('client_profile_id', $clientProfile->id)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'ends_on' => $startsOn,
                ]);

            return ClientDiscountRule::create([
                'client_profile_id' => $clientProfile->id,
                'discount_percent' => $discountPercent,
                'starts_on' => $startsOn,
                'notes' => $notes,
                'is_active' => true,
            ]);
        });
    }
}
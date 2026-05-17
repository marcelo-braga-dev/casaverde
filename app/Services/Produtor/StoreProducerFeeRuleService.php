<?php

namespace App\Services\Produtor;

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Models\Produtor\ProducerAdministrationFeeRules;
use App\Models\Produtor\ProducerProfile;
use App\Services\Cliente\UpdateClientActiveDiscountRuleService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StoreProducerFeeRuleService
{
    public function handle(
        ProducerProfile $producerProfile,
        float           $feePercent,
        string          $startsOn,
        ?string         $endsOn = null,
        ?string         $notes = null,
    ): ProducerAdministrationFeeRules {
        return DB::transaction(function () use (
            $producerProfile,
            $feePercent,
            $startsOn,
            $endsOn,
            $notes
        ) {
            $rule = ProducerAdministrationFeeRules::create([
                'producer_profile_id' => $producerProfile->id,
                'fee_percent' => $feePercent,
                'starts_on' => $startsOn,
                'ends_on' => $endsOn,
                'notes' => $notes,
                'is_active' => false,
            ]);

            app(UpdateProducerActiveDiscountRuleService::class)
                ->handle($producerProfile);

            return $rule;
        });
    }
}

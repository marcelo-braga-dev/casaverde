<?php

namespace App\Services\Produtor;

use App\Models\Produtor\ProducerAdministrationFeeRules;
use App\Models\Produtor\ProducerProfile;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UpdateProducerActiveDiscountRuleService
{
    public function handle(ProducerProfile $producerProfile): void
    {
        DB::transaction(function () use ($producerProfile) {

            ProducerAdministrationFeeRules::query()
                ->where('producer_profile_id', $producerProfile->id)
                ->update([
                    'is_active' => false,
                ]);

            $now = Carbon::now();

            $activeRule = ProducerAdministrationFeeRules::query()
                ->where('producer_profile_id', $producerProfile->id)

                ->where('starts_on', '<=', $now)

                ->where(function ($query) use ($now) {
                    $query
                        ->whereNull('ends_on')
                        ->orWhere('ends_on', '>=', $now);
                })

                ->orderByDesc('starts_on')
                ->first();

            if ($activeRule) {
                $activeRule->update([
                    'is_active' => true,
                ]);
            }
        });
    }
}

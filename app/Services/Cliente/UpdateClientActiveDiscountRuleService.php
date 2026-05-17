<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UpdateClientActiveDiscountRuleService
{
    public function handle(ClientProfile $clientProfile): void
    {
        DB::transaction(function () use ($clientProfile) {

            ClientDiscountRule::query()
                ->where('client_profile_id', $clientProfile->id)
                ->update([
                    'is_active' => false,
                ]);

            $now = Carbon::now();

            $activeRule = ClientDiscountRule::query()
                ->where('client_profile_id', $clientProfile->id)

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

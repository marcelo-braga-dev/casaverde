<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientProfile;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ConvertProspectToActiveClientService
{
    public function handle(ClientProfile $clientProfile): ClientProfile
    {
        if (!$clientProfile->consultor_user_id) {
            throw new InvalidArgumentException('O cliente precisa possuir um consultor responsável.');
        }

        return DB::transaction(function () use ($clientProfile) {
            $clientProfile->update([
                'status' => 'contrato_fechado',
                'is_active_client' => true,
            ]);

            return $clientProfile->fresh();
        });
    }
}
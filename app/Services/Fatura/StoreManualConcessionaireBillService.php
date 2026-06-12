<?php

namespace App\Services\Fatura;

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreManualConcessionaireBillService
{
    public function __construct(
        private readonly ResolveConsumerUnitService $consumerUnitResolver,
    ) {
    }

    public function handle(array $data): ConcessionaireBill
    {
        return DB::transaction(function () use ($data) {
            $file = $data['pdf'];
            $clientProfileId = (int) $data['client_profile_id'];
            $clientProfile = ClientProfile::findOrFail($clientProfileId);

            $path = sprintf(
                'concessionaire-bills/%d/%s/%s.pdf',
                $clientProfileId,
                now()->format('Y/m'),
                (string) Str::uuid(),
            );

            Storage::disk('local')->put($path, file_get_contents($file->getRealPath()));

            $referenceLabel = str_pad((string) $data['reference_month'], 2, '0', STR_PAD_LEFT)
                . '/'
                . $data['reference_year'];

            $unidadeConsumidora = !empty($data['unidade_consumidora'])
                ? preg_replace('/\D+/', '', $data['unidade_consumidora'])
                : null;

            $consumerUnit = !empty($data['consumer_unit_id'])
                ? ConsumerUnit::query()->where('client_profile_id', $clientProfileId)->find($data['consumer_unit_id'])
                : $this->consumerUnitResolver->handle($clientProfile, $unidadeConsumidora);

            $bill = ConcessionaireBill::create([
                'client_profile_id' => $clientProfileId,
                'consumer_unit_id' => $consumerUnit?->id,
                'usina_id' => $data['usina_id']
                    ?? $consumerUnit?->activeUsinaLink?->usina_id
                    ?? $clientProfile->activeUsinaLink?->usina_id,
                'created_by_user_id' => auth()->id(),
                'import_source' => 'manual',
                'concessionaria' => 'copel',
                'reference_month' => $data['reference_month'],
                'reference_year' => $data['reference_year'],
                'reference_label' => $referenceLabel,
                'unidade_consumidora' => $unidadeConsumidora ?? $consumerUnit?->uc_code,
                'numero_instalacao' => $data['numero_instalacao'] ?? null,
                'vencimento' => $data['vencimento'],
                'valor_total' => $data['valor_total'],
                'consumo_kwh' => $data['consumo_kwh'] ?? null,
                'pdf_disk' => 'local',
                'pdf_path' => $path,
                'pdf_original_name' => $file->getClientOriginalName(),
                'import_status' => 'manual',
                'review_status' => 'pending_review',
                'notes' => $data['notes'] ?? null,
            ]);

            $bill->pdf_url = route('consultor.cliente.faturas.pdf', $bill->id);
            $bill->save();

            return $bill;
        });
    }
}

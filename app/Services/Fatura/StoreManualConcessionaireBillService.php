<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreManualConcessionaireBillService
{
    public function handle(array $data): ConcessionaireBill
    {
        return DB::transaction(function () use ($data) {
            $file = $data['pdf'];
            $clientProfileId = (int) $data['client_profile_id'];

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

            $bill = ConcessionaireBill::create([
                'client_profile_id' => $clientProfileId,
                'usina_id' => $data['usina_id'] ?? null,
                'created_by_user_id' => auth()->id(),
                'import_source' => 'manual',
                'concessionaria' => 'copel',
                'reference_month' => $data['reference_month'],
                'reference_year' => $data['reference_year'],
                'reference_label' => $referenceLabel,
                'unidade_consumidora' => preg_replace('/\D+/', '', $data['unidade_consumidora']),
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

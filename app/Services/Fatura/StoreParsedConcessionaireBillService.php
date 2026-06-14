<?php

namespace App\Services\Fatura;

use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Importacao\ClientEmailImportSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class StoreParsedConcessionaireBillService
{
    public function __construct(
        private readonly PdfTextExtractorService $pdfTextExtractorService,
        private readonly CopelBillParserService $copelBillParserService,
        private readonly ProtectedPdfResolverService $protectedPdfResolverService,
        private readonly ResolveConsumerUnitService $consumerUnitResolver,
    ) {}

    public function handle(array $data): ConcessionaireBill
    {
        return DB::transaction(function () use ($data) {
            /** @var UploadedFile $file */
            $file = $data['pdf'];

            $clientProfileId = (int) $data['client_profile_id'];
            $clientProfile = ClientProfile::findOrFail($clientProfileId);

            $path = sprintf(
                'concessionaire-bills/%d/%s/%s.pdf',
                $clientProfileId,
                now()->format('Y/m'),
                (string) Str::uuid()
            );

            Storage::disk('local')->put($path, file_get_contents($file->getRealPath()));

            $absolutePath = Storage::disk('local')->path($path);

            $setting = ClientEmailImportSetting::query()
                ->where('client_profile_id', $clientProfileId)
                ->first();

            $consumerUnit = ! empty($data['consumer_unit_id'])
                ? ConsumerUnit::query()
                    ->where('client_profile_id', $clientProfileId)
                    ->find($data['consumer_unit_id'])
                : null;

            $bill = new ConcessionaireBill([
                'client_profile_id' => $clientProfileId,
                'consumer_unit_id' => $consumerUnit?->id,
                'usina_id' => $data['usina_id'] ?? null,
                'concessionaria_id' => $data['concessionaria_id'] ?? null,
                'created_by_user_id' => auth()->id(),
                'import_source' => 'manual',
                'pdf_disk' => 'local',
                'pdf_path' => $path,
                'pdf_original_name' => $file->getClientOriginalName(),
                'import_status' => 'manual',
                'review_status' => 'pending_review',
                'parser_status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            $tempUnlockedFile = null;

            try {
                $tempUnlockedFile = $this->protectedPdfResolverService->unlockToTempFile(
                    $absolutePath,
                    $setting?->pdf_password
                );

                $rawText = $this->pdfTextExtractorService->extract($tempUnlockedFile);

                $parsed = $this->copelBillParserService->parse($rawText);

                $bill->fill([
                    'reference_month' => $parsed['reference_month'],
                    'reference_year' => $parsed['reference_year'],
                    'reference_label' => $parsed['reference_label'],
                    'unidade_consumidora' => $parsed['unidade_consumidora'],
                    'numero_instalacao' => $parsed['numero_instalacao'],
                    'vencimento' => $parsed['vencimento'],
                    'valor_total' => $parsed['valor_total'],
                    'consumo_kwh' => $parsed['consumo_kwh'],
                    'raw_text' => $rawText,
                    'extracted_payload' => $parsed,
                    'parser_status' => 'success',
                    'parser_error' => null,
                ]);

                if (! $consumerUnit) {
                    $consumerUnit = $this->consumerUnitResolver->handle($clientProfile, $parsed['unidade_consumidora']);
                    $bill->consumer_unit_id = $consumerUnit?->id;
                }
            } catch (Throwable $e) {
                $referenceMonth = (int) ($data['reference_month'] ?? now()->month);
                $referenceYear = (int) ($data['reference_year'] ?? now()->year);

                $unidadeConsumidora = preg_replace('/\D+/', '', $data['unidade_consumidora'] ?? '0');

                $bill->fill([
                    'reference_month' => $referenceMonth,
                    'reference_year' => $referenceYear,
                    'reference_label' => sprintf('%02d/%04d', $referenceMonth, $referenceYear),
                    'unidade_consumidora' => $unidadeConsumidora,
                    'numero_instalacao' => $data['numero_instalacao'] ?? null,
                    'vencimento' => $data['vencimento'] ?? now()->toDateString(),
                    'valor_total' => $data['valor_total'] ?? 0,
                    'consumo_kwh' => $data['consumo_kwh'] ?? null,
                    'parser_status' => 'error',
                    'parser_error' => $e->getMessage(),
                ]);

                if (! $consumerUnit) {
                    $consumerUnit = $this->consumerUnitResolver->handle($clientProfile, $unidadeConsumidora);
                    $bill->consumer_unit_id = $consumerUnit?->id;
                }
            } finally {
                $this->protectedPdfResolverService->cleanup($tempUnlockedFile);
            }

            if (! $bill->usina_id) {
                $bill->usina_id = $consumerUnit?->activeUsinaLink?->usina_id
                    ?? $clientProfile->activeUsinaLink?->usina_id;
            }

            $bill->save();

            $bill->forceFill([
                'pdf_url' => route('consultor.cliente.faturas.pdf', $bill->id),
            ])->save();

            return $bill;
        });
    }
}

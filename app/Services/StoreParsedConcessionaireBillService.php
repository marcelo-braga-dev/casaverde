<?php

namespace App\Services\Fatura;

use App\Models\Fatura\ConcessionaireBill;
use App\Models\Importacao\ClientEmailImportSetting;
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
    ) {
    }

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
            $absolutePath = Storage::disk('local')->path($path);

            $setting = ClientEmailImportSetting::query()
                ->where('client_profile_id', $clientProfileId)
                ->first();

            $bill = new ConcessionaireBill([
                'client_profile_id' => $clientProfileId,
                'usina_id' => $data['usina_id'] ?? null,
                'concessionaria_id' => $data['concessionaria_id'],
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
                ]);
            } catch (Throwable $e) {
                $bill->fill([
                    'reference_month' => $data['reference_month'] ?? now()->month,
                    'reference_year' => $data['reference_year'] ?? now()->year,
                    'reference_label' => sprintf('%02d/%04d', (int) ($data['reference_month'] ?? now()->month), (int) ($data['reference_year'] ?? now()->year)),
                    'unidade_consumidora' => preg_replace('/\D+/', '', ($data['unidade_consumidora'] ?? '0')),
                    'numero_instalacao' => $data['numero_instalacao'] ?? null,
                    'vencimento' => $data['vencimento'] ?? now()->toDateString(),
                    'valor_total' => $data['valor_total'] ?? 0,
                    'consumo_kwh' => $data['consumo_kwh'] ?? null,
                    'parser_status' => 'error',
                    'parser_error' => $e->getMessage(),
                ]);
            } finally {
                $this->protectedPdfResolverService->cleanup($tempUnlockedFile);
            }

            $bill->save();
            $bill->pdf_url = route('admin.faturas.pdf', $bill->id);
            $bill->save();

            return $bill;
        });
    }
}
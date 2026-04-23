<?php

namespace App\Services\Fatura;

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ImportedConcessionaireEmail;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Services\Fatura\Imap\ImapConcessionaireFetcherService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ImportAutomaticConcessionaireBillService
{
    public function __construct(
        private readonly ImapConcessionaireFetcherService $fetcher,
        private readonly PdfTextExtractorService $pdfTextExtractorService,
        private readonly CopelBillParserService $copelBillParserService,
        private readonly ProtectedPdfResolverService $protectedPdfResolverService,
    ) {
    }

    public function handle(ClientProfile $clientProfile, ClientEmailImportSetting $setting): array
    {
        $result = [
            'processed' => 0,
            'imported' => 0,
            'skipped' => 0,
            'failed' => 0,
        ];

        $messages = $this->fetcher->fetchMessages($setting);

        foreach ($messages as $message) {
            foreach ($message['attachments'] as $attachment) {
                $result['processed']++;

                $attachmentHash = hash('sha256', $attachment['content']);

                $alreadyImported = ImportedConcessionaireEmail::query()
                    ->where('client_profile_id', $clientProfile->id)
                    ->where(function ($query) use ($message, $attachmentHash) {
                        if (!empty($message['uid'])) {
                            $query->orWhere('message_uid', $message['uid']);
                        }

                        if (!empty($message['message_id'])) {
                            $query->orWhere('message_id', $message['message_id']);
                        }

                        $query->orWhere('attachment_hash', $attachmentHash);
                    })
                    ->exists();

                if ($alreadyImported) {
                    $result['skipped']++;
                    continue;
                }

                $log = ImportedConcessionaireEmail::create([
                    'client_profile_id' => $clientProfile->id,
                    'client_email_import_setting_id' => $setting->id,
                    'message_uid' => $message['uid'] ?? null,
                    'message_id' => $message['message_id'] ?? null,
                    'from_email' => $message['from'] ?? null,
                    'subject' => $message['subject'] ?? null,
                    'received_at' => $message['received_at'] ?? now(),
                    'attachment_name' => $attachment['filename'],
                    'attachment_hash' => $attachmentHash,
                    'status' => 'processing',
                ]);

                $tempUnlockedFile = null;

                try {
                    $storedPath = $this->storePdf($clientProfile->id, $attachment['filename'], $attachment['content']);
                    $absolutePath = Storage::disk('local')->path($storedPath);

                    $tempUnlockedFile = $this->protectedPdfResolverService->unlockToTempFile(
                        $absolutePath,
                        $setting->pdf_password
                    );

                    $rawText = $this->pdfTextExtractorService->extract($tempUnlockedFile);
                    $parsed = $this->copelBillParserService->parse($rawText);

                    $bill = DB::transaction(function () use ($clientProfile, $storedPath, $attachment, $rawText, $parsed, $setting) {
                        $bill = ConcessionaireBill::updateOrCreate(
                            [
                                'client_profile_id' => $clientProfile->id,
                                'unidade_consumidora' => $parsed['unidade_consumidora'],
                                'reference_label' => $parsed['reference_label'],
                            ],
                            [
                                'created_by_user_id' => null,
                                'usina_id' => $clientProfile->activeUsinaLink?->usina_id,
                                'concessionaria_id' => $setting->concessionaria_id,
                                'import_source' => 'email',
                                'reference_month' => $parsed['reference_month'],
                                'reference_year' => $parsed['reference_year'],
                                'numero_instalacao' => $parsed['numero_instalacao'],
                                'vencimento' => $parsed['vencimento'],
                                'valor_total' => $parsed['valor_total'],
                                'consumo_kwh' => $parsed['consumo_kwh'],
                                'pdf_disk' => 'local',
                                'pdf_path' => $storedPath,
                                'pdf_original_name' => $attachment['filename'],
                                'raw_text' => $rawText,
                                'extracted_payload' => $parsed,
                                'import_status' => 'imported',
                                'review_status' => 'pending_review',
                                'parser_status' => 'success',
                            ]
                        );

                        $bill->pdf_url = route('admin.faturas.pdf', $bill->id);
                        $bill->save();

                        return $bill;
                    });

                    $log->update([
                        'concessionaire_bill_id' => $bill->id,
                        'status' => 'success',
                        'processed_at' => now(),
                    ]);

                    $result['imported']++;
                } catch (Throwable $e) {
                    $log->update([
                        'status' => 'failed',
                        'error_message' => $e->getMessage(),
                        'processed_at' => now(),
                    ]);

                    $result['failed']++;
                } finally {
                    $this->protectedPdfResolverService->cleanup($tempUnlockedFile);
                }
            }
        }

        $setting->update([
            'last_checked_at' => now(),
        ]);

        return $result;
    }

    private function storePdf(int $clientProfileId, string $originalFilename, string $content): string
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION) ?: 'pdf';

        $path = sprintf(
            'concessionaire-bills/%d/%s/%s.%s',
            $clientProfileId,
            now()->format('Y/m'),
            (string) Str::uuid(),
            $extension
        );

        Storage::disk('local')->put($path, $content);

        return $path;
    }
}
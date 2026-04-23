<?php

namespace App\Services\Energia\Import;

use App\Models\Energia\EnergyBill;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Importacao\ImportedEnergyBillEmail;
use App\Services\Energia\Imap\ImapEnergyBillFetcherService;
use App\Services\Energia\Pdf\EnergyBillPdfParserService;
use App\Services\Energia\Pdf\ProtectedPdfTextExtractorService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ImportEnergyBillService
{
    public function __construct(
        private readonly ImapEnergyBillFetcherService $fetcher,
        private readonly ProtectedPdfTextExtractorService $extractor,
        private readonly EnergyBillPdfParserService $parser,
    ) {
    }

    public function importForSetting(ClientEmailImportSetting $setting): array
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

                $alreadyImported = ImportedEnergyBillEmail::query()
                    ->where('user_id', $setting->user_id)
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

                $log = ImportedEnergyBillEmail::create([
                    'user_id' => $setting->user_id,
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

                try {
                    $storedPath = $this->storePdf($setting->user_id, $attachment['filename'], $attachment['content']);
                    $absolutePath = Storage::disk('local')->path($storedPath);

                    $rawText = $this->extractor->extractTextFromPdf(
                        $absolutePath,
                        $setting->pdf_password
                    );

                    $parsed = $this->parser->parse($rawText);

                    DB::transaction(function () use ($setting, $log, $storedPath, $attachment, $rawText, $parsed) {
                        $energyBill = EnergyBill::updateOrCreate(
                            [
                                'user_id' => $setting->user_id,
                                'unidade_consumidora' => $parsed['unidade_consumidora'],
                                'referencia' => $parsed['referencia'],
                            ],
                            [
                                'imported_email_id' => $log->id,
                                'concessionaria' => 'Concessionária Padrão',
                                'vencimento' => $parsed['vencimento'],
                                'total_pagar' => $parsed['total_pagar'],
                                'consumo_kwh' => $parsed['consumo_kwh'],
                                'pdf_disk' => 'local',
                                'pdf_path' => $storedPath,
                                'pdf_original_name' => $attachment['filename'],
                                'raw_text' => $rawText,
                                'parser_payload' => $parsed,
                            ]
                        );

                        $energyBill->pdf_url = route('admin.financeiro.energy-bill.pdf', $energyBill->id);
                        $energyBill->save();

                        $log->update([
                            'status' => 'success',
                            'processed_at' => now(),
                        ]);
                    });

                    $result['imported']++;
                } catch (Throwable $e) {
                    Log::error('Erro ao importar fatura de energia.', [
                        'user_id' => $setting->user_id,
                        'setting_id' => $setting->id,
                        'error' => $e->getMessage(),
                    ]);

                    $log->update([
                        'status' => 'failed',
                        'error_message' => $e->getMessage(),
                        'processed_at' => now(),
                    ]);

                    $result['failed']++;
                }
            }
        }

        $setting->update([
            'last_checked_at' => now(),
        ]);

        return $result;
    }

    private function storePdf(int $userId, string $originalFilename, string $content): string
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION) ?: 'pdf';

        $path = sprintf(
            'energy-bills/%d/%s/%s.%s',
            $userId,
            now()->format('Y/m'),
            (string) Str::uuid(),
            $extension
        );

        Storage::disk('local')->put($path, $content);

        return $path;
    }
}
<?php

namespace App\Services\Fatura;

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ImportedConcessionaireEmail;
use App\Models\Fatura\ImportRun;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Usina\Concessionaria;
use App\Services\Fatura\Imap\ImapConcessionaireFetcherService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ImportAutomaticConcessionaireBillService
{
    public function __construct(
        private readonly ImapConcessionaireFetcherService $fetcher,
        private readonly PdfTextExtractorService $pdfExtractor,
        private readonly CopelBillParserService $parser,
        private readonly ProtectedPdfResolverService $pdfResolver,
        private readonly ValidateConcessionaireBillService $validator,
        private readonly ResolveConsumerUnitService $consumerUnitResolver,
    ) {}

    /**
     * Processa todos os clientes ativos OU um cliente específico.
     * Cria e retorna o ImportRun para rastreamento.
     */
    public function run(
        ?ClientProfile $onlyClient = null,
        string $triggeredBy = 'scheduler',
        ?int $triggeredByUserId = null,
    ): ImportRun {
        $run = ImportRun::create([
            'run_code' => ImportRun::generateCode(),
            'triggered_by' => $triggeredBy,
            'triggered_by_user_id' => $triggeredByUserId,
            'client_profile_id' => $onlyClient?->id,
            'status' => 'running',
            'started_at' => now(),
        ]);

        $totals = [
            'total_settings' => 0,
            'total_processed' => 0,
            'total_imported' => 0,
            'total_skipped' => 0,
            'total_failed' => 0,
        ];

        try {
            $query = ClientEmailImportSetting::query()
                ->with(['clientProfile', 'emailAccount'])
                ->where('is_active', true);

            if ($onlyClient) {
                $query->where('client_profile_id', $onlyClient->id);
            }

            $settings = $query->get();
            $totals['total_settings'] = $settings->count();

            foreach ($settings as $setting) {
                $clientProfile = $setting->clientProfile;

                if (! $clientProfile) {
                    Log::warning("[ImportRun #{$run->id}] Setting #{$setting->id} sem client_profile vinculado.");

                    continue;
                }

                $result = $this->handle($clientProfile, $setting, $run);

                $totals['total_processed'] += $result['processed'];
                $totals['total_imported'] += $result['imported'];
                $totals['total_skipped'] += $result['skipped'];
                $totals['total_failed'] += $result['failed'];
            }

            $run->finish($totals);
        } catch (Throwable $e) {
            Log::error("[ImportRun #{$run->id}] Erro fatal: ".$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            $run->finish($totals, $e->getMessage());
        }

        return $run->refresh();
    }

    /**
     * Processa um cliente/configuração específicos dentro de um run.
     */
    public function handle(
        ClientProfile $clientProfile,
        ClientEmailImportSetting $setting,
        ?ImportRun $run = null,
    ): array {
        $result = ['processed' => 0, 'imported' => 0, 'skipped' => 0, 'failed' => 0];

        $messages = $this->fetcher->fetchMessages($setting);

        foreach ($messages as $message) {
            foreach ($message['attachments'] as $attachment) {
                $result['processed']++;
                $this->processAttachment($clientProfile, $setting, $message, $attachment, $run, $result);
            }
        }

        $setting->update(['last_checked_at' => now()]);

        return $result;
    }

    // ── Processamento de cada anexo ───────────────────────────────────────

    private function processAttachment(
        ClientProfile $clientProfile,
        ClientEmailImportSetting $setting,
        array $message,
        array $attachment,
        ?ImportRun $run,
        array &$result,
    ): void {
        $startMs = now()->getPreciseTimestamp(3);
        $attachmentHash = hash('sha256', $attachment['content']);

        // ── Verifica duplicata (ignora tentativas anteriores que falharam) ─
        $existingLog = ImportedConcessionaireEmail::query()
            ->where('client_profile_id', $clientProfile->id)
            ->where(function ($q) use ($message, $attachmentHash) {
                $q->where('attachment_hash', $attachmentHash);
                if (! empty($message['uid'])) {
                    $q->orWhere('message_uid', $message['uid']);
                }
                if (! empty($message['message_id'])) {
                    $q->orWhere('message_id', $message['message_id']);
                }
            })
            ->latest('id')
            ->first();

        if ($existingLog && $existingLog->status !== 'failed') {
            $result['skipped']++;

            return;
        }

        // ── Cria ou reaproveita o log de rastreamento ─────────────────────
        $logData = [
            'client_profile_id' => $clientProfile->id,
            'client_email_import_setting_id' => $setting->id,
            'import_run_id' => $run?->id,
            'message_uid' => $message['uid'] ?? null,
            'message_id' => $message['message_id'] ?? null,
            'from_email' => $message['from'] ?? null,
            'subject' => $message['subject'] ?? null,
            'received_at' => $message['received_at'] ?? now(),
            'attachment_name' => $attachment['filename'],
            'attachment_hash' => $attachmentHash,
            'status' => 'processing',
            'error_message' => null,
            'step_failed' => null,
        ];

        if ($existingLog) {
            $existingLog->update($logData + ['retry_count' => $existingLog->retry_count + 1]);
            $log = $existingLog;
        } else {
            $log = ImportedConcessionaireEmail::create($logData);
        }

        $tempUnlocked = null;
        $stepFailed = null;

        try {
            // Passo 1: Salvar PDF
            $stepFailed = 'store';
            $storedPath = $this->storePdf($clientProfile->id, $attachment['filename'], $attachment['content']);
            $absolutePath = Storage::disk('local')->path($storedPath);

            // Passo 2: Desbloquear PDF (se tiver senha)
            $stepFailed = 'unlock';
            $pdfPassword = $setting->pdf_password; // senha individual da fatura
            $tempUnlocked = $this->pdfResolver->unlockToTempFile($absolutePath, $pdfPassword ?: null);

            // Passo 3: Extrair texto
            $stepFailed = 'extract';
            $rawText = $this->pdfExtractor->extract($tempUnlocked);

            // Passo 4: Fazer o parse dos dados
            $stepFailed = 'parse';
            $parsed = $this->parser->parse($rawText);

            // Passo 5: Persistir fatura no banco
            $stepFailed = 'store';
            $consumerUnit = $this->consumerUnitResolver->handle($clientProfile, $parsed['unidade_consumidora']);

            $bill = DB::transaction(function () use ($clientProfile, $consumerUnit, $storedPath, $attachment, $rawText, $parsed, $setting) {
                $bill = ConcessionaireBill::updateOrCreate(
                    [
                        'client_profile_id' => $clientProfile->id,
                        'unidade_consumidora' => $parsed['unidade_consumidora'],
                        'reference_label' => $parsed['reference_label'],
                    ],
                    [
                        'created_by_user_id' => null,
                        'consumer_unit_id' => $consumerUnit?->id,
                        'usina_id' => $consumerUnit?->activeUsinaLink?->usina_id
                            ?? $clientProfile->activeUsinaLink?->usina_id,
                        'concessionaria_id' => $setting->concessionaria_id ?? Concessionaria::copel()?->id,
                        'import_source' => 'email',
                        'reference_month' => $parsed['reference_month'],
                        'reference_year' => $parsed['reference_year'],
                        'numero_instalacao' => $parsed['numero_instalacao'],
                        'vencimento' => $parsed['vencimento'],
                        'valor_total' => $parsed['valor_total'],
                        'consumo_kwh' => $parsed['consumo_kwh'],
                        'injected_energy_kwh' => $parsed['injected_energy_kwh'],
                        'injected_energy_amount' => $parsed['injected_energy_amount'],
                        'injected_consumption_kwh' => $parsed['injected_consumption_kwh'],
                        'injected_consumption_amount' => $parsed['injected_consumption_amount'],
                        'injected_consumption_discount_percent' => (float) ($clientProfile->activeDiscountRule?->discount_percent ?? 0),
                        'nome' => $parsed['nome'] ?? null,
                        'pdf_disk' => 'local',
                        'pdf_path' => $storedPath,
                        'pdf_original_name' => $attachment['filename'],
                        'raw_text' => $rawText,
                        'extracted_payload' => $parsed,
                        'import_status' => 'imported',
                        'review_status' => 'pending_review',
                        'parser_status' => 'success',
                        'parser_error' => null,
                    ]
                );

                $bill->pdf_url = route('consultor.cliente.faturas.pdf', $bill->id);
                $bill->save();

                return $bill;
            });

            // Passo 6: Validar fatura importada (CORRIGIDO — estava faltando!)
            $stepFailed = 'validate';
            $this->validator->handle($bill);

            // ── Sucesso ────────────────────────────────────────────────
            $log->update([
                'concessionaire_bill_id' => $bill->id,
                'status' => 'success',
                'step_failed' => null,
                'duration_ms' => (int) (now()->getPreciseTimestamp(3) - $startMs),
                'processed_at' => now(),
            ]);

            $result['imported']++;

        } catch (Throwable $e) {
            Log::error("[ImportService] Falha na etapa '{$stepFailed}' para cliente #{$clientProfile->id}: ".$e->getMessage());

            $log->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'step_failed' => $stepFailed,
                'duration_ms' => (int) (now()->getPreciseTimestamp(3) - $startMs),
                'processed_at' => now(),
            ]);

            $result['failed']++;
        } finally {
            $this->pdfResolver->cleanup($tempUnlocked);
        }
    }

    // ── Armazenamento do PDF ──────────────────────────────────────────────

    private function storePdf(int $clientProfileId, string $filename, string $content): string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION)) ?: 'pdf';
        $safe = Str::slug(pathinfo($filename, PATHINFO_FILENAME), '-');

        $path = sprintf(
            'concessionaire-bills/%d/%s/%s-%s.%s',
            $clientProfileId,
            now()->format('Y/m'),
            now()->format('d-His'),
            Str::random(8),
            $ext
        );

        Storage::disk('local')->put($path, $content);

        if (! Storage::disk('local')->exists($path)) {
            throw new \RuntimeException("Falha ao salvar o PDF no disco: {$path}");
        }

        return $path;
    }
}

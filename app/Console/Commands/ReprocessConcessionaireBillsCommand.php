<?php

namespace App\Console\Commands;

use App\Models\Fatura\ConcessionaireBill;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Services\Fatura\CopelBillParserService;
use App\Services\Fatura\PdfTextExtractorService;
use App\Services\Fatura\ProtectedPdfResolverService;
use App\Services\Fatura\ResolveConsumerUnitService;
use Illuminate\Console\Command;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ReprocessConcessionaireBillsCommand extends Command
{
    protected $signature = 'concessionaire-bills:reprocess {--id= : Reprocessa apenas uma fatura específica}';

    protected $description = 'Relê o PDF de cada fatura já importada e atualiza as colunas extraídas pelo parser (inclui campos novos de energia injetada).';

    public function handle(
        PdfTextExtractorService $extractor,
        CopelBillParserService $parser,
        ProtectedPdfResolverService $pdfResolver,
        ResolveConsumerUnitService $consumerUnitResolver,
    ): int {
        $query = ConcessionaireBill::query()
            ->whereNotNull('pdf_path')
            ->where('pdf_path', '!=', '')
            ->with('clientProfile.activeDiscountRule', 'clientProfile.activeUsinaLink');

        if ($id = $this->option('id')) {
            $query->where('id', (int) $id);
        }

        $bills = $query->get();

        $this->info("Reprocessando {$bills->count()} fatura(s)...");

        $ok = 0;
        $failed = 0;
        $duplicates = [];
        $tempFile = null;

        foreach ($bills as $bill) {
            $clientProfile = $bill->clientProfile;

            if (! $clientProfile) {
                $this->warn("Fatura #{$bill->id} sem client_profile_id válido — pulando.");
                $failed++;

                continue;
            }

            try {
                $disk = $bill->pdf_disk ?: 'local';

                if (! Storage::disk($disk)->exists($bill->pdf_path)) {
                    throw new \RuntimeException("PDF não encontrado no disco '{$disk}': {$bill->pdf_path}");
                }

                $absolutePath = Storage::disk($disk)->path($bill->pdf_path);

                $pdfPassword = ClientEmailImportSetting::query()
                    ->where('client_profile_id', $clientProfile->id)
                    ->value('pdf_password');

                $tempFile = $pdfResolver->unlockToTempFile($absolutePath, $pdfPassword ?: null);

                $rawText = $extractor->extract($tempFile);

                $parsed = $parser->parse($rawText);

                $consumerUnit = $bill->consumer_unit_id
                    ? $bill->consumerUnit
                    : $consumerUnitResolver->handle($clientProfile, $parsed['unidade_consumidora']);

                $bill->fill([
                    'consumer_unit_id' => $bill->consumer_unit_id ?: $consumerUnit?->id,
                    'usina_id' => $bill->usina_id
                        ?: ($consumerUnit?->activeUsinaLink?->usina_id ?? $clientProfile->activeUsinaLink?->usina_id),
                    'reference_month' => $parsed['reference_month'],
                    'reference_year' => $parsed['reference_year'],
                    'reference_label' => $parsed['reference_label'],
                    'unidade_consumidora' => $parsed['unidade_consumidora'],
                    'numero_instalacao' => $parsed['numero_instalacao'],
                    'vencimento' => $parsed['vencimento'],
                    'valor_total' => $parsed['valor_total'],
                    'consumo_kwh' => $parsed['consumo_kwh'],
                    'injected_energy_kwh' => $parsed['injected_energy_kwh'],
                    'injected_energy_amount' => $parsed['injected_energy_amount'],
                    'injected_consumption_kwh' => $parsed['injected_consumption_kwh'],
                    'injected_consumption_amount' => $parsed['injected_consumption_amount'],
                    'injected_consumption_discount_percent' => (float) ($clientProfile->activeDiscountRule?->discount_percent ?? 0),
                    'nome' => $parsed['nome'] ?? $bill->nome,
                    'raw_text' => $rawText,
                    'extracted_payload' => $parsed,
                    'parser_status' => 'success',
                    'parser_error' => null,
                ]);

                if (! $bill->pdf_url) {
                    $bill->pdf_url = route('consultor.cliente.faturas.pdf', $bill->id);
                }

                $bill->save();

                $ok++;
            } catch (UniqueConstraintViolationException $e) {
                $duplicates[] = sprintf(
                    'Fatura #%d (cliente #%d, PDF "%s") — após reler o PDF, resolve para UC %s / ref %s, que já pertence a outra fatura existente. Possível duplicata; não atualizado para evitar conflito.',
                    $bill->id,
                    $clientProfile->id,
                    $bill->pdf_original_name,
                    $parsed['unidade_consumidora'] ?? '?',
                    $parsed['reference_label'] ?? '?',
                );

                $this->warn(end($duplicates));
                $failed++;
            } catch (Throwable $e) {
                $bill->refresh()->forceFill([
                    'parser_status' => 'error',
                    'parser_error' => $e->getMessage(),
                ])->save();

                $this->error("Fatura #{$bill->id} (cliente #{$clientProfile->id}): {$e->getMessage()}");
                $failed++;
            } finally {
                $pdfResolver->cleanup($tempFile);
                $tempFile = null;
            }
        }

        if ($duplicates !== []) {
            $this->newLine();
            $this->warn('Possíveis duplicatas encontradas (não atualizadas):');
            foreach ($duplicates as $duplicate) {
                $this->line('  - '.$duplicate);
            }
        }

        $this->newLine();
        $this->table(
            ['Resultado', 'Quantidade'],
            [
                ['Sucesso', $ok],
                ['Falha', $failed],
            ]
        );

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}

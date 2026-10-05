<?php

namespace Database\Seeders;

use App\Models\Cliente\ClientProfile;
use App\Models\Concessionarias;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ImportedConcessionaireEmail;
use App\Models\Fatura\ImportRun;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Importacao\ImportEmailAccount;
use App\Models\Users\User;
use App\Services\Config\SystemSettingService;
use App\src\Roles\RoleUser;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Histórico de importação de faturas coerente com a base de demonstração: cada fatura
 * importada por e-mail nos últimos 30 dias vira um e-mail processado na rodada do dia
 * em que chegou, com alguns e-mails ignorados (duplicados) e uma falha ocasional.
 * Também dá a cada cliente ativo uma caixa dedicada do pool de importação.
 *
 * Pode ser executado de novo: refaz apenas as rodadas da janela de 30 dias.
 */
class MarketingImportHistorySeeder extends Seeder
{
    private const DAYS = 30;

    private const RUN_HOURS = [7, 13, 19];

    public function run(): void
    {
        mt_srand(4242);
        Model::unguard();

        $today = CarbonImmutable::today();
        $since = $today->subDays(self::DAYS);
        $adminId = User::where('role_id', RoleUser::$ADMIN)->orderBy('id')->value('id');
        $imapHost = app(SystemSettingService::class)->get('imap_default_host') ?: 'mail.suaempresa.com.br';

        DB::transaction(function () use ($today, $since, $adminId, $imapHost) {
            $settings = $this->ensureMailboxes($adminId, $imapHost, $today);

            $windowRuns = ImportRun::where('started_at', '>=', $since)->pluck('id');
            ImportedConcessionaireEmail::whereIn('import_run_id', $windowRuns)->delete();
            ImportRun::whereIn('id', $windowRuns)->delete();

            $bills = ConcessionaireBill::query()
                ->where('import_source', 'imap')
                ->where('created_at', '>=', $since)
                ->whereIn('client_profile_id', $settings->keys())
                ->get()
                ->groupBy(fn ($bill) => CarbonImmutable::parse($bill->created_at)->toDateString());

            $failureDay = $today->subDays(mt_rand(5, 20))->toDateString();
            $runs = 0;
            $emails = 0;

            for ($day = $since; $day->lte($today); $day = $day->addDay()) {
                $dayBills = ($bills[$day->toDateString()] ?? collect())->shuffle()->values();

                foreach (self::RUN_HOURS as $slot => $hour) {
                    $start = $day->setTime($hour, 0, mt_rand(5, 55));
                    if ($start->isFuture()) {
                        continue;
                    }

                    // As faturas do dia se dividem entre as rodadas.
                    $chunk = $dayBills->filter(fn ($b, $i) => $i % count(self::RUN_HOURS) === $slot);
                    $run = ImportRun::create([
                        'run_code' => 'RUN-'.$start->format('Ymd-His').'-'.strtoupper(substr(md5($start->toIso8601String()), 0, 4)),
                        'triggered_by' => 'scheduler',
                        'status' => 'running',
                        'total_settings' => $settings->count(),
                        'started_at' => $start,
                        'created_at' => $start,
                    ]);

                    $offset = 0;
                    $imported = 0;
                    $skipped = 0;
                    $failed = 0;

                    foreach ($chunk as $bill) {
                        $this->email($run, $settings[$bill->client_profile_id], $bill, 'success', $start->addSeconds(++$offset * 7));
                        $imported++;
                    }

                    // Reenvio da concessionária: e-mail já processado é ignorado.
                    if ($chunk->isNotEmpty() && mt_rand(0, 2) === 0) {
                        $bill = $chunk->first();
                        $this->email($run, $settings[$bill->client_profile_id], null, 'skipped', $start->addSeconds(++$offset * 7), 'Fatura já importada anteriormente.', 'duplicate');
                        $skipped++;
                    }

                    if ($day->toDateString() === $failureDay && $slot === 0) {
                        $setting = $settings->random();
                        $this->email($run, $setting, null, 'failed', $start->addSeconds(++$offset * 7), 'Não foi possível abrir o PDF: senha da fatura inválida.', 'pdf_unlock');
                        $failed++;
                    }

                    $duration = 2500 + $offset * mt_rand(2200, 4800);
                    $run->update([
                        'status' => $failed ? 'partial' : 'completed',
                        'total_processed' => $imported + $skipped + $failed,
                        'total_imported' => $imported,
                        'total_skipped' => $skipped,
                        'total_failed' => $failed,
                        'finished_at' => $start->addMilliseconds($duration),
                        'duration_ms' => $duration,
                        'error_message' => $failed ? '1 e-mail com falha: senha do PDF inválida.' : null,
                        'updated_at' => $start->addMilliseconds($duration),
                    ]);

                    $runs++;
                    $emails += $imported + $skipped + $failed;
                }
            }

            $this->command?->line("  → Rodadas de importação: {$runs} | e-mails processados: {$emails} | caixas: {$settings->count()}");
        });

        Model::reguard();
    }

    /** @return Collection<int, ClientEmailImportSetting> por client_profile_id */
    private function ensureMailboxes(?int $adminId, string $imapHost, CarbonImmutable $today)
    {
        $clients = ClientProfile::query()->where('is_active_client', true)->whereNull('deleted_at')->get();

        foreach ($clients as $client) {
            $setting = ClientEmailImportSetting::where('client_profile_id', $client->id)->first();
            if ($setting) {
                // Conta antiga criada em teste ficou com rótulo sem sentido.
                $setting->emailAccount?->update(['label' => 'Faturas · '.$client->display_name]);

                continue;
            }

            $email = 'faturas.'.strtolower($client->client_code).'@faturas.demo';
            $account = ImportEmailAccount::create([
                'email' => $email,
                'label' => 'Faturas · '.$client->display_name,
                'imap_password' => 'demonstracao',
                'is_active' => true,
                'client_profile_id' => $client->id,
                'assigned_at' => $client->activated_at ?? $today->subMonths(6),
                'created_by_user_id' => $adminId,
            ]);

            $concessionariaId = ConcessionaireBill::where('client_profile_id', $client->id)->value('concessionaria_id');

            ClientEmailImportSetting::create([
                'client_profile_id' => $client->id,
                'import_email_account_id' => $account->id,
                'concessionaria_id' => $concessionariaId,
                'user_id' => $adminId,
                'imap_host' => $imapHost,
                'imap_port' => 993,
                'imap_encryption' => 'ssl',
                'imap_email' => $email,
                'imap_password' => 'demonstracao',
                'sender_filter' => $this->senderDomain($concessionariaId),
                'is_active' => true,
                'last_checked_at' => $today->setTime(19, 0),
            ]);
        }

        return ClientEmailImportSetting::query()->whereNotNull('client_profile_id')->get()->keyBy('client_profile_id');
    }

    private function senderDomain(?int $concessionariaId): ?string
    {
        $name = mb_strtolower((string) Concessionarias::whereKey($concessionariaId)->value('nome'));

        foreach (['copel' => 'copel.com', 'cemig' => 'cemig.com.br', 'cpfl' => 'cpfl.com.br', 'rge' => 'rge-rs.com.br',
            'celesc' => 'celesc.com.br', 'enel' => 'enel.com', 'neoenergia' => 'neoenergia.com', 'energisa' => 'energisa.com.br'] as $needle => $domain) {
            if (str_contains($name, $needle)) {
                return $domain;
            }
        }

        return null;
    }

    private function email(ImportRun $run, ClientEmailImportSetting $setting, ?ConcessionaireBill $bill, string $status, CarbonImmutable $at, ?string $error = null, ?string $step = null): void
    {
        $uc = $bill?->unidade_consumidora ?? (string) mt_rand(40000000, 49999999);
        $ref = $bill?->reference_label ?? $at->subMonth()->format('m/Y');

        ImportedConcessionaireEmail::create([
            'client_profile_id' => $setting->client_profile_id,
            'client_email_import_setting_id' => $setting->id,
            'import_run_id' => $run->id,
            'concessionaire_bill_id' => $bill?->id,
            'message_uid' => (string) mt_rand(10000, 99999),
            'message_id' => '<'.md5($uc.$ref.$status.$at->timestamp).'@copel.com>',
            'from_email' => 'faturadigital@copel.com',
            'subject' => "Sua fatura Copel está disponível - UC {$uc} - {$ref}",
            'received_at' => $at->subMinutes(mt_rand(20, 300)),
            'attachment_name' => 'fatura_'.$uc.'_'.str_replace('/', '', $ref).'.pdf',
            'attachment_hash' => hash('sha256', $uc.$ref.$status),
            'status' => $status,
            'error_message' => $error,
            'step_failed' => $step,
            'duration_ms' => mt_rand(900, 4200),
            'retry_count' => 0,
            'processed_at' => $at,
            'created_at' => $at,
            'updated_at' => $at,
        ]);
    }
}

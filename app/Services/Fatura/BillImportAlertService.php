<?php

namespace App\Services\Fatura;

use App\Models\Importacao\ClientEmailImportSetting;
use App\Services\Alert\OperationalAlertNotifier;
use Throwable;

/**
 * Alertas da importação automática de faturas (IMAP). Sem fatura importada não há cobrança:
 * toda falha aqui atrasa o faturamento do cliente, então vira alerta para o admin.
 */
class BillImportAlertService
{
    public const MAILBOX_FAILED = 'bill_import_mailbox_failed';

    public const PDF_PASSWORD = 'bill_import_pdf_password';

    public const READ_FAILED = 'bill_import_read_failed';

    public const STORE_FAILED = 'bill_import_failed';

    public const RUN_FAILED = 'bill_import_run_failed';

    private const ATTACHMENT_TYPES = [self::PDF_PASSWORD, self::READ_FAILED, self::STORE_FAILED];

    public function __construct(
        private readonly OperationalAlertNotifier $notifier,
    ) {}

    public function mailboxFailed(ClientEmailImportSetting $setting, Throwable $e): void
    {
        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_FATURA,
            self::MAILBOX_FAILED,
            'error',
            'Caixa de e-mail de faturas inacessível',
            sprintf(
                'Não foi possível ler a caixa %s do cliente %s: %s. Nenhuma fatura desse cliente será importada até a conexão/credencial ser corrigida.',
                $setting->imap_email ?? '#'.$setting->id,
                $this->clientName($setting),
                $e->getMessage(),
            ),
            $setting,
            $this->context($setting, ['error' => $e->getMessage()]),
        );
    }

    public function mailboxOk(ClientEmailImportSetting $setting): void
    {
        $this->notifier->resolve(OperationalAlertNotifier::MODULE_FATURA, self::MAILBOX_FAILED, $setting);
    }

    public function attachmentFailed(ClientEmailImportSetting $setting, ?string $step, string $filename, Throwable $e): void
    {
        [$type, $title, $hint] = match ($step) {
            'unlock' => [self::PDF_PASSWORD, 'Senha do PDF da fatura inválida', 'Corrija a senha do PDF na configuração de importação do cliente.'],
            'extract', 'parse' => [self::READ_FAILED, 'Fatura da concessionária ilegível', 'Confira o PDF no histórico de importação e, se preciso, lance a fatura manualmente.'],
            default => [self::STORE_FAILED, 'Falha ao importar fatura da concessionária', 'Confira o histórico de importação.'],
        };

        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_FATURA,
            $type,
            'error',
            $title,
            sprintf('Fatura "%s" do cliente %s: %s. %s', $filename, $this->clientName($setting), $e->getMessage(), $hint),
            $setting,
            $this->context($setting, ['attachment' => $filename, 'step' => $step, 'error' => $e->getMessage()]),
        );
    }

    public function attachmentImported(ClientEmailImportSetting $setting): void
    {
        foreach (self::ATTACHMENT_TYPES as $type) {
            $this->notifier->resolve(OperationalAlertNotifier::MODULE_FATURA, $type, $setting);
        }
    }

    public function runFailed(string $error): void
    {
        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::RUN_FAILED,
            'critical',
            'Importação automática de faturas parou',
            "A rotina de importação de faturas falhou por completo: {$error}. Nenhum cliente teve faturas importadas nesta execução.",
            context: ['payload' => ['error' => $error, 'action_url' => route('admin.import-history.index', absolute: false)]],
        );
    }

    public function runOk(): void
    {
        $this->notifier->resolve(OperationalAlertNotifier::MODULE_SISTEMA, self::RUN_FAILED);
    }

    private function context(ClientEmailImportSetting $setting, array $payload): array
    {
        return [
            'client_profile_id' => $setting->client_profile_id,
            'payload' => $payload + ['setting_id' => $setting->id, 'action_url' => route('admin.import-history.index', absolute: false)],
        ];
    }

    private function clientName(ClientEmailImportSetting $setting): string
    {
        $client = $setting->clientProfile;

        return $client?->nome ?? $client?->razao_social ?? '#'.$setting->client_profile_id;
    }
}

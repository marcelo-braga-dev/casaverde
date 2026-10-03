<?php

namespace App\Services\Pagamento;

use App\Exceptions\Payments\PaymentProviderException;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Services\Alert\OperationalAlertNotifier;
use Throwable;

/**
 * Alertas de falhas no ciclo de pagamento (Mercado Pago). Cada um representa dinheiro que
 * pode não estar sendo cobrado ou baixado.
 */
class PaymentAlertService
{
    public const GENERATION_FAILED = 'payment_generation_failed';

    public const PROVIDER_AUTH_FAILED = 'payment_provider_auth_failed';

    public const SYNC_FAILED = 'payment_sync_failed';

    public const WEBHOOK_FAILED = 'payment_webhook_failed';

    public function __construct(
        private readonly OperationalAlertNotifier $notifier,
    ) {}

    public function generationFailed(CustomerCharge $charge, PaymentProviderException $e, ?PaymentProviderAccount $account = null): void
    {
        $charge->loadMissing('clientProfile');

        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_FINANCEIRO,
            self::GENERATION_FAILED,
            'error',
            'Mercado Pago recusou gerar o pagamento',
            sprintf(
                'A cobrança %s (%s) está sem boleto/Pix: o Mercado Pago recusou a geração (HTTP %s). Confira o histórico de tentativas no pagamento e gere novamente.',
                $charge->reference_label ?? '#'.$charge->id,
                $this->clientName($charge),
                $e->httpStatus ?? '—',
            ),
            $charge,
            [
                'client_profile_id' => $charge->client_profile_id,
                'assigned_to_user_id' => $charge->clientProfile?->consultor_user_id,
                'payload' => ['customer_charge_id' => $charge->id, 'http_status' => $e->httpStatus, 'action_url' => route('admin.financeiro.cobrancas.show', $charge->id, false)],
            ],
        );

        $this->checkProviderAuth($account, $e);
    }

    public function generationOk(CustomerCharge $charge, ?PaymentProviderAccount $account = null): void
    {
        $this->notifier->resolve(OperationalAlertNotifier::MODULE_FINANCEIRO, self::GENERATION_FAILED, $charge);
        $this->providerOk($account);
    }

    public function syncFailed(PaymentSlip $slip, Throwable $e): void
    {
        $slip->loadMissing('charge.clientProfile');

        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_FINANCEIRO,
            self::SYNC_FAILED,
            'error',
            'Pagamento não consegue ser conferido no Mercado Pago',
            sprintf(
                'O pagamento #%s da cobrança %s não pôde ser consultado no Mercado Pago: %s. Enquanto isso, um pagamento feito pelo cliente não é baixado automaticamente.',
                $slip->id,
                $slip->charge?->reference_label ?? '#'.$slip->customer_charge_id,
                $e->getMessage(),
            ),
            $slip,
            [
                'client_profile_id' => $slip->charge?->client_profile_id,
                'payload' => ['payment_slip_id' => $slip->id, 'customer_charge_id' => $slip->customer_charge_id, 'action_url' => route('admin.financeiro.pagamentos.show', $slip->id, false)],
            ],
        );

        if ($e instanceof PaymentProviderException) {
            $this->checkProviderAuth($slip->providerAccount, $e);
        }
    }

    public function syncOk(PaymentSlip $slip): void
    {
        $this->notifier->resolve(OperationalAlertNotifier::MODULE_FINANCEIRO, self::SYNC_FAILED, $slip);
        $this->providerOk($slip->providerAccount);
    }

    public function webhookFailed(PaymentWebhookEvent $event, Throwable $e): void
    {
        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::WEBHOOK_FAILED,
            'error',
            'Falha ao processar notificação de pagamento',
            sprintf('A notificação #%s do %s falhou: %s. Reprocesse em Financeiro → Webhooks de Pagamento.', $event->id, $event->provider, $e->getMessage()),
            $event,
            ['payload' => ['payment_webhook_event_id' => $event->id, 'action_url' => route('admin.financeiro.payment-webhooks.show', $event->id, false)]],
        );
    }

    public function webhookOk(PaymentWebhookEvent $event): void
    {
        $this->notifier->resolve(OperationalAlertNotifier::MODULE_SISTEMA, self::WEBHOOK_FAILED, $event);
    }

    // 401/403 = token revogado/expirado: nenhum boleto é gerado nem baixado até trocar a credencial.
    private function checkProviderAuth(?PaymentProviderAccount $account, PaymentProviderException $e): void
    {
        if (! $account || ! in_array($e->httpStatus, [401, 403], true)) {
            return;
        }

        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::PROVIDER_AUTH_FAILED,
            'critical',
            'Mercado Pago recusou as credenciais',
            "O Mercado Pago respondeu HTTP {$e->httpStatus} para a conta \"{$account->name}\": o access token está inválido, expirado ou sem permissão. Nenhum boleto/Pix será gerado nem baixado até a credencial ser atualizada em Contas de Pagamento.",
            $account,
            ['payload' => ['http_status' => $e->httpStatus, 'action_url' => route('admin.financeiro.payment-provider-accounts.edit', $account->id, false)]],
        );
    }

    private function providerOk(?PaymentProviderAccount $account): void
    {
        if ($account) {
            $this->notifier->resolve(OperationalAlertNotifier::MODULE_SISTEMA, self::PROVIDER_AUTH_FAILED, $account);
        }
    }

    private function clientName(CustomerCharge $charge): string
    {
        return $charge->clientProfile?->nome ?? $charge->clientProfile?->razao_social ?? '#'.$charge->client_profile_id;
    }
}

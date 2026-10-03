<?php

namespace App\Services\Alert;

use App\Models\Cobranca\CustomerCharge;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use Illuminate\Support\Collection;

/**
 * Varredura periódica do que nenhuma exceção denuncia: rotinas paradas, etapas do
 * faturamento esquecidas e configuração que impede cobrar. Alertas agrupados (um por
 * consultor ou um geral) para não inundar a tela; resolvem sozinhos quando a contagem zera.
 */
class OperationalHealthScanService
{
    public const BILL_IMPORT_STALLED = 'bill_import_stalled';

    public const BILLS_REVIEW_OVERDUE = 'bills_review_overdue';

    public const BILLS_WITHOUT_CHARGE = 'bills_approved_without_charge';

    public const CHARGES_DRAFT_PENDING = 'charges_draft_pending';

    public const CHARGES_WITHOUT_PAYMENT = 'charges_without_payment';

    public const PAYMENT_SYNC_STALE = 'payment_sync_stale';

    public const PROVIDER_MISSING = 'payment_provider_missing';

    public const WEBHOOK_SECRET_MISSING = 'payment_webhook_secret_missing';

    private const IMPORT_STALE_HOURS = 3;

    private const REVIEW_OVERDUE_DAYS = 3;

    private const DRAFT_PENDING_DAYS = 2;

    private const PAYMENT_DUE_WINDOW_DAYS = 5;

    private const SYNC_STALE_HOURS = 2;

    public function __construct(
        private readonly OperationalAlertNotifier $notifier,
    ) {}

    public function scan(): array
    {
        return [
            self::BILL_IMPORT_STALLED => $this->billImportStalled(),
            self::BILLS_REVIEW_OVERDUE => $this->billsReviewOverdue(),
            self::BILLS_WITHOUT_CHARGE => $this->billsWithoutCharge(),
            self::CHARGES_DRAFT_PENDING => $this->chargesByConsultor(
                self::CHARGES_DRAFT_PENDING,
                CustomerCharge::query()->where('status', 'draft')->where('created_at', '<', now()->subDays(self::DRAFT_PENDING_DAYS)),
                fn (int $count) => [
                    'severity' => 'warning',
                    'title' => 'Cobranças em rascunho não abertas',
                    'message' => "{$count} cobrança(s) gerada(s) há mais de ".self::DRAFT_PENDING_DAYS.' dias continuam em rascunho: o cliente não está sendo cobrado. Revise e abra cada uma.',
                    'url' => route('admin.financeiro.cobrancas.index', ['status' => 'draft'], false),
                ],
            ),
            self::CHARGES_WITHOUT_PAYMENT => $this->chargesByConsultor(
                self::CHARGES_WITHOUT_PAYMENT,
                CustomerCharge::query()
                    ->whereIn('status', ['open', 'waiting_payment', 'overdue'])
                    ->whereDate('due_date', '<=', now()->addDays(self::PAYMENT_DUE_WINDOW_DAYS))
                    // Boleto vencido tem alerta próprio (PaymentSlipExpiredAlertService).
                    ->whereDoesntHave('paymentSlips', fn ($q) => $q->whereIn('status', ['pending', 'generated', 'paid', 'expired'])),
                fn (int $count) => [
                    'severity' => 'error',
                    'title' => 'Cobranças vencendo sem boleto/Pix',
                    'message' => "{$count} cobrança(s) vence(m) em até ".self::PAYMENT_DUE_WINDOW_DAYS.' dias (ou já venceram) e não têm boleto/Pix gerado: o cliente não tem como pagar. Gere o pagamento e envie ao cliente.',
                    'url' => route('admin.financeiro.cobrancas.index', [], false),
                ],
            ),
            self::PAYMENT_SYNC_STALE => $this->paymentSyncStale(),
            self::PROVIDER_MISSING => $this->providerMissing(),
            self::WEBHOOK_SECRET_MISSING => $this->webhookSecretMissing(),
        ];
    }

    private function billImportStalled(): int
    {
        $stalled = ClientEmailImportSetting::query()
            ->with('clientProfile')
            ->where('is_active', true)
            ->whereNotNull('client_profile_id')
            ->where(fn ($q) => $q
                ->whereNull('last_checked_at')
                ->orWhere('last_checked_at', '<', now()->subHours(self::IMPORT_STALE_HOURS)))
            ->get();

        return $this->aggregate(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::BILL_IMPORT_STALLED,
            $stalled,
            'critical',
            'Importação de faturas parada',
            "{$stalled->count()} caixa(s) de e-mail de faturas não são verificadas há mais de ".self::IMPORT_STALE_HOURS.' horas. Verifique o agendador (cron) e o worker da fila.',
            route('admin.import-history.index', absolute: false),
        );
    }

    private function billsReviewOverdue(): int
    {
        $bills = ConcessionaireBill::query()
            ->where('review_status', 'pending_review')
            ->where('created_at', '<', now()->subDays(self::REVIEW_OVERDUE_DAYS))
            ->get(['id']);

        return $this->aggregate(
            OperationalAlertNotifier::MODULE_FATURA,
            self::BILLS_REVIEW_OVERDUE,
            $bills,
            'warning',
            'Faturas aguardando revisão',
            "{$bills->count()} fatura(s) de concessionária esperam revisão há mais de ".self::REVIEW_OVERDUE_DAYS.' dias. Sem aprovação, a cobrança do cliente não é gerada.',
            route('admin.relatorios.faturas', ['review_status' => 'pending_review'], false),
        );
    }

    private function billsWithoutCharge(): int
    {
        $bills = ConcessionaireBill::query()
            ->where('review_status', 'approved')
            ->where('updated_at', '<', now()->subHours(2))
            // Só fatura que nunca gerou cobrança (falha). Cobrança cancelada é decisão humana.
            ->doesntHave('charges')
            ->get(['id']);

        return $this->aggregate(
            OperationalAlertNotifier::MODULE_FATURA,
            self::BILLS_WITHOUT_CHARGE,
            $bills,
            'error',
            'Faturas aprovadas sem cobrança',
            "{$bills->count()} fatura(s) aprovada(s) nunca geraram cobrança: esses clientes não estão sendo cobrados. Gere a cobrança a partir da fatura.",
            route('admin.relatorios.faturas', ['review_status' => 'approved'], false),
        );
    }

    private function paymentSyncStale(): int
    {
        $staleBefore = now()->subHours(self::SYNC_STALE_HOURS);

        $slips = PaymentSlip::query()
            ->whereIn('status', ['pending', 'generated'])
            ->whereNotNull('provider_payment_id')
            ->where('generated_at', '<', $staleBefore)
            ->get()
            ->filter(function (PaymentSlip $slip) use ($staleBefore) {
                $syncedAt = $slip->response_payload['synced_at'] ?? null;

                return ! $syncedAt || now()->parse($syncedAt)->lt($staleBefore);
            });

        return $this->aggregate(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::PAYMENT_SYNC_STALE,
            $slips,
            'critical',
            'Pagamentos sem conferência com o Mercado Pago',
            "{$slips->count()} pagamento(s) em aberto não são conferidos com o Mercado Pago há mais de ".self::SYNC_STALE_HOURS.' horas: pagamentos feitos pelos clientes não estão sendo baixados. Verifique o worker da fila, o agendador e a conta do Mercado Pago.',
            route('admin.financeiro.pagamentos.index', ['status' => 'generated'], false),
        );
    }

    private function providerMissing(): int
    {
        $hasAccount = PaymentProviderAccount::query()
            ->where('provider', 'mercado_pago')
            ->where('is_active', true)
            ->where('is_default', true)
            ->exists();

        return $this->aggregate(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::PROVIDER_MISSING,
            $hasAccount ? collect() : collect([true]),
            'critical',
            'Nenhuma conta do Mercado Pago ativa',
            'Não há conta padrão ativa do Mercado Pago: nenhum boleto/Pix pode ser gerado. Cadastre ou ative a conta em Contas de Pagamento.',
            route('admin.financeiro.payment-provider-accounts.index', absolute: false),
        );
    }

    private function webhookSecretMissing(): int
    {
        $accounts = PaymentProviderAccount::query()
            ->where('provider', 'mercado_pago')
            ->where('is_active', true)
            ->get()
            ->filter(fn (PaymentProviderAccount $account) => blank($account->webhook_secret));

        return $this->notifier->sync(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::WEBHOOK_SECRET_MISSING,
            $accounts,
            fn (PaymentProviderAccount $account) => [
                'severity' => 'warning',
                'title' => 'Webhook do Mercado Pago sem secret',
                'message' => "A conta \"{$account->name}\" não tem webhook secret: as notificações do Mercado Pago são recusadas e os pagamentos só são baixados pela sincronização a cada 5 minutos. Configure o webhook (evento \"Order (Mercado Pago)\") e cole o secret na conta.",
                'context' => ['payload' => ['action_url' => route('admin.financeiro.payment-provider-accounts.edit', $account->id, false)]],
            ],
        );
    }

    /**
     * Um alerta por consultor (com a contagem da carteira dele) e um geral para cobranças
     * de clientes sem consultor.
     */
    private function chargesByConsultor(string $type, $query, callable $describe): int
    {
        $byConsultor = $query
            ->with('clientProfile:id,consultor_user_id')
            ->get(['id', 'client_profile_id'])
            ->groupBy(fn (CustomerCharge $charge) => $charge->clientProfile?->consultor_user_id ?? 0);

        $consultores = User::query()->whereIn('id', $byConsultor->keys()->filter())->get();

        $this->notifier->sync(
            OperationalAlertNotifier::MODULE_FINANCEIRO,
            $type,
            $consultores,
            function (User $consultor) use ($byConsultor, $describe) {
                $charges = $byConsultor->get($consultor->id);
                $info = $describe($charges->count());

                return [
                    'severity' => $info['severity'],
                    'title' => $info['title'],
                    'message' => $info['message'],
                    'context' => [
                        'assigned_to_user_id' => $consultor->id,
                        'payload' => ['count' => $charges->count(), 'customer_charge_ids' => $charges->pluck('id')->take(50)->values(), 'action_url' => $info['url']],
                    ],
                ];
            },
        );

        $withoutConsultor = $byConsultor->get(0, collect());
        $info = $describe($withoutConsultor->count());

        $this->aggregate(
            OperationalAlertNotifier::MODULE_FINANCEIRO,
            $type,
            $withoutConsultor,
            $info['severity'],
            $info['title'].' (clientes sem consultor)',
            $info['message'],
            $info['url'],
        );

        return $byConsultor->flatten()->count();
    }

    private function aggregate(string $module, string $type, Collection $items, string $severity, string $title, string $message, string $url): int
    {
        if ($items->isEmpty()) {
            $this->notifier->resolve($module, $type, notes: 'Resolvido automaticamente: a condição deixou de ocorrer.');

            return 0;
        }

        $ids = $items->map(fn ($item) => is_object($item) ? $item->getKey() : null)->filter()->take(50)->values();

        $this->notifier->raise($module, $type, $severity, $title, $message, context: [
            'payload' => ['count' => $items->count(), 'ids' => $ids, 'action_url' => $url],
        ], respectIgnored: true);

        return $items->count();
    }
}

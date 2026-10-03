<?php

namespace App\Services\Alert;

use App\Enums\Alert\OperationalAlertStatus;
use App\Models\Alert\OperationalAlert;
use Illuminate\Database\Eloquent\Model;
use Throwable;

/**
 * Porta única para alertas de falha operacional (faturas, pagamentos, fila, agendador).
 *
 * Cada alerta é identificado por módulo + tipo + registro afetado: repetir a mesma falha
 * renova o alerta em vez de duplicá-lo, e resolve() o fecha quando a operação volta a
 * funcionar. Falhar ao registrar um alerta nunca pode derrubar a operação que falhou.
 */
class OperationalAlertNotifier
{
    public const MODULE_FATURA = 'fatura';

    public const MODULE_FINANCEIRO = 'financeiro';

    public const MODULE_SISTEMA = 'sistema';

    public function __construct(
        private readonly UpsertOperationalAlertService $upsertAlertService,
    ) {}

    /**
     * @param  array{client_profile_id?: ?int, usina_id?: ?int, assigned_to_user_id?: ?int, payload?: array}  $context
     */
    public function raise(
        string $module,
        string $type,
        string $severity,
        string $title,
        string $message,
        ?Model $alertable = null,
        array $context = [],
        bool $respectIgnored = false,
    ): void {
        try {
            // Varreduras periódicas re-disparam o mesmo alerta a cada execução: se alguém
            // marcou como ignorado, não reabrir enquanto a condição persistir.
            if ($respectIgnored && $this->query($module, $type, $alertable)->where('status', OperationalAlertStatus::Ignored->value)->exists()) {
                return;
            }

            $this->upsertAlertService->handle([
                'module' => $module,
                'type' => $type,
                'severity' => $severity,
                'title' => $title,
                'message' => $message,
                'client_profile_id' => $context['client_profile_id'] ?? null,
                'usina_id' => $context['usina_id'] ?? null,
                'assigned_to_user_id' => $context['assigned_to_user_id'] ?? null,
                'payload' => $context['payload'] ?? null,
            ], $alertable);
        } catch (Throwable $e) {
            report($e);
        }
    }

    public function resolve(string $module, string $type, ?Model $alertable = null, string $notes = 'Resolvido automaticamente: a operação voltou a funcionar.'): void
    {
        try {
            $this->query($module, $type, $alertable)
                ->whereIn('status', [
                    OperationalAlertStatus::Open->value,
                    OperationalAlertStatus::InProgress->value,
                    OperationalAlertStatus::Ignored->value,
                ])
                ->update([
                    'status' => OperationalAlertStatus::Resolved->value,
                    'resolved_at' => now(),
                    'resolution_notes' => $notes,
                ]);
        } catch (Throwable $e) {
            report($e);
        }
    }

    /**
     * Para varreduras: mantém aberto um alerta por registro ainda com problema e resolve os
     * que deixaram de aparecer (condição corrigida).
     *
     * @param  iterable<Model>  $offenders
     * @param  callable(Model): array{severity: string, title: string, message: string, context?: array}  $describe
     */
    public function sync(string $module, string $type, iterable $offenders, callable $describe): int
    {
        $keepIds = [];

        foreach ($offenders as $offender) {
            $alert = $describe($offender);
            $this->raise($module, $type, $alert['severity'], $alert['title'], $alert['message'], $offender, $alert['context'] ?? [], respectIgnored: true);
            $keepIds[$offender::class][] = $offender->getKey();
        }

        try {
            // Só alertas por registro: o agregado sem registro (alertable null) do mesmo tipo
            // é controlado à parte por raise()/resolve().
            $stale = OperationalAlert::query()
                ->where('module', $module)
                ->where('type', $type)
                ->whereNotNull('alertable_id')
                ->whereIn('status', [
                    OperationalAlertStatus::Open->value,
                    OperationalAlertStatus::InProgress->value,
                    OperationalAlertStatus::Ignored->value,
                ])
                ->get()
                ->reject(fn (OperationalAlert $alert) => in_array($alert->alertable_id, $keepIds[$alert->alertable_type] ?? [], false));

            foreach ($stale as $alert) {
                $alert->update([
                    'status' => OperationalAlertStatus::Resolved->value,
                    'resolved_at' => now(),
                    'resolution_notes' => 'Resolvido automaticamente: a condição deixou de ocorrer.',
                ]);
            }
        } catch (Throwable $e) {
            report($e);
        }

        return count($keepIds, COUNT_RECURSIVE) - count($keepIds);
    }

    private function query(string $module, string $type, ?Model $alertable)
    {
        return OperationalAlert::query()
            ->where('module', $module)
            ->where('type', $type)
            ->when($alertable, fn ($q) => $q
                ->where('alertable_type', $alertable::class)
                ->where('alertable_id', $alertable->getKey()))
            ->when(! $alertable, fn ($q) => $q->whereNull('alertable_id'));
    }
}

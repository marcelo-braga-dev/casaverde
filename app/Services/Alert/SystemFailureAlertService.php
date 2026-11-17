<?php

namespace App\Services\Alert;

use App\Enums\Alert\OperationalAlertStatus;
use App\Models\Alert\OperationalAlert;
use Illuminate\Console\Events\ScheduledTaskFailed;
use Illuminate\Console\Events\ScheduledTaskFinished;
use Illuminate\Console\Scheduling\Event as ScheduledEvent;
use Illuminate\Queue\Events\JobFailed;

/**
 * Falhas de infraestrutura que param rotinas sem ninguém perceber: job que esgotou as
 * tentativas na fila e tarefa agendada que terminou com erro.
 */
class SystemFailureAlertService
{
    public const QUEUE_JOB_FAILED = 'queue_job_failed';

    public const SCHEDULED_TASK_FAILED = 'scheduled_task_failed';

    public function __construct(
        private readonly OperationalAlertNotifier $notifier,
    ) {}

    public function jobFailed(JobFailed $event): void
    {
        $name = $event->job->resolveName();

        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::QUEUE_JOB_FAILED,
            'error',
            'Tarefa em segundo plano falhou',
            sprintf('%s esgotou as tentativas: %s. Confira a tabela failed_jobs e reprocesse com "php artisan queue:retry".', class_basename($name), $event->exception->getMessage()),
            context: ['payload' => ['job' => $name, 'error' => $event->exception->getMessage(), 'failed_at' => now()->toDateTimeString()]],
        );
    }

    public function scheduledTaskFailed(ScheduledTaskFailed $event): void
    {
        $command = $this->commandName($event->task);

        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::SCHEDULED_TASK_FAILED,
            'critical',
            'Rotina agendada falhou',
            sprintf('A rotina "%s" terminou com erro: %s. Enquanto não for corrigida, o que ela automatiza (importação, sincronização de pagamentos, vencimentos, lembretes) fica parado.', $command, $event->exception->getMessage()),
            context: ['payload' => ['command' => $command, 'error' => $event->exception->getMessage(), 'failed_at' => now()->toDateTimeString()]],
        );
    }

    // O alerta é um só para todas as rotinas: só resolve quando a rotina que falhou volta a rodar.
    public function scheduledTaskFinished(ScheduledTaskFinished $event): void
    {
        if ((int) $event->task->exitCode !== 0) {
            return;
        }

        OperationalAlert::query()
            ->where('module', OperationalAlertNotifier::MODULE_SISTEMA)
            ->where('type', self::SCHEDULED_TASK_FAILED)
            ->whereIn('status', [OperationalAlertStatus::Open->value, OperationalAlertStatus::InProgress->value])
            ->where('payload->command', $this->commandName($event->task))
            ->update([
                'status' => OperationalAlertStatus::Resolved->value,
                'resolved_at' => now(),
                'resolution_notes' => 'Resolvido automaticamente: a rotina voltou a rodar sem erro.',
            ]);
    }

    private function commandName(ScheduledEvent $task): string
    {
        $command = $task->command ?? $task->description ?? 'tarefa agendada';

        return trim(preg_replace("/^.*artisan'?\s*/", '', (string) $command));
    }
}

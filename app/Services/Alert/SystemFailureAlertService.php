<?php

namespace App\Services\Alert;

use Illuminate\Console\Events\ScheduledTaskFailed;
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
        $command = $event->task->command ?? $event->task->description ?? 'tarefa agendada';
        $command = trim(preg_replace("/^.*artisan'?\s*/", '', (string) $command));

        $this->notifier->raise(
            OperationalAlertNotifier::MODULE_SISTEMA,
            self::SCHEDULED_TASK_FAILED,
            'critical',
            'Rotina agendada falhou',
            sprintf('A rotina "%s" terminou com erro: %s. Enquanto não for corrigida, o que ela automatiza (importação, sincronização de pagamentos, vencimentos, lembretes) fica parado.', $command, $event->exception->getMessage()),
            context: ['payload' => ['command' => $command, 'error' => $event->exception->getMessage(), 'failed_at' => now()->toDateTimeString()]],
        );
    }
}

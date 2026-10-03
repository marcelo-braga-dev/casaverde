<?php

use App\Services\Proposta\TemporaryPdfStorageService;
use Illuminate\Support\Facades\Schedule;

// energy-bills:import (pipeline EnergyBill antigo) fora do agendamento: nunca importou
// uma fatura (energy_bills vazia, toda tentativa falhava no parser) e lia a mesma caixa
// que concessionaire-bills:import, que processa esses PDFs com sucesso.
//
// withoutOverlapping: importação IMAP e sync com o Mercado Pago podem demorar mais que o
// intervalo; duas execuções simultâneas processariam os mesmos e-mails/boletos.
Schedule::command('concessionaire-bills:import')->hourly()->withoutOverlapping(60);

Schedule::command('casaverde:generate-monthly-charges')->hourly()->withoutOverlapping(60);
Schedule::command('casaverde:mark-overdue-charges')->everyTenMinutes()->withoutOverlapping(30);
Schedule::command('casaverde:sync-payments')->everyFiveMinutes()->withoutOverlapping(30);
// Antes dos lembretes das 08:00, para o lembrete do dia já refletir os boletos vencidos.
Schedule::command('casaverde:expire-payment-slips')->dailyAt('06:00')->withoutOverlapping(60);
Schedule::command('casaverde:send-charge-reminders')->dailyAt('08:00')->withoutOverlapping(60);
Schedule::command('casaverde:scan-operational-health')->hourlyAt(30)->withoutOverlapping(60);

Schedule::command('queue:prune-failed', ['--hours' => 24 * 30])->daily();
Schedule::call(fn () => app(TemporaryPdfStorageService::class)->prune())
    ->daily()
    ->name('prune-temporary-pdfs');

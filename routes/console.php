<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('energy-bills:import')->hourly();
Schedule::command('concessionaire-bills:import')->hourly();

Schedule::command('casaverde:generate-monthly-charges')->hourly();
Schedule::command('casaverde:mark-overdue-charges')->everyTenMinutes();
Schedule::command('casaverde:sync-payments')->everyFiveMinutes();
Schedule::command('casaverde:send-charge-reminders')->dailyAt('08:00');
Schedule::command('casaverde:generate-missing-payments')->hourly();

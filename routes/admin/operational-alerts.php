<?php

use App\Http\Controllers\Admin\Alert\IgnoreOperationalAlertController;
use App\Http\Controllers\Admin\Alert\OperationalAlertController;
use App\Http\Controllers\Admin\Alert\ResolveOperationalAlertController;
use App\Http\Controllers\Admin\Alert\ScanOperationalAlertsController;
use Illuminate\Support\Facades\Route;

Route::prefix('alertas-operacionais')
    ->name('operational-alerts.')
    ->group(function () {
        Route::get('/', [OperationalAlertController::class, 'index'])
            ->name('index');

        Route::post('/scan', ScanOperationalAlertsController::class)
            ->name('scan');

        Route::put('/{alert}/resolve', ResolveOperationalAlertController::class)
            ->name('resolve');

        Route::put('/{alert}/ignore', IgnoreOperationalAlertController::class)
            ->name('ignore');
    });

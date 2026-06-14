<?php

use App\Http\Controllers\Admin\Financeiro\AdminBillingManagementController;
use Illuminate\Support\Facades\Route;

Route::name('financeiro.management.')
    ->prefix('financeiro/management')
    ->group(function () {
        Route::get('/', AdminBillingManagementController::class)
            ->name('index');
    });

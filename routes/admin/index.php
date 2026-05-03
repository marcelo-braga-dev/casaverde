<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin,consultor'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', DashboardController::class)->name('dashboard');

        require __DIR__ . '/financeiro/cobrancas.php';
        require __DIR__ . '/financeiro/pagamentos.php';
        require __DIR__ . '/financeiro/payment-webhooks.php';

        require __DIR__ . '/users/admin.php';
        require __DIR__ . '/users/produtor.php';
        require __DIR__ . '/users/vendedor.php';

        require __DIR__ . '/financeiro.php';

        require __DIR__ . '/addresses.php';
        require __DIR__ . '/concessionarias.php';

        require __DIR__ . '/config.php';
        require __DIR__ . '/fatura-import-settings.php';
    });

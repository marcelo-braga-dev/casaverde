<?php

use App\Http\Controllers\Admin\Dashboard\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin,consultor'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

        require __DIR__.'/financeiro/cobrancas.php';
        require __DIR__.'/financeiro/pagamentos.php';
        require __DIR__.'/financeiro/payment-webhooks.php';
        require __DIR__.'/financeiro/management.php';
        require __DIR__.'/relatorios.php';
        require __DIR__.'/settings.php';

        require __DIR__.'/users/admin.php';
        require __DIR__.'/users/produtor.php';
        require __DIR__.'/users/vendedor.php';

        require __DIR__.'/financeiro.php';

        require __DIR__.'/addresses.php';
        require __DIR__.'/concessionarias.php';

        require __DIR__.'/config.php';
        require __DIR__.'/fatura-import-settings.php';

        require __DIR__.'/usinas.php';
        require __DIR__.'/cockpit.php';
        require __DIR__.'/operational-alerts.php';
        require __DIR__.'/integracao.php';
        require __DIR__.'/acesso.php';
        require __DIR__.'/whatsapp.php';
    });

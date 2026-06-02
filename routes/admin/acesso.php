<?php

use App\Http\Controllers\Admin\Acesso\AcessoController;
use Illuminate\Support\Facades\Route;

// Apenas admins — gerenciamento de credenciais e status de acesso
Route::middleware('role:admin')
    ->name('acesso.')
    ->prefix('acesso')
    ->group(function () {

        // Criar/atualizar credenciais
        Route::post('/cliente/{cliente}',   [AcessoController::class, 'storeCliente'])->name('cliente.store');
        Route::post('/produtor/{produtor}', [AcessoController::class, 'storeProdutor'])->name('produtor.store');

        // Bloquear / liberar qualquer usuário
        Route::post('/bloquear/{user}',  [AcessoController::class, 'bloquear'])->name('bloquear');
        Route::post('/liberar/{user}',   [AcessoController::class, 'liberar'])->name('liberar');
    });

<?php

use App\Http\Controllers\Admin\Integracao\ImportEmailAccountController;
use App\Http\Controllers\Admin\Integracao\IntegracaoController;
use Illuminate\Support\Facades\Route;

// Página de configurações de integração (apenas admin)
Route::middleware('role:admin')
    ->name('integracao.')
    ->prefix('integracao')
    ->group(function () {

        // Página principal: IMAP defaults + pool de emails
        Route::get('/', [IntegracaoController::class, 'index'])->name('index');
        Route::put('/settings', [IntegracaoController::class, 'updateSettings'])->name('settings.update');

        // CRUD do pool de emails
        Route::post('/emails', [ImportEmailAccountController::class, 'store'])->name('emails.store');
        Route::put('/emails/{account}', [ImportEmailAccountController::class, 'update'])->name('emails.update');
        Route::delete('/emails/{account}', [ImportEmailAccountController::class, 'destroy'])->name('emails.destroy');
        Route::post('/emails/{account}/unassign', [ImportEmailAccountController::class, 'unassign'])->name('emails.unassign');
    });

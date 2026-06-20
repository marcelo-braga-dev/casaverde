<?php

use App\Http\Controllers\Admin\Integracao\ImportEmailAccountController;
use App\Http\Controllers\Admin\Integracao\InstitutionalEmailAccountController;
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
        Route::put('/cpanel-settings', [IntegracaoController::class, 'updateCpanelSettings'])->name('cpanel-settings.update');

        // CRUD do pool de emails
        Route::post('/emails', [ImportEmailAccountController::class, 'store'])->name('emails.store');
        Route::post('/emails/cpanel', [ImportEmailAccountController::class, 'storeViaCpanel'])->name('emails.cpanel-store');
        Route::put('/emails/{account}', [ImportEmailAccountController::class, 'update'])->name('emails.update');
        Route::delete('/emails/{account}', [ImportEmailAccountController::class, 'destroy'])->name('emails.destroy');
        Route::post('/emails/{account}/unassign', [ImportEmailAccountController::class, 'unassign'])->name('emails.unassign');
        Route::get('/emails/{account}/roundcube', [ImportEmailAccountController::class, 'roundcube'])->name('emails.roundcube');

        // CRUD dos e-mails institucionais da empresa
        Route::post('/institutional-emails', [InstitutionalEmailAccountController::class, 'store'])->name('institutional-emails.store');
        Route::put('/institutional-emails/{institutionalEmail}', [InstitutionalEmailAccountController::class, 'update'])->name('institutional-emails.update');
        Route::delete('/institutional-emails/{institutionalEmail}', [InstitutionalEmailAccountController::class, 'destroy'])->name('institutional-emails.destroy');
    });

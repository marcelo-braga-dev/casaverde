<?php

use App\Http\Controllers\Admin\Fatura\ClientEmailImportSettingController;
use App\Http\Controllers\Admin\Fatura\ImportHistoryController;
use Illuminate\Support\Facades\Route;

// As telas de configuração de importação por e-mail (fatura-import-settings) ficaram
// inacabadas (listagem vazia, formulário apontando para a rota errada, show/edit sem
// página) e não tinham menu: rotas removidas até o módulo ser concluído. A configuração
// por cliente é feita em consultor.user.cliente.email-import-setting. Só o update segue
// ativo (endpoint sem tela, coberto por ClientEmailImportSettingControllerTest).
Route::put('fatura-import-settings/{faturaImportSetting}', [ClientEmailImportSettingController::class, 'update'])
    ->middleware('role:admin')
    ->name('fatura-import-settings.update');

Route::name('import-history.')
    ->prefix('import-history')
    ->middleware('role:admin')
    ->group(function () {
        Route::get('/', [ImportHistoryController::class, 'index'])->name('index');
        Route::post('/trigger', [ImportHistoryController::class, 'trigger'])->name('trigger');
        Route::get('/{run}', [ImportHistoryController::class, 'show'])->name('show');
        Route::get('/email/{email}/pdf', [ImportHistoryController::class, 'pdf'])->name('email.pdf');
    });

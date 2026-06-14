<?php

use App\Http\Controllers\Admin\Fatura\ClientEmailImportSettingController;
use App\Http\Controllers\Admin\Fatura\ImportHistoryController;
use Illuminate\Support\Facades\Route;

// ── Configurações de importação por email ────────────────────────────────
// O grupo pai em admin/index.php já fornece o prefixo admin.
// Aqui usamos apenas o sub-prefixo para que os nomes fiquem corretos:
// admin. (pai) + fatura-import-settings. (filho) + index = admin.fatura-import-settings.index
Route::name('fatura-import-settings.')
    ->prefix('fatura-import-settings')
    ->group(function () {
        Route::get('/', [ClientEmailImportSettingController::class, 'index'])->name('index');
        Route::get('/create', [ClientEmailImportSettingController::class, 'create'])->name('create');
        Route::get('/{faturaImportSetting}', [ClientEmailImportSettingController::class, 'show'])->name('show');
        Route::get('/{faturaImportSetting}/edit', [ClientEmailImportSettingController::class, 'edit'])->name('edit');
        Route::put('/{faturaImportSetting}', [ClientEmailImportSettingController::class, 'update'])->name('update');
    });

// ── Histórico de importações ─────────────────────────────────────────────
// admin. (pai) + import-history. (filho) + index = admin.import-history.index
Route::name('import-history.')
    ->prefix('import-history')
    ->group(function () {
        Route::get('/', [ImportHistoryController::class, 'index'])->name('index');
        Route::post('/trigger', [ImportHistoryController::class, 'trigger'])->name('trigger');
        Route::get('/{run}', [ImportHistoryController::class, 'show'])->name('show');
        Route::get('/email/{email}/pdf', [ImportHistoryController::class, 'pdf'])->name('email.pdf');
    });

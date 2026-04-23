<?php

use App\Http\Controllers\Admin\Fatura\ClientEmailImportSettingController;
use Illuminate\Support\Facades\Route;

Route::name('admin.fatura-import-settings.')
    ->prefix('fatura-import-settings')
    ->group(function () {
        Route::get('/', [ClientEmailImportSettingController::class, 'index'])->name('index');
        Route::get('/create', [ClientEmailImportSettingController::class, 'create'])->name('create');
        Route::post('/', [ClientEmailImportSettingController::class, 'store'])->name('store');
        Route::get('/{faturaImportSetting}', [ClientEmailImportSettingController::class, 'show'])->name('show');
        Route::get('/{faturaImportSetting}/edit', [ClientEmailImportSettingController::class, 'edit'])->name('edit');
        Route::put('/{faturaImportSetting}', [ClientEmailImportSettingController::class, 'update'])->name('update');
    });
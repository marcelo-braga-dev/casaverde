<?php

use App\Http\Controllers\Admin\Config\ConfigController;
use Illuminate\Support\Facades\Route;

Route::name('admin.config.')
    ->prefix('config')
    ->group(function () {
        Route::resource('geral', ConfigController::class)->only(['index']);

        Route::name('api.')
            ->prefix('api')
            ->group(function () {
                Route::post('update-taxa-reducao-conta', [ConfigController::class, 'updateTaxaReducaoConta'])->name('update-taxa-reducao-conta');
                Route::get('get-taxa-reducao-conta', [ConfigController::class, 'getTaxaReducaoConta'])->name('get-taxa-reducao-conta');
            });
    });

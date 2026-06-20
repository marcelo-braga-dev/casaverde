<?php

use App\Http\Controllers\Admin\Configuracao\BrandIdentityController;
use Illuminate\Support\Facades\Route;

Route::name('brand-identity.')
    ->prefix('brand-identity')
    ->group(function () {
        Route::get('/', [BrandIdentityController::class, 'index'])->name('index');
        Route::post('/', [BrandIdentityController::class, 'update'])->name('update');
        Route::delete('/logo', [BrandIdentityController::class, 'destroyLogo'])->name('logo.destroy');
        Route::delete('/favicon', [BrandIdentityController::class, 'destroyFavicon'])->name('favicon.destroy');
    });

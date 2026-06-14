<?php

use App\Http\Controllers\Admin\Configuracao\SystemSettingController;
use Illuminate\Support\Facades\Route;

Route::name('settings.')
    ->prefix('settings')
    ->group(function () {
        Route::get('/', [SystemSettingController::class, 'index'])
            ->name('index');

        Route::put('/', [SystemSettingController::class, 'update'])
            ->name('update');
    });

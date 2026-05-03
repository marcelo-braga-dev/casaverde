<?php

use App\Http\Controllers\Admin\Usuarios\Consultor\GetAllVendedoresController;
use App\Http\Controllers\Admin\Usuarios\Consultor\ConsultorController;
use Illuminate\Support\Facades\Route;

Route::name('user.')
    ->prefix('user')
    ->group(function () {
        Route::resource('vendedor', ConsultorController::class);

        Route::name('vendedor.api.')
            ->prefix('vendedor-api')
            ->group(function () {
                Route::get('get-vendedores', GetAllVendedoresController::class)->name('get');
            });
    });

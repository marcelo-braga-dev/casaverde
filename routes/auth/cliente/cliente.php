<?php

use App\Http\Controllers\Auth\Cliente\ClienteController;
use App\Http\Controllers\Auth\Cliente\GetClientesController;
use Illuminate\Support\Facades\Route;

Route::name('auth.')
    ->group(function () {
        Route::resource('cliente', ClienteController::class)->only(['index', 'create', 'store', 'show']);

        Route::name('cliente.api.')
            ->prefix('cliente-api')
            ->group(function () {
                Route::get('get', GetClientesController::class)->name('get');
            });
    });

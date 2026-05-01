<?php

use App\Http\Controllers\Admin\Usuarios\Cliente\ClienteController;
use Illuminate\Support\Facades\Route;

Route::name('admin.user.')
    ->prefix('user')
    ->group(function () {
        //Route::resource('cliente', ClienteController::class);

//        Route::name('cliente.api.')
//            ->prefix('cliente-api')
//            ->group(function () {
//                Route::get('get-clientes', \App\Http\Controllers\Admin\Usuarios\Cliente\GetClienteController::class)->name('get');
//            });
    });

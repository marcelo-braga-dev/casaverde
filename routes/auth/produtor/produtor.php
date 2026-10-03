<?php

use App\Http\Controllers\Admin\Usuarios\Produtor\GetProdutorApiController;
use App\Http\Controllers\Auth\Produtor\FindProdutorController;
use App\Http\Controllers\Auth\Produtor\ProdutorController;
use Illuminate\Support\Facades\Route;

Route::name('auth.')
    ->group(function () {

        Route::resource('produtor', ProdutorController::class)->only(['index', 'create', 'store', 'show']);

        Route::name('produtor.api.')
            ->prefix('produtor-api')
            ->group(function () {
                Route::get('get-all', GetProdutorApiController::class)->name('get-all');
                Route::get('get/{id}', FindProdutorController::class)->name('get');
            });
    });

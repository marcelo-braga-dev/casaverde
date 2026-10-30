<?php

use App\Http\Controllers\Auth\Usinas\FindUsinaController;
use App\Http\Controllers\Auth\Usinas\GetProdutorUsinasController;
use App\Http\Controllers\Auth\Usinas\GetUsinasController;
use App\Http\Controllers\Auth\Usinas\UsinasController;
use Illuminate\Support\Facades\Route;

Route::name('auth.')
    ->group(function () {
        Route::resource('usinas', UsinasController::class)->only(['index', 'show']);

        Route::name('usinas.api.')
            ->prefix('usinas-api')
            ->group(function () {
                Route::get('get/{id}', FindUsinaController::class)->name('get');
                Route::get('get-produtor/{id}', GetProdutorUsinasController::class)->name('get-produtor');
                Route::get('get-all', GetUsinasController::class)->name('get-all');
            });
    });

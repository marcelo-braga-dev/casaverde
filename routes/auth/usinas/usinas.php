<?php

use App\Http\Controllers\Auth\Usinas\FindUsinaController;
use App\Http\Controllers\Auth\Usinas\GetAllUsinasController;
use App\Http\Controllers\Auth\Usinas\GetProdutorUsinasController;
use App\Http\Controllers\Auth\Usinas\GetUsinasController;
use App\Http\Controllers\Auth\Usinas\UpdateStatusUsinaController;
use App\Http\Controllers\Auth\Usinas\UsinasController;
use Illuminate\Support\Facades\Route;

Route::name('auth.')
    ->group(function () {
        Route::resource('usinas', UsinasController::class);

        Route::prefix('usinas-concessionaria')
            ->name('concessionaria.')
            ->group(function () {
                Route::get('usinas-concessionaria/{id}', [UsinasController::class, 'usinas'])->name('usinas');
            });

        Route::name('usinas.api.')
            ->prefix('usinas-api')
            ->group(function () {
                Route::get('get/{id}', FindUsinaController::class)->name('get');
                Route::get('get-produtor/{id}', GetProdutorUsinasController::class)->name('get-produtor');
                Route::get('get-all', GetUsinasController::class)->name('get-all');
                Route::put('update-status/{id}', UpdateStatusUsinaController::class)->name('update-status');
                Route::get('kanban-get', GetAllUsinasController::class)->name('kanban.get');
            });
    });

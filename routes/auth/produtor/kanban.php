<?php

use App\Http\Controllers\Auth\Produtor\GetKanbanController;
use App\Http\Controllers\Auth\Produtor\KanbanProdutorController;
use Illuminate\Support\Facades\Route;

Route::name('auth.')
    ->group(function () {

        Route::name('produtor.')
            ->prefix('produtor')
            ->group(function () {
                Route::resource('kanban', KanbanProdutorController::class)->only(['index']);

                Route::name('api.')
                    ->prefix('produtor-api')
                    ->group(function () {
                        Route::get('get-kanban', GetKanbanController::class)->name('get-kanban');
                    });
            });
    });

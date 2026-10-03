<?php

use App\Http\Controllers\Admin\Usuarios\Produtor\GetProdutorApiController;
use App\Http\Controllers\Admin\Usuarios\Produtor\Status\AnalizarDocumentosController;
use App\Http\Controllers\Admin\Usuarios\Produtor\Status\UpdateStatusController;
use Illuminate\Support\Facades\Route;

Route::name('admin.')
    ->group(function () {

        Route::name('produtor.status.')
            ->prefix('produtor-status')
            ->group(function () {
                Route::resource('analizar-documentos', AnalizarDocumentosController::class)->only(['show', 'update']);
            });

        Route::name('produtor.api.')
            ->prefix('produtor-api')
            ->group(function () {
                Route::get('cadastrados', GetProdutorApiController::class)->name('cadastrados');
                Route::post('update-status', UpdateStatusController::class)->name('update-status');
            });
    });

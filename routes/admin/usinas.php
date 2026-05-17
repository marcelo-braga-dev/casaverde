<?php

use App\Http\Controllers\Admin\Usina\AdminClientUsinaLinkController;
use App\Http\Controllers\Admin\Usina\AdminUsinaGenerationRecordController;
use App\Http\Controllers\Admin\Usina\AdminUsinaManagementController;
use Illuminate\Support\Facades\Route;

Route::prefix('usinas')
    ->name('usinas.')
    ->group(function () {
        Route::get('/gestao', [AdminUsinaManagementController::class, 'index'])
            ->name('management');

        Route::get('/vinculos', [AdminClientUsinaLinkController::class, 'index'])
            ->name('links.index');

        Route::get('/vinculos/create', [AdminClientUsinaLinkController::class, 'create'])
            ->name('links.create');

        Route::post('/vinculos', [AdminClientUsinaLinkController::class, 'store'])
            ->name('links.store');

        Route::delete('/vinculos/{link}', [AdminClientUsinaLinkController::class, 'destroy'])
            ->name('links.destroy');

        Route::get('/geracao', [AdminUsinaGenerationRecordController::class, 'index'])
            ->name('generation.index');

        Route::get('/geracao/create', [AdminUsinaGenerationRecordController::class, 'create'])
            ->name('generation.create');

        Route::post('/geracao', [AdminUsinaGenerationRecordController::class, 'store'])
            ->name('generation.store');
    });

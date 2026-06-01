<?php

use App\Http\Controllers\Produtor\DashboardController;
use App\Http\Controllers\Produtor\UsinaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:produtor'])
    ->prefix('produtor')
    ->name('produtor.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', DashboardController::class)->name('dashboard');

        // Usinas do produtor (somente leitura das próprias usinas)
        Route::get('/usinas', [UsinaController::class, 'index'])->name('usinas.index');
        Route::get('/usinas/{usina}', [UsinaController::class, 'show'])->name('usinas.show');
    });

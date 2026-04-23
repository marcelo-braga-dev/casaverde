<?php

use App\Http\Controllers\Produtor\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:produtor'])
    ->prefix('produtor')
    ->name('produtor.')
    ->group(function () {
        Route::get('/dashboard', DashboardController::class)->name('dashboard');
    });
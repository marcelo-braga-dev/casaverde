<?php

use App\Http\Controllers\Cliente\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:cliente'])
    ->prefix('cliente')
    ->name('cliente.')
    ->group(function () {
        Route::get('/dashboard', DashboardController::class)->name('dashboard');
    });
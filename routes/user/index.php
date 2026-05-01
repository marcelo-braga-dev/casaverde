<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin,consultor'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        require __DIR__ . '/cliente.php';
    });

<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin,consultor'])
    ->prefix('consultor')
    ->name('consultor.')
    ->group(function () {

        require __DIR__ . '/client/client.php';
        require __DIR__ . '/producer/index.php';
    });

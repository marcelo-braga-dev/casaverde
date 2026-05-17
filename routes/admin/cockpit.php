<?php

use App\Http\Controllers\Admin\Cockpit\AdminExecutiveCockpitController;
use Illuminate\Support\Facades\Route;

Route::name('cockpit.')
    ->prefix('cockpit')
    ->group(function () {
        Route::get('/executivo', AdminExecutiveCockpitController::class)
            ->name('executive');
    });

<?php

use App\Http\Controllers\Auth\Concessionarias\GetAllConcessionariasController;
use Illuminate\Support\Facades\Route;

Route::prefix('concessionarias')
    ->name('auth.concessionarias.')
    ->group(function () {
        Route::get('get-all', GetAllConcessionariasController::class)->name('get-all');
    });


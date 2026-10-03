<?php

use App\Http\Controllers\Auth\ClienteActivationController;

Route::get('/cliente/ativacao/{token}', [ClienteActivationController::class, 'show'])
    ->name('cliente.activation.form');

Route::post('/cliente/ativacao', [ClienteActivationController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('cliente.activation.store');

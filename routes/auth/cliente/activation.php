<?php

use App\Http\Controllers\Auth\ClienteActivationController;

Route::get('/cliente/ativacao/{token}', [ClienteActivationController::class, 'show'])
    ->name('cliente.activation.form');

Route::post('/cliente/ativacao', [ClienteActivationController::class, 'store'])
    ->name('cliente.activation.store');

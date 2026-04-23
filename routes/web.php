<?php

use App\Http\Controllers\Auth\ClienteActivationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/auth/index.php';
require __DIR__ . '/admin/index.php';
require __DIR__ . '/auth.php';

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/cliente/ativacao/{token}', [ClienteActivationController::class, 'show'])
    ->name('cliente.activation.form');

Route::post('/cliente/ativacao', [ClienteActivationController::class, 'store'])
    ->name('cliente.activation.store');
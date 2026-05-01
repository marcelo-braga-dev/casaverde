<?php

use App\Http\Controllers\Auth\ClienteActivationController;
use App\Http\Controllers\Auth\ProdutorActivationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/auth/index.php';
require __DIR__ . '/admin/index.php';
require __DIR__ . '/cliente/index.php';
require __DIR__ . '/produtor/index.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/user/index.php';
require __DIR__ . '/consultor/index.php';

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'redirect.role'])->name('dashboard');

Route::get('/cliente/ativacao/{token}', [ClienteActivationController::class, 'show'])
    ->name('cliente.activation.form');

Route::post('/cliente/ativacao', [ClienteActivationController::class, 'store'])
    ->name('cliente.activation.store');

Route::get('/produtor/ativacao/{token}', [ProdutorActivationController::class, 'show'])
    ->name('produtor.activation.form');

Route::post('/produtor/ativacao', [ProdutorActivationController::class, 'store'])
    ->name('produtor.activation.store');

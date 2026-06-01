<?php

use App\Http\Controllers\Auth\Perfil\PerfilController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])
    ->name('auth.perfil.')
    ->prefix('perfil')
    ->group(function () {
        Route::get('/usuario', [PerfilController::class, 'index'])->name('usuario.index');
        Route::put('/usuario/info', [PerfilController::class, 'updateInfo'])->name('usuario.update-info');
        Route::put('/usuario/senha', [PerfilController::class, 'updatePassword'])->name('usuario.update-password');
    });

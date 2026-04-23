<?php

use App\Http\Controllers\Admin\Usina\UsinaSolarController;
use Illuminate\Support\Facades\Route;

Route::name('admin.usinas.')
    ->prefix('usinas')
    ->group(function () {
        Route::get('/', [UsinaSolarController::class, 'index'])->name('index');
        Route::get('/create', [UsinaSolarController::class, 'create'])->name('create');
        Route::post('/', [UsinaSolarController::class, 'store'])->name('store');
        Route::get('/{usina}', [UsinaSolarController::class, 'show'])->name('show');
        Route::get('/{usina}/edit', [UsinaSolarController::class, 'edit'])->name('edit');
        Route::put('/{usina}', [UsinaSolarController::class, 'update'])->name('update');
    });
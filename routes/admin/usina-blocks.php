<?php

use App\Http\Controllers\Admin\Usina\UsinaBlockController;
use Illuminate\Support\Facades\Route;

Route::name('admin.usina-blocks.')
    ->prefix('usina-blocks')
    ->group(function () {
        Route::get('/', [UsinaBlockController::class, 'index'])->name('index');
        Route::get('/create', [UsinaBlockController::class, 'create'])->name('create');
        Route::post('/', [UsinaBlockController::class, 'store'])->name('store');
        Route::get('/{usinaBlock}', [UsinaBlockController::class, 'show'])->name('show');
        Route::get('/{usinaBlock}/edit', [UsinaBlockController::class, 'edit'])->name('edit');
        Route::put('/{usinaBlock}', [UsinaBlockController::class, 'update'])->name('update');
    });
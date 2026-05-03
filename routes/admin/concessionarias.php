<?php

use App\Http\Controllers\Admin\Settings\ConcessionariaController;
use Illuminate\Support\Facades\Route;

Route::name('concessionaria.')
    ->prefix('concessionaria')
    ->group(function () {
        Route::get('/', [ConcessionariaController::class, 'index'])->name('index');
        Route::get('/create', [ConcessionariaController::class, 'create'])->name('create');
        Route::post('/', [ConcessionariaController::class, 'store'])->name('store');
        Route::get('/{concessionaria}', [ConcessionariaController::class, 'show'])->name('show');
        Route::get('/{concessionaria}/edit', [ConcessionariaController::class, 'edit'])->name('edit');
        Route::put('/{concessionaria}', [ConcessionariaController::class, 'update'])->name('update');
    });

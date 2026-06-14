<?php

use App\Http\Controllers\Admin\Cliente\ConsumerUnitManagementController;
use Illuminate\Support\Facades\Route;

Route::name('cliente.consumer-units.')
    ->prefix('cliente/unidades-consumidoras')
    ->group(function () {
        Route::get('/', [ConsumerUnitManagementController::class, 'index'])->name('index');
        Route::get('/create', [ConsumerUnitManagementController::class, 'create'])->name('create');
        Route::post('/', [ConsumerUnitManagementController::class, 'store'])->name('store');
        Route::get('/{consumerUnit}', [ConsumerUnitManagementController::class, 'show'])->name('show');
        Route::get('/{consumerUnit}/edit', [ConsumerUnitManagementController::class, 'edit'])->name('edit');
        Route::put('/{consumerUnit}', [ConsumerUnitManagementController::class, 'update'])->name('update');
        Route::delete('/{consumerUnit}', [ConsumerUnitManagementController::class, 'destroy'])->name('destroy');
    });

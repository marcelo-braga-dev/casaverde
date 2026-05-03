<?php

use App\Http\Controllers\Admin\Cliente\ClientContractController;
use Illuminate\Support\Facades\Route;

Route::name('cliente.contratos.')
    ->prefix('cliente/contratos')
    ->group(function () {
        Route::get('/', [ClientContractController::class, 'index'])->name('index');
        Route::get('/create/{proposal}', [ClientContractController::class, 'create'])->name('create');
        Route::post('/', [ClientContractController::class, 'store'])->name('store');
        Route::get('/{contract}', [ClientContractController::class, 'show'])->name('show');
        Route::get('/{contract}/edit', [ClientContractController::class, 'edit'])->name('edit');
        Route::put('/{contract}', [ClientContractController::class, 'update'])->name('update');
    });

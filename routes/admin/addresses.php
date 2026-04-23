<?php

use App\Http\Controllers\Admin\Endereco\AddressController;
use Illuminate\Support\Facades\Route;

Route::name('admin.addresses.')
    ->prefix('addresses')
    ->group(function () {
        Route::get('/', [AddressController::class, 'index'])->name('index');
        Route::get('/create', [AddressController::class, 'create'])->name('create');
        Route::post('/', [AddressController::class, 'store'])->name('store');
        Route::get('/{address}', [AddressController::class, 'show'])->name('show');
        Route::get('/{address}/edit', [AddressController::class, 'edit'])->name('edit');
        Route::put('/{address}', [AddressController::class, 'update'])->name('update');
    });
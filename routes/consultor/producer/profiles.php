<?php

use App\Http\Controllers\Admin\Produtor\ProducerProfileController;
use Illuminate\Support\Facades\Route;

Route::name('producer.profiles.')
    ->prefix('producer/profiles')
    ->group(function () {
        Route::get('/', [ProducerProfileController::class, 'index'])->name('index');
        Route::get('/create', [ProducerProfileController::class, 'create'])->name('create');
        Route::post('/', [ProducerProfileController::class, 'store'])->name('store');
        Route::get('/{producerProfile}', [ProducerProfileController::class, 'show'])->name('show');
        Route::get('/{producerProfile}/edit', [ProducerProfileController::class, 'edit'])->name('edit');
        Route::put('/{producerProfile}', [ProducerProfileController::class, 'update'])->name('update');
    });

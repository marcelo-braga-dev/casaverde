<?php

use App\Http\Controllers\Admin\Produtor\ProducerLeadController;
use Illuminate\Support\Facades\Route;

Route::name('producer.leads.')
    ->prefix('producer/leads')
    ->group(function () {
        Route::get('/', [ProducerLeadController::class, 'index'])->name('index');
        Route::get('/create', [ProducerLeadController::class, 'create'])->name('create');
        Route::post('/', [ProducerLeadController::class, 'store'])->name('store');
        Route::get('/{producerLead}', [ProducerLeadController::class, 'show'])->name('show');
        Route::get('/{producerLead}/edit', [ProducerLeadController::class, 'edit'])->name('edit');
        Route::put('/{producerLead}', [ProducerLeadController::class, 'update'])->name('update');
    });

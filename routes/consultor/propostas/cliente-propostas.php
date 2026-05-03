<?php

use App\Http\Controllers\Admin\Proposta\CommercialProposalController;
use Illuminate\Support\Facades\Route;

Route::name('propostas.cliente.')
    ->prefix('propostas/cliente')
    ->group(function () {
        Route::get('/', [CommercialProposalController::class, 'index'])->name('index');
        Route::get('/create', [CommercialProposalController::class, 'create'])->name('create');
        Route::post('/', [CommercialProposalController::class, 'store'])->name('store');
        Route::get('/{proposal}', [CommercialProposalController::class, 'show'])->name('show');
        Route::get('/{proposal}/pdf', [CommercialProposalController::class, 'pdf'])->name('pdf');
        Route::get('/{proposal}/edit', [CommercialProposalController::class, 'edit'])->name('edit');
        Route::put('/{proposal}', [CommercialProposalController::class, 'update'])->name('update');
    });

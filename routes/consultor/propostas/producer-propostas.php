<?php

use App\Http\Controllers\Admin\Proposta\ProducerProposalController;
use Illuminate\Support\Facades\Route;

Route::name('propostas.produtor.')
    ->prefix('propostas/produtor')
    ->group(function () {
        Route::get('/', [ProducerProposalController::class, 'index'])->name('index');
        Route::get('/create', [ProducerProposalController::class, 'create'])->name('create');
        Route::post('/', [ProducerProposalController::class, 'store'])->name('store');
        Route::get('/{proposal}', [ProducerProposalController::class, 'show'])->name('show');
        Route::get('/{proposal}/pdf', [ProducerProposalController::class, 'pdf'])->name('pdf');
        Route::get('/{proposal}/edit', [ProducerProposalController::class, 'edit'])->name('edit');
        Route::put('/{proposal}', [ProducerProposalController::class, 'update'])->name('update');
    });

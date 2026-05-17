<?php

use App\Http\Controllers\Admin\Proposta\ClientProposalController;
use Illuminate\Support\Facades\Route;

Route::name('propostas.cliente.')
    ->prefix('propostas/cliente')
    ->group(function () {
        Route::get('/', [ClientProposalController::class, 'index'])->name('index');
        Route::get('/create', [ClientProposalController::class, 'create'])->name('create');
        Route::post('/', [ClientProposalController::class, 'store'])->name('store');
        Route::get('/{proposal}', [ClientProposalController::class, 'show'])->name('show');
        Route::get('/{proposal}/pdf', [ClientProposalController::class, 'pdf'])->name('pdf');
        Route::get('/{proposal}/edit', [ClientProposalController::class, 'edit'])->name('edit');
        Route::put('/{proposal}', [ClientProposalController::class, 'update'])->name('update');
    });

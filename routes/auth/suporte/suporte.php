<?php

use App\Http\Controllers\Support\SupportTicketController;
use Illuminate\Support\Facades\Route;

// ── Rotas do sistema de chamados (todos os usuários autenticados) ─────────
Route::middleware(['auth'])
    ->name('support.')
    ->prefix('support')
    ->group(function () {

        Route::get('/tickets', [SupportTicketController::class, 'index'])->name('tickets.index');
        Route::get('/tickets/create', [SupportTicketController::class, 'create'])->name('tickets.create');
        Route::post('/tickets', [SupportTicketController::class, 'store'])->name('tickets.store');

        Route::get('/tickets/{ticket}', [SupportTicketController::class, 'show'])->name('tickets.show');
        Route::post('/tickets/{ticket}/message', [SupportTicketController::class, 'addMessage'])->name('tickets.message');
        Route::post('/tickets/{ticket}/cancel', [SupportTicketController::class, 'cancel'])->name('tickets.cancel');

        Route::put('/tickets/{ticket}/status', [SupportTicketController::class, 'updateStatus'])
            ->middleware('role:admin,consultor')
            ->name('tickets.status');
    });

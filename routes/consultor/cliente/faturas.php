<?php

use App\Http\Controllers\Admin\Fatura\ApproveConcessionaireBillController;
use App\Http\Controllers\Admin\Fatura\ConcessionaireBillController;
use App\Http\Controllers\Admin\Fatura\ConcessionaireBillFileController;
use App\Http\Controllers\Admin\Fatura\ConcessionaireBillIssueController;
use Illuminate\Support\Facades\Route;

Route::name('cliente.faturas.')
    ->prefix('cliente-faturas')
    ->middleware('role:admin')
    ->group(function () {
        Route::get('/create', [ConcessionaireBillController::class, 'create'])->name('create');
        Route::post('/', [ConcessionaireBillController::class, 'store'])->name('store');
        Route::get('/{fatura}', [ConcessionaireBillController::class, 'show'])->name('show');
        Route::put('/{fatura}', [ConcessionaireBillController::class, 'update'])->name('update');
        Route::delete('/{fatura}', [ConcessionaireBillController::class, 'destroy'])->name('destroy');
        Route::get('/{fatura}/pdf', [ConcessionaireBillFileController::class, 'show'])->name('pdf');

        Route::post('/issues/{issue}/resolve', [ConcessionaireBillIssueController::class, 'resolve'])
            ->name('issues.resolve');

        Route::post('/{fatura}/approve', [ApproveConcessionaireBillController::class, 'store'])
            ->name('approve');
    });

<?php

use App\Http\Controllers\Admin\Fatura\ConcessionaireBillController;
use App\Http\Controllers\Admin\Fatura\ConcessionaireBillFileController;
use App\Http\Controllers\Admin\Fatura\ConcessionaireBillIssueController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Fatura\ApproveConcessionaireBillController;

Route::name('admin.faturas.')
    ->prefix('faturas')
    ->group(function () {
        Route::get('/', [ConcessionaireBillController::class, 'index'])->name('index');
        Route::get('/create', [ConcessionaireBillController::class, 'create'])->name('create');
        Route::post('/', [ConcessionaireBillController::class, 'store'])->name('store');
        Route::get('/{fatura}', [ConcessionaireBillController::class, 'show'])->name('show');
        Route::put('/{fatura}', [ConcessionaireBillController::class, 'update'])->name('update');
        Route::get('/{fatura}/pdf', [ConcessionaireBillFileController::class, 'show'])->name('pdf');

        Route::post('/issues/{issue}/resolve', [ConcessionaireBillIssueController::class, 'resolve'])
            ->name('issues.resolve');

        Route::post('/{fatura}/approve', [ApproveConcessionaireBillController::class, 'store'])
            ->name('approve');
    });
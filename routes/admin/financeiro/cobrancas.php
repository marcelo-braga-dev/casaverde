<?php

use App\Http\Controllers\Admin\Cobranca\ApproveCustomerChargeController;
use App\Http\Controllers\Admin\Cobranca\CancelCustomerChargeController;
use App\Http\Controllers\Admin\Cobranca\CustomerChargeAdjustmentController;
use App\Http\Controllers\Admin\Cobranca\CustomerChargeController;
use App\Http\Controllers\Admin\Cobranca\GenerateCustomerChargeFromBillController;
use App\Http\Controllers\Admin\Cobranca\MarkCustomerChargeAsOverdueController;
use App\Http\Controllers\Admin\Cobranca\MarkCustomerChargeAsPaidController;
use Illuminate\Support\Facades\Route;

Route::name('financeiro.cobrancas.')
    ->prefix('financeiro/cobrancas')
    ->group(function () {
        Route::get('/', [CustomerChargeController::class, 'index'])->name('index');
        Route::get('/{cobranca}', [CustomerChargeController::class, 'show'])->name('show');

        Route::post('/gerar-da-fatura/{fatura}', [GenerateCustomerChargeFromBillController::class, 'store'])
            ->middleware('role:admin')
            ->name('generate-from-bill');

        Route::post('/{cobranca}/approve', [ApproveCustomerChargeController::class, 'store'])
            ->name('approve');

        Route::post('/{cobranca}/cancel', [CancelCustomerChargeController::class, 'store'])
            ->name('cancel');

        Route::post('/{cobranca}/mark-paid', [MarkCustomerChargeAsPaidController::class, 'store'])
            ->name('mark-paid');

        Route::post('/{cobranca}/mark-overdue', [MarkCustomerChargeAsOverdueController::class, 'store'])
            ->name('mark-overdue');

        Route::post('/{cobranca}/adjustments', [CustomerChargeAdjustmentController::class, 'store'])
            ->name('adjustments.store');
    });

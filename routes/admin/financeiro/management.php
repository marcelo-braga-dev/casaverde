<?php

use App\Http\Controllers\Admin\Cobranca\ApproveCustomerChargeController;
use App\Http\Controllers\Admin\Cobranca\CancelCustomerChargeController;
use App\Http\Controllers\Admin\Cobranca\CustomerChargeAdjustmentController;
use App\Http\Controllers\Admin\Cobranca\CustomerChargeController;
use App\Http\Controllers\Admin\Cobranca\GenerateCustomerChargeFromBillController;
use App\Http\Controllers\Admin\Cobranca\MarkCustomerChargeAsOverdueController;
use App\Http\Controllers\Admin\Cobranca\MarkCustomerChargeAsPaidController;
use App\Http\Controllers\Admin\Financeiro\AdminBillingManagementController;
use Illuminate\Support\Facades\Route;

Route::name('financeiro.management.')
    ->prefix('financeiro/management')
    ->group(function () {
        Route::get('/', AdminBillingManagementController::class)
            ->name('index');
    });

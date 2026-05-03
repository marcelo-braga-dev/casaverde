<?php

use App\Http\Controllers\Admin\Pagamento\CancelPaymentSlipController;
use App\Http\Controllers\Admin\Pagamento\GeneratePaymentSlipController;
use App\Http\Controllers\Admin\Pagamento\PaymentProviderAccountController;
use App\Http\Controllers\Admin\Pagamento\PaymentSlipController;
use App\Http\Controllers\Admin\Pagamento\SyncPaymentSlipController;
use Illuminate\Support\Facades\Route;

Route::name('financeiro.pagamentos.')
    ->prefix('financeiro/pagamentos')
    ->group(function () {
        Route::get('/', [PaymentSlipController::class, 'index'])->name('index');
        Route::get('/{pagamento}', [PaymentSlipController::class, 'show'])->name('show');

        Route::post('/gerar-da-cobranca/{cobranca}', [GeneratePaymentSlipController::class, 'store'])
            ->name('generate-from-charge');

        Route::post('/{pagamento}/sync', [SyncPaymentSlipController::class, 'store'])
            ->name('sync');

        Route::post('/{pagamento}/cancel', [CancelPaymentSlipController::class, 'store'])
            ->name('cancel');
    });

Route::name('financeiro.payment-provider-accounts.')
    ->prefix('financeiro/payment-provider-accounts')
    ->group(function () {
        Route::get('/', [PaymentProviderAccountController::class, 'index'])->name('index');
        Route::get('/create', [PaymentProviderAccountController::class, 'create'])->name('create');
        Route::post('/', [PaymentProviderAccountController::class, 'store'])->name('store');
        Route::get('/{paymentProviderAccount}', [PaymentProviderAccountController::class, 'show'])->name('show');
        Route::get('/{paymentProviderAccount}/edit', [PaymentProviderAccountController::class, 'edit'])->name('edit');
        Route::put('/{paymentProviderAccount}', [PaymentProviderAccountController::class, 'update'])->name('update');
    });

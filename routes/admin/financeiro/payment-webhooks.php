<?php

use App\Http\Controllers\Admin\Pagamento\PaymentWebhookEventController;
use App\Http\Controllers\Admin\Pagamento\ReprocessPaymentWebhookEventController;
use Illuminate\Support\Facades\Route;

Route::name('financeiro.payment-webhooks.')
    ->prefix('financeiro/payment-webhooks')
    ->group(function () {
        Route::get('/', [PaymentWebhookEventController::class, 'index'])->name('index');
        Route::get('/{webhook}', [PaymentWebhookEventController::class, 'show'])->name('show');

        Route::post('/{webhook}/reprocess', [ReprocessPaymentWebhookEventController::class, 'store'])
            ->name('reprocess');
    });

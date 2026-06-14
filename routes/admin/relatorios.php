<?php

use App\Http\Controllers\Admin\Relatorio\BillReportController;
use App\Http\Controllers\Admin\Relatorio\ChargeReportController;
use App\Http\Controllers\Admin\Relatorio\ClientReportController;
use App\Http\Controllers\Admin\Relatorio\ExecutiveReportController;
use App\Http\Controllers\Admin\Relatorio\ExportBillReportController;
use App\Http\Controllers\Admin\Relatorio\ExportBillReportPdfController;
use App\Http\Controllers\Admin\Relatorio\ExportChargeReportController;
use App\Http\Controllers\Admin\Relatorio\ExportChargeReportPdfController;
use App\Http\Controllers\Admin\Relatorio\ExportPaymentReportController;
use App\Http\Controllers\Admin\Relatorio\ExportPaymentReportPdfController;
use App\Http\Controllers\Admin\Relatorio\FinancialReportController;
use App\Http\Controllers\Admin\Relatorio\PaymentReportController;
use App\Http\Controllers\Admin\Relatorio\UsinaReportController;
use Illuminate\Support\Facades\Route;

Route::name('relatorios.')
    ->prefix('relatorios')
    ->group(function () {
        Route::get('/financeiro', FinancialReportController::class)
            ->name('financeiro');

        Route::get('/cobrancas', ChargeReportController::class)
            ->name('cobrancas');

        Route::get('/pagamentos', PaymentReportController::class)
            ->name('pagamentos');

        Route::get('/usinas', UsinaReportController::class)
            ->name('usinas');

        Route::get('/clientes', ClientReportController::class)
            ->name('clientes');

        Route::get('/faturas', BillReportController::class)
            ->name('faturas');

        Route::get('/cobrancas/export', ExportChargeReportController::class)
            ->name('cobrancas.export');

        Route::get('/pagamentos/export', ExportPaymentReportController::class)
            ->name('pagamentos.export');

        Route::get('/faturas/export', ExportBillReportController::class)
            ->name('faturas.export');

        Route::get('/cobrancas/export-pdf', ExportChargeReportPdfController::class)
            ->name('cobrancas.export-pdf');

        Route::get('/pagamentos/export-pdf', ExportPaymentReportPdfController::class)
            ->name('pagamentos.export-pdf');

        Route::get('/faturas/export-pdf', ExportBillReportPdfController::class)
            ->name('faturas.export-pdf');

        Route::get('/executivo', ExecutiveReportController::class)
            ->name('executivo');
    });

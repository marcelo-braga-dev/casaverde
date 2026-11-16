<?php

use App\Http\Controllers\Admin\Financeiro\ClienteFinanceiroController;
use App\Http\Controllers\Admin\Financeiro\ProdutorFinanceiroController;
use App\Http\Controllers\Admin\Financeiro\VendedorFinanceiroController;
use Illuminate\Support\Facades\Route;

Route::name('admin.financeiro.')
    ->prefix('financeiro')
    ->group(function () {
        Route::resource('produtor', ProdutorFinanceiroController::class)->only(['index']);
        Route::resource('cliente', ClienteFinanceiroController::class)->only(['index']);
        Route::resource('vendedor', VendedorFinanceiroController::class)->only(['index']);
    });

<?php

use App\Http\Controllers\Auth\Contratos\Clientes\ClientesContratoController;
use App\Http\Controllers\Auth\Contratos\Usinas\GerarContratoProdutorController;
use App\Http\Controllers\Auth\Contratos\Usinas\UsinasContratoController;
use Illuminate\Support\Facades\Route;

Route::name('auth.contratos.')
    ->prefix('contratos')
    ->group(function () {
        Route::resource('usina', UsinasContratoController::class)->only(['index']);
        Route::resource('cliente', ClientesContratoController::class)->only(['index']);

        Route::name('pdf.usina.')
            ->prefix('pdf')
            ->group(function () {
                Route::get('gerar-pdf-usina', [GerarContratoProdutorController::class, 'gerarPdf'])->name('gerar-pdf');
            });
    });

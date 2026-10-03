<?php

use App\Http\Controllers\Auth\Propostas\Cliente\GetDadosPropostaClienteController;
use App\Http\Controllers\Auth\Propostas\Produtor\GerarPropostaProdutorController;
use App\Http\Controllers\Auth\Propostas\Produtor\GerarPropostaUsinaController;
use Illuminate\Support\Facades\Route;

Route::name('auth.propostas.')
    ->prefix('propostas')
    ->group(function () {

        Route::name('pdf.cliente.')
            ->prefix('pdf-cliente')
            ->group(function () {
                Route::get('get-dados/{id}', GetDadosPropostaClienteController::class)->name('get-dados');
                Route::post('gerar-pdf', [GerarPropostaUsinaController::class, 'gerarPdf'])->name('gerar-pdf');
                Route::get('layout-pdf', [GerarPropostaProdutorController::class, 'layoutPdf'])->name('layout-pdf');
            });

        Route::name('pdf.usina.')
            ->prefix('pdf')
            ->group(function () {
                Route::post('gerar-pdf-usina', [GerarPropostaUsinaController::class, 'gerarPdf'])->name('gerar-pdf');
                Route::get('layout-pdf', [GerarPropostaProdutorController::class, 'layoutPdf'])->name('layout-pdf');
            });
    });

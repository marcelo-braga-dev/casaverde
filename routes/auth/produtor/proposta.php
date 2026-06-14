<?php

use App\Http\Controllers\Auth\Produtor\GetPropostasProdutorController;
use App\Http\Controllers\Auth\Produtor\ProdutorPropostasController;
use App\Http\Controllers\Auth\Produtor\PropostasProdutorController;
use App\Http\Controllers\Auth\Propostas\Produtor\GerarPropostaProdutorController;
use App\Http\Controllers\Auth\Propostas\Produtor\GetDadosPropostaProdutorController;
use Illuminate\Support\Facades\Route;

Route::name('auth.produtor.')
    ->prefix('produtores')
    ->group(function () {
        Route::resource('proposta', ProdutorPropostasController::class);

        Route::name('proposta.api.')
            ->prefix('proposta-api')
            ->group(function () {
                Route::get('get-produtor/{id}', GetPropostasProdutorController::class)->name('get-produtor');
                Route::get('get-all', PropostasProdutorController::class)->name('get-all');
                Route::get('get-dados/{id}', GetDadosPropostaProdutorController::class)->name('get-dados');

                Route::get('layout-pdf', [GerarPropostaProdutorController::class, 'layoutPdf'])->name('layout-pdf');
                Route::post('gerar-pdf', [GerarPropostaProdutorController::class, 'gerarPdf'])->name('gerar-pdf');
            });
    });

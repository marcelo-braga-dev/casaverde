<?php

use App\Http\Controllers\Admin\Proposta\Pdf\ClientProposalPdfUploadController;
use App\Http\Controllers\Admin\Proposta\Pdf\ProducerProposalPdfController;
use Illuminate\Support\Facades\Route;

Route::name('propostas.pdf.')
    ->prefix('propostas/pdf')
    ->group(function () {
        Route::post('/cliente', ClientProposalPdfUploadController::class)->name('cliente-upload');
        Route::get('/produtor/layout', [ProducerProposalPdfController::class, 'layoutPdf'])->name('produtor-layout');
        Route::post('/produtor', [ProducerProposalPdfController::class, 'gerarPdf'])->name('produtor-gerar');
    });

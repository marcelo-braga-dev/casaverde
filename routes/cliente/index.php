<?php

use App\Http\Controllers\Cliente\Cobranca\ClienteCobrancaController;
use App\Http\Controllers\Cliente\Contrato\ClienteContratoController;
use App\Http\Controllers\Cliente\Dashboard\ClienteDashboardController;
use App\Http\Controllers\Cliente\Fatura\ClienteFaturaController;
use App\Http\Controllers\Cliente\Perfil\ClientePerfilController;
use App\Http\Controllers\Cliente\Relatorio\ClienteEconomiaRelatorioController;
use App\Http\Controllers\Cliente\Relatorio\ClienteRelatorioIndexController;
use App\Http\Controllers\Cliente\Relatorio\ExportClienteEconomiaExcelController;
use App\Http\Controllers\Cliente\Relatorio\ExportClienteEconomiaPdfController;
use App\Http\Controllers\Cliente\Usina\ClienteUsinaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:cliente'])
    ->prefix('cliente')
    ->name('cliente.')
    ->group(function () {

        // Dashboard principal
        Route::get('/dashboard', ClienteDashboardController::class)->name('dashboard');

        // Faturas de energia
        Route::get('/faturas', [ClienteFaturaController::class, 'index'])->name('faturas.index');
        Route::get('/faturas/{fatura}', [ClienteFaturaController::class, 'show'])->name('faturas.show');

        // Cobranças
        Route::get('/cobrancas', [ClienteCobrancaController::class, 'index'])->name('cobrancas.index');
        Route::get('/cobrancas/{cobranca}', [ClienteCobrancaController::class, 'show'])->name('cobrancas.show');

        // Usina vinculada
        Route::get('/minha-usina', [ClienteUsinaController::class, 'show'])->name('usina.show');

        // Contratos
        Route::get('/contratos', [ClienteContratoController::class, 'index'])->name('contratos.index');
        Route::get('/contratos/{contrato}', [ClienteContratoController::class, 'show'])->name('contratos.show');

        // Perfil
        Route::get('/meu-perfil', [ClientePerfilController::class, 'show'])->name('perfil.show');

        // Relatórios
        Route::get('/relatorios', ClienteRelatorioIndexController::class)->name('relatorios.index');
        Route::get('/relatorios/economia', ClienteEconomiaRelatorioController::class)->name('relatorios.economia');
        Route::get('/relatorios/economia/exportar-excel', ExportClienteEconomiaExcelController::class)->name('relatorios.economia.excel');
        Route::get('/relatorios/economia/exportar-pdf', ExportClienteEconomiaPdfController::class)->name('relatorios.economia.pdf');
    });

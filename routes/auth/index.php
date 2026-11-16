<?php

use Illuminate\Support\Facades\Route;

// O antigo módulo de cadastros (clientes, produtores, usinas, propostas e contratos sem
// filtro de carteira) foi removido em 2026-11-16; o que era usado vive nos módulos novos.
// Aqui restam só as telas do próprio usuário e as ferramentas de WhatsApp.

Route::middleware(['auth', 'role:admin,consultor'])
    ->prefix('auth')
    ->group(function () {
        require __DIR__.'/ferramentas/index.php';
    });

// Perfil e chamados são do próprio usuário: abertos a todas as roles.
Route::middleware(['auth'])
    ->prefix('auth')
    ->group(function () {
        require __DIR__.'/suporte/index.php';
        require __DIR__.'/perfil/index.php';
    });

require __DIR__.'/cliente/activation.php';

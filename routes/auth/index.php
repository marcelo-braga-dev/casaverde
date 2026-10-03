<?php

use Illuminate\Support\Facades\Route;

// Módulo legado de cadastros (propostas, produtores, usinas, contratos...). Expõe CPF,
// CNPJ, e-mail e endereço de todos os cadastros: com só "auth", qualquer cliente ou
// produtor logado conseguia listar tudo.
// Os controllers deste módulo não filtram por carteira, então nem consultor entra.
Route::middleware(['auth', 'role:admin'])
    ->prefix('auth')
    ->group(function () {
        require __DIR__.'/produtor/index.php';
        require __DIR__.'/concessionarias/index.php';
        require __DIR__.'/usinas/index.php';
        require __DIR__.'/propostas/index.php';
        require __DIR__.'/contratos/index.php';
        require __DIR__.'/cliente/index.php';
        require __DIR__.'/config/config.php';
    });

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

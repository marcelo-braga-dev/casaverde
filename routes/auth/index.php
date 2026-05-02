<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])
    ->prefix('auth')
    ->group(function () {
        require __DIR__ . '/produtor/index.php';
        require __DIR__ . '/concessionarias/index.php';
        require __DIR__ . '/usinas/index.php';
        require __DIR__ . '/propostas/index.php';
        require __DIR__ . '/contratos/index.php';
        require __DIR__ . '/ferramentas/index.php';
        require __DIR__ . '/suporte/index.php';
        require __DIR__ . '/perfil/index.php';
        require __DIR__ . '/cliente/index.php';
        require __DIR__ . '/config/config.php';
    });

require __DIR__ . '/cliente/activation.php';


<?php

use App\Http\Controllers\Demo\DemoAccessController;
use Illuminate\Support\Facades\Route;

// Modo demonstração (config/demo.php). As rotas existem sempre, mas respondem 404 quando
// DEMO_MODE está desligado; o formulário de acesso é servido em /login.
Route::prefix('demo')->name('demo.')->group(function () {
    Route::post('acesso', [DemoAccessController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('access');

    Route::post('perfil/{role}', [DemoAccessController::class, 'switchRole'])
        ->middleware(['auth', 'throttle:60,1'])
        ->name('switch');

    Route::get('visitantes.csv', [DemoAccessController::class, 'export'])
        ->middleware('throttle:20,1')
        ->name('visitors.export');
});

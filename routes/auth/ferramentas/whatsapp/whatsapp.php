<?php

use App\Http\Controllers\Auth\Ferramentas\Whatsapp\ChatbotWhatsappController;
use App\Http\Controllers\Auth\Ferramentas\Whatsapp\WhatsappFerramentaController;
use Illuminate\Support\Facades\Route;

Route::name('auth.ferramentas.whatsapp.')
    ->prefix('ferramentas/whatsapp')
    ->group(function () {
        Route::resource('chat', WhatsappFerramentaController::class)->only(['index']);
        Route::resource('chatbot', ChatbotWhatsappController::class)->only(['index']);
    });

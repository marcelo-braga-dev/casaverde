<?php

use App\Http\Controllers\Admin\WhatsApp\WhatsAppMessageTemplateController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:admin')
    ->name('whatsapp.')
    ->prefix('whatsapp')
    ->group(function () {
        Route::get('templates', [WhatsAppMessageTemplateController::class, 'index'])->name('templates.index');
        Route::put('templates/{template}', [WhatsAppMessageTemplateController::class, 'update'])->name('templates.update');
    });

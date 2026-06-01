<?php

use App\Http\Controllers\Admin\Usuarios\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::name('user.')
    ->prefix('user')
    ->middleware('role:admin')
    ->group(function () {
        Route::resource('admin', AdminController::class);
    });

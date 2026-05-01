<?php

//use App\Http\Controllers\Admin\Usina\ConcessionariaController;
use App\Http\Controllers\Admin\Concessionaria\ConcessionariaController;
use Illuminate\Support\Facades\Route;

Route::name('admin.concessionarias.')
    ->prefix('concessionarias')
    ->group(function () {
        Route::get('/', [ConcessionariaController::class, 'index'])->name('index');
        Route::get('/create', [ConcessionariaController::class, 'create'])->name('create');
        Route::post('/', [ConcessionariaController::class, 'store'])->name('store');
        Route::get('/{concessionaria}', [ConcessionariaController::class, 'show'])->name('show');
        Route::get('/{concessionaria}/edit', [ConcessionariaController::class, 'edit'])->name('edit');
        Route::put('/{concessionaria}', [ConcessionariaController::class, 'update'])->name('update');
    });

Route::name('admin.')
    ->prefix('concessionaria')
    ->group(function () {
        Route::resource('concessionaria', ConcessionariaController::class);
        Route::get('api/get-all', [ConcessionariaController::class, 'getAll'])->name('concessionaria.api.get-all');
    });

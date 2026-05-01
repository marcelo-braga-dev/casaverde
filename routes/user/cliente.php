<?php
//
//use App\Http\Controllers\Admin\Cliente\ClientAccessInviteController;
//use App\Http\Controllers\Admin\Cliente\ClientDiscountRuleController;
//use App\Http\Controllers\Admin\Cliente\ClientUsinaHistoryController;
//use App\Http\Controllers\Admin\Cliente\ClientUsinaLinkController;
//use App\Http\Controllers\Admin\Cliente\ConvertClientProfileController;
//use App\Http\Controllers\Admin\Cliente\ClientContractDataController;
//use App\Http\Controllers\Admin\Usuarios\Cliente\ClienteController;
//use App\Http\Controllers\Admin\Cliente\ClientContactController;
//use Illuminate\Support\Facades\Route;
//
//Route::name('user.')
//    ->prefix('user')
//    ->group(function () {
//        Route::resource('cliente', ClienteController::class);
//
//        Route::post('cliente/{clientProfile}/converter', [ConvertClientProfileController::class, 'store'])
//            ->name('cliente.convert');
//
//        Route::post('cliente/{clientProfile}/invite', [ClientAccessInviteController::class, 'store'])
//            ->name('cliente.invite');
//
//        Route::post('cliente/{clientProfile}/usina', [ClientUsinaLinkController::class, 'store'])
//            ->name('cliente.usina.store');
//
//        Route::get('cliente/{clientProfile}/usina-history', [ClientUsinaHistoryController::class, 'index'])
//            ->name('cliente.usina.history');
//
//        Route::post('cliente/{clientProfile}/discount-rule', [ClientDiscountRuleController::class, 'store'])
//            ->name('cliente.discount-rule.store');
//
//Route::get('cliente-user/{user}/contract-data', [ClientContractDataController::class, 'edit'])
//    ->name('cliente.contract-data.edit');
//
//Route::put('cliente-user/{user}/contract-data', [ClientContractDataController::class, 'update'])
//    ->name('cliente.contract-data.update');
//
//Route::get('cliente/{clientProfile}/discount-history', [ClientDiscountHistoryController::class, 'index'])
//    ->name('cliente.discount.history');
//
//Route::get('cliente-user/{user}/contact', [ClientContactController::class, 'edit'])
//    ->name('cliente.contact.edit');
//
//Route::put('cliente-user/{user}/contact', [ClientContactController::class, 'update'])
//    ->name('cliente.contact.update');
//    });

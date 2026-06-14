<?php

namespace App\Http\Controllers\Admin\Usuarios\Consultor;

use App\Http\Controllers\Controller;
use App\Repositories\Consultor\ConsultorRepository;

class GetAllVendedoresController extends Controller
{
    public function __invoke()
    {
        //        $user = (new ConsultorRepository())->getAll();
        //
        //        return response()->json($user);
    }
}

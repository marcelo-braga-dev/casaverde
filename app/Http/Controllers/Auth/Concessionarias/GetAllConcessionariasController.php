<?php

namespace App\Http\Controllers\Auth\Concessionarias;

use App\Http\Controllers\Controller;
use App\Models\Concessionarias;

class GetAllConcessionariasController extends Controller
{
    public function __invoke()
    {
        $get = (new Concessionarias)
            ->orderBy('nome')
            ->get();

        return response()->json($get);
    }
}

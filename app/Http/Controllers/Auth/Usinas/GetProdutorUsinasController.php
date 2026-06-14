<?php

namespace App\Http\Controllers\Auth\Usinas;

use App\Http\Controllers\Controller;
use App\Models\Usina\UsinaSolar;

class GetProdutorUsinasController extends Controller
{
    public function __invoke($id)
    {
        $usinas = (new UsinaSolar)->where('user_id', $id)->get();

        return response()->json($usinas);
    }
}

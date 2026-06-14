<?php

namespace App\Http\Controllers\Auth\Usinas;

use App\Http\Controllers\Controller;
use App\Models\Usina\UsinaSolar;

class GetUsinasController extends Controller
{
    public function __invoke()
    {
        $usinas = (new UsinaSolar)
            ->orderByDesc('id')
            ->get();

        return response()->json($usinas);
    }
}

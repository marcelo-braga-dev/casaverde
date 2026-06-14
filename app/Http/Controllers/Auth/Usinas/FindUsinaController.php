<?php

namespace App\Http\Controllers\Auth\Usinas;

use App\Http\Controllers\Controller;
use App\Models\Usina\UsinaSolar;

class FindUsinaController extends Controller
{
    public function __invoke($id)
    {
        $date = UsinaSolar::find($id);

        return response()->json($date);
    }
}

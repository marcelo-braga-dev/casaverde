<?php

namespace App\Http\Controllers\Auth\Produtor;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorRepository;

class FindProdutorController extends Controller
{
    public function __invoke($id)
    {
        $date = (new ProdutorRepository)->find($id);

        return response()->json($date);
    }
}

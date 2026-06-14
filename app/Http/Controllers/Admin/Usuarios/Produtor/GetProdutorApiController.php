<?php

namespace App\Http\Controllers\Admin\Usuarios\Produtor;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorRepository;

class GetProdutorApiController extends Controller
{
    public function __invoke()
    {
        $produtores = (new ProdutorRepository)->getAll();

        return response()->json($produtores);
    }
}

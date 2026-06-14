<?php

namespace App\Http\Controllers\Auth\Produtor;

use App\Http\Controllers\Controller;
use App\Repositories\Produtor\ProdutorRepository;

class GetKanbanController extends Controller
{
    public function __invoke()
    {
        $produtores = (new ProdutorRepository)->getGroupByStatus();

        return response()->json($produtores);
    }
}

<?php

namespace App\Http\Controllers\Admin\Concessionaria;

use App\Http\Controllers\Controller;
use App\Models\Concessionarias;
use Inertia\Inertia;

/**
 * @deprecated
 */
class ConcessionariaController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Concessionaria/Index/Page');
    }

    public function getAll()
    {
        $concessionarias = (new Concessionarias)
            ->orderBy('nome')
            ->get();

        return response()->json([...$concessionarias]);
    }
}

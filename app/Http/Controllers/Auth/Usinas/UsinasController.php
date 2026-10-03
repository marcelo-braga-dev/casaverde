<?php

namespace App\Http\Controllers\Auth\Usinas;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class UsinasController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Usina/Index/Page');
    }

    public function show($id)
    {
        return Inertia::render('Auth/Usina/Show/Page', compact('id'));
    }
}

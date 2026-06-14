<?php

namespace App\Http\Controllers\Admin\Financeiro;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProdutorFinanceiroController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Financeiro/Produtor/Index/Page');
    }
}

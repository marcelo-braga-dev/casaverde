<?php

namespace App\Http\Controllers\Admin\Financeiro;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ClienteFinanceiroController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Financeiro/Cliente/Index/Page');
    }
}

<?php

namespace App\Http\Controllers\Admin\Usuarios\Consultor;

use App\Http\Controllers\Controller;
use App\Repositories\Consultor\ConsultorRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/User/Vendedor/Index/Page');
    }

    public function create()
    {
        return Inertia::render('Admin/User/Vendedor/Create/Page');
    }

    public function store(Request $request)
    {
        (new ConsultorRepository())->create($request);

        //return redirect()->route('admin.user.vendedor.index');
    }
}

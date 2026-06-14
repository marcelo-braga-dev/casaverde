<?php

namespace App\Http\Controllers\Admin\Usuarios\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Admin\AdminRepository;

class GetAdminController extends Controller
{
    public function __invoke()
    {
        $users = (new AdminRepository)->getAll();

        return response()->json($users);
    }
}

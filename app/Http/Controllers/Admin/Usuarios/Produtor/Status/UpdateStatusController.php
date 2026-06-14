<?php

namespace App\Http\Controllers\Admin\Usuarios\Produtor\Status;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use Illuminate\Http\Request;

class UpdateStatusController extends Controller
{
    public function __invoke(Request $request)
    {
        (new User)->find($request->id)->update(['status' => $request->status]);

        return response()->json($request->all());
    }
}

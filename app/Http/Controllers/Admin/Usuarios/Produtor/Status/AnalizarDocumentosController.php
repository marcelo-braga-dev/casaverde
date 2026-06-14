<?php

namespace App\Http\Controllers\Admin\Usuarios\Produtor\Status;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use App\Repositories\Produtor\ProdutorRepository;
use Inertia\Inertia;

class AnalizarDocumentosController extends Controller
{
    public function show($id)
    {
        $produtor = (new ProdutorRepository)->findAllData($id);

        return Inertia::render('Admin/User/Produtor/Status/AnalizarDocumentos', compact('produtor'));
    }

    public function update($id)
    {
        (new User)->find($id)->update(['status' => 'documentacao-aprovada']);

        return redirect()->route('auth.produtor.index');
    }
}

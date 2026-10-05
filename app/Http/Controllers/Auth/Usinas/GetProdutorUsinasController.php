<?php

namespace App\Http\Controllers\Auth\Usinas;

use App\Http\Controllers\Controller;
use App\Models\Usina\UsinaSolar;

class GetProdutorUsinasController extends Controller
{
    public function __invoke($id)
    {
        // $id é o usuário do produtor; usina_solars.user_id não existe mais (migration 2026_05_19).
        $usinas = UsinaSolar::query()
            ->whereHas('produtor', fn ($q) => $q->where('platform_user_id', $id))
            ->get();

        return response()->json($usinas);
    }
}

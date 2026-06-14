<?php

namespace App\Http\Controllers\Auth\Contratos\Usinas;

use App\Http\Controllers\Controller;
use Barryvdh\Snappy\Facades\SnappyPdf as PDF;
use Illuminate\Http\Request;

class GerarContratoProdutorController extends Controller
{
    public function gerarPdf(Request $request)
    {
        $data = [
            'title1' => '(Produtor Solar)',
            'title2' => 'SOLMAR COOPERATIVA',
        ];

        $pdf = PDF::loadView('pdf.contratos.usina', $data);

        return $pdf->download('contrato.pdf');
    }
}

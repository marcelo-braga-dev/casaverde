<?php

namespace App\Http\Controllers\Auth\Propostas\Produtor;

use App\Http\Controllers\Controller;
use Barryvdh\Snappy\Facades\SnappyPdf as PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GerarPropostaProdutorController extends Controller
{
    public function gerarPdf(Request $request)
    {
        // O PDF é gerado com enable-local-file-access (as imagens de fundo são locais):
        // HTML livre permitiria <iframe src="file:///..."> e vazaria arquivos do servidor
        // num PDF público. Só tags de formatação passam.
        $html = strip_tags(
            (string) $request->input('html'),
            '<p><div><span><b><strong><i><em><u><br><h1><h2><h3><h4><h5><h6><table><thead><tbody><tr><td><th><ul><ol><li>'
        );
        $html = preg_replace('/\b(file|php|data|ftp|https?):/i', '', $html);

        // Caminho para as imagens das páginas
        $dirCapa = public_path('storage/propostas/produtor/paginas/1.jpg');
        $image2 = public_path('storage/propostas/produtor/paginas/2.jpg');

        // HTML para a capa
        $capa = '
    <div style="position: relative; text-align: center; width: 100%; height: 100%;">
        <img src="'.$dirCapa.'" alt="Background" style="width: 100%; height: 100%" />
    </div>
    ';

        // HTML para a segunda página com sobreposição de texto
        $page2 = '
    <div style="position: relative; text-align: center; width: 100%; height: 100%;">
        <img src="'.$image2.'" alt="Background" style="width: 100%; height: 100%" />
        <div style="
            position: absolute;
            top: 200;
            left: 10;
            width: 100%;
            text-align: left;
        ">
            '.$html.'
        </div>
    </div>


    ';

        // Gera o PDF com Snappy
        $pdf = PDF::loadHTML($capa.$page2)
            ->setOption('encoding', 'UTF-8')
            ->setOption('enable-local-file-access', true)
            ->setOption('margin-top', '0mm')
            ->setOption('margin-bottom', '0mm');

        // Nome do arquivo com identificador único
        $fileName = 'proposta_'.Str::random(10).'.pdf';
        $filePath = "pdfs/propostas/$fileName"; // Caminho no armazenamento

        Storage::disk('public')->put($filePath, $pdf->output());

        // URL pública do PDF
        $pdfUrl = asset("storage/$filePath");

        return response()->json(['urlPdf' => url($pdfUrl)]);
    }

    public function layoutPdf()
    {
        return [
            'capa' => url('storage/propostas/produtor/paginas/1.jpg'),
            'header' => url('storage/propostas/produtor/paginas/cabecalho.jpg'),
            'page_2' => url('storage/propostas/produtor/paginas/2.jpg'),
        ];
    }
}

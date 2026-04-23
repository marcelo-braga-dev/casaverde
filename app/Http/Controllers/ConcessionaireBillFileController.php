<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ConcessionaireBillFileController extends Controller
{
    public function show(ConcessionaireBill $fatura): Response
    {
        abort_unless(
            Storage::disk($fatura->pdf_disk)->exists($fatura->pdf_path),
            404,
            'PDF não encontrado.'
        );

        $absolutePath = Storage::disk($fatura->pdf_disk)->path($fatura->pdf_path);

        return response()->file($absolutePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . ($fatura->pdf_original_name ?: 'fatura.pdf') . '"',
        ]);
    }
}
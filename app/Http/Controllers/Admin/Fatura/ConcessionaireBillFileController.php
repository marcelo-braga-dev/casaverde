<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ConcessionaireBillFileController extends Controller
{
    public function show(ConcessionaireBill $fatura): BinaryFileResponse
    {
        $disk = $fatura->pdf_disk ?? config('filesystems.default');
        $path = $fatura->pdf_path;

        if (!$path || !Storage::disk($disk)->exists($path)) {
            abort(404, 'PDF não encontrado.');
        }

        $absolutePath = Storage::disk($disk)->path($path);

        return response()->file($absolutePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . ($fatura->pdf_original_name ?? 'fatura.pdf') . '"',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Models\Fatura\ConcessionaireBill;
use App\Services\Fatura\ProtectedPdfResolverService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Throwable;

class ConcessionaireBillFileController extends Controller
{
    public function show(ConcessionaireBill $fatura, ProtectedPdfResolverService $pdfResolver): BinaryFileResponse
    {
        $disk = $fatura->pdf_disk ?? config('filesystems.default');
        $path = $fatura->pdf_path;

        if (! $path || ! Storage::disk($disk)->exists($path)) {
            abort(404, 'PDF não encontrado.');
        }

        $absolutePath = Storage::disk($disk)->path($path);
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.($fatura->pdf_original_name ?? 'fatura.pdf').'"',
        ];

        $password = $fatura->clientProfile?->emailImportSetting?->pdf_password;

        if ($password) {
            try {
                $unlockedPath = $pdfResolver->unlockToTempFile($absolutePath, $password);

                return response()->file($unlockedPath, $headers)->deleteFileAfterSend(true);
            } catch (Throwable $e) {
                Log::warning("[ConcessionaireBillFileController] Falha ao desbloquear PDF da fatura #{$fatura->id}: ".$e->getMessage());
            }
        }

        return response()->file($absolutePath, $headers);
    }
}

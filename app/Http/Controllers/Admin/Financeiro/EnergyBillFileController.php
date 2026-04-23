<?php

namespace App\Http\Controllers\Admin\Financeiro;

use App\Http\Controllers\Controller;
use App\Models\Energia\EnergyBill;
use App\src\Roles\RoleUser;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class EnergyBillFileController extends Controller
{
    public function show(EnergyBill $energyBill): Response
    {
        $authUser = auth()->user();

        abort_unless($authUser, 403);

        $canView = false;

        if ($authUser->role_id === RoleUser::$ADMIN) {
            $canView = true;
        }

        if ((int) $authUser->id === (int) $energyBill->user_id) {
            $canView = true;
        }

        if ((int) $energyBill->user?->consultor_id === (int) $authUser->id) {
            $canView = true;
        }

        abort_unless($canView, 403);

        abort_unless(
            Storage::disk($energyBill->pdf_disk)->exists($energyBill->pdf_path),
            404,
            'PDF não encontrado.'
        );

        $absolutePath = Storage::disk($energyBill->pdf_disk)->path($energyBill->pdf_path);

        return response()->file($absolutePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . ($energyBill->pdf_original_name ?: 'fatura.pdf') . '"',
        ]);
    }
}
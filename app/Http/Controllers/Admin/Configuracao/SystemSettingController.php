<?php

namespace App\Http\Controllers\Admin\Configuracao;

use App\Http\Controllers\Controller;
use App\Http\Requests\Config\UpdateSystemSettingRequest;
use App\Services\Config\SystemSettingService;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function index(
        SystemSettingService $service,
    ) {
        return Inertia::render('Admin/Configuracao/Page', [
            'settings' => [
                'default_discount_percentage' => $service->get(
                    'default_discount_percentage',
                    20
                ),
            ],
        ]);
    }

    public function update(
        UpdateSystemSettingRequest $request,
        SystemSettingService $service,
    ) {
        $service->set(
            'default_discount_percentage',
            $request->default_discount_percentage,
            'float',
            auth()->id(),
        );

        return redirect()
            ->back()
            ->with('success', 'Configurações atualizadas com sucesso.');
    }
}

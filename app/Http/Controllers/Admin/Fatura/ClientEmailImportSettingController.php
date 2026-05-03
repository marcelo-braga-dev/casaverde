<?php

namespace App\Http\Controllers\Admin\Fatura;

use App\Http\Controllers\Controller;
use App\Http\Requests\Fatura\StoreClientEmailImportSettingRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Usina\Concessionaria;
use Inertia\Inertia;

class ClientEmailImportSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Index/Page', [
            'settings' => ClientEmailImportSetting::query()
                ->with(['clientProfile', 'concessionaria'])
                ->orderByDesc('id')
                ->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Create/Page', [
            'clients' => ClientProfile::query()
                ->orderByDesc('id')
                ->get(['id', 'client_code', 'nome', 'razao_social', 'cpf', 'cnpj']),

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
        ]);
    }

    public function store(StoreClientEmailImportSettingRequest $request)
    {
        $data = $request->validated();

        $data['user_id'] = auth()->id();

        $setting = ClientEmailImportSetting::updateOrCreate(
            ['client_profile_id' => $data['client_profile_id']],
            $data
        );

        return redirect()
            ->back()
            ->with('success', 'Configuração de importação salva com sucesso.');
    }

    public function show(ClientEmailImportSetting $faturaImportSetting)
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Show/Page', [
            'setting' => $faturaImportSetting->load(['clientProfile', 'concessionaria']),
        ]);
    }

    public function edit(ClientEmailImportSetting $faturaImportSetting)
    {
        return Inertia::render('Admin/Fatura/ImportSetting/Edit/Page', [
            'setting' => $faturaImportSetting->load(['clientProfile', 'concessionaria']),

            'clients' => ClientProfile::query()
                ->orderByDesc('id')
                ->get(['id', 'client_code', 'nome', 'razao_social', 'cpf', 'cnpj']),

            'concessionarias' => Concessionaria::query()
                ->where('status', 'ativo')
                ->orderBy('nome')
                ->get(['id', 'nome']),
        ]);
    }

    public function update(StoreClientEmailImportSettingRequest $request, ClientEmailImportSetting $faturaImportSetting)
    {
        $data = $request->validated();
        $data['user_id'] = null;

        return $this->updateExistingSetting($faturaImportSetting, $data);
    }

    private function updateExistingSetting(ClientEmailImportSetting $setting, array $data)
    {
        if (empty($data['imap_password'])) {
            unset($data['imap_password']);
        }

        if (empty($data['pdf_password'])) {
            unset($data['pdf_password']);
        }

        $setting->update($data);

        return redirect()
            ->back()
            ->with('success', 'Configuração de importação atualizada com sucesso.');
    }
}

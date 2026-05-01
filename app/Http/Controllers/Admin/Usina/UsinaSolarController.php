<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreUsinaSolarRequest;
use App\Models\Endereco\Address;
use App\Models\Produtor\ProducerProfile;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaBlock;
use App\Models\Usina\UsinaSolar;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UsinaSolarController extends Controller
{
    public function index()
    {
        return Inertia::render('Consultor/Producer/Usina/Index/Page', [
            'usinas' => UsinaSolar::query()
                ->with(['produtor', 'consultor', 'concessionaria', 'block', 'address'])
                ->orderByDesc('id')
                ->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Consultor/Producer/Usina/Create/Page', [
            'produtores' => User::query()
                ->where('role_id', RoleUser::$PRODUTOR)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'consultor_id']),
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'concessionarias' => Concessionaria::query()
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'blocks' => UsinaBlock::query()
                ->orderBy('id')
                ->get(['id', 'nome']),
            'addresses' => Address::query()
                ->orderByDesc('id')
                ->get(['id', 'rua', 'numero', 'bairro', 'cidade', 'estado']),
        ]);
    }

    public function store(StoreUsinaSolarRequest $request)
    {
        $data = $request->validated();

        $usina = DB::transaction(function () use ($data) {
            $usina = UsinaSolar::query()->create($data);

            $this->syncProducerProfileWithUsina($usina, $data);

            return $usina;
        });

        return redirect()
            ->route('consultor.producer.usinas.show', $usina->id)
            ->with('success', 'Usina cadastrada com sucesso.');
    }

    public function show(UsinaSolar $usina)
    {
        return Inertia::render('Consultor/Producer/Usina/Show/Page', [
            'usina' => $usina->load(['produtor', 'consultor', 'concessionaria', 'block', 'address']),
        ]);
    }

    public function edit(UsinaSolar $usina)
    {
        return Inertia::render('Consultor/Producer/Usina/Edit/Page', [
            'usina' => $usina->load(['produtor', 'consultor', 'concessionaria', 'block', 'address']),
            'produtores' => User::query()
                ->where('role_id', RoleUser::$PRODUTOR)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'consultor_id']),
            'consultores' => User::query()
                ->where('role_id', RoleUser::$CONSULTOR)
                ->orderBy('name')
                ->get(['id', 'name']),
            'concessionarias' => Concessionaria::query()
                ->orderBy('nome')
                ->get(['id', 'nome']),
            'blocks' => UsinaBlock::query()
                ->orderBy('id')
                ->get(['id', 'nome']),
            'addresses' => Address::query()
                ->orderByDesc('id')
                ->get(['id', 'rua', 'numero', 'bairro', 'cidade', 'estado']),
        ]);
    }

    public function update(StoreUsinaSolarRequest $request, UsinaSolar $usina)
    {
        $data = $request->validated();

        DB::transaction(function () use ($usina, $data) {
            $usina->update($data);

            $this->syncProducerProfileWithUsina($usina->fresh(), $data);
        });

        return redirect()
            ->route('consultor.producer.usinas.show', $usina->id)
            ->with('success', 'Usina atualizada com sucesso.');
    }

    private function syncProducerProfileWithUsina(UsinaSolar $usina, array $data): void
    {
        $produtor = User::query()->find($usina->user_id);

        if (!$produtor) {
            return;
        }

        $profile = ProducerProfile::query()->firstOrCreate(
            ['user_id' => $usina->user_id],
            [
                'created_by_user_id' => $data['consultor_user_id'] ?? auth()->id(),
                'admin_nome' => $produtor->name,
                'admin_qualificacao' => $produtor->userData?->tipo_pessoa === 'pj'
                    ? 'Pessoa Jurídica'
                    : 'Pessoa Física',
                'usina_nome' => $produtor->userData?->razao_social
                    ?? $produtor->userData?->nome_fantasia
                    ?? $produtor->name,
                'usina_cnpj' => $produtor->userData?->getRawOriginal('cnpj'),
                'status' => 'novo',
            ]
        );

        $profile->update([
            'created_by_user_id' => $data['consultor_user_id'] ?? $profile->created_by_user_id,
            'usina_address_id' => $data['address_id'] ?? $profile->usina_address_id,
            'potencia_kw' => $data['potencia_usina'] ?? $profile->potencia_kw,
            'potencia_kwp' => $data['potencia_usina'] ?? $profile->potencia_kwp,
            'geracao_anual' => isset($data['media_geracao'])
                ? ((float) $data['media_geracao'] * 12)
                : $profile->geracao_anual,
            'prazo_locacao' => $data['prazo_locacao'] ?? $profile->prazo_locacao,
            'modulos' => $data['modulos'] ?? $profile->modulos,
            'inversores' => $data['inversores'] ?? $profile->inversores,
            'status' => $profile->status === 'novo' ? 'em_integracao' : $profile->status,
        ]);
    }
}

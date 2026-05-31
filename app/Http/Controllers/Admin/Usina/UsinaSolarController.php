<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Models\Proposta\CommercialProposal;
use App\src\Usina\UsinaStatus;
use App\Http\Requests\Usina\StoreUsinaSolarRequest;
use App\Models\Endereco\Address;
use App\Models\Produtor\ProducerProfile;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaBlock;
use App\Models\Usina\UsinaSolar;
use App\Models\Users\User;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            'produtores' => ProducerProfile::query()
                ->orderBy('nome')
                ->get(['id', 'nome', 'razao_social', 'consultor_user_id', 'cpf', 'cnpj']),
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
            $data['status'] = UsinaStatus::NOVA;

            $usina = UsinaSolar::query()->create($data);

            $address = $this->createOrUpdateAddress($usina, $data['address']);
            $usina->update(['address_id' => $address?->id]);

            $this->syncProducerProfileWithUsina($usina->fresh(), $data);

            return $usina;
        });

        return redirect()
            ->route('consultor.producer.usinas.show', $usina->id)
            ->with('success', 'Usina cadastrada com sucesso.');
    }

    private function createOrUpdateAddress(UsinaSolar $usina, array $addressData): ?Address
    {
        $addressData = collect($addressData)
            ->only([
                'cep',
                'rua',
                'numero',
                'complemento',
                'bairro',
                'cidade',
                'estado',
                'referencia',
                'latitude',
                'longitude',
            ])
            ->map(fn ($value) => $value === '' ? null : $value)
            ->toArray();

        $hasAddress = collect($addressData)
            ->filter(fn ($value) => filled($value))
            ->isNotEmpty();

        if (!$hasAddress) {
            return $usina->address;
        }

        if ($usina->address) {
            $usina->address->update($addressData);

            return $usina->address;
        }

        return Address::create($addressData);
    }

    public function show(UsinaSolar $usina)
    {
        return Inertia::render(
            'Consultor/Producer/Usina/Show/Page',
            [
                'usina' => $usina->load([
                    'produtor',
                    'consultor',
                    'concessionaria',
                    'block',
                    'address',
                    'activeClientLinks.clientProfile',
                ]),
            ]
        );
    }

    public function edit(UsinaSolar $usina)
    {
        return Inertia::render('Consultor/Producer/Usina/Edit/Page', [
            'usina' => $usina->load(['produtor', 'consultor', 'concessionaria', 'block', 'address']),
            'produtores' => ProducerProfile::query()
                ->orderBy('nome')
                ->get(['id', 'nome']),
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
        ]);
    }

    public function update(StoreUsinaSolarRequest $request, UsinaSolar $usina)
    {
        $data = $request->validated();

        try {
            DB::transaction(function () use ($usina, $data) {
                $usina->update($data);
                $this->createOrUpdateAddress($usina, $data['address']);
                $this->syncProducerProfileWithUsina($usina->fresh(), $data);
            });
        } catch (\Throwable $e) {
            Log::error('Erro ao atualizar usina', [
                'usina_id' => $usina->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->withErrors(['error' => 'Erro interno ao atualizar a usina. Tente novamente.']);
        }

        return redirect()
            ->route('consultor.producer.usinas.show', $usina->id)
            ->with('success', 'Usina atualizada com sucesso.');
    }

    private function syncProducerProfileWithUsina(UsinaSolar $usina, array $data): void
    {
        $profile = ProducerProfile::query()->find($usina->user_id);

        if (!$profile) {
            return;
        }

        $profile->update([
            'inversores' => $data['inversores'] ?? $profile->inversores,
            'status' => $profile->status === 'novo' ? 'em_integracao' : $profile->status,
            'modulos' => $data['modulos'] ?? $profile->modulos,

            'usina_address_id' => $data['address_id'] ?? $profile->usina_address_id,
            'potencia_kw' => $data['potencia_usina'] ?? $profile->potencia_kw,
            'potencia_kwp' => $data['potencia_usina'] ?? $profile->potencia_kwp,
            'geracao_anual' => isset($data['media_geracao'])
                ? ((float)$data['media_geracao'] * 12)
                : $profile->geracao_anual,

            'prazo_locacao' => $data['prazo_locacao'] ?? $profile->prazo_locacao,


        ]);
    }
}

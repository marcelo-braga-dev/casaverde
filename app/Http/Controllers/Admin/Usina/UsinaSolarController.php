<?php

namespace App\Http\Controllers\Admin\Usina;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usina\StoreUsinaSolarRequest;
use App\Models\Endereco\Address;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaBlock;
use App\Models\Usina\UsinaSolar;
use App\Repositories\Usina\UsinaSolarRepository;
use App\src\Roles\RoleUser;
use App\src\Usina\UsinaStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UsinaSolarController extends Controller
{
    public function index(UsinaSolarRepository $repository)
    {
        $filters = request()->only(['search', 'status', 'concessionaria_id']);

        return Inertia::render('Consultor/Producer/Usina/Index/Page', [
            'usinas' => $repository->paginate(20, $filters),
            'filters' => $filters,
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
        $this->authorize('create', UsinaSolar::class);

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

        if (! $hasAddress) {
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
        $this->authorize('view', $usina);

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
        $this->authorize('update', $usina);

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
        $this->authorize('update', $usina);

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
        $profile = $usina->producer_profile_id
            ? ProducerProfile::query()->find($usina->producer_profile_id)
            : null;

        if (! $profile) {
            return;
        }

        if ($profile->status === 'lead' || $profile->status === 'prospect') {
            $profile->update(['status' => 'em_integracao']);
        }
    }
}

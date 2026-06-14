<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreConsumerUnitRequest;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Endereco\Address;
use App\Models\Usina\Concessionaria;
use App\Repositories\Cliente\ConsumerUnitRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConsumerUnitManagementController extends Controller
{
    public function index(Request $request, ConsumerUnitRepository $repository)
    {
        $this->authorize('viewAny', ClientProfile::class);

        $filters = $request->only(['search', 'status', 'client_profile_id']);

        return Inertia::render('Consultor/Cliente/ConsumerUnit/Index/Page', [
            'consumerUnits' => $repository->paginate($filters, 20),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $this->authorize('create', ClientProfile::class);

        return Inertia::render('Consultor/Cliente/ConsumerUnit/Create/Page', [
            'clients' => $this->clientOptions(),
            'concessionarias' => $this->concessionariaOptions(),
        ]);
    }

    public function store(StoreConsumerUnitRequest $request)
    {
        $data = $request->validated();

        $clientProfile = ClientProfile::findOrFail($data['client_profile_id']);

        $this->authorize('update', $clientProfile);

        $error = $this->validateDuplicateUcCode($data);

        if ($error) {
            return back()->withErrors(['uc_code' => $error])->withInput();
        }

        $addressData = $data['address'];
        unset($data['address']);

        $consumerUnit = DB::transaction(function () use ($data, $addressData) {
            $address = Address::create($addressData);

            $data['address_id'] = $address->id;

            return ConsumerUnit::create($data);
        });

        return redirect()
            ->route('consultor.cliente.consumer-units.show', $consumerUnit->id)
            ->with('success', 'Unidade Consumidora cadastrada com sucesso.');
    }

    public function show(ConsumerUnit $consumerUnit)
    {
        $this->authorize('view', $consumerUnit->clientProfile);

        $consumerUnit->load([
            'clientProfile',
            'concessionaria',
            'address',
            'activeUsinaLink.usina.produtor',
            'usinaLinks.usina.produtor',
            'contracts',
        ]);

        $bills = $consumerUnit->bills()
            ->with(['concessionaria', 'usina'])
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Consultor/Cliente/ConsumerUnit/Show/Page', [
            'consumerUnit' => $consumerUnit,
            'bills' => $bills,
        ]);
    }

    public function edit(ConsumerUnit $consumerUnit)
    {
        $this->authorize('update', $consumerUnit->clientProfile);

        $consumerUnit->load('address');

        return Inertia::render('Consultor/Cliente/ConsumerUnit/Edit/Page', [
            'consumerUnit' => $consumerUnit,
            'clients' => $this->clientOptions(),
            'concessionarias' => $this->concessionariaOptions(),
        ]);
    }

    public function update(StoreConsumerUnitRequest $request, ConsumerUnit $consumerUnit)
    {
        $this->authorize('update', $consumerUnit->clientProfile);

        $data = $request->validated();

        $error = $this->validateDuplicateUcCode($data, $consumerUnit);

        if ($error) {
            return back()->withErrors(['uc_code' => $error])->withInput();
        }

        $addressData = $data['address'];
        unset($data['address']);

        DB::transaction(function () use ($data, $addressData, $consumerUnit) {
            if ($consumerUnit->address_id) {
                $consumerUnit->address->update($addressData);
            } else {
                $address = Address::create($addressData);
                $data['address_id'] = $address->id;
            }

            $consumerUnit->update($data);
        });

        return redirect()
            ->route('consultor.cliente.consumer-units.show', $consumerUnit->id)
            ->with('success', 'Unidade Consumidora atualizada com sucesso.');
    }

    public function destroy(ConsumerUnit $consumerUnit)
    {
        $this->authorize('update', $consumerUnit->clientProfile);

        $hasLinks = $consumerUnit->usinaLink()->where('is_active', true)->exists();

        if ($hasLinks) {
            return back()->withErrors(['uc' => 'Esta UC possui vínculos ativos com usinas. Encerre os vínculos antes de remover.']);
        }

        $consumerUnit->delete();

        return redirect()
            ->route('consultor.cliente.consumer-units.index')
            ->with('success', 'Unidade Consumidora removida com sucesso.');
    }

    private function validateDuplicateUcCode(array $data, ?ConsumerUnit $ignore = null): ?string
    {
        $sameClient = ConsumerUnit::query()
            ->where('client_profile_id', $data['client_profile_id'])
            ->where('uc_code', $data['uc_code'])
            ->when($ignore, fn ($q) => $q->where('id', '!=', $ignore->id))
            ->exists();

        if ($sameClient) {
            return 'Esta UC já está cadastrada para este cliente.';
        }

        if (! empty($data['concessionaria_id'])) {
            $sameConcessionaria = ConsumerUnit::query()
                ->where('concessionaria_id', $data['concessionaria_id'])
                ->where('uc_code', $data['uc_code'])
                ->when($ignore, fn ($q) => $q->where('id', '!=', $ignore->id))
                ->exists();

            if ($sameConcessionaria) {
                return 'Esta UC já está cadastrada para esta concessionária em outro cliente.';
            }
        }

        return null;
    }

    private function clientOptions()
    {
        $user = auth()->user();

        return ClientProfile::query()
            ->when($user && $user->isConsultor(), fn ($q) => $q->where('consultor_user_id', $user->id))
            ->orderBy('nome')
            ->get(['id', 'nome', 'razao_social', 'nome_fantasia', 'cpf', 'cnpj', 'client_code', 'tipo_pessoa']);
    }

    private function concessionariaOptions()
    {
        return Concessionaria::query()
            ->where('status', 'ativo')
            ->orderBy('nome')
            ->get(['id', 'nome', 'estado']);
    }
}

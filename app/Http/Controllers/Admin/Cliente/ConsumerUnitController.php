<?php

namespace App\Http\Controllers\Admin\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Endereco\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConsumerUnitController extends Controller
{
    public function store(ClientProfile $clientProfile, Request $request)
    {
        $this->authorize('update', $clientProfile);

        $data = $request->validate([
            'uc_code' => ['required', 'string', 'max:30'],
            'label' => ['nullable', 'string', 'max:120'],
            'consumo_previsto_kwh_mes' => ['required', 'numeric', 'min:0'],
            'concessionaria_id' => ['nullable', 'integer', 'exists:concessionarias,id'],
            'status' => ['nullable', 'string', 'in:active,inactive,cancelled'],
            'notes' => ['nullable', 'string'],
            'address' => ['required', 'array'],
            'address.cep' => ['required', 'string'],
            'address.rua' => ['required', 'string'],
            'address.numero' => ['required', 'string'],
            'address.complemento' => ['nullable', 'string'],
            'address.bairro' => ['required', 'string'],
            'address.cidade' => ['required', 'string'],
            'address.estado' => ['required', 'string'],
            'address.referencia' => ['nullable', 'string'],
        ]);

        // Verifica duplicata por cliente
        $exists = $clientProfile->consumerUnits()
            ->where('uc_code', $data['uc_code'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['uc_code' => 'Esta UC já está cadastrada para este cliente.']);
        }

        // Verifica duplicata na mesma concessionária (outro cliente)
        if (! empty($data['concessionaria_id'])) {
            $existsInConcessionaria = ConsumerUnit::query()
                ->where('concessionaria_id', $data['concessionaria_id'])
                ->where('uc_code', $data['uc_code'])
                ->exists();

            if ($existsInConcessionaria) {
                return back()->withErrors(['uc_code' => 'Esta UC já está cadastrada para esta concessionária em outro cliente.']);
            }
        }

        $addressData = $data['address'];
        unset($data['address']);

        DB::transaction(function () use ($clientProfile, $data, $addressData) {
            $address = Address::create($addressData);

            $data['address_id'] = $address->id;

            $clientProfile->consumerUnits()->create($data);
        });

        return back()->with('success', 'Unidade Consumidora cadastrada com sucesso.');
    }

    public function update(ClientProfile $clientProfile, ConsumerUnit $consumerUnit, Request $request)
    {
        $this->authorize('update', $clientProfile);

        $data = $request->validate([
            'uc_code' => ['required', 'string', 'max:30'],
            'label' => ['nullable', 'string', 'max:120'],
            'consumo_previsto_kwh_mes' => ['required', 'numeric', 'min:0'],
            'concessionaria_id' => ['nullable', 'integer', 'exists:concessionarias,id'],
            'status' => ['nullable', 'string', 'in:active,inactive,cancelled'],
            'notes' => ['nullable', 'string'],
            'address' => ['required', 'array'],
            'address.cep' => ['required', 'string'],
            'address.rua' => ['required', 'string'],
            'address.numero' => ['required', 'string'],
            'address.complemento' => ['nullable', 'string'],
            'address.bairro' => ['required', 'string'],
            'address.cidade' => ['required', 'string'],
            'address.estado' => ['required', 'string'],
            'address.referencia' => ['nullable', 'string'],
        ]);

        // Verifica duplicata excluindo a própria
        $exists = $clientProfile->consumerUnits()
            ->where('uc_code', $data['uc_code'])
            ->where('id', '!=', $consumerUnit->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['uc_code' => 'Esta UC já está cadastrada para este cliente.']);
        }

        // Verifica duplicata na mesma concessionária (outro cliente)
        if (! empty($data['concessionaria_id'])) {
            $existsInConcessionaria = ConsumerUnit::query()
                ->where('concessionaria_id', $data['concessionaria_id'])
                ->where('uc_code', $data['uc_code'])
                ->where('id', '!=', $consumerUnit->id)
                ->exists();

            if ($existsInConcessionaria) {
                return back()->withErrors(['uc_code' => 'Esta UC já está cadastrada para esta concessionária em outro cliente.']);
            }
        }

        $addressData = $data['address'];
        unset($data['address']);

        DB::transaction(function () use ($consumerUnit, $data, $addressData) {
            if ($consumerUnit->address_id) {
                $consumerUnit->address->update($addressData);
            } else {
                $address = Address::create($addressData);
                $data['address_id'] = $address->id;
            }

            $consumerUnit->update($data);
        });

        return back()->with('success', 'Unidade Consumidora atualizada com sucesso.');
    }

    public function destroy(ClientProfile $clientProfile, ConsumerUnit $consumerUnit)
    {
        $this->authorize('update', $clientProfile);

        // Só permite deletar se não tiver vínculos ativos
        $hasLinks = $consumerUnit->usinaLink()->where('is_active', true)->exists();
        if ($hasLinks) {
            return back()->withErrors(['uc' => 'Esta UC possui vínculos ativos com usinas. Encerre os vínculos antes de remover.']);
        }

        $consumerUnit->delete();

        return back()->with('success', 'Unidade Consumidora removida com sucesso.');
    }
}

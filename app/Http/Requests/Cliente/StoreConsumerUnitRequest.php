<?php

namespace App\Http\Requests\Cliente;

use App\Http\Requests\Concerns\NormalizesNumbers;
use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreConsumerUnitRequest extends FormRequest
{
    use NormalizesNumbers;

    public function authorize(): bool
    {
        return in_array(auth()->user()?->role_id, [
            RoleUser::$ADMIN,
            RoleUser::$CONSULTOR,
        ], true);
    }

    public function rules(): array
    {
        return [
            'client_profile_id' => ['required', 'integer', 'exists:client_profiles,id'],
            'uc_code' => ['required', 'string', 'max:30'],
            'label' => ['nullable', 'string', 'max:120'],
            'consumo_previsto_kwh_mes' => ['required', 'numeric', 'min:0'],
            'concessionaria_id' => ['nullable', 'integer', 'exists:concessionarias,id'],
            'status' => ['required', 'string', 'in:active,inactive,cancelled'],
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
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'consumo_previsto_kwh_mes' => $this->normalizeNumber($this->input('consumo_previsto_kwh_mes')),
        ]);
    }
}

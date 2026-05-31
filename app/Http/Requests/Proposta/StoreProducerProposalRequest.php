<?php

namespace App\Http\Requests\Proposta;

use App\Models\Cliente\ClientProfile;
use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProducerProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'producer_profile_id' => ['nullable', 'integer', 'exists:producer_profiles,id'],

            'tipo_pessoa' => ['required', 'string'],
            'cpf' => ['nullable', 'string'],
            'cnpj' => ['nullable', 'string'],
            'nome' => ['nullable', 'string'],
            'razao_social' => ['nullable', 'string'],
            'nome_fantasia' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'telefone' => ['nullable', 'string'],

            'address' => ['nullable', 'array'],
            'address.cep' => ['nullable', 'string'],
            'address.rua' => ['nullable', 'string'],
            'address.numero' => ['nullable', 'string'],
            'address.complemento' => ['nullable', 'string'],
            'address.bairro' => ['nullable', 'string'],
            'address.cidade' => ['nullable', 'string'],
            'address.estado' => ['nullable', 'string'],
            'address.referencia' => ['nullable', 'string'],
            'address.latitude' => ['nullable', 'numeric'],
            'address.longitude' => ['nullable', 'numeric'],

            'concessionaria_id' => ['required', 'integer'],
            'potencia_usina' => ['nullable'],
            'prazo_contrato' => ['nullable'],
            'media_geracao' => ['nullable'],
            'valor_investimento' => ['nullable'],
            'valid_until' => ['nullable', 'date'],
            'notes' => ['nullable'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cpf' => ClientProfile::normalizeDocument($this->cpf),
            'cnpj' => ClientProfile::normalizeDocument($this->cnpj),
            'telefone' => ClientProfile::normalizeDocument($this->telefone),
            'email' => $this->email ? mb_strtolower(trim($this->email)) : null,
        ]);
    }
}

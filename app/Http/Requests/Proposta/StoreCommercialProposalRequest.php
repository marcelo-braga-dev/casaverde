<?php

namespace App\Http\Requests\Proposta;

use App\Models\Cliente\ClientProfile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommercialProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'client_profile_id' => ['nullable', 'integer', 'exists:client_profiles,id'],

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
            'media_consumo' => ['nullable'],
            'taxa_reducao' => ['nullable'],
            'prazo_locacao' => ['nullable'],
            'valor_medio' => ['nullable'],
            'unidade_consumidora' => ['nullable'],
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

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
            'tipo_pessoa' => ['required', Rule::in(['pf', 'pj'])],
            'cpf' => ['nullable', 'required_if:tipo_pessoa,pf', 'string', 'max:14'],
            'cnpj' => ['nullable', 'required_if:tipo_pessoa,pj', 'string', 'max:18'],

            'nome' => ['nullable', 'required_if:tipo_pessoa,pf', 'string', 'max:255'],
            'razao_social' => ['nullable', 'required_if:tipo_pessoa,pj', 'string', 'max:255'],
            'nome_fantasia' => ['nullable', 'string', 'max:255'],

            'cidade' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'telefone' => ['nullable', 'string', 'max:30'],

            'concessionaria_id' => ['required', 'integer', 'exists:concessionarias,id'],
            'media_consumo' => ['nullable', 'numeric', 'min:0'],
            'taxa_reducao' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'prazo_locacao' => ['nullable', 'integer', 'min:1'],
            'valor_medio' => ['nullable', 'numeric', 'min:0'],
            'unidade_consumidora' => ['nullable', 'string', 'max:255'],
            'valid_until' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
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
<?php

namespace App\Http\Requests\Cliente;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientContractDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'address_id' => ['nullable', 'integer', 'exists:addresses,id'],
            'tipo_pessoa' => ['required', Rule::in(['pf', 'pj'])],
            'nome' => ['nullable', 'string', 'max:255'],
            'cpf' => ['nullable', 'string', 'max:14'],
            'data_nascimento' => ['nullable', 'date'],
            'rg' => ['nullable', 'string', 'max:50'],
            'genero' => ['nullable', 'string', 'max:50'],
            'estado_civil' => ['nullable', 'string', 'max:50'],
            'profissao' => ['nullable', 'string', 'max:255'],
            'data_fundacao' => ['nullable', 'date'],
            'cnpj' => ['nullable', 'string', 'max:18'],
            'razao_social' => ['nullable', 'string', 'max:255'],
            'nome_fantasia' => ['nullable', 'string', 'max:255'],
            'tipo_empresa' => ['nullable', 'string', 'max:255'],
            'ie' => ['nullable', 'string', 'max:100'],
            'im' => ['nullable', 'string', 'max:100'],
            'ramo_atividade' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cpf' => $this->cpf ? preg_replace('/\D+/', '', $this->cpf) : null,
            'cnpj' => $this->cnpj ? preg_replace('/\D+/', '', $this->cnpj) : null,
        ]);
    }
}
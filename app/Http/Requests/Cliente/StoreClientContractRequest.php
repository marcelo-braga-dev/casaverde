<?php

namespace App\Http\Requests\Cliente;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'commercial_proposal_id' => ['required', 'integer', 'exists:commercial_proposals,id'],
            'status' => ['required', Rule::in(['issued', 'signed', 'active', 'cancelled'])],
            'issued_at' => ['nullable', 'date'],
            'signed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],

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

            'address' => ['nullable', 'array'],
            'address.cep' => ['nullable', 'string', 'max:9'],
            'address.rua' => ['nullable', 'string', 'max:255'],
            'address.numero' => ['nullable', 'string', 'max:50'],
            'address.complemento' => ['nullable', 'string', 'max:255'],
            'address.bairro' => ['nullable', 'string', 'max:255'],
            'address.cidade' => ['nullable', 'string', 'max:255'],
            'address.estado' => ['nullable', 'string', 'max:2'],
            'address.referencia' => ['nullable', 'string', 'max:255'],
            'address.latitude' => ['nullable', 'numeric'],
            'address.longitude' => ['nullable', 'numeric'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $address = $this->input('address', []);

        if (is_array($address)) {
            $address['cep'] = !empty($address['cep'])
                ? preg_replace('/\D+/', '', $address['cep'])
                : null;

            $address['estado'] = !empty($address['estado'])
                ? strtoupper(trim($address['estado']))
                : null;
        }

        $this->merge([
            'cpf' => $this->cpf ? preg_replace('/\D+/', '', $this->cpf) : null,
            'cnpj' => $this->cnpj ? preg_replace('/\D+/', '', $this->cnpj) : null,
            'address' => $address,
        ]);
    }
}

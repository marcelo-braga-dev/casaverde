<?php

namespace App\Http\Requests\Cliente;

use App\Models\Cliente\ClientProfile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $clientProfileId = $this->route('client_profile')?->id;

        return [
            'tipo_pessoa' => ['required', Rule::in(['pf', 'pj'])],

            'cpf' => [
                'nullable',
                'required_if:tipo_pessoa,pf',
                'string',
                'max:14',
                Rule::unique('client_profiles', 'cpf')->ignore($clientProfileId),
            ],

            'cnpj' => [
                'nullable',
                'required_if:tipo_pessoa,pj',
                'string',
                'max:18',
                Rule::unique('client_profiles', 'cnpj')->ignore($clientProfileId),
            ],

            'nome' => [
                'nullable',
                'required_if:tipo_pessoa,pf',
                'string',
                'max:255',
            ],

            'razao_social' => [
                'nullable',
                'required_if:tipo_pessoa,pj',
                'string',
                'max:255',
            ],

            'nome_fantasia' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'telefone' => ['nullable', 'string', 'max:30'],
            'consultor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'cpf.required_if' => 'O CPF é obrigatório para pessoa física.',
            'cpf.unique' => 'Já existe um cliente cadastrado com este CPF.',
            'cnpj.required_if' => 'O CNPJ é obrigatório para pessoa jurídica.',
            'cnpj.unique' => 'Já existe um cliente cadastrado com este CNPJ.',
            'nome.required_if' => 'O nome é obrigatório para pessoa física.',
            'razao_social.required_if' => 'A razão social é obrigatória para pessoa jurídica.',
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

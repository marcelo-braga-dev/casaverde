<?php

namespace App\Http\Requests\Endereco;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'cep' => ['nullable', 'string', 'max:9'],
            'rua' => ['nullable', 'string', 'max:255'],
            'numero' => ['nullable', 'string', 'max:50'],
            'complemento' => ['nullable', 'string', 'max:255'],
            'bairro' => ['nullable', 'string', 'max:255'],
            'cidade' => ['nullable', 'string', 'max:255'],
            'estado' => ['nullable', 'string', 'size:2'],
            'referencia' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cep' => $this->cep ? preg_replace('/\D+/', '', $this->cep) : null,
            'estado' => $this->estado ? strtoupper(trim($this->estado)) : null,
        ]);
    }
}
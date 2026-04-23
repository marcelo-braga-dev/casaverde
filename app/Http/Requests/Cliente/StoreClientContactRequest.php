<?php

namespace App\Http\Requests\Cliente;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'email' => ['nullable', 'email', 'max:255'],
            'celular' => ['nullable', 'string', 'max:20'],
            'celular_2' => ['nullable', 'string', 'max:20'],
            'telefone' => ['nullable', 'string', 'max:20'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'celular' => $this->celular ? preg_replace('/\D+/', '', $this->celular) : null,
            'celular_2' => $this->celular_2 ? preg_replace('/\D+/', '', $this->celular_2) : null,
            'telefone' => $this->telefone ? preg_replace('/\D+/', '', $this->telefone) : null,
            'email' => $this->email ? mb_strtolower(trim($this->email)) : null,
        ]);
    }
}
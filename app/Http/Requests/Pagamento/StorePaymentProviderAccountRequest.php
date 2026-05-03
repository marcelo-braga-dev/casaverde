<?php

namespace App\Http\Requests\Pagamento;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentProviderAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'provider' => ['required', Rule::in(['cora', 'mercado_pago', 'asaas'])],
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'is_default' => ['required', 'boolean'],
            'environment' => ['required', Rule::in(['sandbox', 'production'])],
            'base_url' => ['nullable', 'string', 'max:255'],
            'client_id' => ['nullable', 'string', 'max:255'],
            'client_secret' => ['nullable', 'string', 'max:5000'],
            'webhook_secret' => ['nullable', 'string', 'max:5000'],
            'settings' => ['nullable', 'json'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'is_default' => filter_var($this->is_default, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'provider' => $this->provider ? strtolower(trim($this->provider)) : null,
            'environment' => $this->environment ? strtolower(trim($this->environment)) : null,
        ]);
    }
}

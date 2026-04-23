<?php

namespace App\Http\Requests\Cliente;

use Illuminate\Foundation\Http\FormRequest;

class SendClientAccessInviteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'expires_in_hours' => ['nullable', 'integer', 'min:1', 'max:168'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => $this->email ? mb_strtolower(trim($this->email)) : null,
            'expires_in_hours' => $this->expires_in_hours ?: 48,
        ]);
    }
}
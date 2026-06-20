<?php

namespace App\Http\Requests\Config;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreInstitutionalEmailAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255', 'unique:institutional_email_accounts,email'],
            'label' => ['nullable', 'string', 'max:120'],
            'password' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'O endereço de email é obrigatório.',
            'email.email' => 'Informe um endereço de email válido.',
            'email.unique' => 'Este email institucional já está cadastrado.',
            'password.required' => 'A senha de acesso é obrigatória.',
        ];
    }
}

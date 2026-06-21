<?php

namespace App\Http\Requests\Fatura;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreConcessionaireBillsBulkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'client_profile_id' => ['required', 'integer', 'exists:client_profiles,id'],
            'pdfs' => ['required', 'array', 'min:1'],
            'pdfs.*' => ['file', 'mimes:pdf', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_profile_id.required' => 'Selecione o cliente.',
            'pdfs.required' => 'Selecione ao menos um PDF de fatura.',
            'pdfs.*.mimes' => 'Cada arquivo deve ser um PDF.',
            'pdfs.*.max' => 'Cada PDF deve ter no máximo 10MB.',
        ];
    }
}

<?php

namespace App\Http\Requests\Fatura;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientEmailImportSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'client_profile_id' => ['required', 'integer', 'exists:client_profiles,id'],
            'concessionaria_id' => ['nullable', 'integer', 'exists:concessionarias,id'],
            'imap_host' => ['required', 'string', 'max:255'],
            'imap_port' => ['required', 'integer'],
            'imap_encryption' => ['nullable', Rule::in(['ssl', 'tls', 'none'])],
            'imap_email' => ['required', 'email', 'max:255'],
            'imap_password' => ['required', 'string', 'max:255'],
            'pdf_password' => ['nullable', 'string', 'max:255'],
            'sender_filter' => ['nullable', 'string', 'max:255'],
            'subject_filter' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'imap_email' => $this->imap_email ? mb_strtolower(trim($this->imap_email)) : null,
            'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
        ]);
    }
}
<?php

namespace App\Http\Requests\Fatura;

use Illuminate\Foundation\Http\FormRequest;

class FilterConcessionaireBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'client_profile_id' => ['nullable', 'integer', 'exists:client_profiles,id'],
            'usina_id' => ['nullable', 'integer', 'exists:usina_solars,id'],
            'reference_label' => ['nullable', 'string', 'max:7'],
            'review_status' => ['nullable', 'string', 'max:50'],
            'parser_status' => ['nullable', 'string', 'max:50'],
            'import_source' => ['nullable', 'string', 'max:50'],
            'search' => ['nullable', 'string', 'max:255'],
        ];
    }
}
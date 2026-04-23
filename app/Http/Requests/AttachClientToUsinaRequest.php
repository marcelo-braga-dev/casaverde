<?php

namespace App\Http\Requests\Cliente;

use Illuminate\Foundation\Http\FormRequest;

class AttachClientToUsinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'usina_id' => ['required', 'integer', 'exists:usina_solars,id'],
            'started_at' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
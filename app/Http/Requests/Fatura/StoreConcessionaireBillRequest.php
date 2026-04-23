<?php

namespace App\Http\Requests\Fatura;

use Illuminate\Foundation\Http\FormRequest;

class StoreConcessionaireBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'client_profile_id' => ['required', 'integer', 'exists:client_profiles,id'],
            'usina_id' => ['nullable', 'integer', 'exists:usina_solars,id'],
            'concessionaria_id' => ['required', 'integer', 'exists:concessionarias,id'],
            'reference_month' => ['nullable', 'integer', 'min:1', 'max:12'],
            'reference_year' => ['nullable', 'integer', 'min:2020', 'max:2100'],
            'unidade_consumidora' => ['nullable', 'string', 'max:255'],
            'numero_instalacao' => ['nullable', 'string', 'max:255'],
            'vencimento' => ['nullable', 'date'],
            'valor_total' => ['nullable', 'numeric', 'min:0'],
            'consumo_kwh' => ['nullable', 'numeric', 'min:0'],
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
<?php

namespace App\Http\Requests\Fatura;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConcessionaireBillReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'usina_id' => ['nullable', 'integer', 'exists:usina_solars,id'],
            'concessionaria_id' => ['required', 'integer', 'exists:concessionarias,id'],

            'nome' => ['nullable', 'string', 'max:255'],
            'unidade_consumidora' => ['nullable', 'string', 'max:255'],
            'numero_instalacao' => ['nullable', 'string', 'max:255'],

            'reference_month' => ['nullable', 'integer', 'min:1', 'max:12'],
            'reference_year' => ['nullable', 'integer', 'min:2020', 'max:2100'],
            'reference_label' => ['nullable', 'string', 'max:50'],

            'vencimento' => ['nullable', 'date'],
            'valor_total' => ['nullable'],
            'consumo_kwh' => ['nullable'],

            'notes' => ['nullable', 'string'],
            'review_notes' => ['nullable', 'string'],
            'review_status' => ['required', 'string', 'max:50'],
        ];
    }
}

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
            'reference_month' => ['required', 'integer', 'min:1', 'max:12'],
            'reference_year' => ['required', 'integer', 'min:2020', 'max:2100'],
            'unidade_consumidora' => ['required', 'string', 'max:255'],
            'numero_instalacao' => ['nullable', 'string', 'max:255'],
            'vencimento' => ['required', 'date'],
            'valor_total' => ['required', 'numeric', 'min:0'],
            'consumo_kwh' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'review_status' => ['required', 'string', 'max:50'],
        ];
    }
}
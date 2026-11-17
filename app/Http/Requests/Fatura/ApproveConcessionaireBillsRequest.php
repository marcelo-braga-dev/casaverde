<?php

namespace App\Http\Requests\Fatura;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class ApproveConcessionaireBillsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1', 'max:200'],
            'ids.*' => ['integer', 'exists:concessionaire_bills,id'],
            'injected_values_confirmed' => ['accepted'],
            'charge_due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'injected_values_confirmed.accepted' => 'Confirme que conferiu os valores de consumo injetado antes de aprovar em lote.',
            'charge_due_date.after_or_equal' => 'O vencimento da cobrança não pode ser uma data passada.',
        ];
    }
}

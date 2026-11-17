<?php

namespace App\Http\Requests\Fatura;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class ApproveConcessionaireBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'charge_due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'charge_due_date.after_or_equal' => 'O vencimento da cobrança não pode ser uma data passada.',
        ];
    }
}

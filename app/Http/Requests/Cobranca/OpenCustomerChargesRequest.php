<?php

namespace App\Http\Requests\Cobranca;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class OpenCustomerChargesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1', 'max:200'],
            'ids.*' => ['integer'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'due_date.after_or_equal' => 'O novo vencimento não pode ser uma data passada.',
        ];
    }
}

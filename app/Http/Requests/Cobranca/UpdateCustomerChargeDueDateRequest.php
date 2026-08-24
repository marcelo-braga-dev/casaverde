<?php

namespace App\Http\Requests\Cobranca;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerChargeDueDateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'due_date' => ['required', 'date'],
        ];
    }
}

<?php

namespace App\Http\Requests\Cobranca;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class CancelCustomerChargeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

<?php

namespace App\Http\Requests\Cliente;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class AttachClientToUsinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'consumer_unit_id' => ['nullable', 'integer', 'exists:consumer_units,id'],
            'usina_id' => ['required', 'integer', 'exists:usina_solars,id'],
            'started_at' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

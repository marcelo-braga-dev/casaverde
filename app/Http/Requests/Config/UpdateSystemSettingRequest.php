<?php

namespace App\Http\Requests\Config;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'default_discount_percentage' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
            ],
        ];
    }
}

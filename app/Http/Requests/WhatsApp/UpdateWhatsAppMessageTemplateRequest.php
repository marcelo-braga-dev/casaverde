<?php

namespace App\Http\Requests\WhatsApp;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWhatsAppMessageTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (int) $this->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
            'is_active' => ['boolean'],
        ];
    }
}

<?php

namespace App\Http\Requests\Config;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandIdentityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'color_primary' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'color_secondary' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:2048'],
            'favicon' => ['nullable', 'mimes:png,ico,jpg,jpeg,svg,webp', 'max:512'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome da plataforma é obrigatório.',
            'color_primary.regex' => 'Informe uma cor primária válida (ex: #2F7D18).',
            'color_secondary.regex' => 'Informe uma cor secundária válida (ex: #4F9A2A).',
            'logo.image' => 'O logo deve ser uma imagem (PNG, JPG, SVG ou WEBP).',
            'logo.max' => 'O logo deve ter no máximo 2MB.',
            'favicon.mimes' => 'O favicon deve ser PNG, ICO, JPG, SVG ou WEBP.',
            'favicon.max' => 'O favicon deve ter no máximo 512KB.',
        ];
    }
}

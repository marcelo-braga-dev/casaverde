<?php

namespace App\Http\Requests\Produtor;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProducerLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'consultor_user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role_id', RoleUser::$CONSULTOR)),
            ],
            'producer_profile_id' => ['nullable', 'integer', 'exists:producer_profiles,id'],
            'concessionaria_id' => ['nullable', 'integer', 'exists:concessionarias,id'],
            'taxa_reducao' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'prazo_locacao' => ['nullable', 'integer', 'min:1'],
            'potencia' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
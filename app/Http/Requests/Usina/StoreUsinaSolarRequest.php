<?php

namespace App\Http\Requests\Usina;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUsinaSolarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role_id', RoleUser::$PRODUTOR)),
            ],
            'consultor_user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->where('role_id', RoleUser::$CONSULTOR)),
            ],
            'concessionaria_id' => ['required', 'integer', 'exists:concessionarias,id'],
            'usina_block_id' => ['nullable', 'integer', 'exists:usina_blocks,id'],
            'address_id' => ['nullable', 'integer', 'exists:addresses,id'],
            'status' => ['required', 'string', 'max:50'],
            'uc' => ['nullable', 'string', 'max:255'],
            'media_geracao' => ['nullable', 'numeric', 'min:0'],
            'prazo_locacao' => ['nullable', 'integer', 'min:1'],
            'potencia_usina' => ['nullable', 'numeric', 'min:0'],
            'taxa_comissao' => ['nullable', 'numeric', 'min:0'],
            'inversores' => ['nullable', 'string'],
            'modulos' => ['nullable', 'string'],
        ];
    }
}
<?php

namespace App\Http\Requests\Usina;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsinaSolarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'consultor_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'concessionaria_id' => ['nullable', 'integer', 'exists:concessionarias,id'],
            'usina_block_id' => ['nullable', 'integer', 'exists:usina_blocks,id'],
            'address_id' => ['nullable', 'integer', 'exists:addresses,id'],
            'status' => ['required', 'string', 'max:50'],
            'uc' => ['nullable', 'string', 'max:255'],
            'media_geracao' => ['nullable', 'numeric', 'min:0'],
            'prazo_locacao' => ['nullable', 'integer', 'min:1'],
            'potencia_usina' => ['nullable', 'numeric', 'min:0'],
            'taxa_comissao' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'inversores' => ['nullable', 'string'],
            'modulos' => ['nullable', 'string'],
        ];
    }
}
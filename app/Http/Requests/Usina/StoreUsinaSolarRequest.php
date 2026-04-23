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
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role_id', RoleUser::$PRODUTOR);
                }),
            ],

            'consultor_user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role_id', RoleUser::$CONSULTOR);
                }),
            ],

            'concessionaria_id' => [
                'required',
                'integer',
                'exists:concessionarias,id',
            ],

            'usina_block_id' => [
                'nullable',
                'integer',
                'exists:usina_blocks,id',
            ],

            'address_id' => [
                'nullable',
                'integer',
                'exists:addresses,id',
            ],

            'status' => [
                'required',
                'string',
                'max:50',
            ],

            'uc' => [
                'nullable',
                'string',
                'max:255',
            ],

            'media_geracao' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'prazo_locacao' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'potencia_usina' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'taxa_comissao' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'inversores' => [
                'nullable',
                'string',
            ],

            'modulos' => [
                'nullable',
                'string',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'media_geracao' => $this->normalizeNumber($this->input('media_geracao')),
            'potencia_usina' => $this->normalizeNumber($this->input('potencia_usina')),
            'taxa_comissao' => $this->normalizeNumber($this->input('taxa_comissao')),
            'prazo_locacao' => $this->filled('prazo_locacao') ? (int) $this->input('prazo_locacao') : null,
        ]);
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'O produtor proprietário da usina é obrigatório.',
            'user_id.exists' => 'O produtor selecionado não é válido.',

            'consultor_user_id.required' => 'O consultor responsável é obrigatório.',
            'consultor_user_id.exists' => 'O consultor selecionado não é válido.',

            'concessionaria_id.required' => 'A concessionária é obrigatória.',
            'concessionaria_id.exists' => 'A concessionária selecionada não é válida.',

            'usina_block_id.exists' => 'O bloco da usina selecionado não é válido.',
            'address_id.exists' => 'O endereço selecionado não é válido.',

            'status.required' => 'O status da usina é obrigatório.',

            'media_geracao.numeric' => 'A média de geração deve ser numérica.',
            'media_geracao.min' => 'A média de geração não pode ser negativa.',

            'prazo_locacao.integer' => 'O prazo de locação deve ser um número inteiro.',
            'prazo_locacao.min' => 'O prazo de locação deve ser maior que zero.',

            'potencia_usina.numeric' => 'A potência da usina deve ser numérica.',
            'potencia_usina.min' => 'A potência da usina não pode ser negativa.',

            'taxa_comissao.numeric' => 'A taxa de comissão deve ser numérica.',
            'taxa_comissao.min' => 'A taxa de comissão não pode ser negativa.',
        ];
    }

    private function normalizeNumber($value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return $value;
        }

        $value = trim((string) $value);
        $value = str_replace('.', '', $value);
        $value = str_replace(',', '.', $value);

        return is_numeric($value) ? $value : $value;
    }
}
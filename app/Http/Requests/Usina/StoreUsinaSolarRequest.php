<?php

namespace App\Http\Requests\Usina;

use App\Http\Requests\Concerns\NormalizesNumbers;
use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUsinaSolarRequest extends FormRequest
{
    use NormalizesNumbers;

    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'producer_profile_id' => [
                'required',
                'integer',
                'exists:producer_profiles,id',
            ],
            'usina_nome' => [
                'required',
                'string',
            ],
            'consultor_user_id' => [
                'nullable',
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
            'uc' => [
                'nullable',
                'integer',
            ],
            'media_geracao' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'prazo_locacao' => [
                'required',
                'integer',
                'min:1',
            ],
            'potencia_usina' => [
                'required',
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
            'address' => ['nullable', 'array'],
            'address.cep' => ['nullable', 'string'],
            'address.rua' => ['nullable', 'string'],
            'address.numero' => ['nullable', 'string'],
            'address.complemento' => ['nullable', 'string'],
            'address.bairro' => ['nullable', 'string'],
            'address.cidade' => ['nullable', 'string'],
            'address.estado' => ['nullable', 'string'],
            'address.referencia' => ['nullable', 'string'],
            'address.latitude' => ['nullable', 'numeric'],
            'address.longitude' => ['nullable', 'numeric'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'media_geracao' => $this->normalizeNumber($this->input('media_geracao')),
            'potencia_usina' => $this->normalizeNumber($this->input('potencia_usina')),
            'prazo_locacao' => $this->filled('prazo_locacao') ? (int) $this->input('prazo_locacao') : null,
        ]);
    }

    public function messages(): array
    {
        return [
            'producer_profile_id.required' => 'O produtor proprietário da usina é obrigatório.',
            'producer_profile_id.exists' => 'O produtor selecionado não é válido.',

            'consultor_user_id.exists' => 'O consultor selecionado não é válido.',

            'concessionaria_id.required' => 'A concessionária é obrigatória.',
            'concessionaria_id.exists' => 'A concessionária selecionada não é válida.',

            'usina_block_id.exists' => 'O bloco da usina selecionado não é válido.',

            'media_geracao.numeric' => 'A média de geração deve ser numérica.',
            'media_geracao.min' => 'A média de geração não pode ser negativa.',

            'prazo_locacao.integer' => 'O prazo de locação deve ser um número inteiro.',
            'prazo_locacao.min' => 'O prazo de locação deve ser maior que zero.',

            'potencia_usina.numeric' => 'A potência da usina deve ser numérica.',
            'potencia_usina.min' => 'A potência da usina não pode ser negativa.',
        ];
    }
}

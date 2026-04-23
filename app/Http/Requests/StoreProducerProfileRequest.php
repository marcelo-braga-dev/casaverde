<?php

namespace App\Http\Requests\Produtor;

use Illuminate\Foundation\Http\FormRequest;

class StoreProducerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'created_by_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'admin_nome' => ['nullable', 'string', 'max:255'],
            'admin_qualificacao' => ['nullable', 'string', 'max:255'],
            'admin_address_id' => ['nullable', 'integer', 'exists:addresses,id'],
            'usina_nome' => ['nullable', 'string', 'max:255'],
            'usina_address_id' => ['nullable', 'integer', 'exists:addresses,id'],
            'usina_cnpj' => ['nullable', 'string', 'max:18'],
            'potencia_kw' => ['nullable', 'numeric', 'min:0'],
            'potencia_kwp' => ['nullable', 'numeric', 'min:0'],
            'geracao_anual' => ['nullable', 'numeric', 'min:0'],
            'unidade_consumidora' => ['nullable', 'string', 'max:255'],
            'usina_area' => ['nullable', 'numeric', 'min:0'],
            'imovel_area' => ['nullable', 'numeric', 'min:0'],
            'imovel_matricula' => ['nullable', 'string', 'max:255'],
            'tipo_area' => ['nullable', 'string', 'max:255'],
            'classificacao' => ['nullable', 'string', 'max:255'],
            'prazo_locacao' => ['nullable', 'integer', 'min:1'],
            'modulos' => ['nullable', 'string'],
            'inversores' => ['nullable', 'string'],
            'descricao' => ['nullable', 'string'],
            'parcela_fixa' => ['nullable', 'numeric', 'min:0'],
            'taxa_administracao' => ['nullable', 'numeric', 'min:0'],
            'contrato_data' => ['nullable', 'date'],
            'status' => ['required', 'string', 'max:50'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'usina_cnpj' => $this->usina_cnpj ? preg_replace('/\D+/', '', $this->usina_cnpj) : null,
        ]);
    }
}
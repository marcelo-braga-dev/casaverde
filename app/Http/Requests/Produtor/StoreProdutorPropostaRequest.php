<?php

namespace App\Http\Requests\Produtor;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProdutorPropostaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'produtor_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role_id', RoleUser::$PRODUTOR);
                }),
            ],

            'tipo_pessoa' => [
                'nullable',
                'string',
                Rule::in(['pf', 'pj']),
            ],

            'nome' => [
                Rule::requiredIf(fn () => !$this->filled('produtor_id') && $this->input('tipo_pessoa') !== 'pj'),
                'nullable',
                'string',
                'max:255',
            ],

            'razao_social' => [
                Rule::requiredIf(fn () => !$this->filled('produtor_id') && $this->input('tipo_pessoa') === 'pj'),
                'nullable',
                'string',
                'max:255',
            ],

            'nome_fantasia' => [
                'nullable',
                'string',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'cpf' => [
                Rule::requiredIf(fn () => !$this->filled('produtor_id') && $this->input('tipo_pessoa') !== 'pj' && !$this->filled('cnpj')),
                'nullable',
                'string',
                'max:14',
            ],

            'cnpj' => [
                Rule::requiredIf(fn () => !$this->filled('produtor_id') && $this->input('tipo_pessoa') === 'pj' && !$this->filled('cpf')),
                'nullable',
                'string',
                'max:18',
            ],

            'rg' => [
                'nullable',
                'string',
                'max:30',
            ],

            'data_nascimento' => [
                'nullable',
                'date',
            ],

            'data_fundacao' => [
                'nullable',
                'date',
            ],

            'genero' => [
                'nullable',
                'string',
                'max:50',
            ],

            'estado_civil' => [
                'nullable',
                'string',
                'max:50',
            ],

            'profissao' => [
                'nullable',
                'string',
                'max:255',
            ],

            'tipo_empresa' => [
                'nullable',
                'string',
                'max:100',
            ],

            'ie' => [
                'nullable',
                'string',
                'max:50',
            ],

            'im' => [
                'nullable',
                'string',
                'max:50',
            ],

            'ramo_atividade' => [
                'nullable',
                'string',
                'max:255',
            ],

            'contato' => [
                'nullable',
                'array',
            ],

            'contato.celular' => [
                Rule::requiredIf(fn () => !$this->filled('produtor_id')),
                'nullable',
                'string',
                'max:20',
            ],

            'contato.celular_2' => [
                'nullable',
                'string',
                'max:20',
            ],

            'contato.telefone' => [
                'nullable',
                'string',
                'max:20',
            ],

            'contato.email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'taxa_reducao' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
            ],

            'dados' => [
                'required',
                'array',
            ],

            'dados.potencia' => [
                'required',
                'numeric',
                'min:0',
            ],

            'dados.geracao_media' => [
                'required',
                'numeric',
                'min:0',
            ],

            'dados.valor_investimento' => [
                'required',
                'numeric',
                'min:0',
            ],

            'dados.prazo_locacao' => [
                'required',
                'integer',
                'min:1',
            ],

            'endereco' => [
                'required',
                'array',
            ],

            'endereco.cep' => [
                'required',
                'string',
                'max:9',
            ],

            'endereco.rua' => [
                'required',
                'string',
                'max:255',
            ],

            'endereco.numero' => [
                'nullable',
                'string',
                'max:20',
            ],

            'endereco.complemento' => [
                'nullable',
                'string',
                'max:255',
            ],

            'endereco.bairro' => [
                'required',
                'string',
                'max:255',
            ],

            'endereco.cidade' => [
                'required',
                'string',
                'max:255',
            ],

            'endereco.estado' => [
                'required',
                'string',
                'size:2',
            ],

            'endereco.referencia' => [
                'nullable',
                'string',
                'max:255',
            ],

            'endereco.latitude' => [
                'nullable',
                'numeric',
            ],

            'endereco.longitude' => [
                'nullable',
                'numeric',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $cpf = $this->input('cpf');
        $cnpj = $this->input('cnpj');
        $endereco = $this->input('endereco', []);
        $dados = $this->input('dados', []);
        $contato = $this->input('contato', []);

        $this->merge([
            'cpf' => $cpf ? preg_replace('/\D+/', '', $cpf) : null,
            'cnpj' => $cnpj ? preg_replace('/\D+/', '', $cnpj) : null,

            'endereco' => [
                ...$endereco,
                'cep' => !empty($endereco['cep']) ? preg_replace('/\D+/', '', $endereco['cep']) : null,
            ],

            'dados' => [
                ...$dados,
                'potencia' => $this->normalizeNumber($dados['potencia'] ?? null),
                'geracao_media' => $this->normalizeNumber($dados['geracao_media'] ?? null),
                'valor_investimento' => $this->normalizeNumber($dados['valor_investimento'] ?? null),
                'prazo_locacao' => isset($dados['prazo_locacao']) ? (int) $dados['prazo_locacao'] : null,
            ],

            'contato' => [
                ...$contato,
                'celular' => !empty($contato['celular']) ? preg_replace('/\D+/', '', $contato['celular']) : null,
                'celular_2' => !empty($contato['celular_2']) ? preg_replace('/\D+/', '', $contato['celular_2']) : null,
                'telefone' => !empty($contato['telefone']) ? preg_replace('/\D+/', '', $contato['telefone']) : null,
                'email' => !empty($contato['email']) ? mb_strtolower(trim($contato['email'])) : null,
            ],

            'taxa_reducao' => $this->normalizeNumber($this->input('taxa_reducao')),
        ]);
    }

    public function messages(): array
    {
        return [
            'produtor_id.exists' => 'O produtor selecionado não é válido.',
            'nome.required' => 'O nome do produtor é obrigatório.',
            'razao_social.required' => 'A razão social do produtor é obrigatória.',
            'cpf.required' => 'O CPF do produtor é obrigatório.',
            'cnpj.required' => 'O CNPJ do produtor é obrigatório.',
            'contato.celular.required' => 'O celular do produtor é obrigatório.',
            'dados.required' => 'Os dados da proposta são obrigatórios.',
            'dados.potencia.required' => 'A potência da usina é obrigatória.',
            'dados.geracao_media.required' => 'A média de geração mensal é obrigatória.',
            'dados.valor_investimento.required' => 'O valor do investimento é obrigatório.',
            'dados.prazo_locacao.required' => 'O prazo do contrato é obrigatório.',
            'taxa_reducao.required' => 'A taxa de redução é obrigatória.',
            'endereco.required' => 'O endereço da usina é obrigatório.',
            'endereco.cep.required' => 'O CEP é obrigatório.',
            'endereco.rua.required' => 'A rua é obrigatória.',
            'endereco.bairro.required' => 'O bairro é obrigatório.',
            'endereco.cidade.required' => 'A cidade é obrigatória.',
            'endereco.estado.required' => 'O estado é obrigatório.',
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
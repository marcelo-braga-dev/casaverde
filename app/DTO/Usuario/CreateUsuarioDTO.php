<?php

namespace App\DTO\Usuario;

use Illuminate\Http\Request;

class CreateUsuarioDTO
{
    public ?string $nome;
    public string $email;
    public ?string $tipoPessoa;
    public ?string $razaoSocial;
    public ?string $nomeFantasia;
    public ?string $cnpj;
    public ?string $cpf;
    public ?string $rg;
    public ?string $ie;
    public ?string $im;
    public ?string $dataNascimento;
    public ?string $dataFundacao;
    public ?string $genero;
    public ?string $estadoCivil;
    public ?string $profissao;
    public ?string $tipoEmpresa;
    public ?string $ramoAtividade;


    public static function fromArray(Request $data): CreateUsuarioDTO
    {
        $dto = new self();

        $dto->nome = $data['nome'] ?? null;
        $dto->email = $data['email'];
        $dto->razaoSocial = $data['razao_social'] ?? null;
        $dto->nomeFantasia = $data['nome_fantasia'] ?? null;
        $dto->tipoPessoa = $data['tipo_pessoa'];
        $dto->cpf = $data['cpf'] ?? null;
        $dto->dataNascimento = $data['data_nascimento'] ?? null;
        $dto->dataFundacao = $data['data_fundacao'] ?? null;
        $dto->rg = $data['rg'] ?? null;
        $dto->genero = $data['genero'] ?? null;
        $dto->estadoCivil = $data['estado_civil'] ?? null;
        $dto->profissao = $data['profissao'] ?? null;
        $dto->cnpj = $data['cnpj'] ?? null;
        $dto->tipoEmpresa = $data['tipo_empresa'] ?? null;
        $dto->ie = $data['ie'] ?? null;
        $dto->im = $data['im'] ?? null;
        $dto->ramoAtividade = $data['ramo_atividade'] ?? null;

        return $dto;
    }

    public function toArray(): array
    {
        return [
            'nome' => $this->nome,
            'email' => $this->email,
            'razao_social' => $this->razaoSocial,
            'nome_fantasia' => $this->nomeFantasia,
            'tipo_pessoa' => $this->tipoPessoa,
            'cpf' => $this->cpf,
            'data_nascimento' => $this->dataNascimento,
            'data_fundacao' => $this->dataFundacao,
            'rg' => $this->rg,
            'genero' => $this->genero,
            'estado_civil' => $this->estadoCivil,
            'profissao' => $this->profissao,
            'cnpj' => $this->cnpj,
            'tipo_empresa' => $this->tipoEmpresa,
            'ie' => $this->ie,
            'im' => $this->im,
            'ramo_atividade' => $this->ramoAtividade,
        ];
    }
}

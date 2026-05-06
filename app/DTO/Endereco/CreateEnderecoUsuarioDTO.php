<?php

namespace App\DTO\Endereco;

use Illuminate\Http\Request;

class CreateEnderecoUsuarioDTO
{
    public int $userId;
    public ?string $cep;
    public ?string $rua;
    public ?string $numero;
    public ?string $complemento;
    public ?string $bairro;
    public ?string $cidade;
    public ?string $estado;
    public ?string $referencia;


    public static function fromArray(int $userId, $data): CreateEnderecoUsuarioDTO
    {
        $dto = new self();

        $dto->userId = $userId;
        $dto->cep = $data['cep'] ?? null;
        $dto->rua = $data['rua'] ?? null;
        $dto->numero = $data['numero'] ?? null;
        $dto->complemento = $data['complemento'] ?? null;
        $dto->bairro = $data['bairro'] ?? null;
        $dto->cidade = $data['cidade'] ?? null;
        $dto->estado = $data['estado'] ?? null;
        $dto->referencia = $data['referencia'] ?? null;

        return $dto;
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'cep' => $this->cep,
            'rua' => $this->rua,
            'numero' => $this->numero,
            'complemento' => $this->complemento,
            'bairro' => $this->bairro,
            'cidade' => $this->cidade,
            'estado' => $this->estado,
            'referencia' => $this->referencia,
        ];
    }
}

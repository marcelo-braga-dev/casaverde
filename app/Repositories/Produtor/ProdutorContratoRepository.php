<?php

namespace App\Repositories\Produtor;

use App\Models\Enderecos;
use App\Models\Produtor\ProdutorContratos;
use App\Utils\AlertMessage;

class ProdutorContratoRepository
{
    public function getAll(int $produtorId)
    {
        return (new ProdutorContratos)->newQuery()
            ->where('produtor_id', $produtorId)
            ->get();
    }

    public function story(array $dados)
    {
        try {
            $enderecoAdmin = (new Enderecos)->create($dados['enderecoAdmin']);
            $enderecoUsina = (new Enderecos)->create($dados['enderecoUsina']);

            $contrato = (new ProdutorContratos)->create([
                'autor_id' => auth()->id(),
                'produtor_id' => $dados['produtorId'],
                'admin_endereco_id' => $enderecoAdmin->id,
                'usina_endereco_id' => $enderecoUsina->id,
                ...$dados,
            ]);

            return $contrato->id;
        } catch (\Exception) {
            AlertMessage::error('Falha no cadastro do contrato!');
            throw new \Exception('Falha no cadastro do contrato');
        }
    }
}

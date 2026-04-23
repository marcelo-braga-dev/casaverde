<?php

namespace App\Repositories\Usina;

use App\Models\Usina\Concessionaria;

class ConcessionariaRepository
{
    public function queryList()
    {
        return Concessionaria::query()->orderBy('nome');
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }

    public function findById(int $id): ?Concessionaria
    {
        return $this->queryList()->find($id);
    }
}
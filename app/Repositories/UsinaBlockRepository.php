<?php

namespace App\Repositories\Usina;

use App\Models\Usina\UsinaBlock;

class UsinaBlockRepository
{
    public function queryList()
    {
        return UsinaBlock::query()->withCount('usinas')->orderBy('nome');
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }
}
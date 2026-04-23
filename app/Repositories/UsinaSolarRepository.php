<?php

namespace App\Repositories\Usina;

use App\Models\Usina\UsinaSolar;

class UsinaSolarRepository
{
    public function queryList()
    {
        return UsinaSolar::query()
            ->with([
                'user',
                'consultor',
                'concessionaria',
                'block',
                'address',
            ])
            ->orderByDesc('id');
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }
}
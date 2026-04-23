<?php

namespace App\Repositories\Endereco;

use App\Models\Endereco\Address;

class AddressRepository
{
    public function queryList()
    {
        return Address::query()->orderByDesc('id');
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }
}
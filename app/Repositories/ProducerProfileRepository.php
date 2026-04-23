<?php

namespace App\Repositories\Produtor;

use App\Models\Produtor\ProducerProfile;

class ProducerProfileRepository
{
    public function queryList()
    {
        return ProducerProfile::query()
            ->with(['user', 'createdBy', 'adminAddress', 'usinaAddress'])
            ->orderByDesc('id');
    }

    public function paginate(int $perPage = 15)
    {
        return $this->queryList()->paginate($perPage);
    }
}
<?php

namespace App\Services\Config;

use App\Models\Config;

class ConfigService
{
    public function setTaxaReducao(int $valorTaxaReducao)
    {
        (new Config)->updateOrCreate(
            ['name' => 'valor_taxa_reducao'],
            ['value' => $valorTaxaReducao]
        );
    }

    public function getTaxaReducao()
    {
        return (new Config)->where('name', 'valor_taxa_reducao')->first()->value ?? 0;
    }
}

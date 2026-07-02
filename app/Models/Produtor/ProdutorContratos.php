<?php

namespace App\Models\Produtor;

use Illuminate\Database\Eloquent\Model;

class ProdutorContratos extends Model
{
    protected $fillable = [
        'autor_id',
        'produtor_id',
        'admin_nome',
        'admin_qualificacao',
        'admin_endereco_id',
        'usina_nome',
        'usina_endereco_id',
        'usina_cnpj',
        'potencia_kw',
        'potencia_kwp',
        'geracao_anual',
        'unidade_consumidora',
        'usina_area',
        'imovel_area',
        'imovel_matricula',
        'tipo_area',
        'classificacao',
        'prazo_locacao',
        'modulos',
        'inversores',
        'descricao',
        'parcela_fixa',
        'taxa_administracao',
        'contrato_data',
    ];

    protected $casts = [
        'unidade_consumidora' => 'string',
    ];

    // --------------
    // setters
    // --------------
    public function setUsinaCnpjAttribute($value)
    {
        $this->attributes['usina_cnpj'] = $value ? preg_replace('/\D/', '', $value) : null;
    }
}

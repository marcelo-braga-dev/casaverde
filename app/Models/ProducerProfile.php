<?php

namespace App\Models\Produtor;

use App\Models\Endereco\Address;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProducerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'created_by_user_id',
        'admin_nome',
        'admin_qualificacao',
        'admin_address_id',
        'usina_nome',
        'usina_address_id',
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
        'status',
    ];

    protected $casts = [
        'potencia_kw' => 'decimal:2',
        'potencia_kwp' => 'decimal:2',
        'geracao_anual' => 'decimal:2',
        'usina_area' => 'decimal:2',
        'imovel_area' => 'decimal:2',
        'parcela_fixa' => 'decimal:2',
        'taxa_administracao' => 'decimal:2',
        'contrato_data' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function adminAddress()
    {
        return $this->belongsTo(Address::class, 'admin_address_id');
    }

    public function usinaAddress()
    {
        return $this->belongsTo(Address::class, 'usina_address_id');
    }
}
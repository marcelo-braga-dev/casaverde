<?php

namespace App\Models\Usina;

use App\Models\Cliente\ClientUsinaLink;
use App\Models\Endereco\Address;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsinaSolar extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'consultor_user_id',
        'concessionaria_id',
        'usina_block_id',
        'address_id',
        'status',
        'uc',
        'media_geracao',
        'prazo_locacao',
        'potencia_usina',
        'taxa_comissao',
        'inversores',
        'modulos',
    ];

    protected $casts = [
        'media_geracao' => 'decimal:2',
        'potencia_usina' => 'decimal:2',
        'taxa_comissao' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function produtor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

    public function block()
    {
        return $this->belongsTo(UsinaBlock::class, 'usina_block_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    public function clientLinks()
    {
        return $this->hasMany(ClientUsinaLink::class, 'usina_id');
    }
}
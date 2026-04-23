<?php

namespace App\Models\Produtor;

use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProducerLead extends Model
{
    use HasFactory;

    protected $fillable = [
        'consultor_user_id',
        'producer_profile_id',
        'concessionaria_id',
        'taxa_reducao',
        'prazo_locacao',
        'potencia',
        'status',
        'notes',
    ];

    protected $casts = [
        'taxa_reducao' => 'decimal:2',
        'potencia' => 'decimal:2',
    ];

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function producerProfile()
    {
        return $this->belongsTo(ProducerProfile::class, 'producer_profile_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

    public function produtorUsuario()
    {
        return $this->hasOneThrough(
            User::class,
            ProducerProfile::class,
            'id',
            'id',
            'producer_profile_id',
            'user_id'
        );
    }
}
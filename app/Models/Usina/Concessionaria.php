<?php

namespace App\Models\Usina;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Concessionaria extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'tarifa_gd2',
        'estado',
        'status',
    ];

    protected $casts = [
        'tarifa_gd2' => 'decimal:6',
    ];

    public function usinas()
    {
        return $this->hasMany(UsinaSolar::class, 'concessionaria_id');
    }

public function proposals()
{
    return $this->hasMany(\App\Models\Proposta\CommercialProposal::class, 'concessionaria_id');
}

public function bills()
{
    return $this->hasMany(\App\Models\Fatura\ConcessionaireBill::class, 'concessionaria_id');
}
}
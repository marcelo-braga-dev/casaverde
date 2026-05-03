<?php

namespace App\Models\Usina;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Concessionaria extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $dates = [
        'deleted_at',
    ];

    protected $fillable = [
        'nome',
        'tarifa_gd2',
        'estado',
        'status',
    ];

    protected $casts = [
        'tarifa_gd2' => 'decimal:6',
        'deleted_at' => 'datetime',
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

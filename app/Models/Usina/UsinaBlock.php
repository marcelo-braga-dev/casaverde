<?php

namespace App\Models\Usina;

use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsinaBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descricao',
        'status',
    ];

    public function usinas()
    {
        return $this->hasMany(UsinaSolar::class, 'usina_block_id');
    }
}
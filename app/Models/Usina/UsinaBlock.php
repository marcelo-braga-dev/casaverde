<?php

namespace App\Models\Usina;

use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsinaBlock extends Model
{
    use HasFactory;
    use SoftDeletes;

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

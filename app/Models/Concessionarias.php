<?php

namespace App\Models;

use App\Utils\ConvertValues;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Concessionarias extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'tarifa_gd2', 'estado'];

    protected $hidden = ['created_at', 'updated_at'];

    public function setTarifaGd2Attribute($value)
    {
        $this->attributes['tarifa_gd2'] = ConvertValues::moneyToFloat($value);
    }
}

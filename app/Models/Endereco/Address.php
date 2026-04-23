<?php

namespace App\Models\Endereco;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'cep',
        'rua',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'estado',
        'referencia',
        'latitude',
        'longitude',
    ];

    protected static function booted(): void
    {
        static::saving(function (Address $address) {
            $address->cep = $address->cep ? preg_replace('/\D+/', '', $address->cep) : null;
            $address->estado = $address->estado ? strtoupper(trim($address->estado)) : null;
        });
    }
}
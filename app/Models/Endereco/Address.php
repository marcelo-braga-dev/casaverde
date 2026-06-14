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

    protected $appends = [
        'full_address',
    ];

    protected static function booted(): void
    {
        static::saving(function (Address $address) {

            $address->cep = $address->cep
                ? preg_replace('/\D+/', '', $address->cep)
                : null;

            $address->estado = $address->estado
                ? strtoupper(trim($address->estado))
                : null;
        });
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->rua,
            $this->numero,
            $this->complemento,
            $this->bairro,
            $this->cidade,
            $this->estado,
        ]);

        $address = implode(', ', $parts);

        if ($this->cep) {
            $cep = preg_replace(
                '/(\d{5})(\d{3})/',
                '$1-$2',
                $this->cep
            );
            $address .= ' - CEP: '.$cep;
        }

        return $address;
    }
}

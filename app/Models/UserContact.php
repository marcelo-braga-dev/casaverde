<?php

namespace App\Models\Users;

use App\Utils\FormatValues;
use Illuminate\Database\Eloquent\Model;

class UserContact extends Model
{
    protected $table = 'user_contacts';

    protected $fillable = [
        'user_id',
        'email',
        'celular',
        'celular_2',
        'telefone',
    ];

    protected static function booted(): void
    {
        static::saving(function (UserContact $contact) {
            $contact->email = $contact->email ? mb_strtolower(trim($contact->email)) : null;
            $contact->celular = $contact->celular ? preg_replace('/\D+/', '', $contact->celular) : null;
            $contact->celular_2 = $contact->celular_2 ? preg_replace('/\D+/', '', $contact->celular_2) : null;
            $contact->telefone = $contact->telefone ? preg_replace('/\D+/', '', $contact->telefone) : null;
        });
    }

    public function getCelularAttribute()
    {
        return isset($this->attributes['celular'])
            ? FormatValues::formatPhone($this->attributes['celular'])
            : null;
    }

    public function getCelular2Attribute()
    {
        return isset($this->attributes['celular_2'])
            ? FormatValues::formatPhone($this->attributes['celular_2'])
            : null;
    }

    public function getTelefoneAttribute()
    {
        return isset($this->attributes['telefone'])
            ? FormatValues::formatPhone($this->attributes['telefone'])
            : null;
    }

public function user()
{
    return $this->belongsTo(\App\Models\Users\User::class, 'user_id');
}
}
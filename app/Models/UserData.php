<?php

namespace App\Models\Users;

use App\Models\Endereco\Address;
use App\Utils\FormatValues;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class UserData extends Model
{
    use HasFactory;

    protected $table = 'user_data';

    protected $fillable = [
        'user_id',
        'address_id',
        'tipo_pessoa',
        'nome',
        'cpf',
        'data_nascimento',
        'rg',
        'genero',
        'estado_civil',
        'profissao',
        'data_fundacao',
        'cnpj',
        'razao_social',
        'nome_fantasia',
        'tipo_empresa',
        'ie',
        'im',
        'ramo_atividade',
    ];

    protected $appends = ['cadastrado_em'];

    public function getCadastradoEmAttribute()
    {
        $data = Carbon::parse($this->attributes['created_at']);
        return $data->format('d/m/Y H:i');
    }

    public function getCnpjAttribute()
    {
        return isset($this->attributes['cnpj'])
            ? FormatValues::formatCnpj($this->attributes['cnpj'])
            : null;
    }

    public function getCpfAttribute()
    {
        return isset($this->attributes['cpf'])
            ? FormatValues::formatCpf($this->attributes['cpf'])
            : null;
    }

    public function getDataNascimentoAttribute()
    {
        if (!empty($this->attributes['data_nascimento'])) {
            $data = Carbon::parse($this->attributes['data_nascimento']);
            return $data->format('d/m/Y');
        }

        return null;
    }

    public function setCnpjAttribute($value)
    {
        $this->attributes['cnpj'] = $value ? preg_replace('/\D/', '', $value) : null;
    }

    public function setCpfAttribute($value)
    {
        $this->attributes['cpf'] = $value ? preg_replace('/\D/', '', $value) : null;
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

public function user()
{
    return $this->belongsTo(\App\Models\Users\User::class, 'user_id');
}
}
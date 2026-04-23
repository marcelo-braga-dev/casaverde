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

    protected $appends = [
        'cadastrado_em',
    ];

    public function getCadastradoEmAttribute(): ?string
    {
        if (empty($this->attributes['created_at'])) {
            return null;
        }

        return Carbon::parse($this->attributes['created_at'])->format('d/m/Y H:i');
    }

    public function getCnpjAttribute(): ?string
    {
        return isset($this->attributes['cnpj']) && $this->attributes['cnpj']
            ? FormatValues::formatCnpj($this->attributes['cnpj'])
            : null;
    }

    public function getCpfAttribute(): ?string
    {
        return isset($this->attributes['cpf']) && $this->attributes['cpf']
            ? FormatValues::formatCpf($this->attributes['cpf'])
            : null;
    }

    public function getDataNascimentoAttribute(): ?string
    {
        if (!empty($this->attributes['data_nascimento'])) {
            return Carbon::parse($this->attributes['data_nascimento'])->format('d/m/Y');
        }

        return null;
    }

    public function setCnpjAttribute($value): void
    {
        $this->attributes['cnpj'] = $value
            ? preg_replace('/\D/', '', $value)
            : null;
    }

    public function setCpfAttribute($value): void
    {
        $this->attributes['cpf'] = $value
            ? preg_replace('/\D/', '', $value)
            : null;
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
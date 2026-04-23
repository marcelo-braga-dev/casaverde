<?php

namespace App\Models\Produtor;

use App\Utils\FormatValues;
use Illuminate\Database\Eloquent\Model;

class ProdutorPropostasEnderecos extends Model
{
    protected $table = 'produtor_propostas_enderecos';

    protected $fillable = [
        'proposta_id',
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
        'cidade_estado',
        'endereco_completo',
    ];

    public function proposta()
    {
        return $this->belongsTo(ProdutorPropostas::class, 'proposta_id');
    }

    public function getCepAttribute(): ?string
    {
        $cep = $this->attributes['cep'] ?? null;

        return $cep ? FormatValues::formatCep($cep) : null;
    }

    public function getCidadeEstadoAttribute(): string
    {
        $cidade = $this->attributes['cidade'] ?? '-';
        $estado = $this->attributes['estado'] ?? '-';

        return "{$cidade}/{$estado}";
    }

    public function getEnderecoCompletoAttribute(): string
    {
        $rua = $this->attributes['rua'] ?? '';
        $numero = $this->attributes['numero'] ?? '';
        $complemento = $this->attributes['complemento'] ?? null;
        $bairro = $this->attributes['bairro'] ?? null;
        $cidade = $this->attributes['cidade'] ?? '';
        $estado = $this->attributes['estado'] ?? '';
        $cep = $this->attributes['cep'] ?? null;

        return implode(', ', array_filter([
            trim($rua . ($numero !== '' ? ', ' . $numero : '')),
            $complemento,
            $bairro,
            trim($cidade . ($estado !== '' ? ' - ' . $estado : '')),
            $cep ? FormatValues::formatCep($cep) : null,
        ]));
    }

    public function setCepAttribute($value): void
    {
        $this->attributes['cep'] = $value
            ? preg_replace('/\D/', '', $value)
            : null;
    }
}
<?php

namespace App\Models\Proposta;

use App\Models\BaseModel;
use App\Models\Cliente\ClientContract;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProducerProposal extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'producer_profile_id',
        'consultor_user_id',
        'concessionaria_id',
        'address_id',
        'status',
        'issued_at',
        'valid_until',
        'fill_percent',
        'prazo_contrato',
        'media_geracao',
        'potencia_usina',
        'valor_investimento',
        'notes',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'valid_until' => 'date',
        'media_geracao' => 'decimal:2',
        'fill_percent' => 'decimal:2',
        'valor_investimento' => 'decimal:2',
    ];

    protected $appends = ['proposal_code'];

    public function getProposalCodeAttribute($value)
    {
        $id = $this->id;
        return "PC$id";
    }

    public function producerProfile()
    {
        return $this->belongsTo(ProducerProfile::class);
    }

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

    public function address()
    {
        return $this->belongsTo(\App\Models\Endereco\Address::class, 'address_id');
    }

    public function contract()
    {
        return $this->hasOne(ClientContract::class, 'commercial_proposal_id');
    }
}

<?php

namespace App\Models\Proposta;

use App\Models\BaseModel;
use App\Models\Cliente\ClientContract;
use App\Models\Cliente\ClientProfile;
use App\Models\Endereco\Address;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Utils\ConvertValues;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommercialProposal extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'consultor_user_id',
        'concessionaria_id',
        'address_id',
        'status',
        'issued_at',
        'valid_until',
        'media_consumo',
        'discount_percent',
        'prazo_locacao',
        'valor_medio',
        'unidade_consumidora',
        'notes',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'valid_until' => 'date',
        'valor_medio' => 'float',
        'media_consumo' => 'float',
        'discount_percent' => 'float',
    ];

    protected $appends = ['proposal_code'];

    // ------------
    // getters
    // ------------
    public function getProposalCodeAttribute($value)
    {
        $id = $this->id;

        return "PC$id";
    }

    // ------------
    // setters
    public function setValorMedioAttribute($value)
    {
        $this->attributes['valor_medio'] = $value !== null && $value !== ''
            ? ConvertValues::moneyToFloat($value)
            : null;
    }

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
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
        return $this->belongsTo(Address::class, 'address_id');
    }

    public function contract()
    {
        return $this->hasOne(ClientContract::class, 'commercial_proposal_id');
    }
}

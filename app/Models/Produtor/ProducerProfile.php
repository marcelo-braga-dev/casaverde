<?php

namespace App\Models\Produtor;

use App\Models\Proposta\ProducerProposal;
use App\Models\Users\User;
use App\Models\Users\UserContact;
use App\Models\Usina\UsinaSolar;
use App\Utils\FormatValues;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProducerProfile extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'status',
        'tipo_pessoa',
        'cpf',
        'cnpj',
        'nome',
        'razao_social',
        'nome_fantasia',
        'contacts_id',
        'consultor_user_id',
        'platform_user_id',
        'is_active_producer',
        'activated_at',
    ];

    protected $appends = ['producer_code'];

    protected $with = ['contacts'];

    protected static function booted(): void
    {
        static::deleting(function (ProducerProfile $producerProfile) {
            $producerProfile->newModelQuery()
                ->where('id', $producerProfile->id)
                ->update(['cpf' => null, 'cnpj' => null]);
        });
    }

    // ── Getters ───────────────────────────────────────────────────────────

    public function getProducerCodeAttribute(): string
    {
        return "P{$this->id}";
    }

    public function getCpfAttribute(): ?string
    {
        return isset($this->attributes['cpf']) && $this->attributes['cpf']
            ? FormatValues::formatCpf($this->attributes['cpf'])
            : null;
    }

    public function getCnpjAttribute(): ?string
    {
        return isset($this->attributes['cnpj']) && $this->attributes['cnpj']
            ? FormatValues::formatCnpj($this->attributes['cnpj'])
            : null;
    }

    // ── Relationships ─────────────────────────────────────────────────────

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function platformUser()
    {
        return $this->belongsTo(User::class, 'platform_user_id');
    }

    public function contacts()
    {
        return $this->belongsTo(UserContact::class, 'contacts_id');
    }

    public function proposals()
    {
        return $this->hasMany(ProducerProposal::class, 'producer_profile_id');
    }

    public function usinas()
    {
        return $this->hasMany(UsinaSolar::class, 'producer_profile_id');
    }

    /** Todas as regras de taxa de administração */
    public function feeRules()
    {
        return $this->hasMany(ProducerAdministrationFeeRules::class, 'producer_profile_id');
    }

    /** Regra de taxa de administração atualmente ativa */
    public function activeFeeRule()
    {
        return $this->hasOne(ProducerAdministrationFeeRules::class, 'producer_profile_id')
            ->where('is_active', true);
    }
}

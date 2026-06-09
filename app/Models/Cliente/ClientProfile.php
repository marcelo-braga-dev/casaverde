<?php

namespace App\Models\Cliente;

use App\Models\Alert\OperationalAlert;
use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use App\Models\Users\UserContact;
use App\Utils\FormatValues;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Importacao\ClientEmailImportSetting;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientProfile extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'client_code',
        'tipo_pessoa',
        'cpf',
        'cnpj',
        'nome',
        'razao_social',
        'nome_fantasia',
        'contacts_id',
        'consultor_user_id',
        'platform_user_id',
        'status',
        'is_active_client',
        'activated_at',
    ];

    protected $casts = [
        'is_active_client' => 'boolean',
        'activated_at' => 'datetime',
    ];

    protected $appends = [
        'documento',
        'display_name',
    ];

    protected $with = ['contacts'];

    protected static function booted(): void
    {
        static::creating(function (ClientProfile $clientProfile) {
            if (!$clientProfile->client_code) {
                $clientProfile->client_code = static::generateClientCode();
            }

            $clientProfile->cpf = static::normalizeDocument($clientProfile->cpf);
            $clientProfile->cnpj = static::normalizeDocument($clientProfile->cnpj);
        });

        static::updating(function (ClientProfile $clientProfile) {
            $clientProfile->cpf = static::normalizeDocument($clientProfile->cpf);
            $clientProfile->cnpj = static::normalizeDocument($clientProfile->cnpj);
        });
    }

    public static function normalizeDocument(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        return preg_replace('/\D+/', '', $value);
    }

    public static function generateClientCode(): string
    {
        do {
            $code = 'C' . str_pad((string) random_int(1, 999), 3, '0', STR_PAD_LEFT);
        } while (static::query()->where('client_code', $code)->exists());

        return $code;
    }

    //////////////
    // getters
    //////////////
    public function getCpfAttribute()
    {
        return isset($this->attributes['cpf']) && $this->attributes['cpf']
            ? FormatValues::formatCpf($this->attributes['cpf'])
            : null;
    }

    public function getCnpjAttribute()
    {
        return isset($this->attributes['cnpj']) && $this->attributes['cnpj']
            ? FormatValues::formatCnpj($this->attributes['cnpj'])
            : null;
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->tipo_pessoa === 'pj'
            ? ($this->razao_social ?: ($this->nome_fantasia ?: '-'))
            : ($this->nome ?: '-');
    }

    //////////////
    // relations
    //////////////
    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function platformUser()
    {
        return $this->belongsTo(User::class, 'platform_user_id');
    }

    public function proposals()
    {
        return $this->hasMany(CommercialProposal::class, 'client_profile_id');
    }

    public function accessInvites()
    {
        return $this->hasMany(ClientAccessInvite::class, 'client_profile_id');
    }

    public function consumerUnits()
    {
        return $this->hasMany(ConsumerUnit::class, 'client_profile_id');
    }

    public function activeConsumerUnits()
    {
        return $this->hasMany(ConsumerUnit::class, 'client_profile_id')
            ->where('status', 'active');
    }

    public function usinaLinks()
    {
        return $this->hasMany(ClientUsinaLink::class, 'client_profile_id');
    }

    public function activeUsinaLink()
    {
        return $this->hasOne(ClientUsinaLink::class, 'client_profile_id')
            ->where('is_active', true);
    }

    public function discountRules()
    {
        return $this->hasMany(ClientDiscountRule::class, 'client_profile_id');
    }

    public function activeDiscountRule()
    {
        return $this->hasOne(ClientDiscountRule::class, 'client_profile_id')
            ->where('is_active', true);
    }

    public function getDocumentoAttribute(): ?string
    {
        return $this->cpf ?: $this->cnpj;
    }

    public function isProspect(): bool
    {
        return $this->status === 'prospect' || $this->status === 'proposta_emitida';
    }

    public function scopeSomenteDoConsultor($query, ?int $consultorId)
    {
        if (!$consultorId) {
            return $query;
        }

        return $query->where('consultor_user_id', $consultorId);
    }

    public function concessionaireBills()
    {
        return $this->hasMany(\App\Models\Fatura\ConcessionaireBill::class, 'client_profile_id');
    }

    public function emailImportSetting()
    {
        return $this->hasOne(ClientEmailImportSetting::class, 'client_profile_id');
    }

    public function contracts()
    {
        return $this->hasMany(\App\Models\Cliente\ClientContract::class, 'client_profile_id');
    }

    public function operationalAlerts()
    {
        return $this->hasMany(OperationalAlert::class, 'client_profile_id');
    }

    public function openOperationalAlerts()
    {
        return $this->hasMany(OperationalAlert::class, 'client_profile_id')
            ->whereIn('status', ['open', 'in_progress']);
    }

    public function contacts()
    {
        return $this->belongsTo(UserContact::class, 'contacts_id');
    }
}

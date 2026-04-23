<?php

namespace App\Models\Cliente;

use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_code',
        'tipo_pessoa',
        'cpf',
        'cnpj',
        'nome',
        'razao_social',
        'nome_fantasia',
        'cidade',
        'email',
        'telefone',
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

    protected static function booted(): void
    {
        static::creating(function (ClientProfile $clientProfile) {
            if (!$clientProfile->client_code) {
                $clientProfile->client_code = static::generateClientCode();
            }

            $clientProfile->cpf = static::normalizeDocument($clientProfile->cpf);
            $clientProfile->cnpj = static::normalizeDocument($clientProfile->cnpj);
            $clientProfile->telefone = static::normalizeDocument($clientProfile->telefone);
            $clientProfile->email = $clientProfile->email ? mb_strtolower(trim($clientProfile->email)) : null;
        });

        static::updating(function (ClientProfile $clientProfile) {
            $clientProfile->cpf = static::normalizeDocument($clientProfile->cpf);
            $clientProfile->cnpj = static::normalizeDocument($clientProfile->cnpj);
            $clientProfile->telefone = static::normalizeDocument($clientProfile->telefone);
            $clientProfile->email = $clientProfile->email ? mb_strtolower(trim($clientProfile->email)) : null;
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
            $code = 'CV' . str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (static::query()->where('client_code', $code)->exists());

        return $code;
    }

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

    public function getDisplayNameAttribute(): string
    {
        return $this->tipo_pessoa === 'pj'
            ? ($this->razao_social ?: ($this->nome_fantasia ?: '-'))
            : ($this->nome ?: '-');
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
}
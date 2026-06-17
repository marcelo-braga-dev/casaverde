<?php

namespace App\Models\Cliente;

use App\Models\Endereco\Address;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\Concessionaria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsumerUnit extends Model
{
    use HasFactory;

    protected $table = 'consumer_units';

    protected $fillable = [
        'client_profile_id',
        'uc_code',
        'label',
        'consumo_previsto_kwh_mes',
        'concessionaria_id',
        'address_id',
        'status',
        'notes',
    ];

    protected $casts = [
        'consumo_previsto_kwh_mes' => 'decimal:2',
    ];

    protected $appends = ['display_label'];

    protected static function booted(): void
    {
        static::saving(function (ConsumerUnit $consumerUnit) {
            $consumerUnit->uc_code = static::normalizeCode($consumerUnit->uc_code);
        });
    }

    public static function normalizeCode(?string $value): ?string
    {
        if (! $value) {
            return $value;
        }

        $digits = preg_replace('/\D+/', '', $value);

        return $digits !== '' ? $digits : $value;
    }

    // ── Relationships ─────────────────────────────────────────────────────

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    public function usinaLink()
    {
        return $this->hasOne(ClientUsinaLink::class, 'consumer_unit_id');
    }

    public function usinaLinks()
    {
        return $this->hasMany(ClientUsinaLink::class, 'consumer_unit_id');
    }

    public function activeUsinaLink()
    {
        return $this->hasOne(ClientUsinaLink::class, 'consumer_unit_id')
            ->where('is_active', true);
    }

    public function activeUsinaLinks()
    {
        return $this->hasMany(ClientUsinaLink::class, 'consumer_unit_id')
            ->active();
    }

    public function contracts()
    {
        return $this->hasMany(ClientContract::class, 'consumer_unit_id');
    }

    public function bills()
    {
        return $this->hasMany(ConcessionaireBill::class, 'consumer_unit_id');
    }

    // ── Accessors ─────────────────────────────────────────────────────────

    public function getDisplayLabelAttribute(): string
    {
        return $this->label
            ? "{$this->uc_code} — {$this->label}"
            : $this->uc_code;
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}

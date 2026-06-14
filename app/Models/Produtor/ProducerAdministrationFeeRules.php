<?php

namespace App\Models\Produtor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProducerAdministrationFeeRules extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_profile_id',
        'fee_percent',
        'starts_on',
        'ends_on',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'fee_percent' => 'float',
        'starts_on' => 'datetime',
        'ends_on' => 'datetime',
        'is_active' => 'boolean',
    ];

    // =========================
    // RELATIONSHIPS
    // =========================

    public function producerProfile()
    {
        return $this->belongsTo(ProducerProfile::class);
    }

    // =========================
    // SCOPES
    // =========================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // =========================
    // HELPERS
    // =========================

    public function isCurrentlyActive(): bool
    {
        if (! $this->starts_on) {
            return false;
        }

        $now = now();

        return $this->starts_on <= $now
            && (
                is_null($this->ends_on)
                || $this->ends_on >= $now
            );
    }
}

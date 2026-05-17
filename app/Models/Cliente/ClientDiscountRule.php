<?php

namespace App\Models\Cliente;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientDiscountRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'discount_percent',
        'starts_on',
        'ends_on',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'discount_percent' => 'float',
        'starts_on' => 'datetime',
        'ends_on' => 'datetime',
        'is_active' => 'boolean',
    ];

    // =========================
    // RELATIONSHIPS
    // =========================

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
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
        if (!$this->starts_on) {
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

<?php

namespace App\Models\Produtor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ProducerAccessInvite extends Model
{
    use HasFactory;

    protected $fillable = [
        'producer_profile_id',
        'email',
        'token',
        'expires_at',
        'used_at',
        'created_by_user_id',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $invite) {
            if (!$invite->token) {
                $invite->token = Str::uuid()->toString();
            }
        });
    }

    public function producerProfile()
    {
        return $this->belongsTo(ProducerProfile::class, 'producer_profile_id');
    }

    public function canBeUsed(): bool
    {
        if ($this->used_at) {
            return false;
        }

        if (!$this->expires_at) {
            return true;
        }

        return Carbon::now()->lte($this->expires_at);
    }

    public function markAsUsed(): void
    {
        $this->forceFill([
            'used_at' => now(),
        ])->save();
    }
}
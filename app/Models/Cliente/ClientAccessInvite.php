<?php

namespace App\Models\Cliente;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ClientAccessInvite extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'created_by_user_id',
        'email',
        'token',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (ClientAccessInvite $invite) {
            if (!$invite->token) {
                $invite->token = Str::random(80);
            }

            if ($invite->email) {
                $invite->email = mb_strtolower(trim($invite->email));
            }
        });

        static::updating(function (ClientAccessInvite $invite) {
            if ($invite->email) {
                $invite->email = mb_strtolower(trim($invite->email));
            }
        });
    }

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function isExpired(): bool
    {
        return now()->greaterThan($this->expires_at);
    }

    public function isUsed(): bool
    {
        return !is_null($this->used_at);
    }

    public function canBeUsed(): bool
    {
        return !$this->isUsed() && !$this->isExpired();
    }
}
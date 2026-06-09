<?php

namespace App\Models\Acesso;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;

class UserAccessLog extends Model
{
    public $timestamps = false;

    protected $table = 'user_access_logs';

    protected $fillable = [
        'user_id',
        'event',
        'ip_address',
        'user_agent',
        'country',
        'city',
        'performed_by_user_id',
        'notes',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function performedBy()
    {
        return $this->belongsTo(User::class, 'performed_by_user_id');
    }

    // ── Labels ────────────────────────────────────────────────────────────

    public function getEventLabelAttribute(): string
    {
        return match ($this->event) {
            'login'            => 'Login',
            'logout'           => 'Logout',
            'blocked'          => 'Acesso Bloqueado',
            'unblocked'        => 'Acesso Liberado',
            'password_changed' => 'Senha Alterada',
            'access_created'   => 'Acesso Criado',
            'access_updated'   => 'Acesso Atualizado',
            default            => $this->event,
        };
    }

    public function getEventColorAttribute(): string
    {
        return match ($this->event) {
            'login'            => 'success',
            'logout'           => 'info',
            'blocked'          => 'error',
            'unblocked'        => 'success',
            'password_changed' => 'warning',
            'access_created'   => 'primary',
            'access_updated'   => 'secondary',
            default            => 'default',
        };
    }

    public function getEventIconAttribute(): string
    {
        return match ($this->event) {
            'login'            => 'login',
            'logout'           => 'logout',
            'blocked'          => 'block',
            'unblocked'        => 'check',
            'password_changed' => 'key',
            'access_created'   => 'user-plus',
            'access_updated'   => 'edit',
            default            => 'info',
        };
    }

    // ── Static helpers ────────────────────────────────────────────────────

    public static function record(
        int $userId,
        string $event,
        array $extra = [],
    ): self {
        return static::create(array_merge([
            'user_id'    => $userId,
            'event'      => $event,
            'created_at' => now(),
        ], $extra));
    }
}

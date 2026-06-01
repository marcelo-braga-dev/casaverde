<?php

namespace App\Models\Support;

use App\Enums\Support\SupportTicketPriority;
use App\Enums\Support\SupportTicketStatus;
use App\Models\Cliente\ClientProfile;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupportTicket extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'ticket_code',
        'title',
        'description',
        'category',
        'status',
        'priority',
        'opened_by_user_id',
        'client_profile_id',
        'producer_profile_id',
        'consultor_user_id',
        'assigned_to_user_id',
        'first_response_at',
        'resolved_at',
        'closed_at',
        'rating',
        'rating_comment',
    ];

    protected $casts = [
        'status'            => SupportTicketStatus::class,
        'priority'          => SupportTicketPriority::class,
        'first_response_at' => 'datetime',
        'resolved_at'       => 'datetime',
        'closed_at'         => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (SupportTicket $ticket) {
            if (!$ticket->ticket_code) {
                $ticket->ticket_code = static::generateCode();
            }
        });
    }

    public static function generateCode(): string
    {
        do {
            $code = 'CHM-' . strtoupper(substr(md5(uniqid()), 0, 6));
        } while (static::query()->where('ticket_code', $code)->exists());

        return $code;
    }

    // ── Relationships ─────────────────────────────────────────────────────

    public function openedBy()
    {
        return $this->belongsTo(User::class, 'opened_by_user_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function producerProfile()
    {
        return $this->belongsTo(ProducerProfile::class, 'producer_profile_id');
    }

    public function messages()
    {
        return $this->hasMany(SupportTicketMessage::class, 'ticket_id')->orderBy('created_at');
    }

    public function lastMessage()
    {
        return $this->hasOne(SupportTicketMessage::class, 'ticket_id')->latestOfMany();
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    public function isOpen(): bool
    {
        return $this->status->isOpen();
    }

    public function isClosed(): bool
    {
        return $this->status->isClosed();
    }

    public function canTransitionTo(SupportTicketStatus $newStatus): bool
    {
        return in_array($newStatus, $this->status->allowedTransitions());
    }

    public function getRequesterNameAttribute(): string
    {
        return $this->clientProfile?->display_name
            ?? $this->producerProfile?->nome
            ?? $this->openedBy?->name
            ?? '—';
    }
}

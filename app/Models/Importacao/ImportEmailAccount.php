<?php

namespace App\Models\Importacao;

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;

class ImportEmailAccount extends Model
{
    protected $table = 'import_email_accounts';

    protected $fillable = [
        'email',
        'label',
        'imap_password',
        'sender_filter',
        'subject_filter',
        'is_active',
        'notes',
        'client_profile_id',
        'assigned_at',
        'created_by_user_id',
    ];

    protected $casts = [
        'imap_password' => 'encrypted',
        'is_active'     => 'boolean',
        'assigned_at'   => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function importSetting()
    {
        return $this->hasOne(ClientEmailImportSetting::class, 'import_email_account_id');
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    public function isAvailable(): bool
    {
        return is_null($this->client_profile_id) && $this->is_active;
    }

    public function getStatusLabelAttribute(): string
    {
        if (!$this->is_active) return 'Inativo';
        if ($this->client_profile_id) return 'Vinculado';
        return 'Disponível';
    }

    public function getStatusColorAttribute(): string
    {
        if (!$this->is_active) return 'default';
        if ($this->client_profile_id) return 'warning';
        return 'success';
    }

    // ── Scopes ────────────────────────────────────────────────────────────

    public function scopeAvailable($query)
    {
        return $query->whereNull('client_profile_id')->where('is_active', true);
    }

    public function scopeAssigned($query)
    {
        return $query->whereNotNull('client_profile_id');
    }
}

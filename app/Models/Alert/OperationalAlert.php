<?php

namespace App\Models\Alert;

use App\Enums\Alert\OperationalAlertSeverity;
use App\Enums\Alert\OperationalAlertStatus;
use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Model;

class OperationalAlert extends Model
{
    protected $fillable = [
        'module',
        'type',
        'severity',
        'title',
        'message',
        'alertable_type',
        'alertable_id',
        'usina_id',
        'client_profile_id',
        'assigned_to_user_id',
        'reference_year',
        'reference_month',
        'status',
        'payload',
        'detected_at',
        'resolved_at',
        'resolved_by_user_id',
        'resolution_notes',
    ];

    protected $casts = [
        'severity' => OperationalAlertSeverity::class,
        'status' => OperationalAlertStatus::class,
        'payload' => 'array',
        'detected_at' => 'datetime',
        'resolved_at' => 'datetime',
        'reference_year' => 'integer',
        'reference_month' => 'integer',
    ];

    public function alertable()
    {
        return $this->morphTo();
    }

    public function usina()
    {
        return $this->belongsTo(UsinaSolar::class, 'usina_id');
    }

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by_user_id');
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', [
            OperationalAlertStatus::Open->value,
            OperationalAlertStatus::InProgress->value,
        ]);
    }

    public function scopeForReference($query, int $year, int $month)
    {
        return $query
            ->where('reference_year', $year)
            ->where('reference_month', $month);
    }
}

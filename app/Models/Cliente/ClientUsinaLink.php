<?php

namespace App\Models\Cliente;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Models\Users\User;
use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientUsinaLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'consumer_unit_id',
        'usina_id',
        'started_at',
        'ended_at',
        'is_active',
        'notes',
        'allocated_energy_kwh',
        'discount_percentage',
        'status',
        'created_by_user_id',
        'updated_by_user_id',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_active' => 'boolean',
        'allocated_energy_kwh' => 'decimal:3',
        'discount_percentage' => 'decimal:2',
        'status' => ClientUsinaLinkStatus::class,
    ];

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
    }

    public function consumerUnit()
    {
        return $this->belongsTo(ConsumerUnit::class, 'consumer_unit_id');
    }

    public function usina()
    {
        return $this->belongsTo(UsinaSolar::class, 'usina_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('status', ClientUsinaLinkStatus::Active->value);
    }
}

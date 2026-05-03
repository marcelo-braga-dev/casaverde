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
        'discount_percent' => 'decimal:2',
        'starts_on' => 'datetime',
        'ends_on' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
    }
}

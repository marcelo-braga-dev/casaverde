<?php

namespace App\Models\Cobranca;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerChargeAdjustment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_charge_id',
        'created_by_user_id',
        'type',
        'amount',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function charge()
    {
        return $this->belongsTo(CustomerCharge::class, 'customer_charge_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

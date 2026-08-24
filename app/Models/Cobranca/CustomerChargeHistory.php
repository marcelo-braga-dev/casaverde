<?php

namespace App\Models\Cobranca;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerChargeHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_charge_id',
        'user_id',
        'action',
        'description',
    ];

    public function charge()
    {
        return $this->belongsTo(CustomerCharge::class, 'customer_charge_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function log(CustomerCharge $charge, string $action, string $description): self
    {
        return static::create([
            'customer_charge_id' => $charge->id,
            'user_id' => auth()->id(),
            'action' => $action,
            'description' => $description,
        ]);
    }
}

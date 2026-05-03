<?php

namespace App\Models\Pagamento;

use App\Models\Cobranca\CustomerCharge;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_slip_id',
        'customer_charge_id',
        'provider',
        'provider_transaction_id',
        'amount',
        'paid_at',
        'status',
        'raw_payload',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime:d/m/Y H:i',
        'raw_payload' => 'array',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    public function slip()
    {
        return $this->belongsTo(PaymentSlip::class, 'payment_slip_id');
    }

    public function charge()
    {
        return $this->belongsTo(CustomerCharge::class, 'customer_charge_id');
    }
}

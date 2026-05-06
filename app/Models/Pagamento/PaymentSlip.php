<?php

namespace App\Models\Pagamento;

use App\Models\Cobranca\CustomerCharge;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentSlip extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_charge_id',
        'payment_provider_account_id',
        'provider',
        'provider_payment_id',
        'provider_status',
        'payment_method',
        'status',
        'amount',
        'due_date',
        'barcode',
        'digitable_line',
        'pix_qr_code',
        'pix_copy_paste',
        'checkout_url',
        'pdf_url',
        'request_payload',
        'response_payload',
        'generated_at',
        'paid_at',
        'cancelled_at',
        'error_message',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date:d/m/Y',
        'request_payload' => 'array',
        'response_payload' => 'array',
        'generated_at' => 'datetime:d/m/Y H:i',
        'paid_at' => 'datetime:d/m/Y H:i',
        'cancelled_at' => 'datetime:d/m/Y H:i',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    public function charge()
    {
        return $this->belongsTo(CustomerCharge::class, 'customer_charge_id');
    }

    public function providerAccount()
    {
        return $this->belongsTo(PaymentProviderAccount::class, 'payment_provider_account_id');
    }

    public function transactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }
}

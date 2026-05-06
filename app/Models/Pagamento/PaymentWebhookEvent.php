<?php

namespace App\Models\Pagamento;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentWebhookEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider',
        'event_id',
        'event_type',
        'payment_slip_id',
        'provider_payment_id',
        'headers',
        'payload',
        'status',
        'attempts',
        'last_attempt_at',
        'error_message',
        'processed_at',
    ];

    protected $casts = [
        'headers' => 'array',
        'payload' => 'array',
        'attempts' => 'integer',
        'last_attempt_at' => 'datetime:d/m/Y H:i',
        'processed_at' => 'datetime:d/m/Y H:i',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    public function paymentSlip()
    {
        return $this->belongsTo(PaymentSlip::class, 'payment_slip_id');
    }

    public function isProcessed(): bool
    {
        return $this->status === 'processed';
    }

    public function canBeReprocessed(): bool
    {
        return in_array($this->status, ['failed', 'ignored', 'received'], true);
    }
}

<?php

namespace App\Models\Pagamento;

use App\Models\Cobranca\CustomerCharge;
use App\Support\BoletoDueDate;
use Carbon\CarbonImmutable;
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

    protected $appends = [
        'effective_due_date',
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

    // O código de barras é a fonte da verdade: slips emitidos antes de o vencimento ser
    // enviado ao Mercado Pago gravaram em due_date a data da cobrança, não a do banco.
    public function effectiveDueDate(): ?CarbonImmutable
    {
        return BoletoDueDate::fromBarcode($this->barcode)
            ?? ($this->due_date ? CarbonImmutable::parse($this->getRawOriginal('due_date')) : null);
    }

    // Espelha isSlipPayable() de resources/js/Utils/paymentSlip.js: ativo e dentro da data
    // que o banco aceita (a rotina diária pode ainda não ter marcado como expirado).
    public function isPayable(): bool
    {
        if (! in_array($this->status, ['pending', 'generated'], true)) {
            return false;
        }

        $due = $this->effectiveDueDate();

        return ! $due || $due->gte(today());
    }

    public function getEffectiveDueDateAttribute(): ?string
    {
        return $this->effectiveDueDate()?->toDateString();
    }

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

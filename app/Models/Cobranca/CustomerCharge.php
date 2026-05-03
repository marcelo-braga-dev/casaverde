<?php

namespace App\Models\Cobranca;

use App\Models\BaseModel;
use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerCharge extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'platform_user_id',
        'usina_id',
        'concessionaria_id',
        'concessionaire_bill_id',
        'reference_month',
        'reference_year',
        'reference_label',
        'due_date',
        'original_amount',
        'discount_percent',
        'discount_amount',
        'manual_discount_amount',
        'manual_addition_amount',
        'final_amount',
        'status',
        'generated_by_user_id',
        'approved_by_user_id',
        'approved_at',
        'paid_at',
        'cancelled_at',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'date:d/m/Y',
        'original_amount' => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'manual_discount_amount' => 'decimal:2',
        'manual_addition_amount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
    }

    public function platformUser()
    {
        return $this->belongsTo(User::class, 'platform_user_id');
    }

    public function usina()
    {
        return $this->belongsTo(UsinaSolar::class, 'usina_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

    public function bill()
    {
        return $this->belongsTo(ConcessionaireBill::class, 'concessionaire_bill_id');
    }

    public function adjustments()
    {
        return $this->hasMany(CustomerChargeAdjustment::class);
    }

    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by_user_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isOpen(): bool
    {
        return in_array($this->status, ['open', 'waiting_payment', 'overdue'], true);
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function paymentSlips()
    {
        return $this->hasMany(\App\Models\Pagamento\PaymentSlip::class, 'customer_charge_id');
    }
}

<?php

namespace App\Models\Cobranca;

use App\Enums\Cobranca\CustomerChargeStatus;
use App\Models\Alert\OperationalAlert;
use App\Models\BaseModel;
use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

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
        'reminder_sent_at',
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
        'reminder_sent_at' => 'datetime',
    ];

    // Consultor só enxerga cobranças de clientes da própria carteira (mesma regra da
    // CustomerChargePolicy::view).
    public function scopeSomenteMinhasCobrancas($query)
    {
        $user = Auth::user();

        if (! $user) {
            return $query->whereRaw('1 = 0');
        }

        if ($user->isAdmin()) {
            return $query;
        }

        if ($user->isConsultor()) {
            return $query->whereHas('clientProfile', fn ($q) => $q->where('consultor_user_id', $user->id));
        }

        return $query->whereRaw('1 = 0');
    }

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
        return $this->status === CustomerChargeStatus::DRAFT->value;
    }

    public function isPaid(): bool
    {
        return $this->status === CustomerChargeStatus::PAID->value;
    }

    public function isCancelled(): bool
    {
        return $this->status === CustomerChargeStatus::CANCELLED->value;
    }

    public function isFinal(): bool
    {
        return in_array($this->status, CustomerChargeStatus::finalValues(), true);
    }

    public function canReceivePayment(): bool
    {
        return in_array($this->status, CustomerChargeStatus::payableValues(), true);
    }

    public function paymentSlips()
    {
        return $this->hasMany(PaymentSlip::class, 'customer_charge_id');
    }

    public function operationalAlerts()
    {
        return $this->morphMany(OperationalAlert::class, 'alertable');
    }

    // Em aberto, sem boleto pagável e com um boleto que venceu: o cliente não tem como
    // pagar até alguém emitir um novo boleto e enviá-lo.
    public function scopeAguardandoNovoBoleto($query)
    {
        return $query
            ->whereIn('status', CustomerChargeStatus::payableValues())
            ->whereDoesntHave('paymentSlips', fn ($q) => $q->active())
            ->whereHas('paymentSlips', fn ($q) => $q->where('status', 'expired'));
    }

    public function isAguardandoNovoBoleto(): bool
    {
        return static::query()->whereKey($this->getKey())->aguardandoNovoBoleto()->exists();
    }

    public function histories()
    {
        return $this->hasMany(CustomerChargeHistory::class, 'customer_charge_id')->latest();
    }

    public function canBeCancelled(): bool
    {
        return ! $this->isFinal();
    }

    public function canBeMarkedAsPaid(): bool
    {
        return ! $this->isFinal();
    }

    public function canBeMarkedAsOverdue(): bool
    {
        return $this->status === CustomerChargeStatus::OPEN->value;
    }

    public function canChangeDueDate(): bool
    {
        return ! $this->isFinal();
    }

    public function hasActivePayment(): bool
    {
        return $this->paymentSlips()->active()->exists();
    }

    /**
     * O boleto/Pix ativo deixou de ser pagável (cancelado, vencido, recusado, estornado):
     * a cobrança volta para "em aberto" ou "vencida", conforme a data, para aceitar um novo.
     * Antes cada service fazia isso do seu jeito; alguns punham "open" mesmo vencida.
     */
    public function reopenAfterPaymentEnded(): bool
    {
        if ($this->isFinal()) {
            return false;
        }

        $status = $this->due_date && $this->due_date->lt(today())
            ? CustomerChargeStatus::OVERDUE->value
            : CustomerChargeStatus::OPEN->value;

        if ($this->status !== $status) {
            $this->update(['status' => $status]);
        }

        return true;
    }
}

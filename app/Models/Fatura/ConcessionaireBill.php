<?php

namespace App\Models\Fatura;

use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConcessionaireBill extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'consumer_unit_id',
        'usina_id',
        'created_by_user_id',
        'reviewed_by_user_id',
        'import_source',
        'concessionaria_id',
        'reference_month',
        'reference_year',
        'reference_label',
        'unidade_consumidora',
        'numero_instalacao',
        'vencimento',
        'valor_total',
        'consumo_kwh',
        'injected_energy_kwh',
        'injected_energy_amount',
        'injected_consumption_kwh',
        'injected_consumption_amount',
        'injected_consumption_discount_percent',
        'pdf_disk',
        'pdf_path',
        'pdf_original_name',
        'pdf_url',
        'raw_text',
        'extracted_payload',
        'import_status',
        'review_status',
        'parser_status',
        'parser_error',
        'notes',
        'reviewed_at',
        'nome',
        'review_notes',
        'created_by_id',
        'reviewed_by_id',
    ];

    protected $casts = [
        'vencimento' => 'date',
        'valor_total' => 'decimal:2',
        'consumo_kwh' => 'decimal:2',
        'injected_energy_kwh' => 'decimal:2',
        'injected_energy_amount' => 'decimal:2',
        'injected_consumption_kwh' => 'decimal:2',
        'injected_consumption_amount' => 'decimal:2',
        'injected_consumption_discount_percent' => 'decimal:2',
        'extracted_payload' => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = [
        'pdf_link',
        'has_open_issues',
        'injected_consumption_discount_amount',
    ];

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

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

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    public function issues()
    {
        return $this->hasMany(ConcessionaireBillIssue::class, 'concessionaire_bill_id');
    }

    public function openIssues()
    {
        return $this->hasMany(ConcessionaireBillIssue::class, 'concessionaire_bill_id')
            ->where('is_resolved', false);
    }

    public function charges()
    {
        return $this->hasMany(CustomerCharge::class, 'concessionaire_bill_id');
    }

    public function customerCharge()
    {
        return $this->hasOne(CustomerCharge::class, 'concessionaire_bill_id');
    }

    /**
     * Regra de desconto ativa do cliente, ligada pelo client_profile_id
     * compartilhado entre concessionaire_bills e client_discount_rules.
     */
    public function activeClientDiscountRule()
    {
        return $this->belongsTo(ClientDiscountRule::class, 'client_profile_id', 'client_profile_id')
            ->where('is_active', true);
    }

    public function getPdfLinkAttribute(): ?string
    {
        return $this->pdf_url;
    }

    public function getHasOpenIssuesAttribute(): bool
    {
        return $this->openIssues()->exists();
    }

    /**
     * "Consumo Injetada RS" x margem de desconto usada no cálculo (snapshot
     * gravado em injected_consumption_discount_percent no momento do parse).
     */
    public function getInjectedConsumptionDiscountAmountAttribute(): ?float
    {
        if (is_null($this->injected_consumption_amount) || is_null($this->injected_consumption_discount_percent)) {
            return null;
        }

        return round(
            (float) $this->injected_consumption_amount * ((float) $this->injected_consumption_discount_percent / 100),
            2
        );
    }
}

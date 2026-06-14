<?php

namespace App\Models\Fatura;

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
        'extracted_payload' => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = [
        'pdf_link',
        'has_open_issues',
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

    public function getPdfLinkAttribute(): ?string
    {
        return $this->pdf_url;
    }

    public function getHasOpenIssuesAttribute(): bool
    {
        return $this->openIssues()->exists();
    }
}

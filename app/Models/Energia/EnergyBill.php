<?php

namespace App\Models\Energia;

use App\Models\Importacao\ImportedEnergyBillEmail;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnergyBill extends Model
{
    protected $fillable = [
        'user_id',
        'imported_email_id',
        'concessionaria',
        'unidade_consumidora',
        'referencia',
        'vencimento',
        'total_pagar',
        'consumo_kwh',
        'pdf_disk',
        'pdf_path',
        'pdf_original_name',
        'pdf_url',
        'raw_text',
        'parser_payload',
    ];

    protected $casts = [
        'vencimento' => 'date',
        'total_pagar' => 'decimal:2',
        'consumo_kwh' => 'decimal:2',
        'parser_payload' => 'array',
    ];

    protected $appends = [
        'pdf_link',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function importedEmail(): BelongsTo
    {
        return $this->belongsTo(ImportedEnergyBillEmail::class, 'imported_email_id');
    }

    public function getPdfLinkAttribute(): ?string
    {
        return $this->pdf_url;
    }
}
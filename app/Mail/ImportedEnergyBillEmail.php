<?php

namespace App\Models\Importacao;

use App\Models\Energia\EnergyBill;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ImportedEnergyBillEmail extends Model
{
    protected $table = 'imported_energy_bill_emails';

    protected $fillable = [
        'user_id',
        'client_email_import_setting_id',
        'message_uid',
        'message_id',
        'from_email',
        'subject',
        'received_at',
        'attachment_name',
        'attachment_hash',
        'status',
        'error_message',
        'processed_at',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function setting(): BelongsTo
    {
        return $this->belongsTo(ClientEmailImportSetting::class, 'client_email_import_setting_id');
    }

    public function energyBill(): HasOne
    {
        return $this->hasOne(EnergyBill::class, 'imported_email_id');
    }
}
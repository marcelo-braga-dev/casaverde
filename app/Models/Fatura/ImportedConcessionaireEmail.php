<?php

namespace App\Models\Fatura;

use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ClientEmailImportSetting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportedConcessionaireEmail extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'client_email_import_setting_id',
        'concessionaire_bill_id',
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

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
    }

    public function setting()
    {
        return $this->belongsTo(ClientEmailImportSetting::class, 'client_email_import_setting_id');
    }

    public function bill()
    {
        return $this->belongsTo(ConcessionaireBill::class, 'concessionaire_bill_id');
    }
}
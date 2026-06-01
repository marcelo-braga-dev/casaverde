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
        'import_run_id',
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
        'step_failed',
        'duration_ms',
        'retry_count',
        'processed_at',
    ];

    protected $casts = [
        'received_at'  => 'datetime',
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

    public function importRun()
    {
        return $this->belongsTo(ImportRun::class, 'import_run_id');
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'processing' => 'Processando',
            'success'    => 'Sucesso',
            'skipped'    => 'Ignorado',
            'failed'     => 'Falhou',
            default      => $this->status ?? '—',
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'success'    => 'success',
            'skipped'    => 'info',
            'processing' => 'warning',
            'failed'     => 'error',
            default      => 'default',
        };
    }

    public function getStepFailedLabelAttribute(): ?string
    {
        return match ($this->step_failed) {
            'fetch'    => 'Busca IMAP',
            'unlock'   => 'Desbloqueio PDF',
            'extract'  => 'Extração de texto',
            'parse'    => 'Leitura dos dados',
            'store'    => 'Armazenamento',
            'validate' => 'Validação',
            default    => $this->step_failed,
        };
    }
}

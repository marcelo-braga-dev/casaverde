<?php

namespace App\Models\Importacao;

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Services\Config\SystemSettingService;
use Illuminate\Database\Eloquent\Model;

class ClientEmailImportSetting extends Model
{
    protected $table = 'client_email_import_settings';

    protected $fillable = [
        'client_profile_id',
        'import_email_account_id',
        'concessionaria_id',
        'user_id',
        'imap_host',
        'imap_port',
        'imap_encryption',
        'imap_email',
        'imap_password',
        'pdf_password',
        'sender_filter',
        'subject_filter',
        'is_active',
        'last_checked_at',
    ];

    protected $casts = [
        'imap_password'   => 'encrypted',
        'pdf_password'    => 'encrypted',
        'is_active'       => 'boolean',
        'last_checked_at' => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function emailAccount()
    {
        return $this->belongsTo(ImportEmailAccount::class, 'import_email_account_id');
    }

    // ── Helpers — resolve valores efetivos com fallback para padrões ──────

    /**
     * Retorna o email efetivo: da conta do pool ou do campo legado.
     */
    public function getEffectiveImapEmailAttribute(): ?string
    {
        return $this->emailAccount?->email ?? $this->imap_email;
    }

    /**
     * Retorna a senha IMAP efetiva: da conta do pool ou do campo legado.
     */
    public function getEffectiveImapPasswordAttribute(): ?string
    {
        return $this->emailAccount?->imap_password ?? $this->imap_password;
    }

    /**
     * Retorna o host IMAP efetivo: do campo ou do padrão do sistema.
     */
    public function getEffectiveImapHostAttribute(): string
    {
        return $this->imap_host
            ?: (app(SystemSettingService::class)->get('imap_default_host', 'mail.casaverde.com.br'));
    }

    /**
     * Retorna a porta IMAP efetiva.
     */
    public function getEffectiveImapPortAttribute(): int
    {
        return $this->imap_port
            ?: (int) app(SystemSettingService::class)->get('imap_default_port', 993);
    }

    /**
     * Retorna a criptografia IMAP efetiva.
     */
    public function getEffectiveImapEncryptionAttribute(): string
    {
        return $this->imap_encryption
            ?: (app(SystemSettingService::class)->get('imap_default_encryption', 'ssl'));
    }

    /**
     * Retorna o filtro de remetente efetivo: da conta do pool ou do campo local.
     */
    public function getEffectiveSenderFilterAttribute(): ?string
    {
        return $this->emailAccount?->sender_filter ?? $this->sender_filter;
    }

    /**
     * Retorna o filtro de assunto efetivo.
     */
    public function getEffectiveSubjectFilterAttribute(): ?string
    {
        return $this->emailAccount?->subject_filter ?? $this->subject_filter;
    }
}

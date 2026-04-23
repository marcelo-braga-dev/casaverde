<?php

namespace App\Models\Importacao;

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use Illuminate\Database\Eloquent\Model;

class ClientEmailImportSetting extends Model
{
    protected $table = 'client_email_import_settings';

    protected $fillable = [
        'client_profile_id',
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
        'imap_password' => 'encrypted',
        'pdf_password' => 'encrypted',
        'is_active' => 'boolean',
        'last_checked_at' => 'datetime',
    ];

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
}
<?php

namespace App\Models\Importacao;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;

class InstitutionalEmailAccount extends Model
{
    protected $table = 'institutional_email_accounts';

    protected $fillable = [
        'email',
        'label',
        'password',
        'notes',
        'is_active',
        'created_by_user_id',
    ];

    protected $casts = [
        'password' => 'encrypted',
        'is_active' => 'boolean',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}

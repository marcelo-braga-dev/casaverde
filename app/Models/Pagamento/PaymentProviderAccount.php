<?php

namespace App\Models\Pagamento;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentProviderAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider',
        'name',
        'is_active',
        'is_default',
        'environment',
        'base_url',
        'client_id',
        'client_secret',
        'webhook_secret',
        'settings',
    ];

    // O cast "encrypted" descriptografa no toArray(): sem isso o access token de produção
    // ia para as props do Inertia nas telas de conta.
    protected $hidden = [
        'client_secret',
        'webhook_secret',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'settings' => 'array',
        'client_secret' => 'encrypted',
        'webhook_secret' => 'encrypted',
    ];

    public function slips()
    {
        return $this->hasMany(PaymentSlip::class);
    }
}

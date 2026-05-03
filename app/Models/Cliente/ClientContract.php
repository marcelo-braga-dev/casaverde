<?php

namespace App\Models\Cliente;

use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientContract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_code',
        'commercial_proposal_id',
        'client_profile_id',
        'user_id',
        'status',
        'issued_at',
        'signed_at',
        'notes',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'signed_at' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function (ClientContract $contract) {
            if (!$contract->contract_code) {
                $contract->contract_code = static::generateContractCode();
            }
        });
    }

    public static function generateContractCode(): string
    {
        do {
            $code = 'CTR-' . now()->format('Ymd') . '-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (static::query()->where('contract_code', $code)->exists());

        return $code;
    }

    public function proposal()
    {
        return $this->belongsTo(CommercialProposal::class, 'commercial_proposal_id');
    }

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

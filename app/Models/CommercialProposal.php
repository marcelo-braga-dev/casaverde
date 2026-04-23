<?php

namespace App\Models\Proposta;

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommercialProposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'proposal_code',
        'client_profile_id',
        'consultor_user_id',
        'concessionaria_id',
        'status',
        'issued_at',
        'valid_until',
        'media_consumo',
        'taxa_reducao',
        'prazo_locacao',
        'valor_medio',
        'unidade_consumidora',
        'notes',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'valid_until' => 'date',
        'media_consumo' => 'decimal:2',
        'taxa_reducao' => 'decimal:2',
        'valor_medio' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (CommercialProposal $proposal) {
            if (!$proposal->proposal_code) {
                $proposal->proposal_code = static::generateProposalCode();
            }
        });
    }

    public static function generateProposalCode(): string
    {
        do {
            $code = 'PROP-' . now()->format('Ymd') . '-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (static::query()->where('proposal_code', $code)->exists());

        return $code;
    }

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
    }

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }
}
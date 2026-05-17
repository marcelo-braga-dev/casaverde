<?php

namespace App\Models\Usina;

use App\Enums\Usina\UsinaOperationalStatus;
use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Endereco\Address;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsinaSolar extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'consultor_user_id',
        'concessionaria_id',
        'usina_block_id',
        'address_id',
        'status',
        'uc',
        'media_geracao',
        'prazo_locacao',
        'potencia_usina',
        'taxa_comissao',
        'inversores',
        'modulos',
        'operational_status',
        'operation_started_at',
        'energia_disponivel_kwh',
        'energia_alocada_kwh',
        'energia_saldo_kwh',
        'admin_notes',
    ];

    protected $casts = [
        'media_geracao' => 'decimal:2',
        'potencia_usina' => 'decimal:2',
        'taxa_comissao' => 'decimal:2',


        'energia_disponivel_kwh' => 'decimal:3',
        'energia_alocada_kwh' => 'decimal:3',
        'energia_saldo_kwh' => 'decimal:3',
        'operation_started_at' => 'date',
        'operational_status' => UsinaOperationalStatus::class,
    ];

    protected $appends = [
        'utilization_percentage',
        'remaining_energy_kwh',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function produtor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_user_id');
    }

    public function concessionaria()
    {
        return $this->belongsTo(Concessionaria::class, 'concessionaria_id');
    }

    public function block()
    {
        return $this->belongsTo(UsinaBlock::class, 'usina_block_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    public function clientLinks()
    {
        return $this->hasMany(ClientUsinaLink::class, 'usina_id');
    }

    public function activeClientLinks()
    {
        return $this->hasMany(ClientUsinaLink::class, 'usina_id')
            ->where('is_active', true);
    }

    public function generationRecords()
    {
        return $this->hasMany(UsinaGenerationRecord::class, 'usina_id');
    }

    public function getRemainingEnergyKwhAttribute(): float
    {
        return max(
            0,
            (float) $this->energia_disponivel_kwh - (float) $this->energia_alocada_kwh
        );
    }

    public function getUtilizationPercentageAttribute(): float
    {
        $availableEnergy = (float) $this->energia_disponivel_kwh;

        if ($availableEnergy <= 0) {
            return 0;
        }

        return round(((float) $this->energia_alocada_kwh / $availableEnergy) * 100, 2);
    }

    public function operationalAlerts()
    {
        return $this->hasMany(OperationalAlert::class, 'usina_id');
    }

    public function openOperationalAlerts()
    {
        return $this->hasMany(OperationalAlert::class, 'usina_id')
            ->whereIn('status', ['open', 'in_progress']);
    }
}

<?php

namespace App\Models\Usina;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;

class UsinaGenerationRecord extends Model
{
    protected $fillable = [
        'usina_id',
        'reference_year',
        'reference_month',
        'generated_energy_kwh',
        'injected_energy_kwh',
        'compensated_energy_kwh',
        'available_energy_kwh',
        'notes',
        'created_by_user_id',
        'updated_by_user_id',
    ];

    protected $casts = [
        'reference_year' => 'integer',
        'reference_month' => 'integer',
        'generated_energy_kwh' => 'decimal:3',
        'injected_energy_kwh' => 'decimal:3',
        'compensated_energy_kwh' => 'decimal:3',
        'available_energy_kwh' => 'decimal:3',
    ];

    public function usina()
    {
        return $this->belongsTo(UsinaSolar::class, 'usina_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }
}

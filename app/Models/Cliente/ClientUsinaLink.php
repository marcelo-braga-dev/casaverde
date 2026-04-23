<?php

namespace App\Models\Cliente;

use App\Models\Usina\UsinaSolar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientUsinaLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_profile_id',
        'usina_id',
        'started_at',
        'ended_at',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'date',
        'ended_at' => 'date',
        'is_active' => 'boolean',
    ];

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class);
    }

    public function usina()
    {
        return $this->belongsTo(UsinaSolar::class, 'usina_id');
    }
}
<?php

namespace App\Models\Users;

use App\Models\Cliente\ClientProfile;
use App\Models\Energia\EnergyBill;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Produtor\ProducerProfile;
use App\Models\Usina\UsinaSolar;
use App\src\Roles\RoleUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'consultor_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected $appends = [
        'nome',
        'status_nome',
        'cadastrado_em',
        'dados_acesso',
        'role_name',
    ];

    protected $with = [
        'userData',
        'contatos',
        'consultor',
    ];

    public function scopeSomenteMeusClientes($query)
    {
        $user = Auth::user();

        if (!$user) {
            return $query->whereRaw('1 = 0');
        }

        if ($user->isAdmin()) {
            return $query;
        }

        if ($user->isConsultor()) {
            return $query
                ->where('consultor_id', $user->id)
                ->where('role_id', RoleUser::$CLIENTE);
        }

        return $query->where('id', $user->id);
    }

    public function scopeSomenteMeusRelacionados($query)
    {
        $user = Auth::user();

        if (!$user) {
            return $query->whereRaw('1 = 0');
        }

        if ($user->isAdmin()) {
            return $query;
        }

        if ($user->isConsultor()) {
            return $query->where('consultor_id', $user->id);
        }

        return $query->where('id', $user->id);
    }

    public function isAdmin(): bool
    {
        return (int) $this->role_id === RoleUser::$ADMIN;
    }

    public function isConsultor(): bool
    {
        return (int) $this->role_id === RoleUser::$CONSULTOR;
    }

    public function isProdutor(): bool
    {
        return (int) $this->role_id === RoleUser::$PRODUTOR;
    }

    public function isCliente(): bool
    {
        return (int) $this->role_id === RoleUser::$CLIENTE;
    }

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_id');
    }

    public function vendedor()
    {
        return $this->belongsTo(User::class, 'consultor_id');
    }

    public function userData(): HasOne
    {
        return $this->hasOne(UserData::class, 'user_id', 'id');
    }

    public function usina(): HasOne
    {
        return $this->hasOne(UsinaSolar::class, 'user_id', 'id');
    }

    public function usinas(): HasMany
    {
        return $this->hasMany(UsinaSolar::class, 'user_id');
    }

    public function ownedUsinas(): HasMany
    {
        return $this->hasMany(UsinaSolar::class, 'user_id');
    }

    public function usinasComoConsultor(): HasMany
    {
        return $this->hasMany(UsinaSolar::class, 'consultor_user_id');
    }

    public function contatos(): HasOne
    {
        return $this->hasOne(UserContact::class, 'user_id');
    }

    public function clientes(): HasMany
    {
        return $this->hasMany(User::class, 'consultor_id')
            ->where('role_id', RoleUser::$CLIENTE);
    }

    public function produtores(): HasMany
    {
        return $this->hasMany(User::class, 'consultor_id')
            ->where('role_id', RoleUser::$PRODUTOR);
    }

    public function energyBillImportSetting(): HasOne
    {
        return $this->hasOne(ClientEmailImportSetting::class, 'user_id');
    }

    public function energyBills(): HasMany
    {
        return $this->hasMany(EnergyBill::class, 'user_id');
    }

    public function clientProfilesAsConsultor(): HasMany
    {
        return $this->hasMany(ClientProfile::class, 'consultor_user_id');
    }

    public function clientProfileAsPlatformUser(): HasOne
    {
        return $this->hasOne(ClientProfile::class, 'platform_user_id');
    }

    public function producerProfile(): HasOne
    {
        return $this->hasOne(ProducerProfile::class, 'user_id');
    }

    public function getNomeAttribute()
    {
        return $this->attributes['name'] ?? null;
    }

    public function getRoleNameAttribute(): ?string
    {
        return RoleUser::nameById((int) $this->role_id);
    }

    public function getDadosAcessoAttribute(): array
    {
        $status = (string) ($this->attributes['status'] ?? '');

        return [
            'email' => $this->attributes['email'] ?? null,
            'status' => $status,
            'status_nome' => match ($status) {
                '0' => 'Bloqueado',
                '1' => 'Ativo',
                'novo' => 'Aguardando Análise Documentos',
                'documentacao-aprovada' => 'Documentação Aprovada',
                'assinar_contrato' => 'Assinar Contrato',
                default => 'Desconhecido',
            },
        ];
    }

    public function getCadastradoEmAttribute(): ?string
    {
        if (empty($this->attributes['created_at'])) {
            return null;
        }

        return Carbon::parse($this->attributes['created_at'])->format('d/m/Y H:i');
    }

    public function getStatusNomeAttribute(): string
    {
        return match ((string) ($this->attributes['status'] ?? '')) {
            '1' => 'Ativo',
            '0' => 'Bloqueado',
            'novo' => 'Aguardando Análise Documentos',
            'documentacao-aprovada' => 'Documentação Aprovada',
            'assinar_contrato' => 'Assinar Contrato',
            default => '-',
        };
    }
}
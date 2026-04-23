<?php

namespace App\Models\Users;

use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Energia\EnergyBill;
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
        'name',
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

    protected $appends = ['nome', 'status_nome', 'cadastrado_em', 'dados_acesso', 'role_name'];

    protected $with = ['userData', 'contatos', 'consultor'];

    public function scopeSomenteMeusClientes($query)
    {
        $user = Auth::user();

        if ($user && $user->role_id == RoleUser::$ADMIN) {
            return $query;
        }

        return $query->where('consultor_id', $user->id);
    }

    public function isAdmin(): bool
    {
        return (int) $this->role_id === RoleUser::$ADMIN;
    }

    public function isConsultor(): bool
    {
        return (int) $this->role_id === RoleUser::$CONSULTOR;
    }

    public function isCliente(): bool
    {
        return (int) $this->role_id === RoleUser::$CLIENTE;
    }

    public function consultor()
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

    public function contatos(): HasOne
    {
        return $this->hasOne(UserContact::class, 'user_id', 'id');
    }

    public function vendedor()
    {
        return $this->belongsTo(User::class, 'consultor_id');
    }

    public function clientes(): HasMany
    {
        return $this->hasMany(User::class, 'consultor_id');
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

    public function getNomeAttribute()
    {
        return $this->attributes['name'];
    }

    public function getRoleNameAttribute(): ?string
    {
        return RoleUser::nameById((int) $this->role_id);
    }

    public function getDadosAcessoAttribute()
    {
        switch ($this->attributes['status']) {
            case '0':
                $statusNome = 'Bloqueado';
                break;
            case '1':
                $statusNome = 'Ativo';
                break;
            default:
                $statusNome = 'Desconhecido';
        }

        return [
            'email' => $this->attributes['email'],
            'status' => $this->attributes['status'],
            'status_nome' => $statusNome,
        ];
    }

    public function getCadastradoEmAttribute()
    {
        $data = Carbon::parse($this->attributes['created_at']);
        return $data->format('d/m/Y H:i');
    }

    public function getStatusNomeAttribute()
    {
        switch ($this->attributes['status']) {
            case '1':
                return 'Ativo';
            case 'novo':
                return 'Aguardando Análise Documentos';
            case 'documentacao-aprovada':
                return 'Documentação Aprovada';
            case 'assinar_contrato':
                return 'Assinar Contrato';
            default:
                return '-';
        }
    }

public function usinas()
{
    return $this->hasMany(\App\Models\Usina\UsinaSolar::class, 'user_id');
}

public function producerProfile()
{
    return $this->hasOne(\App\Models\Produtor\ProducerProfile::class, 'user_id');
}
}
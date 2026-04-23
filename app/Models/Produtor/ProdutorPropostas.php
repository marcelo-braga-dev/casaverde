<?php

namespace App\Models\Produtor;

use App\Models\Users\User;
use App\src\Roles\RoleUser;
use App\Utils\ConvertValues;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ProdutorPropostas extends Model
{
    protected $table = 'produtor_propostas';

    protected $fillable = [
        'consultor_id',
        'produtor_id',
        'taxa_reducao',
        'prazo_locacao',
        'potencia',
        'geracao_media',
        'valor_investimento',
    ];

    protected $with = [
        'produtor',
        'endereco',
        'consultor',
    ];

    protected $appends = [
        'geracao_anual',
        'retorno_anual_bruto',
        'criado_em',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('consultor_filter', function (Builder $query) {
            $user = Auth::user();

            if (!$user) {
                return;
            }

            if ((int) $user->role_id === RoleUser::$ADMIN) {
                return;
            }

            if ((int) $user->role_id === RoleUser::$CONSULTOR) {
                $query->where('consultor_id', $user->id);
                return;
            }

            if ((int) $user->role_id === RoleUser::$PRODUTOR) {
                $query->where('produtor_id', $user->id);
            }
        });
    }

    public function produtor()
    {
        return $this->belongsTo(User::class, 'produtor_id');
    }

    public function consultor()
    {
        return $this->belongsTo(User::class, 'consultor_id');
    }

    public function endereco()
    {
        return $this->hasOne(ProdutorPropostasEnderecos::class, 'proposta_id', 'id');
    }

    public function setPotenciaAttribute($value): void
    {
        $this->attributes['potencia'] = $value !== null && $value !== ''
            ? ConvertValues::moneyToFloat($value)
            : null;
    }

    public function setGeracaoMediaAttribute($value): void
    {
        $this->attributes['geracao_media'] = $value !== null && $value !== ''
            ? ConvertValues::moneyToFloat($value)
            : null;
    }

    public function setValorInvestimentoAttribute($value): void
    {
        $this->attributes['valor_investimento'] = $value !== null && $value !== ''
            ? ConvertValues::moneyToFloat($value)
            : null;
    }

    public function getValorInvestimentoAttribute()
    {
        $value = $this->attributes['valor_investimento'] ?? null;

        return $value !== null
            ? ConvertValues::floatToMoney($value)
            : null;
    }

    public function getPotenciaAttribute()
    {
        $value = $this->attributes['potencia'] ?? null;

        return $value !== null
            ? ConvertValues::floatToMoney($value)
            : null;
    }

    public function getGeracaoMediaAttribute()
    {
        $value = $this->attributes['geracao_media'] ?? null;

        return $value !== null
            ? ConvertValues::floatToMoney($value)
            : null;
    }

    public function getCriadoEmAttribute(): ?string
    {
        if (empty($this->attributes['created_at'])) {
            return null;
        }

        return Carbon::parse($this->attributes['created_at'])->format('d/m/Y H:i:s');
    }

    public function getGeracaoAnualAttribute()
    {
        $geracaoMensal = (float) ($this->attributes['geracao_media'] ?? 0);

        return ConvertValues::floatToMoney($geracaoMensal * 12);
    }

    public function getRetornoAnualBrutoAttribute()
    {
        $geracaoMensal = (float) ($this->attributes['geracao_media'] ?? 0);

        return ConvertValues::floatToMoney($geracaoMensal * 12 * 0.41);
    }
}
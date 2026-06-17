<?php

namespace App\Http\Requests\Cliente;

use App\Models\Cliente\ClientUsinaLink;
use App\src\Roles\RoleUser;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class AttachClientToUsinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'consumer_unit_id' => ['nullable', 'integer', 'exists:consumer_units,id'],
            'usina_id' => ['required', 'integer', 'exists:usina_solars,id'],
            'started_at' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'consumption_percentage' => ['required', 'numeric', 'min:0.01', 'max:100'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $consumerUnitId = $this->input('consumer_unit_id');
            $usinaId = $this->input('usina_id');

            if (! $consumerUnitId || ! $usinaId || $validator->errors()->has('consumption_percentage')) {
                return;
            }

            $consumptionPercentage = (float) $this->input('consumption_percentage');

            // Soma das alocações ativas da UC em OUTRAS usinas (o vínculo ativo com a
            // mesma usina, se existir, é substituído por este envio, então é ignorado).
            $allocated = (float) ClientUsinaLink::query()
                ->where('consumer_unit_id', $consumerUnitId)
                ->where('usina_id', '!=', $usinaId)
                ->active()
                ->sum('consumption_percentage');

            $remaining = round(100 - $allocated, 2);

            if ($consumptionPercentage > $remaining + 0.001) {
                $validator->errors()->add(
                    'consumption_percentage',
                    "A soma das alocações desta UC não pode exceder 100% do Consumo Previsto. Já alocado em outra(s) usina(s): {$allocated}%. Disponível: {$remaining}%."
                );
            }
        });
    }
}

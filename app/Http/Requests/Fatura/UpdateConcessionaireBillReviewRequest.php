<?php

namespace App\Http\Requests\Fatura;

use App\Services\Fatura\ReviewConcessionaireBillService;
use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateConcessionaireBillReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'consumer_unit_id' => [
                'nullable',
                'integer',
                Rule::exists('consumer_units', 'id')
                    ->where('client_profile_id', $this->route('fatura')?->client_profile_id),
            ],
            'usina_id' => ['nullable', 'integer', 'exists:usina_solars,id'],
            'concessionaria_id' => ['required', 'integer', 'exists:concessionarias,id'],

            'nome' => ['nullable', 'string', 'max:255'],
            'unidade_consumidora' => ['required', 'digits_between:6,12'],
            'numero_instalacao' => ['nullable', 'string', 'max:255'],

            'reference_month' => ['nullable', 'integer', 'min:1', 'max:12'],
            'reference_year' => ['nullable', 'integer', 'min:2020', 'max:2100'],
            'reference_label' => ['nullable', 'string', 'max:50'],

            'vencimento' => ['nullable', 'date'],
            'valor_total' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (ReviewConcessionaireBillService::nullableDecimal($value) === null) {
                        $fail('Informe um valor total válido maior que zero.');
                    }
                },
            ],
            'consumo_kwh' => ['nullable'],

            'injected_energy_kwh' => ['nullable'],
            'injected_energy_amount' => ['nullable'],
            'injected_consumption_kwh' => ['nullable'],
            'injected_consumption_amount' => ['nullable'],
            'injected_consumption_discount_percent' => ['nullable'],

            'notes' => ['nullable', 'string'],
            'review_notes' => ['nullable', 'string'],
            'review_status' => ['required', 'string', 'max:50'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'unidade_consumidora' => ltrim(preg_replace('/\D+/', '', (string) $this->input('unidade_consumidora')) ?? '', '0'),
        ]);
    }
}

<?php

namespace App\Http\Requests\Usina;

use App\Http\Requests\Concerns\NormalizesNumbers;
use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreUsinaGenerationRecordRequest extends FormRequest
{
    use NormalizesNumbers;

    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()?->role_id, [RoleUser::$ADMIN, RoleUser::$CONSULTOR], true);
    }

    public function rules(): array
    {
        return [
            'usina_id' => ['required', 'integer', 'exists:usina_solars,id'],
            'reference_year' => ['required', 'integer', 'min:2020', 'max:2100'],
            'reference_month' => ['required', 'integer', 'min:1', 'max:12'],
            'generated_energy_kwh' => ['required', 'numeric', 'min:0'],
            'injected_energy_kwh' => ['nullable', 'numeric', 'min:0'],
            'compensated_energy_kwh' => ['nullable', 'numeric', 'min:0'],
            'available_energy_kwh' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'generated_energy_kwh' => $this->normalizeNumber($this->input('generated_energy_kwh')),
            'injected_energy_kwh' => $this->normalizeNumber($this->input('injected_energy_kwh')),
            'compensated_energy_kwh' => $this->normalizeNumber($this->input('compensated_energy_kwh')),
            'available_energy_kwh' => $this->normalizeNumber($this->input('available_energy_kwh')),
        ]);
    }
}

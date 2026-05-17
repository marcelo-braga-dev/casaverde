<?php

namespace App\Http\Requests\Usina;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreClientUsinaLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'client_profile_id' => ['required', 'integer', 'exists:client_profiles,id'],
            'usina_id' => ['required', 'integer', 'exists:usina_solars,id'],
            'allocated_energy_kwh' => ['required', 'numeric', 'min:0.001'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'started_at' => ['required', 'date'],
            'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'is_active' => ['nullable', 'boolean'],
            'status' => ['nullable', new Enum(ClientUsinaLinkStatus::class)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'allocated_energy_kwh' => $this->normalizeNumber($this->input('allocated_energy_kwh')),
            'discount_percentage' => $this->normalizeNumber($this->input('discount_percentage')),
            'is_active' => $this->boolean('is_active', true),
        ]);
    }

    private function normalizeNumber($value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return $value;
        }

        $value = trim((string) $value);
        $value = str_replace('.', '', $value);
        $value = str_replace(',', '.', $value);

        return is_numeric($value) ? $value : null;
    }
}

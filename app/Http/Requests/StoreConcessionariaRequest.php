<?php

namespace App\Http\Requests\Usina;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConcessionariaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $concessionariaId = $this->route('concessionaria')?->id;

        return [
            'nome' => [
                'required',
                'string',
                'max:255',
                Rule::unique('concessionarias', 'nome')->ignore($concessionariaId),
            ],
            'tarifa_gd2' => ['required', 'numeric', 'min:0'],
            'estado' => ['required', 'string', 'size:2'],
            'status' => ['required', 'string', 'max:50'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'estado' => $this->estado ? strtoupper(trim($this->estado)) : null,
        ]);
    }
}
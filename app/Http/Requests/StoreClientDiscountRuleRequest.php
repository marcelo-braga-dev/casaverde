<?php

namespace App\Http\Requests\Cliente;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientDiscountRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'discount_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'starts_on' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
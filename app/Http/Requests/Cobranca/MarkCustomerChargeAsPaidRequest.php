<?php

namespace App\Http\Requests\Cobranca;

use Illuminate\Foundation\Http\FormRequest;

class MarkCustomerChargeAsPaidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

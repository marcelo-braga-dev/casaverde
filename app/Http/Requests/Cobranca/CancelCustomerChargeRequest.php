<?php

namespace App\Http\Requests\Cobranca;

use Illuminate\Foundation\Http\FormRequest;

class CancelCustomerChargeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

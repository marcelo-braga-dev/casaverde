<?php

namespace App\Http\Requests\Config;

use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'default_discount_percentage' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
            ],
            'default_producer_fee_percentage' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
            ],
            'producer_proposal_consumer_discount_percentage' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'default_discount_percentage.required' => 'A taxa de desconto padrão do cliente é obrigatória.',
            'default_discount_percentage.min' => 'A taxa deve ser entre 0 e 100%.',
            'default_discount_percentage.max' => 'A taxa deve ser entre 0 e 100%.',
            'default_producer_fee_percentage.required' => 'A taxa de administração padrão do produtor é obrigatória.',
            'default_producer_fee_percentage.min' => 'A taxa deve ser entre 0 e 100%.',
            'default_producer_fee_percentage.max' => 'A taxa deve ser entre 0 e 100%.',
            'producer_proposal_consumer_discount_percentage.required' => 'A redução de consumo exibida na proposta do produtor é obrigatória.',
            'producer_proposal_consumer_discount_percentage.min' => 'A taxa deve ser entre 0 e 100%.',
            'producer_proposal_consumer_discount_percentage.max' => 'A taxa deve ser entre 0 e 100%.',
        ];
    }
}

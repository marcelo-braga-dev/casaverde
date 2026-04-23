<?php

namespace App\Http\Requests\Usina;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUsinaBlockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $blockId = $this->route('usinaBlock')?->id;

        return [
            'nome' => [
                'required',
                'string',
                'max:255',
                Rule::unique('usina_blocks', 'nome')->ignore($blockId),
            ],
            'descricao' => ['nullable', 'string'],
            'status' => ['required', 'string', 'max:50'],
        ];
    }
}
<?php

namespace App\Http\Requests\Usina;

use App\Enums\Usina\UsinaOnboardingStage;
use App\src\Roles\RoleUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsinaOnboardingStageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()?->role_id === RoleUser::$ADMIN;
    }

    public function rules(): array
    {
        return [
            'stage' => ['required', Rule::enum(UsinaOnboardingStage::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'stage.required' => 'Informe a etapa de onboarding.',
            'stage.enum' => 'Etapa de onboarding inválida.',
        ];
    }
}

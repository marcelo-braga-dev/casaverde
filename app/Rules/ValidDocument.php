<?php

namespace App\Rules;

use App\Support\DocumentValidator;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDocument implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value !== null && $value !== '' && ! DocumentValidator::isValid((string) $value)) {
            $fail('O :attribute informado é inválido.');
        }
    }
}

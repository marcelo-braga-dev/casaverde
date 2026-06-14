<?php

namespace App\Services\Config;

use App\Models\Config\SystemSetting;

class SystemSettingService
{
    public function get(
        string $key,
        mixed $default = null,
    ): mixed {
        $setting = SystemSetting::query()
            ->where('key', $key)
            ->first();

        if (! $setting || $setting->value === null) {
            return $default;
        }

        return match ($setting->type) {
            'integer' => (int) $setting->value,
            'float' => (float) $setting->value,
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($setting->value, true),
            'encrypted' => decrypt($setting->value),
            default => $setting->value,
        };
    }

    public function set(
        string $key,
        mixed $value,
        string $type = 'string',
        ?int $userId = null,
    ): SystemSetting {
        return SystemSetting::query()->updateOrCreate(
            [
                'key' => $key,
            ],
            [
                'value' => match (true) {
                    $type === 'encrypted' => encrypt((string) $value),
                    is_array($value) => json_encode($value),
                    default => (string) $value,
                },

                'type' => $type,

                'updated_by' => $userId,

                'created_by' => $userId,
            ]
        );
    }
}

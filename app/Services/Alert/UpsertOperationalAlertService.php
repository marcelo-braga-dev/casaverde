<?php

namespace App\Services\Alert;

use App\Enums\Alert\OperationalAlertStatus;
use App\Models\Alert\OperationalAlert;
use Illuminate\Database\Eloquent\Model;

class UpsertOperationalAlertService
{
    public function handle(array $data, ?Model $alertable = null): OperationalAlert
    {
        $unique = [
            'module' => $data['module'],
            'type' => $data['type'],
            'usina_id' => $data['usina_id'] ?? null,
            'client_profile_id' => $data['client_profile_id'] ?? null,
            'reference_year' => $data['reference_year'] ?? null,
            'reference_month' => $data['reference_month'] ?? null,
        ];

        if ($alertable) {
            $unique['alertable_type'] = $alertable::class;
            $unique['alertable_id'] = $alertable->getKey();
        }

        $payload = [
            'severity' => $data['severity'] ?? 'info',
            'title' => $data['title'],
            'message' => $data['message'] ?? null,
            'assigned_to_user_id' => $data['assigned_to_user_id'] ?? null,
            'status' => $data['status'] ?? OperationalAlertStatus::Open->value,
            'payload' => $data['payload'] ?? null,
            'detected_at' => $data['detected_at'] ?? now(),
            'resolved_at' => null,
            'resolved_by_user_id' => null,
            'resolution_notes' => null,
        ];

        return OperationalAlert::query()->updateOrCreate($unique, $payload);
    }
}

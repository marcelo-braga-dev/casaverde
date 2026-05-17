<?php

namespace App\Services\Alert;

use App\Enums\Alert\OperationalAlertStatus;
use App\Models\Alert\OperationalAlert;

class ResolveOperationalAlertService
{
    public function handle(
        OperationalAlert $alert,
        ?string $notes = null,
        ?int $resolvedByUserId = null
    ): OperationalAlert {
        $alert->update([
            'status' => OperationalAlertStatus::Resolved->value,
            'resolved_at' => now(),
            'resolved_by_user_id' => $resolvedByUserId ?? auth()->id(),
            'resolution_notes' => $notes,
        ]);

        return $alert->refresh();
    }

    public function resolveMatching(array $criteria, string $notes = 'Resolvido automaticamente.'): int
    {
        return OperationalAlert::query()
            ->where($criteria)
            ->whereIn('status', [
                OperationalAlertStatus::Open->value,
                OperationalAlertStatus::InProgress->value,
            ])
            ->update([
                'status' => OperationalAlertStatus::Resolved->value,
                'resolved_at' => now(),
                'resolution_notes' => $notes,
            ]);
    }
}

<?php

namespace App\Http\Controllers\Demo;

use App\Models\Demo\DemoVisitor;
use App\Services\Demo\DemoAccessService;

final class DemoVisitorExport
{
    public const HEADER = [
        'Nome', 'E-mail', 'Telefone', 'Empresa', 'Primeiro acesso', 'Último acesso', 'Visitas',
        'Telas vistas', 'Perfis usados', 'Origem (utm_source)', 'Mídia (utm_medium)', 'Campanha (utm_campaign)', 'IP',
    ];

    public static function row(DemoVisitor $visitor): array
    {
        $roles = collect($visitor->roles_viewed ?? [])
            ->map(fn ($role) => DemoAccessService::ROLES[$role] ?? $role)
            ->implode(', ');

        return [
            $visitor->name,
            $visitor->email,
            $visitor->phone,
            $visitor->company,
            $visitor->first_seen_at?->format('d/m/Y H:i'),
            $visitor->last_seen_at?->format('d/m/Y H:i'),
            $visitor->visits,
            $visitor->page_views,
            $roles,
            $visitor->utm_source,
            $visitor->utm_medium,
            $visitor->utm_campaign,
            $visitor->ip_address,
        ];
    }
}

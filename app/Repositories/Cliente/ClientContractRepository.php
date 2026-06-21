<?php

namespace App\Repositories\Cliente;

use App\Models\Cliente\ClientContract;

class ClientContractRepository
{
    public function paginate(array $filters = [], int $perPage = 20)
    {
        return ClientContract::query()
            ->with(['clientProfile', 'proposal', 'user'])
            ->when($filters['id'] ?? null, fn ($query, $id) => $query->where('id', $id))
            ->when($filters['code'] ?? null, fn ($query, $code) => $query->where('contract_code', 'like', "%{$code}%"))
            ->when($filters['document'] ?? null, function ($query, $document) {
                $document = preg_replace('/\D+/', '', $document);

                $query->whereHas('clientProfile', function ($subQuery) use ($document) {
                    $subQuery
                        ->where('cpf', 'like', "%{$document}%")
                        ->orWhere('cnpj', 'like', "%{$document}%");
                });
            })
            ->when($filters['client_name'] ?? null, function ($query, $name) {
                $query->whereHas('clientProfile', function ($subQuery) use ($name) {
                    $subQuery
                        ->where('nome', 'like', "%{$name}%")
                        ->orWhere('razao_social', 'like', "%{$name}%")
                        ->orWhere('nome_fantasia', 'like', "%{$name}%");
                });
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }
}

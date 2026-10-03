<?php

namespace App\Services\Cliente;

use App\Models\Cobranca\CustomerCharge;

class ClientContactEmailResolver
{
    /**
     * O e-mail de contato do cliente (cadastro) é sempre preferido em relação ao
     * e-mail de login da plataforma, porque clientes que nunca ativaram o portal
     * recebem um e-mail sintético "cliente-{id}@casaverde.local" (IssueClientContractService)
     * só para satisfazer o unique da tabela users — nunca é um endereço real, e
     * provedores de pagamento (ex: Mercado Pago) rejeitam com invalid_payer_email.
     */
    public function forCharge(CustomerCharge $charge): ?string
    {
        $charge->loadMissing(['clientProfile.contacts', 'platformUser']);

        $contactEmail = $charge->clientProfile?->contacts?->email;

        if ($contactEmail) {
            return $contactEmail;
        }

        $platformEmail = $charge->platformUser?->email;

        if ($platformEmail && ! $this->isSynthetic($platformEmail)) {
            return $platformEmail;
        }

        return null;
    }

    public function isSynthetic(string $email): bool
    {
        return str_ends_with($email, '@casaverde.local');
    }
}

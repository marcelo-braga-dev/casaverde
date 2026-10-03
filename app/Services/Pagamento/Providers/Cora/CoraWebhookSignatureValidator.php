<?php

namespace App\Services\Pagamento\Providers\Cora;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Http\Request;

class CoraWebhookSignatureValidator
{
    public function isValid(Request $request, ?PaymentProviderAccount $account = null): bool
    {
        // O processamento da Cora confia no payload para dar baixa (marca como pago):
        // sem secret, qualquer um forjaria um pagamento. Sem secret, nada é aceito.
        if (! $account?->webhook_secret) {
            return false;
        }

        $signature = $request->header('X-Cora-Signature')
            ?? $request->header('X-Signature')
            ?? null;

        if (! $signature) {
            return false;
        }

        $payload = $request->getContent();
        $expected = hash_hmac('sha256', $payload, $account->webhook_secret);

        return hash_equals($expected, $signature);
    }
}

<?php

namespace App\Services\Pagamento\Providers\Cora;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Http\Request;

class CoraWebhookSignatureValidator
{
    public function isValid(Request $request, ?PaymentProviderAccount $account = null): bool
    {
        if (!$account?->webhook_secret) {
            return true;
        }

        $signature = $request->header('X-Cora-Signature')
            ?? $request->header('X-Signature')
            ?? null;

        if (!$signature) {
            return false;
        }

        $payload = $request->getContent();
        $expected = hash_hmac('sha256', $payload, $account->webhook_secret);

        return hash_equals($expected, $signature);
    }
}

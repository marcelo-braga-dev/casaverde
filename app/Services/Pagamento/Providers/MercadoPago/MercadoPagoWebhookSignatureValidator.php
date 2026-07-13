<?php

namespace App\Services\Pagamento\Providers\MercadoPago;

use App\Models\Pagamento\PaymentProviderAccount;
use Illuminate\Http\Request;

class MercadoPagoWebhookSignatureValidator
{
    public function isValid(Request $request, ?PaymentProviderAccount $account = null): bool
    {
        if (! $account?->webhook_secret) {
            return true;
        }

        $signatureHeader = $request->header('x-signature');

        if (! $signatureHeader) {
            return false;
        }

        [$ts, $hash] = $this->parseSignatureHeader($signatureHeader);

        if (! $ts || ! $hash) {
            return false;
        }

        $requestId = (string) $request->header('x-request-id');
        $dataId = $this->resolveDataId($request);

        $manifest = "id:{$dataId};request-id:{$requestId};ts:{$ts};";
        $expected = hash_hmac('sha256', $manifest, $account->webhook_secret);

        return hash_equals($expected, $hash);
    }

    private function parseSignatureHeader(string $header): array
    {
        $ts = null;
        $hash = null;

        foreach (explode(',', $header) as $chunk) {
            [$key, $value] = array_pad(explode('=', $chunk, 2), 2, null);
            $key = trim((string) $key);

            if ($key === 'ts') {
                $ts = trim((string) $value);
            } elseif ($key === 'v1') {
                $hash = trim((string) $value);
            }
        }

        return [$ts, $hash];
    }

    private function resolveDataId(Request $request): string
    {
        // O Mercado Pago envia o id do recurso como "data.id". O PHP converte
        // pontos em chaves de query string para "_", por isso checamos ambas
        // as formas antes de recorrer a um parse manual da query string.
        $dataId = data_get($request->input(), 'data.id')
            ?? $request->query('data_id')
            ?? $request->query('data.id');

        if (! $dataId) {
            parse_str((string) $request->getQueryString(), $rawQuery);
            $dataId = $rawQuery['data.id'] ?? $rawQuery['data_id'] ?? null;
        }

        return strtolower((string) $dataId);
    }
}

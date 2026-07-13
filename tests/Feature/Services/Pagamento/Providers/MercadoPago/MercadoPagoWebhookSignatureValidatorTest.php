<?php

use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\MercadoPago\MercadoPagoWebhookSignatureValidator;
use Illuminate\Http\Request;

function buildMercadoPagoManifest(string $dataId, string $requestId, string $ts): string
{
    return "id:{$dataId};request-id:{$requestId};ts:{$ts};";
}

describe('MercadoPagoWebhookSignatureValidator', function () {

    beforeEach(function () {
        $this->validator = app(MercadoPagoWebhookSignatureValidator::class);
    });

    it('accepts any webhook when there is no account or no webhook_secret configured', function () {
        $request = Request::create('/webhooks/payments/mercado-pago', 'POST', content: '{"data":{"id":"123"}}');

        expect($this->validator->isValid($request, null))->toBeTrue();

        $accountWithoutSecret = PaymentProviderAccount::factory()->mercadoPago()->create(['webhook_secret' => null]);
        expect($this->validator->isValid($request, $accountWithoutSecret))->toBeTrue();
    });

    it('rejects the webhook when a secret is configured but no x-signature header is sent', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->withWebhookSecret('my-secret')->create();
        $request = Request::create('/webhooks/payments/mercado-pago', 'POST', content: '{"data":{"id":"123"}}');

        expect($this->validator->isValid($request, $account))->toBeFalse();
    });

    it('rejects the webhook when the signature does not match', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->withWebhookSecret('my-secret')->create();

        $request = Request::create('/webhooks/payments/mercado-pago?data.id=123', 'POST', content: '{"data":{"id":"123"}}');
        $request->headers->set('x-signature', 'ts=1704908010,v1=invalidhash');
        $request->headers->set('x-request-id', 'req-1');

        expect($this->validator->isValid($request, $account))->toBeFalse();
    });

    it('accepts the webhook when the signature matches the manifest HMAC, resolving data.id from the JSON body', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->withWebhookSecret('my-secret')->create();

        $ts = '1704908010';
        $requestId = 'req-1';
        $manifest = buildMercadoPagoManifest('123', $requestId, $ts);
        $hash = hash_hmac('sha256', $manifest, 'my-secret');

        $request = Request::create('/webhooks/payments/mercado-pago', 'POST', content: '{"data":{"id":"123"}}');
        $request->headers->set('Content-Type', 'application/json');
        $request->headers->set('x-signature', "ts={$ts},v1={$hash}");
        $request->headers->set('x-request-id', $requestId);

        expect($this->validator->isValid($request, $account))->toBeTrue();
    });

    it('accepts the webhook resolving data.id from a query string mangled by PHP into data_id', function () {
        $account = PaymentProviderAccount::factory()->mercadoPago()->withWebhookSecret('my-secret')->create();

        $ts = '1704908010';
        $requestId = 'req-1';
        $manifest = buildMercadoPagoManifest('456', $requestId, $ts);
        $hash = hash_hmac('sha256', $manifest, 'my-secret');

        $request = Request::create('/webhooks/payments/mercado-pago?data.id=456&type=payment', 'POST');
        $request->headers->set('x-signature', "ts={$ts},v1={$hash}");
        $request->headers->set('x-request-id', $requestId);

        expect($this->validator->isValid($request, $account))->toBeTrue();
    });

});

<?php

use App\Models\Pagamento\PaymentProviderAccount;
use App\Services\Pagamento\Providers\Cora\CoraWebhookSignatureValidator;
use Illuminate\Http\Request;

describe('CoraWebhookSignatureValidator', function () {

    beforeEach(function () {
        $this->validator = app(CoraWebhookSignatureValidator::class);
    });

    it('accepts any webhook when there is no account or no webhook_secret configured', function () {
        $request = Request::create('/webhooks/payments/cora', 'POST', content: '{"status":"PAID"}');

        expect($this->validator->isValid($request, null))->toBeTrue();

        $accountWithoutSecret = PaymentProviderAccount::factory()->create(['webhook_secret' => null]);
        expect($this->validator->isValid($request, $accountWithoutSecret))->toBeTrue();
    });

    it('rejects the webhook when a secret is configured but no signature header is sent', function () {
        $account = PaymentProviderAccount::factory()->withWebhookSecret('my-secret')->create();
        $request = Request::create('/webhooks/payments/cora', 'POST', content: '{"status":"PAID"}');

        expect($this->validator->isValid($request, $account))->toBeFalse();
    });

    it('rejects the webhook when the signature does not match', function () {
        $account = PaymentProviderAccount::factory()->withWebhookSecret('my-secret')->create();

        $request = Request::create('/webhooks/payments/cora', 'POST', content: '{"status":"PAID"}');
        $request->headers->set('X-Cora-Signature', 'invalid-signature');

        expect($this->validator->isValid($request, $account))->toBeFalse();
    });

    it('accepts the webhook when the signature matches the HMAC of the body', function () {
        $account = PaymentProviderAccount::factory()->withWebhookSecret('my-secret')->create();
        $body = '{"status":"PAID"}';

        $request = Request::create('/webhooks/payments/cora', 'POST', content: $body);
        $request->headers->set('X-Cora-Signature', hash_hmac('sha256', $body, 'my-secret'));

        expect($this->validator->isValid($request, $account))->toBeTrue();
    });

    it('also accepts the signature via the X-Signature header', function () {
        $account = PaymentProviderAccount::factory()->withWebhookSecret('my-secret')->create();
        $body = '{"status":"PAID"}';

        $request = Request::create('/webhooks/payments/cora', 'POST', content: $body);
        $request->headers->set('X-Signature', hash_hmac('sha256', $body, 'my-secret'));

        expect($this->validator->isValid($request, $account))->toBeTrue();
    });

});

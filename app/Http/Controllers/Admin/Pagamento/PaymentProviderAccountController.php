<?php

namespace App\Http\Controllers\Admin\Pagamento;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pagamento\StorePaymentProviderAccountRequest;
use App\Models\Pagamento\PaymentProviderAccount;
use Inertia\Inertia;

class PaymentProviderAccountController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Financeiro/Pagamento/ProviderAccount/Index/Page', [
            'accounts' => PaymentProviderAccount::query()
                ->orderByDesc('id')
                ->paginate(20),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Financeiro/Pagamento/ProviderAccount/Create/Page');
    }

    public function store(StorePaymentProviderAccountRequest $request)
    {
        $data = $request->validated();

        $data['settings'] = $this->decodeSettings($data['settings'] ?? null);

        if (empty($data['client_secret'])) {
            unset($data['client_secret']);
        }

        if (empty($data['webhook_secret'])) {
            unset($data['webhook_secret']);
        }

        if (!empty($data['is_default'])) {
            PaymentProviderAccount::query()
                ->where('provider', $data['provider'])
                ->update(['is_default' => false]);
        }

        $account = PaymentProviderAccount::create($data);

        return redirect()
            ->route('admin.financeiro.payment-provider-accounts.show', $account->id)
            ->with('success', 'Conta de pagamento cadastrada com sucesso.');
    }

    public function show(PaymentProviderAccount $paymentProviderAccount)
    {
        return Inertia::render('Admin/Financeiro/Pagamento/ProviderAccount/Show/Page', [
            'account' => $paymentProviderAccount,
        ]);
    }

    public function edit(PaymentProviderAccount $paymentProviderAccount)
    {
        return Inertia::render('Admin/Financeiro/Pagamento/ProviderAccount/Edit/Page', [
            'account' => $paymentProviderAccount,
        ]);
    }

    public function update(
        StorePaymentProviderAccountRequest $request,
        PaymentProviderAccount $paymentProviderAccount
    ) {
        $data = $request->validated();

        $data['settings'] = $this->decodeSettings($data['settings'] ?? null);

        if (empty($data['client_secret'])) {
            unset($data['client_secret']);
        }

        if (empty($data['webhook_secret'])) {
            unset($data['webhook_secret']);
        }

        if (!empty($data['is_default'])) {
            PaymentProviderAccount::query()
                ->where('provider', $data['provider'])
                ->where('id', '!=', $paymentProviderAccount->id)
                ->update(['is_default' => false]);
        }

        $paymentProviderAccount->update($data);

        return redirect()
            ->route('admin.financeiro.payment-provider-accounts.show', $paymentProviderAccount->id)
            ->with('success', 'Conta de pagamento atualizada com sucesso.');
    }

    private function decodeSettings(?string $settings): array
    {
        if (!$settings) {
            return [];
        }

        $decoded = json_decode($settings, true);

        return is_array($decoded) ? $decoded : [];
    }
}

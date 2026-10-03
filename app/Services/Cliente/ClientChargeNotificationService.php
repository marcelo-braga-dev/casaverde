<?php

namespace App\Services\Cliente;

use App\Mail\Cliente\ChargePaymentMail;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Pagamento\PaymentSlip;
use Illuminate\Support\Facades\Mail;

class ClientChargeNotificationService
{
    public function __construct(private readonly ClientContactEmailResolver $emailResolver) {}

    public function paymentAvailable(PaymentSlip $slip): void
    {
        if (! $slip->isPayable()) {
            return;
        }

        $this->send($slip, ChargePaymentMail::AVAILABLE);
    }

    // Sem boleto pagável não há o que lembrar: o consultor recebe o alerta de boleto vencido.
    public function dueReminder(CustomerCharge $charge): void
    {
        $slip = $charge->paymentSlips()
            ->whereIn('status', ['pending', 'generated'])
            ->latest('id')
            ->get()
            ->first(fn (PaymentSlip $slip) => $slip->isPayable());

        if ($slip) {
            $this->send($slip, ChargePaymentMail::REMINDER);
        }
    }

    private function send(PaymentSlip $slip, string $kind): void
    {
        // Consulta própria em vez de $slip->charge: carregar a relação deixaria uma cópia
        // desatualizada da cobrança presa no slip do chamador.
        $charge = $slip->charge()->first();
        $email = $charge ? $this->emailResolver->forCharge($charge) : null;

        if (! $email) {
            return;
        }

        Mail::to($email)->queue(new ChargePaymentMail($slip, $kind));
    }
}

<?php

namespace App\Mail\Cliente;

use App\Models\Pagamento\PaymentSlip;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ChargePaymentMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public const AVAILABLE = 'available';

    public const REMINDER = 'reminder';

    public function __construct(
        public PaymentSlip $slip,
        public string $kind,
    ) {
        // Na geração do boleto o slip é gravado dentro de uma transação: sem isso o
        // worker pode buscar o slip antes do commit.
        $this->afterCommit();
    }

    public function build()
    {
        $charge = $this->slip->charge()->with('clientProfile')->first();
        $reference = $charge?->reference_label ?? 'sua cobrança';

        return $this
            ->subject($this->kind === self::REMINDER
                ? "Lembrete: a cobrança de {$reference} vence em breve"
                : "Sua cobrança de {$reference} está disponível para pagamento")
            ->view('emails.cliente.charge-payment', [
                'kind' => $this->kind,
                'slip' => $this->slip,
                'charge' => $charge,
                'clientName' => $charge?->clientProfile?->display_name
                    ?? $charge?->clientProfile?->nome
                    ?? $charge?->clientProfile?->razao_social,
                'dueDate' => $this->slip->effectiveDueDate()?->format('d/m/Y'),
                'portalUrl' => $charge?->clientProfile?->platform_user_id
                    ? route('cliente.cobrancas.show', $charge)
                    : null,
            ]);
    }
}

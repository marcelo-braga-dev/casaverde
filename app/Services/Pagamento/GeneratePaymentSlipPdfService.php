<?php

namespace App\Services\Pagamento;

use App\Exceptions\Payments\PaymentSlipPdfUnavailableException;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Config\SystemSettingService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class GeneratePaymentSlipPdfService
{
    public function __construct(
        private readonly BoletoBarcodeService $barcodeService,
        private readonly SystemSettingService $settings,
    ) {}

    public function stream(PaymentSlip $slip)
    {
        $pdf = $this->buildPdf($slip);

        return $pdf->stream($this->fileName($slip));
    }

    public function download(PaymentSlip $slip)
    {
        $pdf = $this->buildPdf($slip);

        return $pdf->download($this->fileName($slip));
    }

    private function buildPdf(PaymentSlip $slip)
    {
        $this->guardAgainstMissingBoletoData($slip);

        $slip->load(['charge.clientProfile', 'charge.bill']);

        return Pdf::loadView('pdf.pagamentos.payment-slip', [
            'slip' => $slip,
            'barcodeImage' => $this->barcodeService->barcodeImageBase64($slip->barcode),
            'digitableLine' => $this->barcodeService->formatDigitableLine($slip->digitable_line),
            'logoImage' => $this->logoImage(),
            'billItems' => $this->billItems($slip),
        ])->setPaper('a4');
    }

    /**
     * Todas as linhas extraídas da fatura da concessionária (energia consumida,
     * energia injetada/compensada e taxas fixas como iluminação pública) —
     * exibidas no boleto apenas como referência para o cliente conferir a fatura
     * original, sem relação direta com o valor efetivamente cobrado neste boleto.
     */
    private function billItems(PaymentSlip $slip): array
    {
        $bill = $slip->charge?->bill;

        if (! $bill) {
            return [];
        }

        $items = $bill->extracted_payload['items'] ?? [];

        return array_map(fn (array $item) => [
            'descricao' => $item['descricao'],
            'quantidade' => isset($item['quantidade']) ? (float) $item['quantidade'] : null,
        ], $items);
    }

    private function logoImage(): ?string
    {
        $path = $this->settings->get('brand_boleto_logo_path');

        if (! $path || ! Storage::disk('public')->exists($path)) {
            return null;
        }

        $bytes = Storage::disk('public')->get($path);
        $image = @imagecreatefromstring($bytes);

        if ($image === false) {
            return null;
        }

        if (! imageistruecolor($image)) {
            imagepalettetotruecolor($image);
        }
        imagesavealpha($image, true);

        ob_start();
        imagepng($image);
        $png = ob_get_clean();
        imagedestroy($image);

        return 'data:image/png;base64,'.base64_encode($png);
    }

    private function guardAgainstMissingBoletoData(PaymentSlip $slip): void
    {
        if ($slip->provider !== 'mercado_pago') {
            throw new PaymentSlipPdfUnavailableException(
                'A emissão de PDF de boleto próprio está disponível apenas para pagamentos gerados via Mercado Pago.'
            );
        }

        if (! $slip->barcode || ! $slip->digitable_line) {
            throw new PaymentSlipPdfUnavailableException(
                'Este pagamento não possui código de barras ou linha digitável de boleto disponível para emissão de PDF.'
            );
        }
    }

    private function fileName(PaymentSlip $slip): string
    {
        return "boleto-cobranca-{$slip->customer_charge_id}.pdf";
    }
}

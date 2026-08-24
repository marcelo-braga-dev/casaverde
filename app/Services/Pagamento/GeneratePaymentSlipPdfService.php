<?php

namespace App\Services\Pagamento;

use App\Exceptions\Payments\PaymentSlipPdfUnavailableException;
use App\Models\Pagamento\PaymentSlip;
use App\Services\Config\SystemSettingService;
use App\Services\Fatura\BuildBillEnergyBreakdownService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class GeneratePaymentSlipPdfService
{
    public function __construct(
        private readonly BoletoBarcodeService $barcodeService,
        private readonly SystemSettingService $settings,
        private readonly BuildBillEnergyBreakdownService $breakdownService,
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
            'consumptionItems' => $this->consumptionItems($slip),
        ])->setPaper('a4');
    }

    /**
     * Mesmas linhas usadas em "Como chegamos em Consumo Injetado" na tela de conferência
     * de faturas (BuildBillEnergyBreakdownService), só que aqui expomos apenas kWh — sem os
     * valores em R$ da concessionária, que não têm relação com o valor cobrado neste boleto.
     */
    private function consumptionItems(PaymentSlip $slip): array
    {
        $bill = $slip->charge?->bill;

        if (! $bill) {
            return [];
        }

        $items = $this->breakdownService->handle($bill)['injected_consumption']['items'];

        return array_map(fn (array $item) => [
            'descricao' => $item['descricao'],
            'quantidade' => (float) $item['quantidade'],
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

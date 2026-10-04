<?php

namespace Database\Seeders\Support;

use App\Models\Fatura\ConcessionaireBill;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;

/** PDF de demonstração para faturas fictícias (sem ele a revisão marca "PDF inválido"). */
final class DemoBillPdf
{
    public static function write(ConcessionaireBill $bill): string
    {
        $path = $bill->pdf_path ?: sprintf(
            'concessionaire-bills/%d/%d/%02d/demo-%d.pdf',
            $bill->client_profile_id, $bill->reference_year, $bill->reference_month, $bill->id
        );

        Storage::disk($bill->pdf_disk ?: 'local')->put($path, Pdf::loadHTML(self::html($bill))->setPaper('a4')->output());

        return $path;
    }

    private static function html(ConcessionaireBill $bill): string
    {
        $row = fn ($label, $value) => '<tr><td class="l">'.e($label).'</td><td>'.e($value).'</td></tr>';
        $vencimento = $bill->vencimento ? CarbonImmutable::parse($bill->vencimento)->format('d/m/Y') : '—';

        return '<html><head><meta charset="utf-8"><style>
            body{font-family:DejaVu Sans,sans-serif;color:#18221A;font-size:12px}
            .tarja{background:#13326c;color:#fff;padding:10px 14px;font-size:14px;font-weight:bold}
            .aviso{border:2px dashed #D9971A;padding:10px;margin:14px 0;color:#7a5410;font-weight:bold;text-align:center}
            table{width:100%;border-collapse:collapse;margin-top:10px}
            td{border:1px solid #D9E2D6;padding:8px} td.l{background:#EEF3EA;width:40%;font-weight:bold}
        </style></head><body>
            <div class="tarja">FATURA DE ENERGIA ELÉTRICA (FICTÍCIA) · '.e($bill->concessionaria?->nome ?? 'Concessionária').'</div>
            <div class="aviso">Documento de demonstração com dados fictícios. Não é uma fatura real.</div>
            <table>'
                .$row('Titular', $bill->nome)
                .$row('Unidade consumidora', $bill->unidade_consumidora)
                .$row('Número da instalação', $bill->numero_instalacao)
                .$row('Competência', $bill->reference_label)
                .$row('Consumo', number_format((float) $bill->consumo_kwh, 1, ',', '.').' kWh')
                .$row('Vencimento', $vencimento)
                .$row('Valor total', 'R$ '.number_format((float) $bill->valor_total, 2, ',', '.'))
            .'</table></body></html>';
    }
}

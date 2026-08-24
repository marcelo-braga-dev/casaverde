<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">

    <title>
        Boleto - Cobrança #{{ $slip->customer_charge_id }}
    </title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1E293B;
            margin: 0;
            padding: 0;
            background: #FFFFFF;
            line-height: 1.4;
        }

        .page {
            padding: 20px 34px 22px;
        }

        /* ══════════════════════════════════════
           HERO
        ══════════════════════════════════════ */
        .hero {
            background: #064E3B;
            border-radius: 12px;
            padding: 15px 26px;
            color: #FFFFFF;
            margin-bottom: 12px;
        }

        .hero-top {
            width: 100%;
        }

        .wordmark {
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #FFFFFF;
        }

        .wordmark span {
            color: #6EE7B7;
        }

        .logo-caption {
            display: inline-block;
            vertical-align: middle;
            margin-left: 14px;
            font-size: 16px;
        }

        .brand-logo-wrap {
            display: inline-block;
            vertical-align: middle;
            background: #FFFFFF;
            border-radius: 8px;
            padding: 6px 14px;
        }

        .brand-logo {
            height: 38px;
            display: block;
            border-radius: 6px;
        }

        .status-pill {
            float: right;
            padding: 5px 12px;
            border-radius: 999px;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .hero-header {
            width: 100%;
            margin-top: 12px;
        }

        .hero-title-col {
            width: 60%;
            display: inline-block;
            vertical-align: top;
        }

        .doc-title {
            font-size: 21px;
            font-weight: 900;
            margin-bottom: 4px;
            letter-spacing: -0.4px;
        }

        .doc-subtitle {
            font-size: 10px;
            color: rgba(255,255,255,.75);
            line-height: 1.4;
            max-width: 340px;
        }

        .hero-amount-col {
            width: 38%;
            display: inline-block;
            vertical-align: top;
            text-align: right;
        }

        .amount-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6EE7B7;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .amount-value {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: -0.5px;
        }

        .due-value {
            font-size: 11px;
            color: rgba(255,255,255,.85);
            margin-top: 3px;
            font-weight: 700;
        }

        .hero-grid {
            display: table;
            table-layout: fixed;
            width: 100%;
            margin-top: 10px;
            border-spacing: 8px 0;
        }

        .hero-card {
            display: table-cell;
            vertical-align: top;
            background: rgba(255,255,255,.12);
            border: 1px solid rgba(255,255,255,.24);
            border-radius: 8px;
            padding: 6px 14px;
        }

        .hero-label {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6EE7B7;
            margin-bottom: 3px;
            font-weight: 700;
        }

        .hero-value {
            font-size: 13px;
            font-weight: 800;
            color: #FFFFFF;
            word-break: break-word;
        }

        /* ══════════════════════════════════════
           SECTION / CARD
        ══════════════════════════════════════ */
        .section {
            margin-bottom: 9px;
        }

        .section-title {
            font-size: 10px;
            font-weight: 800;
            margin-bottom: 8px;
            color: #065F46;
            padding-bottom: 5px;
            border-bottom: 2px solid #A7F3D0;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }

        .card {
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            padding: 10px 18px;
            background: #FFFFFF;
        }

        .info-row {
            display: table;
            table-layout: fixed;
            width: 100%;
        }

        .info-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .info-col.right {
            padding-left: 16px;
            border-left: 1px solid #F1F5F9;
        }

        .info-label {
            display: block;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #94A3B8;
            font-weight: 700;
            margin-bottom: 2px;
        }

        .info-value {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: #1E293B;
            word-break: break-word;
        }

        /* ══════════════════════════════════════
           CONSUMO — ITENS DA FATURA DA CONCESSIONÁRIA
           (mesmo padrão visual da tabela "Como chegamos em
           Energia Injetada" da tela de conferência de faturas)
        ══════════════════════════════════════ */
        .consumption-card {
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            overflow: hidden;
        }

        .consumption-table {
            display: table;
            table-layout: fixed;
            width: 100%;
            border-collapse: collapse;
        }

        .consumption-row {
            display: table-row;
        }

        .consumption-cell {
            display: table-cell;
            vertical-align: middle;
            font-size: 10px;
            color: #1E293B;
            padding: 6px 12px;
            border-bottom: 1px solid #F1F5F9;
        }

        .consumption-row.head .consumption-cell {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #64748B;
            font-weight: 700;
            padding: 0 12px 5px;
            border-bottom: 1px solid #E2E8F0;
        }

        .consumption-row.total .consumption-cell {
            font-weight: 800;
            color: #065F46;
            background: #F0FDF9;
            border-bottom: none;
        }

        .consumption-row:last-child:not(.total) .consumption-cell {
            border-bottom: none;
        }

        .consumption-cell:first-child {
            padding-left: 16px;
        }

        .consumption-cell:last-child {
            padding-right: 16px;
        }

        .consumption-cell.description {
            width: 68%;
        }

        .consumption-cell.kwh {
            width: 32%;
            text-align: right;
            font-weight: 700;
        }

        /* ══════════════════════════════════════
           PAGAMENTO — LINHA DIGITÁVEL + BARCODE
        ══════════════════════════════════════ */
        .payment-card {
            border: 1.5px dashed #059669;
            border-radius: 10px;
            padding: 9px 18px;
            background: #F0FDF9;
            text-align: center;
            page-break-inside: avoid;
        }

        .payment-card-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #059669;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .digitable-line {
            font-family: 'DejaVu Sans Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: #064E3B;
            letter-spacing: 0.3px;
            padding: 6px 10px;
            background: #FFFFFF;
            border: 1px solid #A7F3D0;
            border-radius: 6px;
            display: inline-block;
        }

        .barcode-wrap {
            margin-top: 7px;
            padding: 5px 12px;
            background: #FFFFFF;
            border-radius: 6px;
            display: inline-block;
        }

        .barcode-wrap img {
            height: 30px;
        }

        .payment-card-caption {
            font-size: 8.5px;
            color: #64748B;
            margin-top: 5px;
        }

        /* ══════════════════════════════════════
           COMO PAGAR
        ══════════════════════════════════════ */
        .steps {
            display: table;
            width: 100%;
            table-layout: fixed;
            border-spacing: 10px 0;
            page-break-inside: avoid;
        }

        .step {
            display: table-cell;
            vertical-align: top;
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            padding: 7px 10px;
        }

        .step-number {
            float: left;
            width: 15px;
            height: 15px;
            line-height: 15px;
            text-align: center;
            border-radius: 999px;
            background: #064E3B;
            color: #6EE7B7;
            font-size: 8px;
            font-weight: 900;
        }

        .step-text {
            margin-left: 21px;
            font-size: 9px;
            color: #334155;
            line-height: 1.35;
        }

        /* ══════════════════════════════════════
           FOOTER
        ══════════════════════════════════════ */
        .footer {
            margin-top: 10px;
            padding-top: 9px;
            border-top: 1px solid #F1F5F9;
            page-break-inside: avoid;
        }

        .footer-note {
            font-size: 8.5px;
            color: #94A3B8;
            line-height: 1.6;
        }

        .footer-meta {
            display: table;
            width: 100%;
            margin-top: 10px;
        }

        .footer-meta-col {
            display: table-cell;
            font-size: 8.5px;
            color: #94A3B8;
        }

        .footer-meta-col.right {
            text-align: right;
        }
    </style>
</head>

<body>

@php
    $statusMap = [
        'pending' => ['label' => 'Pendente', 'bg' => 'rgba(217,119,6,.25)', 'color' => '#FDE68A'],
        'generated' => ['label' => 'Gerado', 'bg' => 'rgba(255,255,255,.18)', 'color' => '#FFFFFF'],
        'paid' => ['label' => 'Pago', 'bg' => 'rgba(110,231,183,.22)', 'color' => '#6EE7B7'],
        'cancelled' => ['label' => 'Cancelado', 'bg' => 'rgba(255,255,255,.14)', 'color' => 'rgba(255,255,255,.75)'],
        'failed' => ['label' => 'Falhou', 'bg' => 'rgba(220,38,38,.25)', 'color' => '#FCA5A5'],
        'expired' => ['label' => 'Expirado', 'bg' => 'rgba(217,119,6,.25)', 'color' => '#FDE68A'],
    ];
    $statusInfo = $statusMap[$slip->status] ?? ['label' => $slip->status, 'bg' => 'rgba(255,255,255,.14)', 'color' => '#FFFFFF'];

    $charge = $slip->charge;
    $clientProfile = $charge?->clientProfile;
@endphp

<div class="page">

    <div class="hero">
        <div class="hero-top">
            @if(! empty($logoImage))
                <span class="brand-logo-wrap">
                    <img src="{{ $logoImage }}" alt="Casa Verde Energia" class="brand-logo">
                </span>
                <span class="wordmark logo-caption">Casa<span>Verde</span></span>
            @else
                <span class="wordmark">Casa<span>Verde</span> Energia</span>
            @endif
            <span class="status-pill" style="background: {{ $statusInfo['bg'] }}; color: {{ $statusInfo['color'] }};">
                {{ $statusInfo['label'] }}
            </span>
        </div>

        <div class="hero-header">
            <div class="hero-title-col">
                <div class="doc-title">Boleto de Cobrança</div>
                <div class="doc-subtitle">
                    Referente ao fornecimento de energia por compensação/assinatura.
                </div>
            </div>

            <div class="hero-amount-col">
                <div class="amount-label">Valor a pagar</div>
                <div class="amount-value">R$ {{ number_format((float) $slip->amount, 2, ',', '.') }}</div>
                <div class="due-value">Vencimento em {{ optional($slip->due_date)->format('d/m/Y') }}</div>
            </div>
        </div>

        <div class="hero-grid">
            <div class="hero-card">
                <div class="hero-label">Cobrança nº</div>
                <div class="hero-value">#{{ str_pad((string) $slip->customer_charge_id, 6, '0', STR_PAD_LEFT) }}</div>
            </div>
            <div class="hero-card">
                <div class="hero-label">Referência</div>
                <div class="hero-value">{{ $charge?->reference_label ?: '—' }}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Dados do pagador</div>
        <div class="card">
            <div class="info-row">
                <div class="info-col">
                    <span class="info-label">Nome / Razão social</span>
                    <span class="info-value">{{ $clientProfile?->display_name ?: '—' }}</span>
                </div>
                <div class="info-col right">
                    <span class="info-label">CPF / CNPJ</span>
                    <span class="info-value">{{ $clientProfile?->documento ?: '—' }}</span>
                </div>
            </div>
        </div>
    </div>

    @if(! empty($consumptionItems))
        <div class="section">
            <div class="section-title">Consumo Injetado — Fatura da Concessionária</div>
            <div class="consumption-card">
                <div class="consumption-table">
                    <div class="consumption-row head">
                        <span class="consumption-cell description">Linha da fatura</span>
                        <span class="consumption-cell kwh">Quantidade (kWh)</span>
                    </div>
                    @foreach($consumptionItems as $item)
                        <div class="consumption-row">
                            <span class="consumption-cell description">{{ $item['descricao'] ?: '—' }}</span>
                            <span class="consumption-cell kwh">{{ number_format(abs($item['quantidade']), 2, ',', '.') }} kWh</span>
                        </div>
                    @endforeach
                    <div class="consumption-row total">
                        <span class="consumption-cell description">Total</span>
                        <span class="consumption-cell kwh">{{ number_format(abs(array_sum(array_column($consumptionItems, 'quantidade'))), 2, ',', '.') }} kWh</span>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <div class="section">
        <div class="section-title">Pagamento — Boleto Bancário</div>
        <div class="payment-card">
            <div class="payment-card-label">Linha digitável</div>
            <div class="digitable-line">{{ $digitableLine }}</div>

            <div class="barcode-wrap">
                <img src="{{ $barcodeImage }}" alt="Código de barras do boleto">
            </div>

            <div class="payment-card-caption">
                Código de barras padrão bancário (Interleaved 2 de 5) — leia no app do seu banco ou digite a linha
                acima no internet banking, lotérica ou terminal de autoatendimento.
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Como pagar</div>
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Copie a linha digitável ou aponte a câmera do app do seu banco para o código de barras.</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Pague pelo internet banking, aplicativo, lotérica ou terminal de autoatendimento até o vencimento.</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-text">A compensação pode levar até 1 dia útil após o pagamento ser efetuado.</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-note">
            Este documento é um recibo de cobrança emitido pela Casa Verde Energia com base nos dados oficiais
            fornecidos pelo Mercado Pago (arranjo bancário Bradesco). Não substitui a ficha de compensação bancária
            oficial; em caso de qualquer divergência, prevalecem o código de barras e a linha digitável acima.
        </div>
        <div class="footer-meta">
            <span class="footer-meta-col">Emitido em {{ now()->format('d/m/Y \à\s H:i') }}</span>
            <span class="footer-meta-col right">Casa Verde Energia · suporte@casaverde.coop.br</span>
        </div>
    </div>

</div>

</body>
</html>

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
            line-height: 1.55;
        }

        .page {
            padding: 24px 34px 28px;
        }

        /* ══════════════════════════════════════
           HERO
        ══════════════════════════════════════ */
        .hero {
            background: #064E3B;
            border-radius: 12px;
            padding: 18px 26px 18px;
            color: #FFFFFF;
            margin-bottom: 14px;
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

        .brand-logo {
            height: 30px;
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
            font-size: 10.5px;
            color: rgba(255,255,255,.75);
            line-height: 1.6;
            max-width: 320px;
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
            margin-top: 14px;
            width: 100%;
        }

        .hero-card {
            width: 31.3%;
            display: inline-block;
            vertical-align: top;
            margin-right: 2%;
            background: rgba(255,255,255,.10);
            border: 1px solid rgba(255,255,255,.20);
            border-radius: 8px;
            padding: 8px 13px;
        }

        .hero-card:last-child {
            margin-right: 0;
        }

        .hero-label {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6EE7B7;
            margin-bottom: 4px;
            font-weight: 700;
        }

        .hero-value {
            font-size: 12px;
            font-weight: 800;
            color: #FFFFFF;
        }

        /* ══════════════════════════════════════
           SECTION / CARD
        ══════════════════════════════════════ */
        .section {
            margin-bottom: 12px;
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
            padding: 13px 18px;
            background: #FFFFFF;
        }

        .grid-2 {
            width: 100%;
        }

        .grid-col {
            width: 48%;
            display: inline-block;
            vertical-align: top;
        }

        .grid-col.right {
            margin-left: 3%;
            border-left: 1px solid #F1F5F9;
            padding-left: 16px;
        }

        .info-row {
            display: table;
            width: 100%;
            margin-bottom: 6px;
            padding-bottom: 6px;
            border-bottom: 1px dashed #F1F5F9;
        }

        .info-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        .info-label {
            display: table-cell;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #94A3B8;
            font-weight: 700;
        }

        .info-value {
            display: table-cell;
            text-align: right;
            font-size: 11px;
            font-weight: 700;
            color: #1E293B;
        }

        /* ══════════════════════════════════════
           PAGAMENTO — LINHA DIGITÁVEL + BARCODE
        ══════════════════════════════════════ */
        .payment-card {
            border: 1.5px dashed #059669;
            border-radius: 10px;
            padding: 14px 20px;
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
            margin-bottom: 6px;
        }

        .digitable-line {
            font-family: 'DejaVu Sans Mono', monospace;
            font-size: 13px;
            font-weight: 700;
            color: #064E3B;
            letter-spacing: 0.5px;
            padding: 8px 12px;
            background: #FFFFFF;
            border: 1px solid #A7F3D0;
            border-radius: 6px;
            display: inline-block;
        }

        .barcode-wrap {
            margin-top: 12px;
            padding: 8px 14px;
            background: #FFFFFF;
            border-radius: 6px;
            display: inline-block;
        }

        .barcode-wrap img {
            height: 44px;
        }

        .payment-card-caption {
            font-size: 8.5px;
            color: #64748B;
            margin-top: 8px;
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
            padding: 10px 12px;
        }

        .step-number {
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 999px;
            background: #064E3B;
            color: #6EE7B7;
            font-size: 8.5px;
            font-weight: 900;
            margin-bottom: 6px;
        }

        .step-text {
            font-size: 9.5px;
            color: #334155;
            line-height: 1.5;
        }

        /* ══════════════════════════════════════
           FOOTER
        ══════════════════════════════════════ */
        .footer {
            margin-top: 14px;
            padding-top: 12px;
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
    $usina = $charge?->usina;
    $consultor = $clientProfile?->consultor;
@endphp

<div class="page">

    <div class="hero">
        <div class="hero-top">
            @if(! empty($logoImage))
                <img src="{{ $logoImage }}" alt="Casa Verde Energia" class="brand-logo">
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
                    Documento de cobrança referente ao fornecimento de energia
                    por compensação/assinatura Casa Verde Energia.
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
            <div class="hero-card">
                <div class="hero-label">Emitido via</div>
                <div class="hero-value">Mercado Pago</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Dados do pagador</div>
        <div class="card">
            <div class="grid-2">
                <div class="grid-col">
                    <div class="info-row">
                        <span class="info-label">Nome / Razão social</span>
                        <span class="info-value">{{ $clientProfile?->display_name ?: '—' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">CPF / CNPJ</span>
                        <span class="info-value">{{ $clientProfile?->documento ?: '—' }}</span>
                    </div>
                </div>
                <div class="grid-col right">
                    <div class="info-row">
                        <span class="info-label">Usina</span>
                        <span class="info-value">{{ $usina?->usina_nome ?: '—' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Consultor responsável</span>
                        <span class="info-value">{{ $consultor?->name ?: '—' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

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

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">

    <title>
        Proposta Comercial - {{ $proposal->proposal_code }}
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
            padding: 30px 34px 34px;
        }

        /* ══════════════════════════════════════
           HERO
        ══════════════════════════════════════ */
        .hero {
            background: #064E3B;
            border-radius: 12px;
            padding: 26px 28px 22px;
            color: #FFFFFF;
            margin-bottom: 20px;
        }

        .hero-top {
            width: 100%;
        }

        .logo {
            height: 48px;
            margin-bottom: 14px;
        }

        .proposal-title {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 5px;
            letter-spacing: -0.5px;
        }

        .proposal-subtitle {
            font-size: 11px;
            color: rgba(255,255,255,.75);
            line-height: 1.6;
            max-width: 480px;
        }

        .hero-grid {
            margin-top: 18px;
            width: 100%;
        }

        .hero-card {
            width: 31%;
            display: inline-block;
            vertical-align: top;
            margin-right: 2%;
            background: rgba(255,255,255,.10);
            border: 1px solid rgba(255,255,255,.20);
            border-radius: 8px;
            padding: 11px 14px;
        }

        .hero-card:last-child {
            margin-right: 0;
        }

        .hero-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #6EE7B7;
            margin-bottom: 5px;
            font-weight: 700;
        }

        .hero-value {
            font-size: 15px;
            font-weight: 800;
            color: #FFFFFF;
        }

        /* ══════════════════════════════════════
           SECTION
        ══════════════════════════════════════ */
        .section {
            margin-bottom: 18px;
        }

        .section-title {
            font-size: 10px;
            font-weight: 800;
            margin-bottom: 10px;
            color: #065F46;
            padding-bottom: 6px;
            border-bottom: 2px solid #A7F3D0;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }

        /* ══════════════════════════════════════
           CARD
        ══════════════════════════════════════ */
        .card {
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            padding: 16px 18px;
            background: #FFFFFF;
        }

        /* ══════════════════════════════════════
           INFO GRID — CLIENTE
        ══════════════════════════════════════ */
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
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #F1F5F9;
        }

        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .label {
            display: table-cell;
            font-weight: 700;
            color: #94A3B8;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            width: 42%;
            vertical-align: middle;
        }

        .value {
            display: table-cell;
            color: #1E293B;
            font-weight: 700;
            font-size: 11.5px;
            vertical-align: middle;
        }

        /* ══════════════════════════════════════
           ECONOMY CARDS
        ══════════════════════════════════════ */
        .economy-boxes {
            margin-top: 0;
            margin-bottom: 16px;
        }

        .economy-card {
            width: 23.5%;
            display: inline-block;
            vertical-align: top;
            margin-right: 1%;
            border-radius: 8px;
            padding: 13px 12px 12px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-top: 3px solid #CBD5E1;
            text-align: center;
        }

        .economy-card:nth-child(1) { border-top-color: #3B82F6; }
        .economy-card:nth-child(2) { border-top-color: #10B981; }
        .economy-card:nth-child(3) { border-top-color: #F59E0B; }
        .economy-card:nth-child(4) { border-top-color: #8B5CF6; }

        .economy-card:last-child {
            margin-right: 0;
        }

        .economy-title {
            font-size: 8.5px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #64748B;
            margin-bottom: 7px;
            font-weight: 700;
        }

        .economy-value {
            font-size: 17px;
            font-weight: 900;
            color: #0F172A;
            letter-spacing: -0.5px;
        }

        /* ══════════════════════════════════════
           HIGHLIGHT
        ══════════════════════════════════════ */
        .highlight-box {
            margin-top: 0;
            background: #064E3B;
            border: none;
            border-radius: 10px;
            padding: 20px 24px;
            text-align: center;
        }

        .highlight-title {
            font-size: 9px;
            color: #6EE7B7;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
        }

        .highlight-percent {
            font-size: 44px;
            font-weight: 900;
            color: #ECFDF5;
            margin-bottom: 4px;
            letter-spacing: -2px;
            line-height: 1;
        }

        .highlight-amount {
            font-size: 26px;
            font-weight: 900;
            color: #6EE7B7;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .highlight-description {
            font-size: 11px;
            color: rgba(255,255,255,.65);
        }

        /* ══════════════════════════════════════
           TABELA COMPARATIVO
        ══════════════════════════════════════ */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0;
        }

        thead {
            background: #064E3B;
            color: #FFFFFF;
        }

        th {
            padding: 10px 14px;
            font-size: 10px;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #FFFFFF;
        }

        th:first-child {
            text-align: left;
            border-radius: 7px 0 0 0;
            padding-left: 16px;
        }

        th:last-child {
            border-radius: 0 7px 0 0;
            background: #047857;
        }

        td {
            padding: 10px 14px;
            border-bottom: 1px solid #F1F5F9;
            text-align: center;
            font-size: 11.5px;
        }

        td:first-child {
            text-align: left;
            font-weight: 700;
            color: #334155;
            padding-left: 16px;
        }

        td:last-child {
            background: #F0FDF4;
        }

        tbody tr:nth-child(odd) {
            background: #FFFFFF;
        }

        tbody tr:nth-child(even) {
            background: #F8FAFC;
        }

        tbody tr:nth-child(even) td:last-child {
            background: #DCFCE7;
        }

        tbody tr:last-child td {
            border-bottom: none;
        }

        .td-concessionaria {
            color: #475569;
            font-size: 11.5px;
        }

        .td-casaverde {
            color: #065F46;
            font-weight: 800;
        }

        .positive {
            color: #15803D;
            font-weight: 900;
        }

        /* ══════════════════════════════════════
           NOTAS
        ══════════════════════════════════════ */
        .notes-content {
            font-size: 11px;
            color: #475569;
            line-height: 1.7;
        }

        /* ══════════════════════════════════════
           FOOTER
        ══════════════════════════════════════ */
        .footer {
            margin-top: 28px;
            padding-top: 14px;
            border-top: 1px solid #E2E8F0;
            font-size: 9.5px;
            color: #94A3B8;
            line-height: 1.7;
        }

        .footer strong {
            color: #64748B;
            font-weight: 700;
        }

        /* ══════════════════════════════════════
           ASSINATURA
        ══════════════════════════════════════ */
        .signature-area {
            margin-top: 50px;
        }

        .signature-box {
            width: 42%;
            display: inline-block;
            vertical-align: top;
            text-align: center;
        }

        .signature-line {
            border-top: 1px solid #94A3B8;
            margin-bottom: 6px;
            padding-top: 10px;
            font-size: 11px;
            color: #334155;
            font-weight: 700;
        }

        .text-muted {
            color: #94A3B8;
            font-size: 9.5px;
        }

    </style>
</head>

<body>

@php

    $valorMedio = (float) ($proposal->valor_medio ?? 0);

    $taxaReducao = (float) ($proposal->discount_percent ?? 0);

    $valorCasaVerde = $valorMedio * (
        1 - ($taxaReducao / 100)
    );

    $economiaMensal = $valorMedio - $valorCasaVerde;

    $economiaAnual = $economiaMensal * 12;

    $economiaTrimestral = $economiaMensal * 3;

    $economiaSemestral = $economiaMensal * 6;

@endphp

<div class="page">

    <div class="hero">

        <div class="hero-top">

            @if(!empty($logoBase64))
                <img
                    src="{{ $logoBase64 }}"
                    class="logo"
                >
            @endif

            <div class="proposal-title">
                Proposta Comercial
            </div>

            <div class="proposal-subtitle">
                Proposta personalizada de redução de custos
                com energia elétrica através da Casa Verde Energia.
            </div>

        </div>

        <div class="hero-grid">

            <div class="hero-card">
                <div class="hero-label">
                    Código da proposta
                </div>

                <div class="hero-value">
                    {{ $proposal->proposal_code }}
                </div>
            </div>

            <div class="hero-card">
                <div class="hero-label">
                    Data de emissão
                </div>

                <div class="hero-value">
                    {{ $proposal->issued_at?->format('d/m/Y') }}
                </div>
            </div>

            <div class="hero-card">
                <div class="hero-label">
                    Validade
                </div>

                <div class="hero-value">
                    {{ $proposal->valid_until?->format('d/m/Y') ?? '30 dias' }}
                </div>
            </div>

        </div>

    </div>

    <div class="section">

        <div class="section-title">
            Informações do Cliente
        </div>

        <div class="card">

            <div class="grid-2">

                <div class="grid-col">

                    <div class="info-row">
                        <span class="label">Cliente</span>
                        <span class="value">
                            {{ $proposal->clientProfile->display_name }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">Documento</span>
                        <span class="value">
                            {{ $proposal->clientProfile->documento ?? '-' }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">Unidade Consumidora</span>
                        <span class="value">
                            {{ $proposal->unidade_consumidora ?? '-' }}
                        </span>
                    </div>

                </div>

                <div class="grid-col right">

                    <div class="info-row">
                        <span class="label">Concessionária</span>
                        <span class="value">
                            {{ $proposal->concessionaria?->nome ?? '-' }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">Consultor</span>
                        <span class="value">
                            {{ $proposal->consultor?->name ?? '-' }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">Emitida em</span>
                        <span class="value">
                            {{ $proposal->issued_at?->format('d/m/Y') ?? '-' }}
                        </span>
                    </div>

                </div>

            </div>

        </div>

    </div>

    <div class="section">

        <div class="section-title">
            Resumo da Proposta
        </div>

        <div class="card">

            <div class="economy-boxes">

                <div class="economy-card">

                    <div class="economy-title">
                        Média Mensal
                    </div>

                    <div class="economy-value">
                        R$ {{ number_format($valorMedio, 2, ',', '.') }}
                    </div>

                </div>

                <div class="economy-card">

                    <div class="economy-title">
                        Consumo Médio
                    </div>

                    <div class="economy-value">
                        {{ number_format((float) ($proposal->media_consumo ?? 0), 0, ',', '.') }} kWh
                    </div>

                </div>

                <div class="economy-card">

                    <div class="economy-title">
                        Taxa de Redução
                    </div>

                    <div class="economy-value">
                        {{ number_format($taxaReducao, 2, ',', '.') }}%
                    </div>

                </div>

                <div class="economy-card">

                    <div class="economy-title">
                        Prazo Contrato
                    </div>

                    <div class="economy-value">
                        {{ $proposal->prazo_locacao ?? '-' }} meses
                    </div>

                </div>

            </div>

            <div class="highlight-box">

                <div class="highlight-title">
                    SUA MÉDIA DE ECONOMIA ANUAL
                </div>

                <div class="highlight-percent">
                    {{ number_format($taxaReducao, 2, ',', '.') }}%
                </div>

                <div class="highlight-amount">
                    R$ {{ number_format($economiaAnual, 2, ',', '.') }}
                </div>

                <div class="highlight-description">
                    Economia projetada anual com energia solar
                    através da Casa Verde Energia.
                </div>

            </div>

        </div>

    </div>

    <div class="section">

        <div class="section-title">
            Comparativo Financeiro
        </div>

        <div class="card">

            <table>

                <thead>
                <tr>
                    <th>Período</th>
                    <th>Concessionária</th>
                    <th>Casa Verde</th>
                    <th>Economia</th>
                </tr>
                </thead>

                <tbody>

                <tr>
                    <td>Mensal</td>
                    <td class="td-concessionaria">R$ {{ number_format($valorMedio, 2, ',', '.') }}</td>
                    <td class="td-casaverde">R$ {{ number_format($valorCasaVerde, 2, ',', '.') }}</td>
                    <td class="positive">R$ {{ number_format($economiaMensal, 2, ',', '.') }}</td>
                </tr>

                <tr>
                    <td>Trimestral</td>
                    <td class="td-concessionaria">R$ {{ number_format($valorMedio * 3, 2, ',', '.') }}</td>
                    <td class="td-casaverde">R$ {{ number_format($valorCasaVerde * 3, 2, ',', '.') }}</td>
                    <td class="positive">R$ {{ number_format($economiaTrimestral, 2, ',', '.') }}</td>
                </tr>

                <tr>
                    <td>Semestral</td>
                    <td class="td-concessionaria">R$ {{ number_format($valorMedio * 6, 2, ',', '.') }}</td>
                    <td class="td-casaverde">R$ {{ number_format($valorCasaVerde * 6, 2, ',', '.') }}</td>
                    <td class="positive">R$ {{ number_format($economiaSemestral, 2, ',', '.') }}</td>
                </tr>

                <tr>
                    <td>Anual</td>
                    <td class="td-concessionaria">R$ {{ number_format($valorMedio * 12, 2, ',', '.') }}</td>
                    <td class="td-casaverde">R$ {{ number_format($valorCasaVerde * 12, 2, ',', '.') }}</td>
                    <td class="positive">R$ {{ number_format($economiaAnual, 2, ',', '.') }}</td>
                </tr>

                </tbody>

            </table>

        </div>

    </div>

    @if($proposal->notes)

        <div class="section">

            <div class="section-title">
                Observações
            </div>

            <div class="card">

                <div class="notes-content">
                    {!! nl2br(e($proposal->notes)) !!}
                </div>

            </div>

        </div>

    @endif

    <div class="footer">

        <strong>
            Casa Verde Energia
        </strong>

        <br>

        Esta proposta possui caráter comercial e poderá
        sofrer alterações conforme análise técnica,
        disponibilidade energética e aprovação contratual.

        <br><br>

        Os valores apresentados são estimativas calculadas
        com base no histórico médio de consumo informado
        pelo cliente.

    </div>

    <div class="signature-area">

        <div class="signature-box">

            <div class="signature-line">
                Cliente
            </div>

            <div class="text-muted">
                Assinatura e carimbo
            </div>

        </div>

        <div
            class="signature-box"
            style="float:right;"
        >

            <div class="signature-line">
                Casa Verde Energia
            </div>

            <div class="text-muted">
                Consultor responsável
            </div>

        </div>

    </div>

</div>

</body>
</html>

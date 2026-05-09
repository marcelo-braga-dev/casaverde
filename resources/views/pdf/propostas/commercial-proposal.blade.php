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
            font-size: 12px;
            color: #1F2937;
            margin: 0;
            padding: 0;
            background: #FFFFFF;
        }

        .page {
            padding: 34px;
        }

        .hero {
            background: linear-gradient(
                135deg,
                #0F3D2E 0%,
                #14532D 100%
            );

            border-radius: 18px;

            padding: 32px;

            color: #FFFFFF;

            margin-bottom: 26px;
        }

        .hero-top {
            width: 100%;
        }

        .logo {
            height: 58px;
            margin-bottom: 22px;
        }

        .proposal-title {
            font-size: 30px;
            font-weight: 900;
            margin-bottom: 10px;
        }

        .proposal-subtitle {
            font-size: 13px;
            opacity: .92;
            line-height: 1.5;
        }

        .hero-grid {
            margin-top: 26px;
            width: 100%;
        }

        .hero-card {
            width: 31%;
            display: inline-block;
            vertical-align: top;
            margin-right: 2%;
            background: rgba(255,255,255,.10);
            border: 1px solid rgba(255,255,255,.14);
            border-radius: 14px;
            padding: 16px;
        }

        .hero-card:last-child {
            margin-right: 0;
        }

        .hero-label {
            font-size: 11px;
            text-transform: uppercase;
            opacity: .75;
            margin-bottom: 8px;
        }

        .hero-value {
            font-size: 18px;
            font-weight: 800;
        }

        .section {
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 14px;
            color: #0F172A;
            padding-bottom: 8px;
            border-bottom: 2px solid #E5E7EB;
        }

        .card {
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            padding: 20px;
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
        }

        .info-row {
            margin-bottom: 10px;
        }

        .label {
            font-weight: 700;
            color: #374151;
        }

        .value {
            color: #111827;
        }

        .highlight-box {
            margin-top: 26px;

            background: linear-gradient(
                135deg,
                #DCFCE7 0%,
                #ECFCCB 100%
            );

            border: 1px solid #BBF7D0;

            border-radius: 18px;

            padding: 26px;

            text-align: center;
        }

        .highlight-title {
            font-size: 15px;
            color: #166534;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .highlight-percent {
            font-size: 42px;
            font-weight: 900;
            color: #166534;
            margin-bottom: 12px;
        }

        .highlight-description {
            font-size: 14px;
            color: #166534;
        }

        .economy-boxes {
            margin-top: 26px;
        }

        .economy-card {
            width: 23.5%;
            display: inline-block;
            vertical-align: top;
            margin-right: 1%;
            border-radius: 14px;
            padding: 18px;
            background: #F9FAFB;
            border: 1px solid #E5E7EB;
        }

        .economy-card:last-child {
            margin-right: 0;
        }

        .economy-title {
            font-size: 11px;
            text-transform: uppercase;
            color: #6B7280;
            margin-bottom: 10px;
        }

        .economy-value {
            font-size: 20px;
            font-weight: 800;
            color: #111827;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
        }

        thead {
            background: #14532D;
            color: #FFFFFF;
        }

        th {
            padding: 14px;
            font-size: 12px;
            text-align: center;
            font-weight: 700;
        }

        td {
            padding: 14px;
            border-bottom: 1px solid #E5E7EB;
            text-align: center;
            font-size: 12px;
        }

        tbody tr:nth-child(even) {
            background: #F9FAFB;
        }

        .positive {
            color: #15803D;
            font-weight: 700;
        }

        .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #E5E7EB;
            font-size: 11px;
            color: #6B7280;
            line-height: 1.6;
        }

        .signature-area {
            margin-top: 70px;
        }

        .signature-box {
            width: 42%;
            display: inline-block;
            vertical-align: top;
            text-align: center;
        }

        .signature-line {
            border-top: 1px solid #111827;
            margin-bottom: 10px;
            padding-top: 10px;
        }

        .text-muted {
            color: #6B7280;
        }

    </style>
</head>

<body>

@php

    $valorMedio = (float) ($proposal->valor_medio ?? 0);

    $taxaReducao = (float) ($proposal->taxa_reducao ?? 0);

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
                        <span class="label">
                            Cliente:
                        </span>

                        <span class="value">
                            {{ $proposal->clientProfile->display_name }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">
                            Documento:
                        </span>

                        <span class="value">
                            {{ $proposal->clientProfile->documento ?? '-' }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">
                            Unidade Consumidora:
                        </span>

                        <span class="value">
                            {{ $proposal->unidade_consumidora ?? '-' }}
                        </span>
                    </div>

                </div>

                <div class="grid-col right">

                    <div class="info-row">
                        <span class="label">
                            Cidade:
                        </span>

                        <span class="value">
                            {{ $proposal->clientProfile->cidade ?? '-' }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">
                            Concessionária:
                        </span>

                        <span class="value">
                            {{ $proposal->concessionaria?->nome ?? '-' }}
                        </span>
                    </div>

                    <div class="info-row">
                        <span class="label">
                            Consultor:
                        </span>

                        <span class="value">
                            {{ $proposal->consultor?->nome ?? '-' }}
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

                <div
                    style="
                        font-size: 34px;
                        font-weight: 900;
                        color: #166534;
                        margin-bottom: 12px;
                    "
                >
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
                    <th>
                        Período
                    </th>

                    <th>
                        Concessionária
                    </th>

                    <th>
                        Casa Verde
                    </th>

                    <th>
                        Economia
                    </th>
                </tr>
                </thead>

                <tbody>

                <tr>
                    <td>
                        Mensal
                    </td>

                    <td>
                        R$ {{ number_format($valorMedio, 2, ',', '.') }}
                    </td>

                    <td>
                        R$ {{ number_format($valorCasaVerde, 2, ',', '.') }}
                    </td>

                    <td class="positive">
                        R$ {{ number_format($economiaMensal, 2, ',', '.') }}
                    </td>
                </tr>

                <tr>
                    <td>
                        Trimestral
                    </td>

                    <td>
                        R$ {{ number_format($valorMedio * 3, 2, ',', '.') }}
                    </td>

                    <td>
                        R$ {{ number_format($valorCasaVerde * 3, 2, ',', '.') }}
                    </td>

                    <td class="positive">
                        R$ {{ number_format($economiaTrimestral, 2, ',', '.') }}
                    </td>
                </tr>

                <tr>
                    <td>
                        Semestral
                    </td>

                    <td>
                        R$ {{ number_format($valorMedio * 6, 2, ',', '.') }}
                    </td>

                    <td>
                        R$ {{ number_format($valorCasaVerde * 6, 2, ',', '.') }}
                    </td>

                    <td class="positive">
                        R$ {{ number_format($economiaSemestral, 2, ',', '.') }}
                    </td>
                </tr>

                <tr>
                    <td>
                        Anual
                    </td>

                    <td>
                        R$ {{ number_format($valorMedio * 12, 2, ',', '.') }}
                    </td>

                    <td>
                        R$ {{ number_format($valorCasaVerde * 12, 2, ',', '.') }}
                    </td>

                    <td class="positive">
                        R$ {{ number_format($economiaAnual, 2, ',', '.') }}
                    </td>
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

                {!! nl2br(e($proposal->notes)) !!}

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

        </div>

        <div
            class="signature-box"
            style="float:right;"
        >

            <div class="signature-line">
                Casa Verde Energia
            </div>

        </div>

    </div>

</div>

</body>
</html>

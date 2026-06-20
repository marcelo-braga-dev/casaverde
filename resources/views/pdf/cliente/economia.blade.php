<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #1a1a2e;
            background: #ffffff;
        }

        /* HEADER */
        .header {
            background: linear-gradient(135deg, #064e3b, #065f46);
            color: #ffffff;
            padding: 24px 28px 20px;
            margin-bottom: 20px;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .brand {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: -0.5px;
        }

        .brand span {
            color: #6ee7b7;
        }

        .report-title {
            font-size: 14px;
            font-weight: 700;
            opacity: 0.85;
            text-align: right;
        }

        .report-subtitle {
            font-size: 10px;
            opacity: 0.65;
            text-align: right;
        }

        .header-client {
            background: rgba(255,255,255,0.12);
            border-radius: 6px;
            padding: 10px 14px;
        }

        .header-client-name {
            font-size: 13px;
            font-weight: 900;
        }

        .header-client-meta {
            font-size: 9px;
            opacity: 0.75;
            margin-top: 3px;
        }

        /* HERO ECONOMIA */
        .hero {
            margin: 0 20px 20px;
        }

        .hero-grid {
            display: flex;
            gap: 12px;
        }

        .hero-card {
            flex: 1;
            border-radius: 8px;
            padding: 14px 16px;
            text-align: center;
        }

        .hero-card.concessionaria {
            background: #fef3c7;
            border: 1px solid #fde68a;
        }

        .hero-card.casaverde {
            background: #d1fae5;
            border: 1px solid #6ee7b7;
        }

        .hero-card.savings {
            background: #064e3b;
            color: #ffffff;
        }

        .hero-card-label {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.75;
            margin-bottom: 6px;
        }

        .hero-card-value {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: -0.5px;
        }

        .hero-card.concessionaria .hero-card-value { color: #92400e; }
        .hero-card.casaverde .hero-card-value { color: #065f46; }
        .hero-card.savings .hero-card-value { color: #6ee7b7; }

        .hero-card-sub {
            font-size: 9px;
            opacity: 0.7;
            margin-top: 4px;
        }

        /* MENSAGEM */
        .message-box {
            margin: 0 20px 20px;
            background: #f0fdf4;
            border-left: 4px solid #065f46;
            border-radius: 4px;
            padding: 10px 14px;
        }

        .message-box p {
            font-size: 10px;
            color: #065f46;
            line-height: 1.6;
        }

        /* SECTION */
        .section {
            margin: 0 20px 20px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 900;
            color: #064e3b;
            border-bottom: 2px solid #064e3b;
            padding-bottom: 5px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* TABLE */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
        }

        thead th {
            background: #064e3b;
            color: #ffffff;
            padding: 7px 6px;
            text-align: center;
            font-weight: 700;
            font-size: 8.5px;
        }

        thead th:first-child { text-align: left; border-radius: 4px 0 0 0; }
        thead th:last-child  { border-radius: 0 4px 0 0; }

        tbody tr:nth-child(even) { background: #f8fdf9; }

        tbody td {
            padding: 6px;
            border-bottom: 1px solid #e2e8f0;
            text-align: center;
        }

        tbody td:first-child { text-align: left; font-weight: 700; }

        .td-original { color: #92400e; font-weight: 700; }
        .td-final    { color: #065f46; font-weight: 900; }
        .td-savings  { color: #047857; font-weight: 700; }
        .td-pct      { color: #047857; font-weight: 700; }

        .status-paid     { color: #065f46; font-weight: 700; }
        .status-open     { color: #92400e; }
        .status-overdue  { color: #dc2626; }
        .status-waiting  { color: #1e40af; }

        /* TOTALS ROW */
        .total-row td {
            background: #064e3b;
            color: #ffffff;
            font-weight: 900;
            font-size: 10px;
            padding: 8px 6px;
            border: none;
        }

        .total-row td:first-child { border-radius: 0 0 0 4px; }
        .total-row td:last-child  { border-radius: 0 0 4px 0; }

        /* STATS STRIP */
        .stats-strip {
            display: flex;
            gap: 10px;
            margin: 0 20px 20px;
        }

        .stat-item {
            flex: 1;
            border: 1px solid #d1fae5;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
            background: #f0fdf4;
        }

        .stat-label {
            font-size: 8px;
            color: #6b7280;
            margin-bottom: 4px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .stat-value {
            font-size: 13px;
            font-weight: 900;
            color: #065f46;
        }

        /* FOOTER */
        .footer {
            margin: 30px 20px 0;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
        }

        .no-data {
            text-align: center;
            color: #9ca3af;
            padding: 24px;
            font-size: 11px;
        }
    </style>
</head>
<body>

{{-- HEADER --}}
<div class="header">
    <div class="header-top">
        <div>
            <div class="brand">Casa <span>Verde</span></div>
            <div style="font-size:9px; opacity:0.65; margin-top:2px;">Energia Solar por Assinatura</div>
        </div>
        <div>
            <div class="report-title">Relatório de Economia</div>
            <div class="report-subtitle">
                Ano {{ $report['filters']['year'] ?? date('Y') }}
                &nbsp;·&nbsp; Gerado em {{ now()->format('d/m/Y H:i') }}
            </div>
        </div>
    </div>

    @if($report['profile'])
    <div class="header-client">
        <div class="header-client-name">{{ $report['profile']['display_name'] }}</div>
        <div class="header-client-meta">
            Código: {{ $report['profile']['client_code'] ?? '—' }}
            @if($report['profile']['usina_nome'])
                &nbsp;·&nbsp; Usina: {{ $report['profile']['usina_nome'] }}
            @endif
        </div>
    </div>
    @endif
</div>

{{-- HERO --}}
@php
    $s = $report['summary'];
    $a = $report['allTime'];
@endphp

@if(!empty($s))
<div class="hero">
    <div class="hero-grid">
        <div class="hero-card concessionaria">
            <div class="hero-card-label">Sem Casa Verde pagaria</div>
            <div class="hero-card-value">R$ {{ number_format($s['total_original_amount'] ?? 0, 2, ',', '.') }}</div>
            <div class="hero-card-sub">Valor cheio das faturas</div>
        </div>
        <div class="hero-card casaverde">
            <div class="hero-card-label">Com Casa Verde você paga</div>
            <div class="hero-card-value">R$ {{ number_format($s['total_final_amount'] ?? 0, 2, ',', '.') }}</div>
            <div class="hero-card-sub">Valor com desconto Casa Verde</div>
        </div>
        <div class="hero-card savings">
            <div class="hero-card-label">Economizou no período</div>
            <div class="hero-card-value">R$ {{ number_format($s['total_savings'] ?? 0, 2, ',', '.') }}</div>
            <div class="hero-card-sub">Sobre o valor total das faturas</div>
        </div>
    </div>
</div>

{{-- MENSAGEM DE VALOR --}}
<div class="message-box">
    <p>
        <strong>Você economizou R$ {{ number_format($s['total_savings'] ?? 0, 2, ',', '.') }}</strong>
        em {{ $report['filters']['year'] ?? date('Y') }} sendo cliente da Casa Verde,
        comparado ao valor que pagaria à concessionária.
        @if(($s['avg_savings_month'] ?? 0) > 0)
            Em média, você economiza <strong>R$ {{ number_format($s['avg_savings_month'], 2, ',', '.') }} por mês</strong>.
        @endif
    </p>
</div>

{{-- ESTATÍSTICAS GERAIS --}}
<div class="stats-strip">
    <div class="stat-item">
        <div class="stat-label">Meses com dados</div>
        <div class="stat-value">{{ $s['months_with_data'] ?? 0 }}</div>
    </div>
    <div class="stat-item">
        <div class="stat-label">Consumo total kWh</div>
        <div class="stat-value">{{ number_format($s['total_kwh'] ?? 0, 0, ',', '.') }}</div>
    </div>
    <div class="stat-item">
        <div class="stat-label">Melhor mês de economia</div>
        <div class="stat-value">
            @if(!empty($s['best_month']))
                {{ $s['best_month']['label'] }}
            @else
                —
            @endif
        </div>
    </div>
    <div class="stat-item">
        <div class="stat-label">Economia média/mês</div>
        <div class="stat-value">R$ {{ number_format($s['avg_savings_month'] ?? 0, 2, ',', '.') }}</div>
    </div>
</div>
@endif

{{-- TABELA MENSAL --}}
<div class="section">
    <div class="section-title">Detalhamento Mensal — Concessionária × Casa Verde</div>

    @php $rows = array_filter($report['monthly'] ?? [], fn($m) => $m['has_data']); @endphp

    @if(empty($rows))
        <div class="no-data">Nenhum dado disponível para o período selecionado.</div>
    @else
    <table>
        <thead>
            <tr>
                <th>Mês</th>
                <th>kWh</th>
                <th>Fatura Concessionária</th>
                <th>Desconto R$</th>
                <th>Valor Casa Verde</th>
                <th>Economia</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
        @foreach($rows as $m)
            @php
                $statusClass = match($m['status'] ?? '') {
                    'paid'            => 'status-paid',
                    'open'            => 'status-open',
                    'overdue'         => 'status-overdue',
                    'waiting_payment' => 'status-waiting',
                    default           => '',
                };
                $statusLabel = match($m['status'] ?? '') {
                    'paid'            => 'Pago',
                    'open'            => 'Em Aberto',
                    'waiting_payment' => 'Ag. Pagamento',
                    'overdue'         => 'Vencido',
                    'cancelled'       => 'Cancelado',
                    default           => '—',
                };
            @endphp
            <tr>
                <td>{{ $m['month_name'] }}</td>
                <td>{{ $m['consumo_kwh'] > 0 ? number_format($m['consumo_kwh'], 0, ',', '.') : '—' }}</td>
                <td class="td-original">R$ {{ number_format($m['original_amount'], 2, ',', '.') }}</td>
                <td class="td-savings">R$ {{ number_format($m['discount_amount'], 2, ',', '.') }}</td>
                <td class="td-final">R$ {{ number_format($m['final_amount'], 2, ',', '.') }}</td>
                <td class="td-savings">R$ {{ number_format($m['net_savings'], 2, ',', '.') }}</td>
                <td class="{{ $statusClass }}">{{ $statusLabel }}</td>
            </tr>
        @endforeach
        </tbody>
        @if(!empty($s))
        <tfoot>
            <tr class="total-row">
                <td>TOTAL DO ANO</td>
                <td>{{ number_format($s['total_kwh'] ?? 0, 0, ',', '.') }}</td>
                <td>R$ {{ number_format($s['total_original_amount'] ?? 0, 2, ',', '.') }}</td>
                <td>R$ {{ number_format($s['total_savings'] ?? 0, 2, ',', '.') }}</td>
                <td>R$ {{ number_format($s['total_final_amount'] ?? 0, 2, ',', '.') }}</td>
                <td>R$ {{ number_format($s['total_savings'] ?? 0, 2, ',', '.') }}</td>
                <td></td>
            </tr>
        </tfoot>
        @endif
    </table>
    @endif
</div>

{{-- HISTÓRICO GERAL --}}
@if(!empty($a) && ($a['total_charges'] ?? 0) > 0)
<div class="section">
    <div class="section-title">Economia Acumulada (Todo o Período)</div>

    <div class="hero-grid">
        <div class="hero-card concessionaria">
            <div class="hero-card-label">Total que pagaria</div>
            <div class="hero-card-value">R$ {{ number_format($a['total_original'] ?? 0, 2, ',', '.') }}</div>
            <div class="hero-card-sub">Acumulado desde o início</div>
        </div>
        <div class="hero-card casaverde">
            <div class="hero-card-label">Total que pagou</div>
            <div class="hero-card-value">R$ {{ number_format($a['total_final'] ?? 0, 2, ',', '.') }}</div>
            <div class="hero-card-sub">{{ $a['total_charges'] ?? 0 }} cobranças</div>
        </div>
        <div class="hero-card savings">
            <div class="hero-card-label">Total economizado</div>
            <div class="hero-card-value">R$ {{ number_format($a['total_savings'] ?? 0, 2, ',', '.') }}</div>
            <div class="hero-card-sub">Acumulado desde o início</div>
        </div>
    </div>
</div>
@endif

<div class="footer">
    Casa Verde Energia Solar &nbsp;·&nbsp;
    Relatório gerado em {{ now()->format('d/m/Y \à\s H:i') }} &nbsp;·&nbsp;
    Este documento é confidencial e destinado exclusivamente ao cliente identificado acima.
</div>

</body>
</html>

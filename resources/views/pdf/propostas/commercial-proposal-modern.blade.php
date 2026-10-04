@php
    $money = fn ($value) => 'R$ '.number_format((float) $value, 2, ',', '.');
    $client = $proposal->clientProfile;
    $issued = $proposal->issued_at?->format('d/m/Y') ?? now()->format('d/m/Y');
    $valid = $proposal->valid_until?->format('d/m/Y') ?? 'Até 30 dias da emissão';
    $p = $brand['primary'];
    $pd = $brand['primary_dark'];
    $ps = $brand['primary_soft'];
    $ac = $brand['accent'];
@endphp
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Proposta {{ $proposal->proposal_code }} · {{ $brand['name'] }}</title>
<style>
    @page { margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: DejaVu Sans, sans-serif; color: #1E293B; font-size: 10.5px; line-height: 1.5; }
    /* A4 no dompdf: 793 × 1122 px. Altura + padding não pode passar disso, senão sobra uma página em branco. */
    .page { padding: 40px 46px 70px; position: relative; page-break-after: always; height: 1010px; }
    .page:last-child { page-break-after: auto; }
    .muted { color: #64748B; }
    .eyebrow { font-size: 8.5px; letter-spacing: 1.6px; text-transform: uppercase; font-weight: bold; color: {{ $p }}; }
    h2 { font-size: 19px; margin: 4px 0 14px; color: #0F172A; letter-spacing: -0.3px; }
    table { border-collapse: collapse; width: 100%; }

    /* Rodapé de todas as páginas internas */
    .footer { position: absolute; left: 46px; width: 701px; bottom: 26px; border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 8.5px; color: #94A3B8; }
    .footer td { padding: 0; }

    /* ── Capa ── */
    .cover { padding: 0; height: 1120px; background: {{ $pd }}; color: #fff; }
    .cover-top { padding: 46px 52px 0; }
    .cover-brand td { vertical-align: middle; }
    .cover-logo { height: 46px; background: #fff; border-radius: 10px; padding: 6px; }
    .cover-name { font-size: 15px; font-weight: bold; letter-spacing: 0.3px; }
    .cover-tag { display: inline-block; margin-top: 120px; background: {{ $ac }}; color: #111827; font-size: 9px; font-weight: bold; letter-spacing: 1.8px; padding: 6px 12px; border-radius: 20px; }
    .cover-title { font-size: 40px; line-height: 1.08; font-weight: bold; margin: 18px 0 14px; letter-spacing: -1px; }
    .cover-sub { font-size: 13px; color: #E2E8F0; width: 78%; line-height: 1.55; }
    .cover-highlight { margin: 54px 52px 0; background: #fff; color: #0F172A; border-radius: 18px; padding: 26px 30px; }
    .cover-highlight .label { font-size: 9px; letter-spacing: 1.6px; text-transform: uppercase; color: #64748B; font-weight: bold; }
    .cover-highlight .value { font-size: 38px; font-weight: bold; color: {{ $p }}; letter-spacing: -1px; margin-top: 4px; }
    .cover-highlight .note { font-size: 10.5px; color: #475569; margin-top: 4px; }
    .cover-meta { margin: 30px 52px 0; }
    .cover-meta td { width: 25%; padding: 14px 12px 0 0; vertical-align: top; }
    .cover-meta .k { font-size: 8px; letter-spacing: 1.4px; text-transform: uppercase; color: #CBD5E1; }
    .cover-meta .v { font-size: 12px; font-weight: bold; margin-top: 3px; }
    .cover-band { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; background: {{ $ac }}; }

    /* ── Indicadores ── */
    .kpis td { width: 25%; padding-right: 10px; vertical-align: top; }
    .kpis td:last-child { padding-right: 0; }
    .kpi { border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 14px; }
    .kpi .k { font-size: 8px; letter-spacing: 1.2px; text-transform: uppercase; color: #64748B; font-weight: bold; }
    .kpi .v { font-size: 17px; font-weight: bold; margin-top: 5px; color: #0F172A; }
    .kpi.hl { background: {{ $p }}; border-color: {{ $p }}; }
    .kpi.hl .k { color: #E2E8F0; } .kpi.hl .v { color: #fff; }

    /* ── Comparativo em barras ── */
    .compare { margin-top: 22px; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 20px; }
    .bars td { vertical-align: bottom; text-align: center; height: 190px; }
    .bar { width: 120px; margin: 0 auto; border-radius: 10px 10px 0 0; }
    .bar-label { font-size: 9.5px; color: #475569; margin-top: 8px; font-weight: bold; }
    .bar-value { font-size: 14px; font-weight: bold; margin-bottom: 6px; }
    .saving-box { background: {{ $ps }}; border-radius: 12px; padding: 16px 18px; }
    .saving-box .big { font-size: 26px; font-weight: bold; color: {{ $p }}; letter-spacing: -0.5px; }

    /* ── Tabela de períodos ── */
    .periods { margin-top: 22px; }
    .periods th { text-align: left; font-size: 8.5px; letter-spacing: 1px; text-transform: uppercase; color: #64748B; padding: 9px 12px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
    .periods td { padding: 9px 12px; border-bottom: 1px solid #F1F5F9; font-size: 10.5px; }
    .periods .num { text-align: right; }
    .periods .saving { color: {{ $p }}; font-weight: bold; }
    .periods tr.total td { background: {{ $ps }}; font-weight: bold; }

    /* ── Como funciona ── */
    .steps td { width: 25%; vertical-align: top; padding-right: 12px; }
    .steps td:last-child { padding-right: 0; }
    .step-n { width: 26px; border-radius: 13px; background: {{ $p }}; color: #fff; font-weight: bold; text-align: center; font-size: 11px; padding: 6px 0; line-height: 14px; }
    .step-t { font-weight: bold; font-size: 11px; margin: 8px 0 3px; color: #0F172A; }
    .step-d { font-size: 9.5px; color: #475569; }

    /* ── Benefícios ── */
    .benefits td { width: 50%; vertical-align: top; padding: 0 12px 12px 0; }
    .benefit { border-left: 3px solid {{ $ac }}; padding: 2px 0 2px 12px; }
    .benefit .t { font-weight: bold; font-size: 11px; color: #0F172A; }
    .benefit .d { font-size: 9.5px; color: #475569; }

    /* ── Dados e condições ── */
    .info td { padding: 7px 0; border-bottom: 1px solid #F1F5F9; font-size: 10.5px; }
    .info td.k { color: #64748B; width: 42%; }
    .info td.v { font-weight: bold; text-align: right; }
    .notes { background: #F8FAFC; border-radius: 10px; padding: 12px 14px; font-size: 10px; color: #334155; }
    .sign td { width: 50%; padding: 52px 18px 0 0; vertical-align: top; }
    .sign .line { border-top: 1px solid #94A3B8; padding-top: 6px; font-size: 9.5px; }
    .disclaimer { font-size: 8.5px; color: #94A3B8; margin-top: 22px; line-height: 1.55; }
</style>
</head>
<body>

{{-- ═════════════════ CAPA ═════════════════ --}}
<div class="page cover">
    <div class="cover-top">
        <table class="cover-brand"><tr>
            @if($brand['logo'])
                <td style="width: 64px;"><img src="{{ $brand['logo'] }}" class="cover-logo" alt=""></td>
            @endif
            <td><span class="cover-name">{{ $brand['name'] }}</span></td>
            <td style="text-align: right; font-size: 10px; color: #CBD5E1;">{{ $proposal->proposal_code }}</td>
        </tr></table>

        <span class="cover-tag">PROPOSTA COMERCIAL</span>
        <div class="cover-title">Energia solar por assinatura para {{ $client?->display_name }}</div>
        <div class="cover-sub">
            Reduza sua conta de luz recebendo créditos de energia de usinas solares,
            sem obras, sem investimento e sem mudar de concessionária.
        </div>
    </div>

    <div class="cover-highlight">
        <div class="label">Economia estimada no primeiro ano</div>
        <div class="value">{{ $money($numbers['yearly']) }}</div>
        <div class="note">
            {{ number_format($numbers['discount'], 0, ',', '.') }}% de desconto sobre a energia compensada ·
            {{ $money($numbers['contract']) }} ao longo de {{ $numbers['months'] }} meses de contrato
        </div>
    </div>

    <table class="cover-meta"><tr>
        <td><div class="k">Emissão</div><div class="v">{{ $issued }}</div></td>
        <td><div class="k">Validade</div><div class="v">{{ $valid }}</div></td>
        <td><div class="k">Concessionária</div><div class="v">{{ $proposal->concessionaria?->nome ?? '—' }}</div></td>
        <td><div class="k">Consultor</div><div class="v">{{ $proposal->consultor?->name ?? '—' }}</div></td>
    </tr></table>

    <div class="cover-band"></div>
</div>

{{-- ═════════════════ NÚMEROS ═════════════════ --}}
<div class="page">
    <div class="eyebrow">A proposta em números</div>
    <h2>Quanto você economiza</h2>

    <table class="kpis"><tr>
        <td><div class="kpi"><div class="k">Conta média atual</div><div class="v">{{ $money($numbers['current']) }}</div></div></td>
        <td><div class="kpi"><div class="k">Nova conta estimada</div><div class="v">{{ $money($numbers['new_bill']) }}</div></div></td>
        <td><div class="kpi"><div class="k">Economia por mês</div><div class="v">{{ $money($numbers['monthly']) }}</div></div></td>
        <td><div class="kpi hl"><div class="k">Economia por ano</div><div class="v">{{ $money($numbers['yearly']) }}</div></div></td>
    </tr></table>

    <div class="compare">
        <table><tr>
            <td style="width: 58%; vertical-align: bottom;">
                <table class="bars"><tr>
                    <td>
                        <div class="bar-value" style="color: #475569;">{{ $money($numbers['current']) }}</div>
                        <div class="bar" style="height: 150px; background: #CBD5E1;"></div>
                        <div class="bar-label">Hoje, só com a concessionária</div>
                    </td>
                    <td>
                        <div class="bar-value" style="color: {{ $p }};">{{ $money($numbers['new_bill']) }}</div>
                        <div class="bar" style="height: {{ round(150 * $numbers['new_bill_ratio'] / 100) }}px; background: {{ $p }};"></div>
                        <div class="bar-label">Com energia por assinatura</div>
                    </td>
                </tr></table>
            </td>
            <td style="width: 42%; vertical-align: middle; padding-left: 18px;">
                <div class="saving-box">
                    <div class="eyebrow" style="color: {{ $pd }};">Ao longo do contrato</div>
                    <div class="big">{{ $money($numbers['contract']) }}</div>
                    <div class="muted" style="font-size: 9.5px;">
                        de economia estimada em {{ $numbers['months'] }} meses, considerando consumo médio de
                        {{ number_format($numbers['consumption'], 0, ',', '.') }} kWh/mês.
                    </div>
                </div>
            </td>
        </tr></table>
    </div>

    <table class="periods">
        <thead><tr>
            <th>Período</th><th class="num">Só concessionária</th><th class="num">Com assinatura</th><th class="num">Economia</th>
        </tr></thead>
        <tbody>
            @foreach($numbers['periods'] as $i => $row)
                <tr class="{{ $loop->last ? 'total' : '' }}">
                    <td>{{ $row['label'] }}</td>
                    <td class="num">{{ $money($row['current']) }}</td>
                    <td class="num">{{ $money($row['new_bill']) }}</td>
                    <td class="num saving">{{ $money($row['saving']) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 26px;">
        <div class="eyebrow">Como funciona</div>
        <h2 style="font-size: 15px;">Do contrato à conta mais barata</h2>
        <table class="steps"><tr>
            <td><div class="step-n">1</div><div class="step-t">Adesão</div><div class="step-d">Você assina o contrato digital. Sem obras e sem equipamentos no seu imóvel.</div></td>
            <td><div class="step-n">2</div><div class="step-t">Geração</div><div class="step-d">Uma usina solar parceira gera energia e injeta na rede da sua concessionária.</div></td>
            <td><div class="step-n">3</div><div class="step-t">Créditos</div><div class="step-d">Os créditos de energia são compensados na sua conta de luz todo mês.</div></td>
            <td><div class="step-n">4</div><div class="step-t">Economia</div><div class="step-d">Você paga uma cobrança única com desconto e acompanha tudo pelo portal.</div></td>
        </tr></table>
    </div>

    <table class="footer"><tr>
        <td>{{ $brand['name'] }} · Proposta {{ $proposal->proposal_code }}</td>
        <td style="text-align: right;">Página 2 de 3</td>
    </tr></table>
</div>

{{-- ═════════════════ BENEFÍCIOS E CONDIÇÕES ═════════════════ --}}
<div class="page">
    <div class="eyebrow">Por que assinar</div>
    <h2>Benefícios para você</h2>

    <table class="benefits">
        <tr>
            <td><div class="benefit"><div class="t">Sem investimento</div><div class="d">Nada de comprar painéis ou fazer instalação: você só recebe o desconto.</div></div></td>
            <td><div class="benefit"><div class="t">Energia renovável</div><div class="d">Sua energia passa a vir de usinas solares, uma fonte limpa e renovável.</div></div></td>
        </tr>
        <tr>
            <td><div class="benefit"><div class="t">Mesma concessionária</div><div class="d">A distribuição continua com a {{ $proposal->concessionaria?->nome ?? 'sua concessionária' }}, sem troca de medidor.</div></div></td>
            <td><div class="benefit"><div class="t">Tudo online</div><div class="d">Faturas, cobranças, Pix e relatório de economia em um portal exclusivo.</div></div></td>
        </tr>
    </table>

    <table style="margin-top: 14px;"><tr>
        <td style="width: 50%; vertical-align: top; padding-right: 16px;">
            <div class="eyebrow">Dados do cliente</div>
            <table class="info" style="margin-top: 8px;">
                <tr><td class="k">Cliente</td><td class="v">{{ $client?->display_name }}</td></tr>
                <tr><td class="k">Documento</td><td class="v">{{ $client?->documento ?? '—' }}</td></tr>
                <tr><td class="k">Unidade consumidora</td><td class="v">{{ $proposal->unidade_consumidora ?? '—' }}</td></tr>
                <tr><td class="k">Concessionária</td><td class="v">{{ $proposal->concessionaria?->nome ?? '—' }}</td></tr>
                <tr><td class="k">Consumo médio</td><td class="v">{{ number_format($numbers['consumption'], 0, ',', '.') }} kWh/mês</td></tr>
            </table>
        </td>
        <td style="width: 50%; vertical-align: top; padding-left: 16px;">
            <div class="eyebrow">Condições comerciais</div>
            <table class="info" style="margin-top: 8px;">
                <tr><td class="k">Desconto</td><td class="v">{{ number_format($numbers['discount'], 2, ',', '.') }}%</td></tr>
                <tr><td class="k">Prazo do contrato</td><td class="v">{{ $numbers['months'] }} meses</td></tr>
                <tr><td class="k">Emissão</td><td class="v">{{ $issued }}</td></tr>
                <tr><td class="k">Validade da proposta</td><td class="v">{{ $valid }}</td></tr>
                <tr><td class="k">Consultor</td><td class="v">{{ $proposal->consultor?->name ?? '—' }}</td></tr>
            </table>
        </td>
    </tr></table>

    @if($proposal->notes)
        <div style="margin-top: 18px;">
            <div class="eyebrow" style="margin-bottom: 6px;">Observações</div>
            <div class="notes">{!! nl2br(e($proposal->notes)) !!}</div>
        </div>
    @endif

    <table class="sign"><tr>
        <td><div class="line"><strong>{{ $client?->display_name }}</strong><br><span class="muted">Cliente</span></div></td>
        <td><div class="line"><strong>{{ $proposal->consultor?->name ?? $brand['name'] }}</strong><br><span class="muted">Consultor · {{ $brand['name'] }}</span></div></td>
    </tr></table>

    <div class="disclaimer">
        Valores estimados a partir do consumo médio informado e da tarifa vigente; a economia real varia conforme o
        consumo mensal, bandeiras tarifárias e reajustes da concessionária. A contratação depende de análise técnica,
        disponibilidade de energia e assinatura do contrato.
    </div>

    <table class="footer"><tr>
        <td>{{ $brand['name'] }} · Proposta {{ $proposal->proposal_code }}</td>
        <td style="text-align: right;">Página 3 de 3</td>
    </tr></table>
</div>

</body>
</html>

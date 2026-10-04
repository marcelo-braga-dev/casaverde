@php
    $money = fn ($value) => 'R$ '.number_format((float) $value, 2, ',', '.');
    $kwh = fn ($value) => 'R$ '.number_format((float) $value, 4, ',', '.');
    $num = fn ($value, $decimals = 0) => number_format((float) $value, $decimals, ',', '.');
    $producer = $proposal->producerProfile;
    $contacts = $producer?->contacts;
    $issued = $proposal->issued_at?->format('d/m/Y') ?? now()->format('d/m/Y');
    $valid = $proposal->valid_until?->format('d/m/Y') ?? 'Até 30 dias da emissão';
    $concessionaria = $proposal->concessionaria
        ? $proposal->concessionaria->nome.($proposal->concessionaria->estado ? ' ('.$proposal->concessionaria->estado.')' : '')
        : '—';
    $payback = $numbers['payback_months'];
    $paybackLabel = $payback === null ? '—' : ($payback < 24 ? $payback.' meses' : $num($payback / 12, 1).' anos');
    $years = $numbers['projection']['years'];
    $barWidth = count($years) > 12 ? 16 : (count($years) > 6 ? 24 : 40);
    // Valores curtos para caber em cima de barras estreitas: R$ 674 mil, R$ 1,68 mi.
    $compact = fn ($value) => $value >= 1000000 ? 'R$ '.number_format($value / 1000000, 2, ',', '.').' mi' : 'R$ '.number_format($value / 1000, 0, ',', '.').' mil';
    $paybackYear = collect($years)->firstWhere('paid_back', true)['year'] ?? null;
    $p = $brand['primary'];
    $pd = $brand['primary_dark'];
    $ps = $brand['primary_soft'];
    $ac = $brand['accent'];
@endphp
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Proposta de investimento {{ $proposal->proposal_code }} · {{ $brand['name'] }}</title>
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
    h3 { font-size: 14px; margin: 2px 0 10px; color: #0F172A; }
    table { border-collapse: collapse; width: 100%; }
    .box { border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px 18px; }

    .footer { position: absolute; left: 46px; width: 701px; bottom: 26px; border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 8.5px; color: #94A3B8; }
    .footer td { padding: 0; }

    /* ── Capa ── */
    .cover { padding: 0; height: 1120px; background: {{ $pd }}; color: #fff; }
    .cover-top { padding: 46px 52px 0; }
    .cover-brand td { vertical-align: middle; }
    .cover-logo { height: 46px; background: #fff; border-radius: 10px; padding: 6px; }
    .cover-name { font-size: 15px; font-weight: bold; letter-spacing: 0.3px; }
    .cover-tag { display: inline-block; margin-top: 96px; background: {{ $ac }}; color: #111827; font-size: 9px; font-weight: bold; letter-spacing: 1.8px; padding: 6px 12px; border-radius: 20px; }
    .cover-title { font-size: 38px; line-height: 1.1; font-weight: bold; margin: 18px 0 14px; letter-spacing: -1px; }
    .cover-sub { font-size: 13px; color: #E2E8F0; width: 80%; line-height: 1.55; }
    .cover-cards { margin: 44px 52px 0; width: 689px; }
    .cover-cards td { vertical-align: top; }
    .cover-card { background: #fff; color: #0F172A; border-radius: 18px; padding: 22px 26px; }
    .cover-card .label { font-size: 9px; letter-spacing: 1.6px; text-transform: uppercase; color: #64748B; font-weight: bold; }
    .cover-card .value { font-size: 34px; font-weight: bold; color: {{ $p }}; letter-spacing: -1px; margin-top: 4px; }
    .cover-card .note { font-size: 10px; color: #475569; margin-top: 4px; }
    .cover-side { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.22); border-radius: 18px; padding: 18px 20px; }
    .cover-side .k { font-size: 8px; letter-spacing: 1.4px; text-transform: uppercase; color: #CBD5E1; }
    .cover-side .v { font-size: 20px; font-weight: bold; margin: 2px 0 10px; }
    .cover-meta { margin: 30px 52px 0; width: 689px; }
    .cover-meta td { width: 25%; padding: 14px 12px 0 0; vertical-align: top; border-top: 1px solid rgba(255,255,255,0.2); }
    .cover-meta .k { font-size: 8px; letter-spacing: 1.4px; text-transform: uppercase; color: #CBD5E1; }
    .cover-meta .v { font-size: 11.5px; font-weight: bold; margin-top: 3px; }
    .cover-summary { margin: 150px 52px 0; width: 689px; }
    .cover-summary td { width: 33.33%; vertical-align: top; padding-right: 14px; }
    .cover-summary .k { font-size: 8px; letter-spacing: 1.4px; text-transform: uppercase; color: #CBD5E1; }
    .cover-summary .v { font-size: 22px; font-weight: bold; margin-top: 4px; color: {{ $ac }}; letter-spacing: -0.5px; }
    .cover-summary .s { font-size: 9px; color: #CBD5E1; }
    .cover-band { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; background: {{ $ac }}; }

    /* ── Indicadores ── */
    .kpis td { width: 25%; padding-right: 10px; vertical-align: top; }
    .kpis td:last-child { padding-right: 0; }
    .kpi { border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 14px; }
    .kpi .k { font-size: 8px; letter-spacing: 1.2px; text-transform: uppercase; color: #64748B; font-weight: bold; }
    .kpi .v { font-size: 16px; font-weight: bold; margin-top: 5px; color: #0F172A; }
    .kpi .s { font-size: 8.5px; color: #64748B; }
    .kpi.hl { background: {{ $p }}; border-color: {{ $p }}; }
    .kpi.hl .k, .kpi.hl .s { color: #E2E8F0; } .kpi.hl .v { color: #fff; }

    /* ── Composição do kWh ── */
    .split { margin-top: 10px; border-radius: 8px; overflow: hidden; }
    .split td { height: 30px; color: #fff; font-weight: bold; font-size: 9.5px; text-align: center; padding: 0 4px; }
    .legend td { vertical-align: top; padding: 10px 10px 0 0; width: 25%; }
    .dot { display: inline-block; width: 9px; height: 9px; border-radius: 5px; margin-right: 5px; }
    .legend .t { font-size: 9px; color: #64748B; }
    .legend .v { font-size: 12px; font-weight: bold; color: #0F172A; margin-top: 2px; }

    /* ── Projeção ── */
    .chart, .axis { table-layout: fixed; }
    .chart td { vertical-align: bottom; text-align: center; height: 180px; padding: 0 2px; }
    .bar { margin: 0 auto; border-radius: 6px 6px 0 0; }
    .axis td { text-align: center; font-size: 8px; color: #64748B; padding-top: 6px; border-top: 1px solid #CBD5E1; }
    .bar-top { font-size: 7.5px; color: #475569; margin-bottom: 3px; white-space: nowrap; }

    /* ── Tabelas de dados ── */
    .info td { padding: 7px 0; border-bottom: 1px solid #F1F5F9; font-size: 10.5px; }
    .info td.k { color: #64748B; width: 46%; }
    .info td.v { font-weight: bold; text-align: right; }
    .info tr.total td { border-bottom: none; border-top: 2px solid {{ $p }}; color: {{ $p }}; font-size: 12px; padding-top: 9px; }

    /* ── Como funciona ── */
    .steps td { width: 25%; vertical-align: top; padding-right: 12px; }
    .steps td:last-child { padding-right: 0; }
    .step-n { width: 26px; border-radius: 13px; background: {{ $p }}; color: #fff; font-weight: bold; text-align: center; font-size: 11px; padding: 6px 0; line-height: 14px; }
    .step-t { font-weight: bold; font-size: 11px; margin: 8px 0 3px; color: #0F172A; }
    .step-d { font-size: 9.5px; color: #475569; }

    .benefits td { width: 50%; vertical-align: top; padding: 0 12px 12px 0; }
    .benefit { border-left: 3px solid {{ $ac }}; padding: 2px 0 2px 12px; }
    .benefit .t { font-weight: bold; font-size: 11px; color: #0F172A; }
    .benefit .d { font-size: 9.5px; color: #475569; }

    .notes { background: #F8FAFC; border-radius: 10px; padding: 12px 14px; font-size: 10px; color: #334155; }
    .sign td { width: 50%; padding: 46px 18px 0 0; vertical-align: top; }
    .sign .line { border-top: 1px solid #94A3B8; padding-top: 6px; font-size: 9.5px; }
    .disclaimer { font-size: 8.5px; color: #94A3B8; margin-top: 18px; line-height: 1.55; }
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

        <span class="cover-tag">PROPOSTA DE INVESTIMENTO</span>
        <div class="cover-title">Renda recorrente com energia solar para {{ $producer?->display_name }}</div>
        <div class="cover-sub">
            Sua usina gera, nós conectamos a energia a clientes assinantes e cuidamos de toda a operação.
            Você recebe todo mês pela energia produzida.
        </div>
    </div>

    <table class="cover-cards"><tr>
        <td style="width: 60%; padding-right: 14px;">
            <div class="cover-card">
                <div class="label">Receita mensal prevista</div>
                <div class="value">{{ $money($numbers['monthly']) }}</div>
                <div class="note">
                    {{ $money($numbers['yearly']) }} por ano ·
                    {{ $money($numbers['contract']) }} em {{ $numbers['months'] }} meses de contrato
                </div>
            </div>
        </td>
        <td style="width: 40%;">
            <div class="cover-side">
                <div class="k">Retorno do investimento</div>
                <div class="v">{{ $paybackLabel }}</div>
                <div class="k">Usina</div>
                <div class="v" style="margin-bottom: 0;">{{ $num($numbers['power'], 1) }} kWp</div>
            </div>
        </td>
    </tr></table>

    <table class="cover-meta"><tr>
        <td><div class="k">Emissão</div><div class="v">{{ $issued }}</div></td>
        <td><div class="k">Validade</div><div class="v">{{ $valid }}</div></td>
        <td><div class="k">Concessionária</div><div class="v">{{ $concessionaria }}</div></td>
        <td><div class="k">Consultor</div><div class="v">{{ $proposal->consultor?->name ?? '—' }}</div></td>
    </tr></table>

    <table class="cover-summary"><tr>
        <td><div class="k">Geração média</div><div class="v">{{ $num($numbers['generation']) }} kWh</div><div class="s">por mês</div></td>
        <td><div class="k">Receita no contrato</div><div class="v">{{ $money($numbers['contract']) }}</div><div class="s">em {{ $numbers['months'] }} meses</div></td>
        <td><div class="k">Rentabilidade</div><div class="v">{{ $numbers['roi_percent'] !== null ? $num($numbers['roi_percent'], 0).'%' : '—' }}</div><div class="s">sobre o investimento, no contrato</div></td>
    </tr></table>

    <div class="cover-band"></div>
</div>

{{-- ═════════════════ NÚMEROS ═════════════════ --}}
<div class="page">
    <div class="eyebrow">O investimento em números</div>
    <h2>Quanto a sua usina rende</h2>

    <table class="kpis"><tr>
        <td><div class="kpi"><div class="k">Investimento</div><div class="v">{{ $numbers['investment'] > 0 ? $money($numbers['investment']) : '—' }}</div><div class="s">valor da usina</div></div></td>
        <td><div class="kpi"><div class="k">Geração média</div><div class="v">{{ $num($numbers['generation']) }} kWh</div><div class="s">por mês</div></div></td>
        <td><div class="kpi"><div class="k">Retorno</div><div class="v">{{ $paybackLabel }}</div><div class="s">payback estimado</div></div></td>
        <td><div class="kpi hl"><div class="k">Receita mensal</div><div class="v">{{ $money($numbers['monthly']) }}</div><div class="s">prevista</div></div></td>
    </tr></table>

    {{-- Composição do kWh --}}
    <div class="box" style="margin-top: 20px;">
        <div class="eyebrow">Como se forma o seu kWh</div>
        <h3>Tarifa de {{ $kwh($numbers['tarifa_grupo_b']) }} por kWh compensado</h3>
        @if($numbers['split'])
            <table class="split"><tr>
                <td style="width: {{ $numbers['split']['producer'] }}%; background: {{ $p }};">Você · {{ $num($numbers['split']['producer'], 1) }}%</td>
                <td style="width: {{ $numbers['split']['consumer'] }}%; background: {{ $ac }}; color: #111827;">{{ $num($numbers['split']['consumer'], 0) }}%</td>
                <td style="width: {{ $numbers['split']['admin'] }}%; background: #64748B;">{{ $num($numbers['split']['admin'], 0) }}%</td>
            </tr></table>
        @endif
        <table class="legend"><tr>
            <td><span class="dot" style="background: {{ $p }};"></span><span class="t">Pago a você</span><div class="v">{{ $kwh($numbers['valor_pago_produtor_kwh']) }}/kWh</div></td>
            <td><span class="dot" style="background: {{ $ac }};"></span><span class="t">Desconto ao cliente ({{ $num($numbers['consumer_discount_percent']) }}%)</span><div class="v">{{ $kwh($numbers['consumer_discount_value']) }}/kWh</div></td>
            <td><span class="dot" style="background: #64748B;"></span><span class="t">Operação ({{ $num($numbers['admin_fee_percent']) }}%)</span><div class="v">{{ $kwh($numbers['admin_fee_value_kwh']) }}/kWh</div></td>
            <td><span class="t">Produção mensal</span><div class="v">{{ $num($numbers['generation']) }} kWh</div></td>
        </tr></table>
    </div>

    {{-- Projeção acumulada --}}
    <div class="box" style="margin-top: 16px;">
        <table><tr>
            <td style="vertical-align: top;">
                <div class="eyebrow">Projeção ao longo do contrato</div>
                <h3 style="margin-bottom: 2px;">Receita acumulada por ano</h3>
                @if($paybackYear)
                    <div class="muted" style="font-size: 9.5px; margin-bottom: 8px;">O investimento se paga no ano {{ $paybackYear }} do contrato.</div>
                @endif
            </td>
            <td style="width: 46%; text-align: right; vertical-align: top; font-size: 9px;" class="muted">
                <span class="dot" style="background: #CBD5E1;"></span>Investimento
                &nbsp;&nbsp;<span class="dot" style="background: {{ $ps }}; border: 1px solid {{ $p }};"></span>Antes do retorno
                &nbsp;&nbsp;<span class="dot" style="background: {{ $p }};"></span>Após o retorno
            </td>
        </tr></table>

        <table class="chart"><tr>
            @if($numbers['projection']['investment_ratio'] !== null)
                <td>
                    <div class="bar-top">{{ $compact($numbers['investment']) }}</div>
                    <div class="bar" style="width: {{ $barWidth }}px; height: {{ max(2, round(150 * $numbers['projection']['investment_ratio'] / 100)) }}px; background: #CBD5E1;"></div>
                </td>
            @endif
            @foreach($years as $year)
                <td>
                    @if(count($years) <= 12 || $loop->last || $year['year'] === $paybackYear)
                        <div class="bar-top">{{ $compact($year['total']) }}</div>
                    @endif
                    <div class="bar" style="width: {{ $barWidth }}px; height: {{ max(2, round(150 * $year['ratio'] / 100)) }}px; background: {{ $year['paid_back'] ? $p : $ps }}; {{ $year['paid_back'] ? '' : 'border: 1px solid '.$p.';' }}"></div>
                </td>
            @endforeach
        </tr></table>
        <table class="axis"><tr>
            @if($numbers['projection']['investment_ratio'] !== null)
                <td>Invest.</td>
            @endif
            @foreach($years as $year)
                <td>{{ count($years) > 12 ? $year['year'] : 'Ano '.$year['year'] }}</td>
            @endforeach
        </tr></table>
    </div>

    {{-- Resumo financeiro --}}
    <table style="margin-top: 16px;"><tr>
        <td style="width: 50%; vertical-align: top; padding-right: 14px;">
            <table class="info">
                <tr><td class="k">Produção anual</td><td class="v">{{ $num($numbers['producao_anual_kwh']) }} kWh</td></tr>
                <tr><td class="k">Receita bruta anual</td><td class="v">{{ $money($numbers['pagamento_anual_bruto']) }}</td></tr>
                <tr><td class="k">Taxa de operação ({{ $num($numbers['admin_fee_percent']) }}%)</td><td class="v">− {{ $money($numbers['admin_fee_value']) }}</td></tr>
                <tr class="total"><td class="k" style="color: {{ $p }};">Receita prevista no ano</td><td class="v">{{ $money($numbers['yearly']) }}</td></tr>
            </table>
        </td>
        <td style="width: 50%; vertical-align: top; padding-left: 14px;">
            <table class="info">
                <tr><td class="k">Prazo do contrato</td><td class="v">{{ $numbers['months'] }} meses</td></tr>
                <tr><td class="k">Receita no contrato</td><td class="v">{{ $money($numbers['contract']) }}</td></tr>
                <tr><td class="k">Retorno do investimento</td><td class="v">{{ $paybackLabel }}</td></tr>
                <tr class="total"><td class="k" style="color: {{ $p }};">Rentabilidade</td><td class="v">{{ $numbers['roi_percent'] !== null ? $num($numbers['roi_percent'], 1).'%' : '—' }}</td></tr>
            </table>
        </td>
    </tr></table>

    <table class="footer"><tr>
        <td>{{ $brand['name'] }} · Proposta de investimento {{ $proposal->proposal_code }}</td>
        <td style="text-align: right;">Página 2 de 3</td>
    </tr></table>
</div>

{{-- ═════════════════ USINA, MODELO E CONDIÇÕES ═════════════════ --}}
<div class="page">
    <div class="eyebrow">Como funciona</div>
    <h2>Da sua usina à renda no fim do mês</h2>
    <table class="steps"><tr>
        <td><div class="step-n">1</div><div class="step-t">Geração</div><div class="step-d">A usina produz energia e injeta na rede da {{ $proposal->concessionaria?->nome ?? 'concessionária' }}.</div></td>
        <td><div class="step-n">2</div><div class="step-t">Alocação</div><div class="step-d">Os créditos são distribuídos entre clientes assinantes que buscam desconto na conta.</div></td>
        <td><div class="step-n">3</div><div class="step-t">Cobrança</div><div class="step-d">Cuidamos das faturas, cobranças e recebimentos de cada cliente.</div></td>
        <td><div class="step-n">4</div><div class="step-t">Pagamento</div><div class="step-d">Você recebe pela energia gerada e acompanha tudo pelo portal do produtor.</div></td>
    </tr></table>

    <table class="benefits" style="margin-top: 22px;">
        <tr>
            <td><div class="benefit"><div class="t">Renda recorrente</div><div class="d">Receita mensal pela energia produzida, durante todo o contrato.</div></div></td>
            <td><div class="benefit"><div class="t">Operação completa</div><div class="d">Captação de clientes, faturamento e cobrança ficam com a gente.</div></div></td>
        </tr>
        <tr>
            <td><div class="benefit"><div class="t">Transparência</div><div class="d">Geração, alocação e repasses visíveis em tempo real no portal.</div></div></td>
            <td><div class="benefit"><div class="t">Energia limpa</div><div class="d">Sua usina abastece residências e empresas com fonte renovável.</div></div></td>
        </tr>
    </table>

    <table style="margin-top: 10px;"><tr>
        <td style="width: 50%; vertical-align: top; padding-right: 16px;">
            <div class="eyebrow">Investidor</div>
            <table class="info" style="margin-top: 8px;">
                <tr><td class="k">Nome</td><td class="v">{{ $producer?->display_name ?? '—' }}</td></tr>
                <tr><td class="k">Documento</td><td class="v">{{ $producer?->cnpj ?? $producer?->cpf ?? '—' }}</td></tr>
                <tr><td class="k">E-mail</td><td class="v">{{ $contacts?->email ?? '—' }}</td></tr>
                <tr><td class="k">Celular</td><td class="v">{{ $contacts?->celular ?? '—' }}</td></tr>
                <tr><td class="k">Consultor</td><td class="v">{{ $proposal->consultor?->name ?? '—' }}</td></tr>
            </table>
        </td>
        <td style="width: 50%; vertical-align: top; padding-left: 16px;">
            <div class="eyebrow">Usina e condições</div>
            <table class="info" style="margin-top: 8px;">
                <tr><td class="k">Potência</td><td class="v">{{ $num($numbers['power'], 1) }} kWp</td></tr>
                <tr><td class="k">Concessionária</td><td class="v">{{ $concessionaria }}</td></tr>
                <tr><td class="k">Prazo do contrato</td><td class="v">{{ $numbers['months'] }} meses</td></tr>
                <tr><td class="k">Emissão</td><td class="v">{{ $issued }}</td></tr>
                <tr><td class="k">Validade da proposta</td><td class="v">{{ $valid }}</td></tr>
            </table>
        </td>
    </tr></table>

    @if($proposal->address?->full_address)
        <div style="margin-top: 14px;">
            <div class="eyebrow" style="margin-bottom: 6px;">Endereço da usina</div>
            <div class="notes">{{ $proposal->address->full_address }}</div>
        </div>
    @endif

    @if($proposal->notes)
        <div style="margin-top: 14px;">
            <div class="eyebrow" style="margin-bottom: 6px;">Observações</div>
            <div class="notes">{!! nl2br(e($proposal->notes)) !!}</div>
        </div>
    @endif

    <table class="sign"><tr>
        <td><div class="line"><strong>{{ $producer?->display_name }}</strong><br><span class="muted">Investidor</span></div></td>
        <td><div class="line"><strong>{{ $proposal->consultor?->name ?? $brand['name'] }}</strong><br><span class="muted">Consultor · {{ $brand['name'] }}</span></div></td>
    </tr></table>

    <div class="disclaimer">
        Os valores são uma simulação baseada na geração média informada e na tarifa vigente da concessionária. Não
        constituem garantia de resultado e podem variar conforme a geração real, reajustes tarifários, alocação de
        clientes e condições contratuais. {{ $brand['name'] }} não se responsabiliza por diferenças entre os valores
        simulados e os efetivamente alcançados.
    </div>

    <table class="footer"><tr>
        <td>{{ $brand['name'] }} · Proposta de investimento {{ $proposal->proposal_code }}</td>
        <td style="text-align: right;">Página 3 de 3</td>
    </tr></table>
</div>

</body>
</html>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Proposta Comercial</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; margin: 24px; }
        .title { font-size: 22px; font-weight: bold; margin-bottom: 8px; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; }
        .box { border: 1px solid #d0d0d0; padding: 12px; margin-top: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        td, th { border: 1px solid #d0d0d0; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="title">Proposta Comercial</div>

    <div class="section">
        <div><span class="label">Código:</span> {{ $proposal->proposal_code }}</div>
        <div><span class="label">Data:</span> {{ $proposal->issued_at?->format('d/m/Y') }}</div>
        @if($proposal->valid_until)
            <div><span class="label">Validade:</span> {{ $proposal->valid_until?->format('d/m/Y') }}</div>
        @endif
    </div>

    <div class="section">
        <div class="label">Cliente</div>
        <div class="box">
            <div>{{ $proposal->clientProfile->display_name }}</div>
            <div>{{ $proposal->clientProfile->documento }}</div>
            <div>{{ $proposal->clientProfile->cidade }}</div>
        </div>
    </div>

    <div class="section">
        <div class="label">Consultor</div>
        <div class="box">
            <div>{{ $proposal->consultor?->nome }}</div>
            <div>{{ $proposal->consultor?->email }}</div>
        </div>
    </div>

    <div class="section">
        <div class="label">Resumo da proposta</div>
        <table>
            <tr>
                <th>Concessionária</th>
                <td>{{ $proposal->concessionaria?->nome ?? '-' }}</td>
            </tr>
            <tr>
                <th>Média de consumo</th>
                <td>{{ $proposal->media_consumo !== null ? number_format((float) $proposal->media_consumo, 2, ',', '.') . ' kWh' : '-' }}</td>
            </tr>
            <tr>
                <th>Taxa de redução</th>
                <td>{{ $proposal->taxa_reducao !== null ? number_format((float) $proposal->taxa_reducao, 2, ',', '.') . '%' : '-' }}</td>
            </tr>
            <tr>
                <th>Prazo de locação</th>
                <td>{{ $proposal->prazo_locacao ? $proposal->prazo_locacao . ' meses' : '-' }}</td>
            </tr>
            <tr>
                <th>Valor médio</th>
                <td>{{ $proposal->valor_medio !== null ? 'R$ ' . number_format((float) $proposal->valor_medio, 2, ',', '.') : '-' }}</td>
            </tr>
            <tr>
                <th>Unidade consumidora</th>
                <td>{{ $proposal->unidade_consumidora ?? '-' }}</td>
            </tr>
        </table>
    </div>

    @if($proposal->notes)
        <div class="section">
            <div class="label">Observações</div>
            <div class="box">{{ $proposal->notes }}</div>
        </div>
    @endif
</body>
</html>
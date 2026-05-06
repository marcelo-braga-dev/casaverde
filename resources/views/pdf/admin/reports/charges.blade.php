<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #222;
        }

        h1 {
            margin-bottom: 4px;
        }

        .subtitle {
            margin-bottom: 20px;
            color: #666;
        }

        .summary {
            margin-bottom: 20px;
        }

        .summary div {
            margin-bottom: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f2f2f2;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }

        .text-right {
            text-align: right;
        }
    </style>
</head>
<body>

<h1>Relatório de Cobranças</h1>

<div class="subtitle">
    Período: {{ $report['range']['label'] }}
</div>

<div class="summary">
    <div><strong>Total:</strong> {{ $report['summary']['total'] }}</div>
    <div><strong>Valor Final:</strong> R$ {{ number_format($report['summary']['final_amount'], 2, ',', '.') }}</div>
</div>

<table>
    <thead>
    <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Referência</th>
        <th>Status</th>
        <th>Vencimento</th>
        <th class="text-right">Valor Final</th>
    </tr>
    </thead>

    <tbody>
    @foreach($report['items'] as $item)
        <tr>
            <td>{{ $item['id'] }}</td>
            <td>{{ $item['client_name'] }}</td>
            <td>{{ $item['reference_label'] }}</td>
            <td>{{ $item['status'] }}</td>
            <td>{{ $item['due_date'] }}</td>
            <td class="text-right">
                R$ {{ number_format($item['final_amount'], 2, ',', '.') }}
            </td>
        </tr>
    @endforeach
    </tbody>
</table>

</body>
</html>

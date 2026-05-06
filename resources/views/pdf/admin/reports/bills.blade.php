<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
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
        }

        .text-right {
            text-align: right;
        }
    </style>
</head>
<body>

<h1>Relatório de Faturas</h1>

<p>
    Período: {{ $report['range']['label'] }}
</p>

<table>
    <thead>
    <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>UC</th>
        <th>Referência</th>
        <th>Revisão</th>
        <th>Parser</th>
        <th class="text-right">Valor</th>
    </tr>
    </thead>

    <tbody>
    @foreach($report['items'] as $item)
        <tr>
            <td>{{ $item['id'] }}</td>
            <td>{{ $item['client_name'] }}</td>
            <td>{{ $item['unidade_consumidora'] }}</td>
            <td>{{ $item['reference_label'] }}</td>
            <td>{{ $item['review_status'] }}</td>
            <td>{{ $item['parser_status'] }}</td>
            <td class="text-right">
                R$ {{ number_format($item['valor_total'], 2, ',', '.') }}
            </td>
        </tr>
    @endforeach
    </tbody>
</table>

</body>
</html>

<?php

namespace App\Exports\Cliente;

use App\Services\Cliente\Relatorio\ClienteEconomiaRelatorioService;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ClienteEconomiaExport implements FromArray, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{
    public function __construct(
        private readonly int   $platformUserId,
        private readonly array $filters = [],
    ) {
    }

    public function title(): string
    {
        return 'Relatório de Economia';
    }

    public function headings(): array
    {
        return [
            'Mês/Ano',
            'Consumo (kWh)',
            'Fatura Concessionária (R$)',
            'Desconto (%)',
            'Desconto (R$)',
            'Valor Casa Verde (R$)',
            'Economia no Mês (R$)',
            '% Economizado',
            'Status',
            'Pago em',
        ];
    }

    public function array(): array
    {
        $report = app(ClienteEconomiaRelatorioService::class)
            ->handle($this->platformUserId, $this->filters);

        $rows = [];

        // Cabeçalho do cliente
        $rows[] = ['Cliente:', $report['profile']['display_name'] ?? '—', '', '', '', '', '', '', '', ''];
        $rows[] = ['Código:', $report['profile']['client_code'] ?? '—', '', '', '', '', '', '', '', ''];
        $rows[] = ['Desconto ativo:', ($report['profile']['discount'] ?? 0) . '%', '', '', '', '', '', '', '', ''];
        $rows[] = ['Ano:', $report['filters']['year'] ?? date('Y'), '', '', '', '', '', '', '', ''];
        $rows[] = ['', '', '', '', '', '', '', '', '', ''];

        foreach ($report['monthly'] as $m) {
            if (!$m['has_data']) continue;

            $rows[] = [
                $m['label'],
                $m['consumo_kwh'] ?: '—',
                number_format($m['original_amount'], 2, ',', '.'),
                $m['discount_percent'] . '%',
                number_format($m['discount_amount'], 2, ',', '.'),
                number_format($m['final_amount'], 2, ',', '.'),
                number_format($m['net_savings'], 2, ',', '.'),
                $m['savings_percent'] . '%',
                $this->translateStatus($m['status']),
                $m['paid_at'] ?? '—',
            ];
        }

        // Totais
        $s = $report['summary'];
        $rows[] = ['', '', '', '', '', '', '', '', '', ''];
        $rows[] = ['TOTAL', '', number_format($s['total_original_amount'] ?? 0, 2, ',', '.'), '', '', number_format($s['total_final_amount'] ?? 0, 2, ',', '.'), number_format($s['total_savings'] ?? 0, 2, ',', '.'), ($s['savings_percent_year'] ?? 0) . '%', '', ''];

        return $rows;
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            6 => ['font' => ['bold' => true, 'size' => 11]],
        ];
    }

    private function translateStatus(?string $status): string
    {
        return match ($status) {
            'paid'            => 'Pago',
            'open'            => 'Em Aberto',
            'waiting_payment' => 'Ag. Pagamento',
            'overdue'         => 'Vencido',
            'cancelled'       => 'Cancelado',
            default           => $status ?? '—',
        };
    }
}

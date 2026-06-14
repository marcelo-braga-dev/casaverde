<?php

namespace App\Exports\Admin\Reports;

use App\Services\Admin\Reports\BillReportService;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BillReportExport implements FromArray, ShouldAutoSize, WithHeadings
{
    public function __construct(
        private readonly array $filters = [],
    ) {}

    public function headings(): array
    {
        return [
            'ID',
            'Cliente',
            'Usina',
            'Concessionária',
            'Unidade Consumidora',
            'Referência',
            'Vencimento',
            'Status Revisão',
            'Status Parser',
            'Valor Total',
            'Consumo kWh',
            'Criado em',
        ];
    }

    public function array(): array
    {
        $report = app(BillReportService::class)->handle($this->filters);

        return collect($report['items'])->map(fn (array $item) => [
            $item['id'],
            $item['client_name'],
            $item['usina'],
            $item['concessionaria'],
            $item['unidade_consumidora'],
            $item['reference_label'],
            $item['vencimento'],
            $item['review_status'],
            $item['parser_status'],
            $item['valor_total'],
            $item['consumo_kwh'],
            $item['created_at'],
        ])->toArray();
    }
}

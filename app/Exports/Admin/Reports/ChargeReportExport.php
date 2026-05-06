<?php

namespace App\Exports\Admin\Reports;

use App\Services\Admin\Reports\ChargeReportService;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ChargeReportExport implements FromArray, WithHeadings, ShouldAutoSize
{
    public function __construct(
        private readonly array $filters = [],
    ) {
    }

    public function headings(): array
    {
        return [
            'ID',
            'Cliente',
            'Usina',
            'Concessionária',
            'Referência',
            'Vencimento',
            'Status',
            'Valor Original',
            'Desconto %',
            'Desconto Contratual',
            'Desconto Manual',
            'Acréscimo Manual',
            'Valor Final',
            'Pago em',
        ];
    }

    public function array(): array
    {
        $report = app(ChargeReportService::class)->handle($this->filters);

        return collect($report['items'])->map(fn (array $item) => [
            $item['id'],
            $item['client_name'],
            $item['usina'],
            $item['concessionaria'],
            $item['reference_label'],
            $item['due_date'],
            $item['status'],
            $item['original_amount'],
            $item['discount_percent'],
            $item['discount_amount'],
            $item['manual_discount_amount'],
            $item['manual_addition_amount'],
            $item['final_amount'],
            $item['paid_at'],
        ])->toArray();
    }
}

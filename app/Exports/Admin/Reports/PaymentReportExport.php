<?php

namespace App\Exports\Admin\Reports;

use App\Services\Admin\Reports\PaymentReportService;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PaymentReportExport implements FromArray, WithHeadings, ShouldAutoSize
{
    public function __construct(
        private readonly array $filters = [],
    ) {
    }

    public function headings(): array
    {
        return [
            'ID',
            'Cobrança ID',
            'Cliente',
            'Provider',
            'ID Provider',
            'Método',
            'Status',
            'Valor',
            'Vencimento',
            'Gerado em',
            'Pago em',
        ];
    }

    public function array(): array
    {
        $report = app(PaymentReportService::class)->handle($this->filters);

        return collect($report['items'])->map(fn (array $item) => [
            $item['id'],
            $item['charge_id'],
            $item['client_name'],
            $item['provider'],
            $item['provider_payment_id'],
            $item['payment_method'],
            $item['status'],
            $item['amount'],
            $item['due_date'],
            $item['generated_at'],
            $item['paid_at'],
        ])->toArray();
    }
}

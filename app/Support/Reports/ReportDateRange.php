<?php

namespace App\Support\Reports;

use Carbon\Carbon;

class ReportDateRange
{
    public function __construct(
        public readonly Carbon $startDate,
        public readonly Carbon $endDate,
    ) {}

    public static function fromFilters(array $filters): self
    {
        $start = ! empty($filters['start_date'])
            ? Carbon::parse($filters['start_date'])->startOfDay()
            : now()->startOfMonth();

        $end = ! empty($filters['end_date'])
            ? Carbon::parse($filters['end_date'])->endOfDay()
            : now()->endOfMonth();

        return new self($start, $end);
    }

    public function label(): string
    {
        return $this->startDate->format('d/m/Y').' até '.$this->endDate->format('d/m/Y');
    }

    public function toArray(): array
    {
        return [
            'start_date' => $this->startDate->format('Y-m-d'),
            'end_date' => $this->endDate->format('Y-m-d'),
            'label' => $this->label(),
        ];
    }
}

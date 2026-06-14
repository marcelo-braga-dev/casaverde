<?php

namespace Database\Factories\Fatura;

use App\Enums\Fatura\BillParserStatus;
use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConcessionaireBillFactory extends Factory
{
    protected $model = ConcessionaireBill::class;

    public function definition(): array
    {
        return [
            'client_profile_id' => ClientProfile::factory(),
            'usina_id' => null,
            'created_by_user_id' => null,
            'reviewed_by_user_id' => null,
            'import_source' => 'manual',
            'concessionaria_id' => null,
            'reference_month' => now()->month,
            'reference_year' => now()->year,
            'reference_label' => now()->format('m/Y'),
            'unidade_consumidora' => fake()->numerify('##########'),
            'numero_instalacao' => fake()->numerify('########'),
            'vencimento' => now()->addDays(15)->toDateString(),
            'valor_total' => 250.00,
            'consumo_kwh' => 300.00,
            'pdf_disk' => 'local',
            'pdf_path' => null,
            'pdf_original_name' => null,
            'pdf_url' => null,
            'raw_text' => null,
            'extracted_payload' => null,
            'import_status' => 'imported',
            'review_status' => 'pending_review',
            'parser_status' => BillParserStatus::PENDING->value,
            'parser_error' => null,
            'notes' => null,
            'reviewed_at' => null,
            'nome' => null,
            'review_notes' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'review_status' => 'approved',
            'reviewed_at' => now(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn () => [
            'review_status' => 'rejected',
            'reviewed_at' => now(),
        ]);
    }
}

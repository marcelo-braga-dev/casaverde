<?php

namespace App\Services\Fatura;

use App\Models\Alert\OperationalAlert;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ImportedConcessionaireEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class DeleteConcessionaireBillService
{
    /**
     * Exclui definitivamente a fatura e todos os registros vinculados:
     * pendências, cobranças, boletos, transações de pagamento (via cascade no banco),
     * alertas operacionais, histórico de importação e o PDF armazenado em disco.
     */
    public function handle(ConcessionaireBill $bill): void
    {
        if ($bill->customerCharge?->isPaid()) {
            throw new RuntimeException('Não é possível excluir uma fatura com cobrança já paga. Cancele ou ajuste a cobrança antes de excluir.');
        }

        DB::transaction(function () use ($bill) {
            if ($bill->pdf_path && Storage::disk($bill->pdf_disk ?: 'local')->exists($bill->pdf_path)) {
                Storage::disk($bill->pdf_disk ?: 'local')->delete($bill->pdf_path);
            }

            OperationalAlert::query()
                ->where('alertable_type', ConcessionaireBill::class)
                ->where('alertable_id', $bill->id)
                ->delete();

            ImportedConcessionaireEmail::query()
                ->where('concessionaire_bill_id', $bill->id)
                ->delete();

            $bill->delete();
        });
    }
}

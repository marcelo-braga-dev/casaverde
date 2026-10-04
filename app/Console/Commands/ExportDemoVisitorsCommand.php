<?php

namespace App\Console\Commands;

use App\Http\Controllers\Demo\DemoVisitorExport;
use App\Models\Demo\DemoVisitor;
use Illuminate\Console\Command;

class ExportDemoVisitorsCommand extends Command
{
    protected $signature = 'demo:visitantes {arquivo? : Caminho do CSV (padrão: mostra uma tabela)} {--desde= : Só quem acessou a partir desta data (AAAA-MM-DD)}';

    protected $description = 'Lista ou exporta em CSV os visitantes do modo demonstração, para a equipe de vendas';

    public function handle(): int
    {
        $visitors = DemoVisitor::query()
            ->when($this->option('desde'), fn ($q, $since) => $q->where('last_seen_at', '>=', $since))
            ->orderByDesc('last_seen_at')
            ->get();

        $rows = $visitors->map(fn (DemoVisitor $visitor) => DemoVisitorExport::row($visitor))->all();

        if (! $file = $this->argument('arquivo')) {
            $this->table(array_slice(DemoVisitorExport::HEADER, 0, 9), array_map(fn ($row) => array_slice($row, 0, 9), $rows));
            $this->info($visitors->count().' visitante(s).');

            return self::SUCCESS;
        }

        $out = fopen($file, 'w');
        fwrite($out, "\xEF\xBB\xBF");
        fputcsv($out, DemoVisitorExport::HEADER, ';');
        foreach ($rows as $row) {
            fputcsv($out, $row, ';');
        }
        fclose($out);

        $this->info($visitors->count()." visitante(s) exportado(s) para {$file}.");

        return self::SUCCESS;
    }
}

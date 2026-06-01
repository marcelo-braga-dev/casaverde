<?php

namespace App\Models\Fatura;

use App\Models\Cliente\ClientProfile;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;

class ImportRun extends Model
{
    protected $table = 'import_runs';

    protected $fillable = [
        'run_code',
        'triggered_by',
        'triggered_by_user_id',
        'client_profile_id',
        'status',
        'total_settings',
        'total_processed',
        'total_imported',
        'total_skipped',
        'total_failed',
        'started_at',
        'finished_at',
        'duration_ms',
        'error_message',
    ];

    protected $casts = [
        'started_at'  => 'datetime',
        'finished_at' => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────

    /**
     * Relação nomeada "triggeredByUser" (não "triggeredBy") para evitar conflito
     * com a coluna "triggered_by" (scheduler/manual/command) ao serializar para JSON.
     */
    public function triggeredByUser()
    {
        return $this->belongsTo(User::class, 'triggered_by_user_id');
    }

    public function clientProfile()
    {
        return $this->belongsTo(ClientProfile::class, 'client_profile_id');
    }

    public function emails()
    {
        return $this->hasMany(ImportedConcessionaireEmail::class, 'import_run_id');
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    public function finish(array $totals = [], ?string $error = null): void
    {
        $startMs = $this->started_at->getPreciseTimestamp(3);
        $nowMs   = now()->getPreciseTimestamp(3);

        $this->update(array_merge([
            'status'       => $error ? 'failed' : ($totals['failed'] > 0 ? 'partial' : 'completed'),
            'finished_at'  => now(),
            'duration_ms'  => (int) ($nowMs - $startMs),
            'error_message'=> $error,
        ], $totals));
    }

    public static function generateCode(): string
    {
        return 'RUN-' . now()->format('Ymd-His');
    }

    public function getSuccessRateAttribute(): float
    {
        $total = $this->total_processed - $this->total_skipped;
        return $total > 0
            ? round(($this->total_imported / $total) * 100, 1)
            : 0;
    }
}

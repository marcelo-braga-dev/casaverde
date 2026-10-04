<?php

namespace App\Services\Proposta;

use App\Services\Config\SystemSettingService;
use Illuminate\Support\Facades\Storage;

/** Identidade visual configurada, no formato que os modelos de proposta em PDF usam. */
class ProposalPdfBrand
{
    public function __construct(private readonly SystemSettingService $settings) {}

    public function toArray(): array
    {
        $primary = $this->hex($this->settings->get('brand_color_primary'), '#2F7D18');

        return [
            'name' => $this->settings->get('brand_name', config('app.name')),
            'logo' => $this->logo(),
            'primary' => $primary,
            'primary_dark' => $this->mix($primary, 0, 0.35),
            'primary_soft' => $this->mix($primary, 255, 0.9),
            'accent' => $this->hex($this->settings->get('brand_color_secondary'), '#F59E0B'),
        ];
    }

    private function logo(): ?string
    {
        $path = $this->settings->get('brand_logo_path');

        if (! $path || ! Storage::disk('public')->exists($path)) {
            return null;
        }

        $mime = Storage::disk('public')->mimeType($path) ?: 'image/png';

        // SVG não é suportado de forma confiável pelo dompdf.
        return $mime === 'image/svg+xml'
            ? null
            : 'data:'.$mime.';base64,'.base64_encode(Storage::disk('public')->get($path));
    }

    private function hex(?string $value, string $fallback): string
    {
        return preg_match('/^#[0-9A-Fa-f]{6}$/', (string) $value) ? strtoupper($value) : $fallback;
    }

    private function mix(string $hex, int $target, float $amount): string
    {
        $rgb = array_map('hexdec', str_split(ltrim($hex, '#'), 2));

        return sprintf('#%02X%02X%02X', ...array_map(fn ($c) => (int) round($c + ($target - $c) * $amount), $rgb));
    }
}

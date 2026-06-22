<?php

namespace App\Http\Controllers\Admin\Configuracao;

use App\Http\Controllers\Controller;
use App\Http\Requests\Config\UpdateBrandIdentityRequest;
use App\Models\Config\SystemSetting;
use App\Services\Config\SystemSettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BrandIdentityController extends Controller
{
    private const DEFAULT_NAME = 'Casa Verde';

    private const DEFAULT_COLOR_PRIMARY = '#2F7D18';

    private const DEFAULT_COLOR_SECONDARY = '#4F9A2A';

    public function index(SystemSettingService $settings): Response
    {
        return Inertia::render('Admin/Configuracao/BrandIdentity/Page', [
            'brand' => [
                'name' => $settings->get('brand_name', self::DEFAULT_NAME),
                'color_primary' => $settings->get('brand_color_primary', self::DEFAULT_COLOR_PRIMARY),
                'color_secondary' => $settings->get('brand_color_secondary', self::DEFAULT_COLOR_SECONDARY),
                'logo_url' => $this->urlFor($settings->get('brand_logo_path')),
                'favicon_url' => $this->urlFor($settings->get('brand_favicon_path')),
            ],
        ]);
    }

    public function update(UpdateBrandIdentityRequest $request, SystemSettingService $settings): RedirectResponse
    {
        $userId = auth()->id();

        $settings->set('brand_name', $request->string('name')->toString(), 'string', $userId);
        $settings->set('brand_color_primary', $request->string('color_primary')->toString(), 'string', $userId);
        $settings->set('brand_color_secondary', $request->string('color_secondary')->toString(), 'string', $userId);

        if ($request->hasFile('logo')) {
            $this->replaceFile($settings, 'brand_logo_path', $request->file('logo'), $userId);
        }

        if ($request->hasFile('favicon')) {
            $this->replaceFile($settings, 'brand_favicon_path', $request->file('favicon'), $userId);
        }

        return back()->with('success', 'Identidade visual atualizada com sucesso.');
    }

    public function destroyLogo(SystemSettingService $settings): RedirectResponse
    {
        $this->removeFile($settings, 'brand_logo_path');

        return back()->with('success', 'Logo restaurado para o padrão.');
    }

    public function destroyFavicon(SystemSettingService $settings): RedirectResponse
    {
        $this->removeFile($settings, 'brand_favicon_path');

        return back()->with('success', 'Favicon restaurado para o padrão.');
    }

    private function replaceFile(SystemSettingService $settings, string $key, $file, ?int $userId): void
    {
        $previous = $settings->get($key);
        if ($previous && Storage::disk('public')->exists($previous)) {
            Storage::disk('public')->delete($previous);
        }

        $prefix = $key === 'brand_logo_path' ? 'logo' : 'favicon';
        $filename = $prefix.'-'.now()->timestamp.'-'.Str::random(8).'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('brand', $filename, 'public');

        $settings->set($key, $path, 'string', $userId);
    }

    private function removeFile(SystemSettingService $settings, string $key): void
    {
        $path = $settings->get($key);
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        SystemSetting::query()->where('key', $key)->delete();
    }

    private function urlFor(?string $path): ?string
    {
        if (! $path || ! Storage::disk('public')->exists($path)) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }
}

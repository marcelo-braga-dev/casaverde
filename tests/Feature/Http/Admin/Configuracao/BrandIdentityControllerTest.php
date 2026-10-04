<?php

use App\Models\Config\SystemSetting;
use App\Models\Users\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('BrandIdentityController', function () {

    beforeEach(function () {
        Storage::fake('public');
        $this->admin = User::factory()->admin()->create();
    });

    it('renders the index page with default brand values', function () {
        $this->actingAs($this->admin)
            ->get(route('admin.brand-identity.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Configuracao/BrandIdentity/Page')
                ->where('brand.name', 'Casa Verde')
                ->where('brand.color_primary', '#2F7D18')
            );
    });

    it('stores the brand name and colors', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
            ])
            ->assertRedirect();

        expect(SystemSetting::where('key', 'brand_name')->first()->value)->toBe('Solmar Energia')
            ->and(SystemSetting::where('key', 'brand_color_primary')->first()->value)->toBe('#112233')
            ->and(SystemSetting::where('key', 'brand_color_secondary')->first()->value)->toBe('#445566');
    });

    it('stores the sidebar colors and shares them with every page', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'color_sidebar' => '#F8FAFC',
                'color_sidebar_text' => '#1F2937',
                'color_sidebar_accent' => '#F3981A',
            ])
            ->assertRedirect();

        expect(SystemSetting::where('key', 'brand_color_sidebar')->first()->value)->toBe('#F8FAFC')
            ->and(SystemSetting::where('key', 'brand_color_sidebar_text')->first()->value)->toBe('#1F2937')
            ->and(SystemSetting::where('key', 'brand_color_sidebar_accent')->first()->value)->toBe('#F3981A');

        // A página da identidade e o prop compartilhado (que pinta o menu em toda tela).
        $this->get(route('admin.brand-identity.index'))
            ->assertInertia(fn ($page) => $page
                ->where('brand.color_sidebar', '#F8FAFC')
                ->where('brand.color_sidebar_text', '#1F2937')
                ->where('brand.color_sidebar_accent', '#F3981A')
            );

        $this->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('brand.color_sidebar', '#F8FAFC')
                ->where('brand.color_sidebar_text', '#1F2937')
                ->where('brand.color_sidebar_accent', '#F3981A')
            );
    });

    it('clears the sidebar colors to fall back to the default menu', function () {
        SystemSetting::create(['key' => 'brand_color_sidebar', 'value' => '#1E3A8A', 'type' => 'string']);
        SystemSetting::create(['key' => 'brand_color_sidebar_text', 'value' => '#FFFFFF', 'type' => 'string']);
        SystemSetting::create(['key' => 'brand_color_sidebar_accent', 'value' => '#F3981A', 'type' => 'string']);

        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'color_sidebar' => '',
                'color_sidebar_text' => '',
                'color_sidebar_accent' => '',
            ])
            ->assertRedirect();

        expect(SystemSetting::whereIn('key', [
            'brand_color_sidebar', 'brand_color_sidebar_text', 'brand_color_sidebar_accent',
        ])->exists())->toBeFalse();
    });

    it('rejects an invalid sidebar color', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'color_sidebar' => 'azul',
                'color_sidebar_text' => 'branco',
                'color_sidebar_accent' => '#12',
            ])
            ->assertSessionHasErrors(['color_sidebar', 'color_sidebar_text', 'color_sidebar_accent']);
    });

    it('rejects an invalid hex color', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => 'not-a-color',
                'color_secondary' => '#445566',
            ])
            ->assertSessionHasErrors('color_primary');
    });

    it('uploads and replaces the logo, deleting the previous file', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'logo' => UploadedFile::fake()->image('logo.png'),
            ])
            ->assertRedirect();

        $firstPath = SystemSetting::where('key', 'brand_logo_path')->first()->value;
        Storage::disk('public')->assertExists($firstPath);

        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'logo' => UploadedFile::fake()->image('logo-novo.png'),
            ])
            ->assertRedirect();

        $secondPath = SystemSetting::where('key', 'brand_logo_path')->first()->value;

        expect($secondPath)->not->toBe($firstPath);
        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($secondPath);
    });

    it('restores the default logo, removing the stored file and setting', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'logo' => UploadedFile::fake()->image('logo.png'),
            ])
            ->assertRedirect();

        $path = SystemSetting::where('key', 'brand_logo_path')->first()->value;

        $this->actingAs($this->admin)
            ->delete(route('admin.brand-identity.logo.destroy'))
            ->assertRedirect();

        Storage::disk('public')->assertMissing($path);
        expect(SystemSetting::where('key', 'brand_logo_path')->first())->toBeNull();
    });

    it('uploads a boleto logo and exposes its url on the index page', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'boleto_logo' => UploadedFile::fake()->image('boleto-logo.png'),
            ])
            ->assertRedirect();

        $path = SystemSetting::where('key', 'brand_boleto_logo_path')->first()->value;
        Storage::disk('public')->assertExists($path);

        $this->actingAs($this->admin)
            ->get(route('admin.brand-identity.index'))
            ->assertInertia(fn ($page) => $page->where('brand.boleto_logo_url', fn ($url) => str_contains($url, $path)));
    });

    it('restores the default boleto logo, removing the stored file and setting', function () {
        $this->actingAs($this->admin)
            ->post(route('admin.brand-identity.update'), [
                'name' => 'Solmar Energia',
                'color_primary' => '#112233',
                'color_secondary' => '#445566',
                'boleto_logo' => UploadedFile::fake()->image('boleto-logo.png'),
            ])
            ->assertRedirect();

        $path = SystemSetting::where('key', 'brand_boleto_logo_path')->first()->value;

        $this->actingAs($this->admin)
            ->delete(route('admin.brand-identity.boleto-logo.destroy'))
            ->assertRedirect();

        Storage::disk('public')->assertMissing($path);
        expect(SystemSetting::where('key', 'brand_boleto_logo_path')->first())->toBeNull();
    });

});

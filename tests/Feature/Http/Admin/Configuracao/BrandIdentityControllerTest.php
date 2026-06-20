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

});

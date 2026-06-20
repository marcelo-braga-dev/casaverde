<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Users\User;

describe('ClientEmailImportSettingController', function () {

    beforeEach(function () {
        $this->admin = User::factory()->admin()->create();
        $this->client = ClientProfile::factory()->create();
    });

    it('stores the pdf_password and returns it decrypted on the next load', function () {
        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.email-import-setting.store'), [
                'client_profile_id' => $this->client->id,
                'concessionaria_id' => null,
                'pdf_password' => 'minhaSenha123',
                'is_active' => true,
            ])
            ->assertRedirect();

        $setting = ClientEmailImportSetting::where('client_profile_id', $this->client->id)->first();

        expect($setting)->not->toBeNull()
            ->and($setting->pdf_password)->toBe('minhaSenha123');
    });

    it('trims accidental whitespace from pdf_password before storing', function () {
        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.email-import-setting.store'), [
                'client_profile_id' => $this->client->id,
                'pdf_password' => '  minhaSenha123  ',
                'is_active' => true,
            ])
            ->assertRedirect();

        $setting = ClientEmailImportSetting::where('client_profile_id', $this->client->id)->first();

        expect($setting->pdf_password)->toBe('minhaSenha123');
    });

    it('keeps the existing pdf_password when updating without sending a new one', function () {
        $setting = ClientEmailImportSetting::create([
            'client_profile_id' => $this->client->id,
            'user_id' => $this->admin->id,
            'imap_host' => 'mail.casaverde.com.br',
            'imap_port' => 993,
            'imap_encryption' => 'ssl',
            'imap_email' => 'teste@example.com',
            'imap_password' => 'x',
            'pdf_password' => 'senhaOriginal',
            'is_active' => true,
        ]);

        $this->actingAs($this->admin)
            ->put(route('admin.fatura-import-settings.update', $setting->id), [
                'concessionaria_id' => $setting->concessionaria_id,
                'sender_filter' => null,
                'subject_filter' => null,
                'is_active' => true,
            ])
            ->assertRedirect();

        expect($setting->refresh()->pdf_password)->toBe('senhaOriginal');
    });

    it('allows the same consultor to store settings for more than one client', function () {
        $secondClient = ClientProfile::factory()->create();

        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.email-import-setting.store'), [
                'client_profile_id' => $this->client->id,
                'pdf_password' => 'senhaClienteA',
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->actingAs($this->admin)
            ->post(route('consultor.user.cliente.email-import-setting.store'), [
                'client_profile_id' => $secondClient->id,
                'pdf_password' => 'senhaClienteB',
                'is_active' => true,
            ])
            ->assertRedirect();

        expect(ClientEmailImportSetting::where('client_profile_id', $this->client->id)->first()->pdf_password)->toBe('senhaClienteA')
            ->and(ClientEmailImportSetting::where('client_profile_id', $secondClient->id)->first()->pdf_password)->toBe('senhaClienteB');
    });

});

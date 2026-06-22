<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Users\User;
use App\Services\Fatura\ProtectedPdfResolverService;
use Illuminate\Support\Facades\Storage;

describe('ConcessionaireBillFileController', function () {

    beforeEach(function () {
        $this->admin = User::factory()->admin()->create();
        $this->actingAs($this->admin);

        Storage::fake('local');
    });

    it('serves the original pdf when the client has no import password configured', function () {
        $client = ClientProfile::factory()->create();
        Storage::disk('local')->put('faturas/sem-senha.pdf', 'conteudo-original');

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'pdf_disk' => 'local',
            'pdf_path' => 'faturas/sem-senha.pdf',
        ]);

        $response = $this->get(route('consultor.cliente.faturas.pdf', $bill->id));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/pdf');
        expect($response->streamedContent())->toBe('conteudo-original');
    });

    it('serves the unlocked pdf when the client has an import password configured, avoiding the browser password prompt', function () {
        $client = ClientProfile::factory()->create();
        Storage::disk('local')->put('faturas/com-senha.pdf', 'conteudo-criptografado');

        ClientEmailImportSetting::create([
            'client_profile_id' => $client->id,
            'user_id' => User::factory()->admin()->create()->id,
            'imap_host' => 'mail.example.com',
            'imap_port' => 993,
            'imap_encryption' => 'ssl',
            'imap_email' => 'import@example.com',
            'imap_password' => 'secret',
            'pdf_password' => 'minha-senha',
            'is_active' => true,
        ]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'pdf_disk' => 'local',
            'pdf_path' => 'faturas/com-senha.pdf',
        ]);

        $unlockedPath = storage_path('app/tmp/fake-unlocked-test.pdf');
        @mkdir(dirname($unlockedPath), 0775, true);
        file_put_contents($unlockedPath, 'conteudo-desbloqueado');

        $this->mock(ProtectedPdfResolverService::class, function ($mock) use ($unlockedPath) {
            $mock->shouldReceive('unlockToTempFile')->once()->andReturn($unlockedPath);
        });

        $response = $this->get(route('consultor.cliente.faturas.pdf', $bill->id));

        $response->assertOk();
        expect($response->streamedContent())->toBe('conteudo-desbloqueado');
    });

    it('falls back to the original pdf when unlocking fails', function () {
        $client = ClientProfile::factory()->create();
        Storage::disk('local')->put('faturas/falha.pdf', 'conteudo-original-fallback');

        ClientEmailImportSetting::create([
            'client_profile_id' => $client->id,
            'user_id' => User::factory()->admin()->create()->id,
            'imap_host' => 'mail.example.com',
            'imap_port' => 993,
            'imap_encryption' => 'ssl',
            'imap_email' => 'import@example.com',
            'imap_password' => 'secret',
            'pdf_password' => 'senha-errada',
            'is_active' => true,
        ]);

        $bill = ConcessionaireBill::factory()->create([
            'client_profile_id' => $client->id,
            'pdf_disk' => 'local',
            'pdf_path' => 'faturas/falha.pdf',
        ]);

        $this->mock(ProtectedPdfResolverService::class, function ($mock) {
            $mock->shouldReceive('unlockToTempFile')->once()->andThrow(new RuntimeException('Senha incorreta para desbloquear o PDF.'));
        });

        $response = $this->get(route('consultor.cliente.faturas.pdf', $bill->id));

        $response->assertOk();
        expect($response->streamedContent())->toBe('conteudo-original-fallback');
    });

    it('returns 404 when the pdf does not exist on disk', function () {
        $bill = ConcessionaireBill::factory()->create([
            'pdf_disk' => 'local',
            'pdf_path' => 'faturas/nao-existe.pdf',
        ]);

        $response = $this->get(route('consultor.cliente.faturas.pdf', $bill->id));

        $response->assertNotFound();
    });

});

<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Services\Fatura\PdfTextExtractorService;
use App\Services\Fatura\ProtectedPdfResolverService;
use App\Services\Fatura\StoreParsedConcessionaireBillService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function fakeCopelBillRawTextForManualUpload(): string
{
    return <<<'TEXT'
Nome: DANILO GOMES DE PAULA
Endereço: R Aracaju, 485 - Qd17 Lt14a - Aparecida 54165822
05/2026 20/06/2026 R$796,17
ENERGIA ELET CONSUMO kWh 2.716 0,367931 999,30 60,50 189,87 0,275750
TOTAL 796,17 105,56 446,94
0403072862 CONSUMO kWh TP 58358 61074 1 2716
TEXT;
}

describe('StoreParsedConcessionaireBillService', function () {

    beforeEach(function () {
        Storage::fake('local');

        $this->clientProfile = ClientProfile::factory()->create();

        $this->partialMock(ProtectedPdfResolverService::class, function ($mock) {
            $mock->shouldReceive('unlockToTempFile')->andReturn('/tmp/fake-unlocked.pdf');
        });

        $this->mock(PdfTextExtractorService::class, function ($mock) {
            $mock->shouldReceive('extract')->andReturn(fakeCopelBillRawTextForManualUpload());
        });
    });

    it('defaults the bill to the Copel concessionaria when none is configured for the client', function () {
        Concessionaria::factory()->create(['nome' => 'Copel Distribuição']);

        $service = app(StoreParsedConcessionaireBillService::class);

        $bill = $service->handle([
            'client_profile_id' => $this->clientProfile->id,
            'pdf' => UploadedFile::fake()->create('fatura.pdf', 10, 'application/pdf'),
        ]);

        expect($bill->concessionaria->nome)->toBe('Copel Distribuição')
            ->and($bill->parser_status)->toBe('success');
    });

    it('uses the concessionaria configured in the client email import setting when present', function () {
        $copel = Concessionaria::factory()->create(['nome' => 'Copel Distribuição']);
        $outraConcessionaria = Concessionaria::factory()->create(['nome' => 'Outra Concessionária']);

        ClientEmailImportSetting::create([
            'client_profile_id' => $this->clientProfile->id,
            'concessionaria_id' => $outraConcessionaria->id,
            'user_id' => User::factory()->admin()->create()->id,
            'imap_host' => 'mail.example.com',
            'imap_port' => 993,
            'imap_encryption' => 'ssl',
            'imap_email' => 'import@example.com',
            'imap_password' => 'secret',
            'is_active' => true,
        ]);

        $service = app(StoreParsedConcessionaireBillService::class);

        $bill = $service->handle([
            'client_profile_id' => $this->clientProfile->id,
            'pdf' => UploadedFile::fake()->create('fatura.pdf', 10, 'application/pdf'),
        ]);

        expect($bill->concessionaria_id)->toBe($outraConcessionaria->id)
            ->and($bill->concessionaria_id)->not->toBe($copel->id);
    });

    it('keeps the explicitly informed concessionaria_id over any default', function () {
        Concessionaria::factory()->create(['nome' => 'Copel Distribuição']);
        $escolhida = Concessionaria::factory()->create(['nome' => 'Escolhida Manualmente']);

        $service = app(StoreParsedConcessionaireBillService::class);

        $bill = $service->handle([
            'client_profile_id' => $this->clientProfile->id,
            'concessionaria_id' => $escolhida->id,
            'pdf' => UploadedFile::fake()->create('fatura.pdf', 10, 'application/pdf'),
        ]);

        expect($bill->concessionaria_id)->toBe($escolhida->id);
    });

    it('creates the bill without a concessionaria when there is no Copel registered and none configured', function () {
        $service = app(StoreParsedConcessionaireBillService::class);

        $bill = $service->handle([
            'client_profile_id' => $this->clientProfile->id,
            'pdf' => UploadedFile::fake()->create('fatura.pdf', 10, 'application/pdf'),
        ]);

        expect($bill->concessionaria_id)->toBeNull();
    });

});

<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ImportedConcessionaireEmail;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Users\User;
use App\Models\Usina\Concessionaria;
use App\Services\Fatura\Imap\ImapConcessionaireFetcherService;
use App\Services\Fatura\ImportAutomaticConcessionaireBillService;
use App\Services\Fatura\PdfTextExtractorService;
use App\Services\Fatura\ProtectedPdfResolverService;
use Illuminate\Support\Facades\Storage;

function fakeCopelBillRawText(): string
{
    return <<<'TEXT'
Nome: DANILO GOMES DE PAULA
Endereço: R Aracaju, 485 - Qd17 Lt14a - Aparecida 54165822
05/2026 20/06/2026 R$796,17
ENERGIA ELET CONSUMO kWh 2.716 0,367931 999,30 60,50 189,87 0,275750
ENERGIA INJ. OUC MPT TE 05/2026 GDI-I kWh -166 0,275723 -45,77 0,00 0,00 0,275750
TOTAL 796,17 105,56 446,94
0403072862 CONSUMO kWh TP 58358 61074 1 2716
TEXT;
}

function fakeMessageWithAttachment(array $overrides = []): array
{
    return array_merge([
        'uid' => 'uid-1',
        'message_id' => 'msg-1',
        'from' => 'concessionaria@example.com',
        'subject' => 'Sua fatura chegou',
        'received_at' => now(),
        'attachments' => [
            ['filename' => 'fatura.pdf', 'content' => 'fake-pdf-bytes'],
        ],
    ], $overrides);
}

describe('ImportAutomaticConcessionaireBillService', function () {

    beforeEach(function () {
        Storage::fake('local');

        $this->concessionaria = Concessionaria::factory()->create();
        $this->clientProfile = ClientProfile::factory()->create();
        $this->setting = ClientEmailImportSetting::create([
            'client_profile_id' => $this->clientProfile->id,
            'concessionaria_id' => $this->concessionaria->id,
            'user_id' => User::factory()->admin()->create()->id,
            'imap_host' => 'mail.example.com',
            'imap_port' => 993,
            'imap_encryption' => 'ssl',
            'imap_email' => 'import@example.com',
            'imap_password' => 'secret',
            'is_active' => true,
        ]);

        $this->partialMock(ProtectedPdfResolverService::class, function ($mock) {
            $mock->shouldReceive('unlockToTempFile')->andReturn('/tmp/fake-unlocked.pdf');
        });

        $this->mock(PdfTextExtractorService::class, function ($mock) {
            $mock->shouldReceive('extract')->andReturn(fakeCopelBillRawText());
        });
    });

    it('imports a bill from a single email message with one attachment', function () {
        $this->mock(ImapConcessionaireFetcherService::class, function ($mock) {
            $mock->shouldReceive('fetchMessages')->andReturn([fakeMessageWithAttachment()]);
        });

        $service = app(ImportAutomaticConcessionaireBillService::class);
        $result = $service->handle($this->clientProfile, $this->setting);

        expect($result)->toBe(['processed' => 1, 'imported' => 1, 'skipped' => 0, 'failed' => 0])
            ->and(ConcessionaireBill::count())->toBe(1);

        $bill = ConcessionaireBill::first();
        expect($bill->client_profile_id)->toBe($this->clientProfile->id)
            ->and($bill->unidade_consumidora)->toBe('54165822')
            ->and($bill->import_status)->toBe('imported')
            ->and($bill->parser_status)->toBe('success');

        $log = ImportedConcessionaireEmail::first();
        expect($log->status)->toBe('success')
            ->and($log->concessionaire_bill_id)->toBe($bill->id);

        expect($this->setting->refresh()->last_checked_at)->not->toBeNull();
    });

    it('skips an attachment that was already imported, identified by its content hash', function () {
        $this->mock(ImapConcessionaireFetcherService::class, function ($mock) {
            $mock->shouldReceive('fetchMessages')->andReturn([fakeMessageWithAttachment()]);
        });

        $service = app(ImportAutomaticConcessionaireBillService::class);
        $service->handle($this->clientProfile, $this->setting);

        $resultSecondRun = $service->handle($this->clientProfile, $this->setting);

        expect($resultSecondRun)->toBe(['processed' => 1, 'imported' => 0, 'skipped' => 1, 'failed' => 0])
            ->and(ConcessionaireBill::count())->toBe(1);
    });

    it('marks the log as failed and does not raise an exception when the parser fails', function () {
        $this->mock(ImapConcessionaireFetcherService::class, function ($mock) {
            $mock->shouldReceive('fetchMessages')->andReturn([fakeMessageWithAttachment()]);
        });

        $this->mock(PdfTextExtractorService::class, function ($mock) {
            $mock->shouldReceive('extract')->andReturn('texto sem nenhum dado reconhecível');
        });

        $service = app(ImportAutomaticConcessionaireBillService::class);
        $result = $service->handle($this->clientProfile, $this->setting);

        expect($result)->toBe(['processed' => 1, 'imported' => 0, 'skipped' => 0, 'failed' => 1])
            ->and(ConcessionaireBill::count())->toBe(0);

        $log = ImportedConcessionaireEmail::first();
        expect($log->status)->toBe('failed')
            ->and($log->error_message)->not->toBeNull();
    });

    it('processes zero attachments when the message has none', function () {
        $this->mock(ImapConcessionaireFetcherService::class, function ($mock) {
            $mock->shouldReceive('fetchMessages')->andReturn([fakeMessageWithAttachment(['attachments' => []])]);
        });

        $service = app(ImportAutomaticConcessionaireBillService::class);
        $result = $service->handle($this->clientProfile, $this->setting);

        expect($result)->toBe(['processed' => 0, 'imported' => 0, 'skipped' => 0, 'failed' => 0])
            ->and(ImportedConcessionaireEmail::count())->toBe(0);
    });

    it('skips the second attachment of the same message after the first one is imported, since they share the message uid', function () {
        $this->mock(ImapConcessionaireFetcherService::class, function ($mock) {
            $mock->shouldReceive('fetchMessages')->andReturn([fakeMessageWithAttachment([
                'attachments' => [
                    ['filename' => 'fatura-1.pdf', 'content' => 'conteudo-1'],
                    ['filename' => 'fatura-2.pdf', 'content' => 'conteudo-2'],
                ],
            ])]);
        });

        $service = app(ImportAutomaticConcessionaireBillService::class);
        $result = $service->handle($this->clientProfile, $this->setting);

        expect($result['processed'])->toBe(2)
            ->and($result['imported'])->toBe(1)
            ->and($result['skipped'])->toBe(1)
            ->and($result['failed'])->toBe(0)
            ->and(ImportedConcessionaireEmail::count())->toBe(1);
    });

    it('imports attachments from two different messages independently', function () {
        $this->mock(ImapConcessionaireFetcherService::class, function ($mock) {
            $mock->shouldReceive('fetchMessages')->andReturn([
                fakeMessageWithAttachment(['uid' => 'uid-1', 'message_id' => 'msg-1', 'attachments' => [
                    ['filename' => 'fatura-1.pdf', 'content' => 'conteudo-1'],
                ]]),
                fakeMessageWithAttachment(['uid' => 'uid-2', 'message_id' => 'msg-2', 'attachments' => [
                    ['filename' => 'fatura-2.pdf', 'content' => 'conteudo-2'],
                ]]),
            ]);
        });

        $service = app(ImportAutomaticConcessionaireBillService::class);
        $result = $service->handle($this->clientProfile, $this->setting);

        expect($result['processed'])->toBe(2)
            ->and($result['imported'])->toBe(2)
            ->and($result['skipped'])->toBe(0)
            ->and($result['failed'])->toBe(0)
            ->and(ImportedConcessionaireEmail::count())->toBe(2);
    });

});

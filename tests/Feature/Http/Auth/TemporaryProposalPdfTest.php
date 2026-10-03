<?php

use App\Models\Users\User;
use App\Services\Proposta\TemporaryPdfStorageService;
use App\src\Roles\RoleUser;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(fn () => Storage::fake('local'));

it('stores the uploaded proposal pdf privately and returns a signed url', function () {
    $admin = User::factory()->create(['role_id' => RoleUser::$ADMIN]);

    $response = $this->actingAs($admin)->post(route('auth.propostas.pdf.cliente.gerar-pdf'), [
        'file' => UploadedFile::fake()->create('proposta.pdf', 10, 'application/pdf'),
    ]);

    $url = $response->assertOk()->json('url');

    expect($url)->toContain('signature=')
        ->and(Storage::disk('local')->files(TemporaryPdfStorageService::DIRECTORY))->toHaveCount(1);

    auth()->logout();

    $this->get($url)->assertOk()->assertHeader('Content-Type', 'application/pdf');
});

it('rejects unsigned or tampered links', function () {
    $url = app(TemporaryPdfStorageService::class)->store('%PDF-1.4 teste');

    $this->get(preg_replace('/signature=[^&]+/', 'signature=invalida', $url))->assertForbidden();
    $this->get(strtok($url, '?'))->assertForbidden();
});

it('rejects expired links', function () {
    $url = app(TemporaryPdfStorageService::class)->store('%PDF-1.4 teste');

    $this->travel(TemporaryPdfStorageService::TTL_HOURS + 1)->hours();

    $this->get($url)->assertForbidden();
});

it('prunes files older than one day', function () {
    $storage = app(TemporaryPdfStorageService::class);
    $storage->store('%PDF-1.4 antigo');
    $antigo = Storage::disk('local')->files(TemporaryPdfStorageService::DIRECTORY)[0];
    touch(Storage::disk('local')->path($antigo), now()->subDays(2)->getTimestamp());

    $storage->store('%PDF-1.4 novo');

    expect($storage->prune())->toBe(1)
        ->and(Storage::disk('local')->files(TemporaryPdfStorageService::DIRECTORY))->toHaveCount(1);
});

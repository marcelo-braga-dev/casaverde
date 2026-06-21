<?php

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Users\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

describe('ConcessionaireBillController bulk upload', function () {

    beforeEach(function () {
        Storage::fake('local');
        $this->consultor = User::factory()->admin()->create();
        $this->client = ClientProfile::factory()->create();
    });

    it('requires a client and at least one pdf', function () {
        $this->actingAs($this->consultor)
            ->post(route('consultor.cliente.faturas.store'), [])
            ->assertSessionHasErrors(['client_profile_id', 'pdfs']);
    });

    it('creates a ConcessionaireBill for a single uploaded pdf for the selected client', function () {
        $this->actingAs($this->consultor)
            ->post(route('consultor.cliente.faturas.store'), [
                'client_profile_id' => $this->client->id,
                'pdfs' => [
                    UploadedFile::fake()->create('fatura-1.pdf', 50, 'application/pdf'),
                ],
            ])
            ->assertRedirect(route('admin.relatorios.faturas'))
            ->assertSessionHas('success');

        expect(ConcessionaireBill::where('client_profile_id', $this->client->id)->count())->toBe(1);
    });

    it('reports per-file failures without aborting the rest of the batch', function () {
        $this->actingAs($this->consultor)
            ->post(route('consultor.cliente.faturas.store'), [
                'client_profile_id' => $this->client->id,
                'pdfs' => [
                    UploadedFile::fake()->create('fatura-1.pdf', 50, 'application/pdf'),
                    UploadedFile::fake()->create('fatura-2.pdf', 50, 'application/pdf'),
                ],
            ])
            ->assertRedirect(route('admin.relatorios.faturas'))
            ->assertSessionHas('warning');

        // Sem dados extraíveis, ambos os PDFs caem no mesmo fallback de UC/referência
        // e colidem na constraint única — por isso só 1 dos 2 é persistido.
        expect(ConcessionaireBill::where('client_profile_id', $this->client->id)->count())->toBe(1);
    });

});

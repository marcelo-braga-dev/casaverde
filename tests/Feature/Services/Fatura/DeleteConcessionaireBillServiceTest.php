<?php

use App\Models\Alert\OperationalAlert;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Fatura\ImportedConcessionaireEmail;
use App\Models\Importacao\ClientEmailImportSetting;
use App\Models\Users\User;
use App\Services\Fatura\DeleteConcessionaireBillService;

describe('DeleteConcessionaireBillService', function () {

    beforeEach(function () {
        $this->service = app(DeleteConcessionaireBillService::class);
    });

    it('deletes the bill, its operational alerts and its import history', function () {
        $bill = ConcessionaireBill::factory()->create();

        $user = User::factory()->admin()->create();

        $setting = ClientEmailImportSetting::create([
            'client_profile_id' => $bill->client_profile_id,
            'user_id' => $user->id,
            'imap_host' => 'imap.example.com',
            'imap_email' => 'import@example.com',
            'imap_password' => 'secret',
        ]);

        $importedEmail = ImportedConcessionaireEmail::create([
            'client_profile_id' => $bill->client_profile_id,
            'client_email_import_setting_id' => $setting->id,
            'concessionaire_bill_id' => $bill->id,
            'attachment_name' => 'fatura.pdf',
            'attachment_hash' => hash('sha256', 'fatura'),
            'status' => 'success',
        ]);

        $alert = OperationalAlert::create([
            'alertable_type' => ConcessionaireBill::class,
            'alertable_id' => $bill->id,
            'module' => 'fatura',
            'type' => 'bill_review',
            'severity' => 'warning',
            'status' => 'open',
            'title' => 'Fatura pendente de revisão',
            'message' => 'Fatura aguardando revisão.',
        ]);

        $this->service->handle($bill);

        expect(ConcessionaireBill::find($bill->id))->toBeNull()
            ->and(ImportedConcessionaireEmail::find($importedEmail->id))->toBeNull()
            ->and(OperationalAlert::find($alert->id))->toBeNull();
    });

    it('allows the same attachment to be imported again after the bill is deleted', function () {
        $bill = ConcessionaireBill::factory()->create();

        $user = User::factory()->admin()->create();

        $setting = ClientEmailImportSetting::create([
            'client_profile_id' => $bill->client_profile_id,
            'user_id' => $user->id,
            'imap_host' => 'imap.example.com',
            'imap_email' => 'import@example.com',
            'imap_password' => 'secret',
        ]);

        $attachmentHash = hash('sha256', 'fatura');

        ImportedConcessionaireEmail::create([
            'client_profile_id' => $bill->client_profile_id,
            'client_email_import_setting_id' => $setting->id,
            'concessionaire_bill_id' => $bill->id,
            'attachment_name' => 'fatura.pdf',
            'attachment_hash' => $attachmentHash,
            'status' => 'success',
        ]);

        $this->service->handle($bill);

        $alreadyImported = ImportedConcessionaireEmail::query()
            ->where('client_profile_id', $bill->client_profile_id)
            ->where('attachment_hash', $attachmentHash)
            ->exists();

        expect($alreadyImported)->toBeFalse();
    });
});

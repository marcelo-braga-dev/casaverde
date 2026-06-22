<?php

use App\Models\WhatsApp\WhatsAppMessageTemplate;
use App\Services\WhatsApp\WhatsAppLinkService;

describe('WhatsAppLinkService', function () {

    beforeEach(function () {
        $this->service = app(WhatsAppLinkService::class);
    });

    describe('render', function () {
        it('replaces placeholders with the given values', function () {
            $result = $this->service->render('Olá {{cliente_nome}}, sua fatura de {{mes_referencia}} venceu.', [
                'cliente_nome' => 'João',
                'mes_referencia' => '06/2026',
            ]);

            expect($result)->toBe('Olá João, sua fatura de 06/2026 venceu.');
        });

        it('replaces a missing variable with an empty string instead of breaking the message', function () {
            $result = $this->service->render('Olá {{cliente_nome}}, tudo bem?', []);

            expect($result)->toBe('Olá {{cliente_nome}}, tudo bem?');
        });

        it('replaces a null value with an empty string', function () {
            $result = $this->service->render('Valor: {{valor}}', ['valor' => null]);

            expect($result)->toBe('Valor: ');
        });
    });

    describe('formatPhone', function () {
        it('prefixes an 11-digit phone with the country code 55', function () {
            expect($this->service->formatPhone('41999990000'))->toBe('5541999990000');
        });

        it('keeps a phone that already has the country code 55', function () {
            expect($this->service->formatPhone('5541999990000'))->toBe('5541999990000');
        });

        it('strips non-digit characters before formatting', function () {
            expect($this->service->formatPhone('(41) 9 9999-0000'))->toBe('5541999990000');
        });

        it('returns null for an empty or null phone', function () {
            expect($this->service->formatPhone(null))->toBeNull()
                ->and($this->service->formatPhone(''))->toBeNull();
        });
    });

    describe('buildLink', function () {
        it('builds a wa.me link when a phone is given', function () {
            $link = $this->service->buildLink('41999990000', 'Olá!');

            expect($link)->toBe('https://wa.me/5541999990000?text=Ol%C3%A1%21');
        });

        it('builds the generic share link when there is no phone', function () {
            $link = $this->service->buildLink(null, 'Olá!');

            expect($link)->toBe('https://api.whatsapp.com/send?text=Ol%C3%A1%21');
        });
    });

    describe('linkForTemplate', function () {
        it('returns null when the template key does not exist', function () {
            expect($this->service->linkForTemplate('does_not_exist'))->toBeNull();
        });

        it('returns null when the template is inactive', function () {
            WhatsAppMessageTemplate::create([
                'key' => 'inactive_template',
                'name' => 'Inativo',
                'category' => 'cobranca',
                'message' => 'Olá {{cliente_nome}}',
                'is_active' => false,
            ]);

            expect($this->service->linkForTemplate('inactive_template'))->toBeNull();
        });

        it('renders the template and returns the message with a wa.me link', function () {
            WhatsAppMessageTemplate::create([
                'key' => 'lembrete_vencimento',
                'name' => 'Lembrete',
                'category' => 'cobranca',
                'message' => 'Olá {{cliente_nome}}, sua fatura de {{mes_referencia}} vence em {{data_vencimento}}.',
                'is_active' => true,
            ]);

            $result = $this->service->linkForTemplate('lembrete_vencimento', [
                'cliente_nome' => 'João',
                'mes_referencia' => '06/2026',
                'data_vencimento' => '25/06/2026',
            ], '41999990000');

            expect($result['message'])->toBe('Olá João, sua fatura de 06/2026 vence em 25/06/2026.')
                ->and($result['link'])->toStartWith('https://wa.me/5541999990000?text=');
        });

        it('returns a generic share link when no phone is provided', function () {
            WhatsAppMessageTemplate::create([
                'key' => 'fatura_vencida',
                'name' => 'Vencida',
                'category' => 'cobranca',
                'message' => 'Sua fatura está vencida.',
                'is_active' => true,
            ]);

            $result = $this->service->linkForTemplate('fatura_vencida');

            expect($result['link'])->toStartWith('https://api.whatsapp.com/send?text=');
        });
    });

});

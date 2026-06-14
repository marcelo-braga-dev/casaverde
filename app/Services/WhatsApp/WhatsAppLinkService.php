<?php

namespace App\Services\WhatsApp;

use App\Models\WhatsApp\WhatsAppMessageTemplate;

class WhatsAppLinkService
{
    /**
     * Substitui os placeholders {{variavel}} do template pelos valores informados.
     */
    public function render(string $message, array $variables): string
    {
        foreach ($variables as $key => $value) {
            $message = preg_replace(
                '/\{\{\s*'.preg_quote((string) $key, '/').'\s*\}\}/',
                (string) ($value ?? ''),
                $message,
            );
        }

        return $message;
    }

    /**
     * Normaliza um telefone para o formato aceito pelo wa.me (DDI 55 + DDD + número, somente dígitos).
     */
    public function formatPhone(?string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone);

        if ($digits === '') {
            return null;
        }

        if (strlen($digits) <= 11) {
            $digits = '55'.$digits;
        }

        return $digits;
    }

    /**
     * Monta o link do WhatsApp. Sem telefone, usa o link de compartilhamento
     * genérico (api.whatsapp.com/send) que deixa o usuário escolher o contato.
     */
    public function buildLink(?string $phone, string $message): string
    {
        $formattedPhone = $this->formatPhone($phone);

        if ($formattedPhone) {
            return "https://wa.me/{$formattedPhone}?text=".rawurlencode($message);
        }

        return 'https://api.whatsapp.com/send?text='.rawurlencode($message);
    }

    /**
     * Busca um template ativo pela key, renderiza com as variáveis informadas
     * e já retorna o link pronto (com ou sem telefone).
     *
     * @return array{message: string, link: string}|null
     */
    public function linkForTemplate(string $key, array $variables = [], ?string $phone = null): ?array
    {
        $template = WhatsAppMessageTemplate::query()
            ->where('key', $key)
            ->where('is_active', true)
            ->first();

        if (! $template) {
            return null;
        }

        $message = $this->render($template->message, $variables);

        return [
            'message' => $message,
            'link' => $this->buildLink($phone, $message),
        ];
    }
}

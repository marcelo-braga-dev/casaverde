<?php

namespace App\Services\Integracao\Cpanel;

use App\Services\Config\SystemSettingService;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class CpanelEmailService
{
    public function __construct(
        private readonly SystemSettingService $settings,
    ) {}

    /**
     * Cria uma conta de email no cPanel via UAPI (Email::add_pop).
     */
    public function createEmailAccount(string $domain, string $localPart, string $password, int $quotaMb = 0): array
    {
        $response = $this->client()->get('/execute/Email/add_pop', [
            'domain' => $domain,
            'email' => $localPart,
            'password' => $password,
            'quota' => $quotaMb,
        ]);

        return $this->parseResult($response);
    }

    /**
     * @return array{data: mixed, status: int, errors: array, messages: array}
     */
    private function parseResult(Response $response): array
    {
        // UAPI pode responder com o payload dentro de "result" ou no nível raiz.
        $result = $response->json('result') ?? $response->json() ?? [];

        if (! $response->successful() || (int) ($result['status'] ?? 0) !== 1) {
            $message = $result['errors'][0]
                ?? $result['messages'][0]
                ?? $response->json('error')
                ?? null;

            if (! $message) {
                $body = trim($response->body());

                $message = sprintf(
                    'Resposta inesperada do cPanel (HTTP %d)%s',
                    $response->status(),
                    $body !== '' ? ': '.Str::limit($body, 300) : '.'
                );
            }

            throw new RuntimeException($message);
        }

        return $result;
    }

    private function client(): PendingRequest
    {
        $host = $this->settings->get('cpanel_host');
        $port = $this->settings->get('cpanel_port', 2083);
        $user = $this->settings->get('cpanel_username');
        $token = $this->settings->get('cpanel_api_token');

        if (! $host || ! $user || ! $token) {
            throw new RuntimeException('Configuração do cPanel incompleta. Informe host, usuário e token na página de Integração.');
        }

        // Remove esquema e barras digitados por engano no campo de host (ex: "https://192.185.131.99")
        $host = rtrim(preg_replace('#^https?://#i', '', $host), '/');

        return Http::baseUrl("https://{$host}:{$port}")
            ->withHeaders([
                'Authorization' => "cpanel {$user}:{$token}",
            ])
            ->acceptJson()
            ->timeout(30);
    }
}

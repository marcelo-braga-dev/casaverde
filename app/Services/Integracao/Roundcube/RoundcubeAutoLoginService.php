<?php

namespace App\Services\Integracao\Roundcube;

use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class RoundcubeAutoLoginService
{
    /**
     * Realiza o login no Roundcube via HTTP (GET para obter token CSRF +
     * cookie de sessão, depois POST com as credenciais) e retorna a URL
     * autenticada do webmail junto com os cookies de sessão a serem
     * repassados para o navegador do usuário.
     *
     * @return array{redirectUrl: string, cookies: array<int, array{name: string, value: string}>}
     */
    public function login(string $webmailUrl, string $email, string $password): array
    {
        $base = $this->normalizeBaseUrl($webmailUrl);
        $jar = new CookieJar;

        $loginPage = Http::withOptions(['cookies' => $jar])
            ->timeout(15)
            ->get("{$base}/?_task=login");

        $token = $this->extractCsrfToken($loginPage->body());

        if (! $token) {
            throw new RuntimeException('Não foi possível conectar ao Roundcube (token CSRF não encontrado).');
        }

        $response = Http::asForm()
            ->withOptions(['cookies' => $jar, 'allow_redirects' => false])
            ->timeout(15)
            ->post("{$base}/?_task=login", [
                '_token' => $token,
                '_user' => $email,
                '_pass' => $password,
                '_action' => 'login',
                '_timezone' => 'America/Sao_Paulo',
                '_url' => '',
            ]);

        if (! $response->redirect()) {
            throw new RuntimeException('Usuário ou senha inválidos no Roundcube.');
        }

        $cookies = array_map(
            static fn (array $cookie) => ['name' => $cookie['Name'], 'value' => $cookie['Value']],
            $jar->toArray()
        );

        return [
            'redirectUrl' => "{$base}/?_task=mail",
            'cookies' => $cookies,
        ];
    }

    private function normalizeBaseUrl(string $url): string
    {
        if (! preg_match('#^https?://#i', $url)) {
            $url = 'https://'.$url;
        }

        return rtrim($url, '/');
    }

    private function extractCsrfToken(string $html): ?string
    {
        if (preg_match('/name=["\']_token["\']\s+value=["\']([^"\']+)["\']/i', $html, $matches)) {
            return $matches[1];
        }

        if (preg_match('/value=["\']([^"\']+)["\']\s+name=["\']_token["\']/i', $html, $matches)) {
            return $matches[1];
        }

        return null;
    }
}

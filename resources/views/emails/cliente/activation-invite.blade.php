<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Ativação de acesso</title>
</head>
<body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
    <h2>Ative seu acesso à plataforma Casa Verde</h2>

    <p>Olá, {{ $invite->clientProfile->display_name }}.</p>

    <p>
        Seu acesso à plataforma Casa Verde foi liberado.
        Para criar sua conta, clique no botão abaixo:
    </p>

    <p style="margin: 24px 0;">
        <a href="{{ $activationUrl }}"
           style="background: #2c7a4b; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 6px; display: inline-block;">
            Criar minha conta
        </a>
    </p>

    <p>
        Este link expira em:
        <strong>{{ $invite->expires_at->format('d/m/Y H:i') }}</strong>
    </p>

    <p>
        Se você não reconhece este convite, apenas ignore este email.
    </p>
</body>
</html>
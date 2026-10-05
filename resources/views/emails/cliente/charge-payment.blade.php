<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cobrança {{ app(\App\Services\Config\SystemSettingService::class)->brandName() }}</title>
</head>
<body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
@php $brandName = app(\App\Services\Config\SystemSettingService::class)->brandName(); @endphp
    <h2>
        @if ($kind === 'reminder')
            Sua cobrança vence em breve
        @else
            Sua cobrança está disponível
        @endif
    </h2>

    <p>Olá{{ $clientName ? ', '.$clientName : '' }}.</p>

    <p>
        @if ($kind === 'reminder')
            Este é um lembrete de que a cobrança de <strong>{{ $charge?->reference_label }}</strong> vence em breve.
        @else
            A cobrança de <strong>{{ $charge?->reference_label }}</strong> já está disponível para pagamento.
        @endif
    </p>

    <table style="border-collapse: collapse; margin: 16px 0;">
        <tr>
            <td style="padding: 4px 16px 4px 0; color: #555;">Valor</td>
            <td style="padding: 4px 0;"><strong>R$ {{ number_format((float) $slip->amount, 2, ',', '.') }}</strong></td>
        </tr>
        @if ($dueDate)
            <tr>
                <td style="padding: 4px 16px 4px 0; color: #555;">Vencimento</td>
                <td style="padding: 4px 0;"><strong>{{ $dueDate }}</strong></td>
            </tr>
        @endif
    </table>

    @if ($slip->pix_copy_paste)
        <p style="margin-bottom: 4px;"><strong>Pix copia e cola</strong></p>
        <p style="font-family: monospace; font-size: 12px; word-break: break-all; background: #f4f4f4; padding: 10px; border-radius: 6px; margin-top: 0;">{{ $slip->pix_copy_paste }}</p>
    @endif

    @if ($slip->digitable_line)
        <p style="margin-bottom: 4px;"><strong>Linha digitável do boleto</strong></p>
        <p style="font-family: monospace; font-size: 13px; word-break: break-all; background: #f4f4f4; padding: 10px; border-radius: 6px; margin-top: 0;">{{ $slip->digitable_line }}</p>
    @endif

    @if ($portalUrl)
        <p style="margin: 24px 0;">
            <a href="{{ $portalUrl }}"
               style="background: #2c7a4b; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 6px; display: inline-block;">
                Ver cobrança e baixar o boleto
            </a>
        </p>
    @endif

    <p style="color: #666; font-size: 13px;">
        Se o pagamento já foi feito, desconsidere este e-mail. Em caso de dúvida, fale com seu consultor {{ $brandName }}.
    </p>
</body>
</html>

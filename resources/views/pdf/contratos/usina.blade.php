<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrato de Locação de Usina Solar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        h4, h6 {
            text-align: center;
            margin-bottom: 20px;
        }

        .text-center {
            text-align: center;
        }

        .section {
            margin: 20px 0;
        }

        .indent {
            margin-left: 20px;
        }

        .divider {
            border-bottom: 1px solid #000;
            margin: 20px 0;
        }

        .signature {
            display: flex;
            justify-content: space-between;
            margin-top: 100px;
        }

        .signature div {
            text-align: center;
            border-top: 1px solid #000;
            width: 40%;
        }

        .signature div:nth-child(2) {
            margin-left: 20%;
        }
    </style>
</head>
<body>
<div class="container">
    <div style="text-align: center">
        @php $pdfBrand = app(\App\Services\Proposta\ProposalPdfBrand::class)->toArray(); @endphp
        @if($pdfBrand['logo'])
            <img src="{{ $pdfBrand['logo'] }}" alt="{{ $pdfBrand['name'] }}" class="logo" style="width: 300px">
        @endif
    </div>

    <h3>Contrato de Locação de Usina Solar e Gestão de Créditos de Energia</h3>

    <div class="section">
        <p>
            <b>CONTRATANTE:</b> [Nome do Cliente], pessoa física ou jurídica, inscrita no CPF/CNPJ sob o nº [número], residente ou com sede em [endereço completo].
        </p>
        <p>
            <b>CONTRATADA:</b> Cooperativa de Energia Solar, com sede em [endereço completo], inscrita no CNPJ sob o nº [número], doravante denominada "COOPERATIVA".
        </p>
    </div>

    <div class="divider"></div>

    <h6>Cláusula 1 - Do Objeto do Contrato</h6>
    <p>1.1. O presente contrato tem por objeto a locação de usina solar fotovoltaica de propriedade da COOPERATIVA, destinada à geração de energia elétrica, e a gestão
        dos créditos de energia elétrica excedentes.</p>
    <p>1.2. A COOPERATIVA compromete-se a administrar, monitorar e manter a usina solar em perfeito estado de funcionamento durante a vigência deste contrato.</p>

    <div class="divider"></div>

    <h6>Cláusula 2 - Das Obrigações da Cooperativa</h6>
    <p>2.1. A COOPERATIVA obriga-se a:</p>
    <div class="indent">
        <p>a) Fornecer ao CONTRATANTE a energia elétrica gerada pela usina solar, de acordo com os padrões e normas técnicas aplicáveis.</p>
        <p>b) Monitorar e manter o sistema fotovoltaico em pleno funcionamento, realizando a manutenção preventiva e corretiva necessária.</p>
        <p>c) Disponibilizar relatórios periódicos de geração de energia e economia obtida, com frequência mínima mensal.</p>
        <p>d) Administrar os créditos de energia excedentes, sendo responsável por alugar tais créditos para terceiros, quando aplicável.</p>
    </div>
    <p>2.2. A COOPERATIVA se responsabiliza pela operação, manutenção e controle do desempenho da usina solar, assumindo os custos relacionados à gestão e operação da
        mesma.</p>

    <div class="divider"></div>

    <h6>Cláusula 3 - Das Obrigações do Contratante</h6>
    <p>3.1. O CONTRATANTE compromete-se a:</p>
    <div class="indent">
        <p>a) Utilizar a energia fornecida pela usina solar de forma consciente e de acordo com as instruções da COOPERATIVA.</p>
        <p>b) Facilitar o acesso à usina solar para a realização de manutenções e inspeções periódicas, quando necessário.</p>
        <p>c) Pagar as mensalidades referentes à locação da usina e à gestão dos créditos de energia, conforme estabelecido na Cláusula 4 deste contrato.</p>
    </div>
    <p>3.2. O CONTRATANTE deverá informar imediatamente à COOPERATIVA sobre qualquer falha ou irregularidade no funcionamento da usina.</p>

    <div class="divider"></div>

    <h6>Cláusula 4 - Do Preço e Condições de Pagamento</h6>
    <p>4.1. O valor mensal pela locação da usina solar será de R$ [valor], a ser pago pelo CONTRATANTE até o dia [dia] de cada mês.</p>
    <p>4.2. Em caso de atraso no pagamento, será aplicada uma multa de [X]% sobre o valor da mensalidade em atraso, além de juros de mora de [Y]% ao mês.</p>
    <p>4.3. A COOPERATIVA poderá reajustar o valor das mensalidades anualmente, com base na variação do índice [índice de referência].</p>

    <div class="divider"></div>

    <h6>Cláusula 5 - Da Duração do Contrato</h6>
    <p>5.1. O presente contrato terá duração de [número] meses, contados a partir da data de sua assinatura.</p>
    <p>5.2. O contrato poderá ser renovado por iguais períodos, mediante acordo entre as partes, formalizado por meio de aditivo contratual.</p>

    <div class="divider"></div>

    <h6>Cláusula 6 - Da Rescisão do Contrato</h6>
    <p>6.1. O presente contrato poderá ser rescindido nas seguintes hipóteses:</p>
    <div class="indent">
        <p>a) Pelo inadimplemento de qualquer das partes, mediante notificação prévia de [número] dias.</p>
        <p>b) Por interesse unilateral de qualquer das partes, mediante notificação por escrito com antecedência mínima de [número] dias.</p>
        <p>c) Pela impossibilidade técnica de continuidade do fornecimento de energia, devidamente justificada pela COOPERATIVA.</p>
    </div>

    <div class="divider"></div>

    <h6>Cláusula 7 - Das Penalidades e Multas</h6>
    <p>7.1. Em caso de rescisão antecipada do contrato, por iniciativa do CONTRATANTE, será aplicada uma multa equivalente a [X]% do valor total das mensalidades
        restantes.</p>
    <p>7.2. Caso a rescisão seja motivada por descumprimento de qualquer obrigação contratual pela COOPERATIVA, o CONTRATANTE estará isento de qualquer multa ou
        penalidade.</p>

    <div class="divider"></div>

    <h6>Cláusula 8 - Da Gestão dos Créditos de Energia</h6>
    <p>8.1. Os créditos de energia elétrica excedentes gerados pela usina solar serão administrados pela COOPERATIVA, que poderá alugá-los para terceiros, revertendo os
        benefícios ao CONTRATANTE, na forma de descontos ou repasses financeiros.</p>
    <p>8.2. A COOPERATIVA se compromete a utilizar práticas de mercado para maximizar os ganhos com a locação dos créditos de energia excedentes.</p>

    <div class="divider"></div>

    <h6>Cláusula 9 - Das Disposições Gerais</h6>
    <p>9.1. Este contrato obriga as partes, seus herdeiros e sucessores a qualquer título.</p>
    <p>9.2. Qualquer alteração ou aditivo a este contrato deverá ser feito por escrito e assinado por ambas as partes.</p>
    <p>9.3. O presente contrato será regido pelas leis brasileiras, especialmente pela legislação aplicável ao setor de energia.</p>

    <div class="divider"></div>

    <h6>Cláusula 10 - Do Foro</h6>
    <p>10.1. As partes elegem o foro da comarca de [cidade], Estado [estado], para dirimir quaisquer controvérsias oriundas do presente contrato, com renúncia expressa a
        qualquer outro, por mais privilegiado que seja.</p>

    <div class="divider"></div>

    <p>E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma, na presença de duas testemunhas.</p>

    <p class="text-center" style="margin-top: 40px;">Maringá/PR, {{ \Carbon\Carbon::now()->format('d \d\e F \d\e Y') }}</p>

    <div class="signature">
        <div>
            <p>(Produtor Solar)</p>
        </div>
        <div>
            <p>SOLMAR COOPERATIVA</p>
        </div>
    </div>
</div>
</body>
</html>

import {Button, Container, Paper, Typography} from '@mui/material';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import {IconDownload, IconFileCheck} from "@tabler/icons-react";
import {useRef, useState} from "react";
import {usePage} from "@inertiajs/react";

const ContratoUsina = () => {
    const {demo, brand} = usePage().props;
    // Na demonstração, a contratante é a marca configurada com dados fictícios (nunca a razão social real).
    const locatario = demo?.enabled
        ? {nome: `Consórcio de geração distribuída ${brand?.name ?? ''} (fictício)`, cnpj: '00.000.000/0001-00', sede: 'Rua Fictícia, 100 - sala 01, Centro, no Município de Demonstração, estado Paraná'}
        : {nome: 'Consórcio de geração distribuída Casa Verde', cnpj: '59.960.782-001-53', sede: 'Av. Mandacaru, 4943 - sala 03, Jardim Munique, no Município de Maringá, estado Paraná'};
    const [contratado, setContratado] = useState({})

    const proposalRef = useRef(null);

    const handleDownload = async () => {
        try {
            const response = await axios.get(route('auth.contratos.pdf.usina.gerar-pdf'), {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${contratado?.razao_social}_contrato_usina.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
        }
    };

    return (
        <Box>
            <Paper variant="outlined" sx={{padding: 2, marginBottom: 4}}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid size={1} paddingInlineEnd={2}>
                        <IconFileCheck color="green" size={30}/>
                    </Grid>
                    <Grid size={11} container justifyContent="space-between" gap={2}>
                        <Grid/>
                        <Grid size="auto">
                            <Button color="error" onClick={handleDownload} startIcon={<IconDownload/>}>Baixar PDF</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <div ref={proposalRef}>
                <Container style={{marginTop: '20px', marginBottom: '20px'}}>
                    <Typography variant="h4" align="center" marginBottom={2}>
                        INSTRUMENTO PARTICULAR DE CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS DE GERAÇÃO DE ENERGIA E OUTRAS AVENÇAS
                    </Typography>
                    <Typography marginBottom={2}>
                        De um lado:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>{contratado?.razao_social?.toUpperCase()}</b>, inscrita no CNPJ sob o no {contratado?.cnpj}, com sede
                        à {contratado?.endereco?.endereco_completo}, representada neste ato pelo administrador [nome completo], brasileiro,
                        [qualificação] residente e domiciliado à [endereço completo], neste ato representada por seu representante legal conforme seu Contrato
                        Social <b>(“LOCADOR”)</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        E, de outro lado:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>{locatario.nome}</b>, regularmente inscrita no CNPJ/ME sob o n° {locatario.cnpj}, com sede na {locatario.sede}, neste ato representado nos termos do seu ato constitutivo <b>(“LOCATÁRIO”)</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>LOCADOR</b> e <b>LOCATÁRIO</b> doravante referidos isoladamente como “Parte” e, em conjunto, como “Partes”;
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>CONSIDERANDO QUE:</b>
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (i) O <b>LOCADOR</b> é o titular e legítimo proprietário de uma Unidade de Geração de Energia Fotovoltaica (“UFV”), devidamente equipada com todos
                        bens e
                        ativos, capazes, em conjunto e instalados, de gerar energia elétrica, neste instrumento denominado de Sistema de Geração de Energia (“SGE”), com
                        potência
                        instalada de [•] kW, com capacidade de instalação total de [•] kWp e uma estimativa mensal de geração de energia de [•] kWh/mês, identificado pelo
                        número
                        de instalação [•], instalado e situado na [área rural/urbana] do Município de [•], Estado de [•], conforme descrição constante do Anexo I;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (ii) O <b>LOCATÁRIO</b> possui interesse em participar do Sistema de Compensação de Energia Elétrica (“SCEE”) e para tanto realiza por este
                        Contrato a
                        locação do SGE, conectado junto a rede de distribuição da concessionaria de energia local e enquadrado como geração compartilhada, classificada
                        como (GD-I
                        ou GD-II ou GD-III), nos termos da Lei nº. 14.300 de 06 de janeiro de 2022;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iii) O <b>LOCATÁRIO</b> seus sublocatários ou cessionários, com seus afiliados e consequentemente seus consumidores aderentes ao consórcio, serão
                        os
                        únicos
                        beneficiados dos créditos gerados pelo excedente de energia elétrica que será́ injetada na rede de distribuição, para os fins inerentes do projeto
                        de
                        Geração Distribuída;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iv) As Partes estão firmando, nesta mesma data, o Contrato Particular de Locação de Imóvel <b>(“Contrato de Locação de Imóvel”)</b>.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (v) As Partes têm plena capacidade de compreender todas as disposições constantes deste Contrato de Locação e de assumir todas as
                        responsabilidades dele
                        decorrentes em igual grau de condições;
                    </Typography>
                    <Typography marginBottom={2}>
                        RESOLVEM, de comum acordo, celebrar o presente Contrato de Locação de Equipamentos de Energia e Outras Avenças (“Contrato Locação de SGE”), que
                        será
                        regido pela Lei nº 10.406 de 10 de janeiro de 2002 ("Código Civil"), e de acordo com as seguintes cláusulas, termos e condições:
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1. DO OBJETO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1.1.</b> Constituem objeto deste Contrato a Locação do SGE de propriedade do <b>LOCADOR</b>, descrito nos Considerandos “I” e “II”,
                        compreendendo a
                        infraestrutura, os equipamentos e os ativos necessários à geração de energia elétrica pela UFV, descritos no Anexo I deste Contrato, por todo o
                        prazo de
                        vigência deste
                        instrumento.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>1.1.1.</b> O SGE está instalado em uma fração do imóvel com área de [•] hectares/m², parte integrante de um todo com área total de [•]
                        hectares/m²,
                        conforme descrito na matrícula nº [•], registrada no Cartório de Registro de Imóveis da Comarca de Município/Estado.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>1.1.2.</b> O <b>LOCATÁRIO</b> utilizará o SGE para possibilitar que as unidades consumidoras dos seus integrantes aproveitem a totalidade dos
                        excedentes de energia gerados no SCEE, através da modalidade de geração compartilhada, conforme os termos estabelecidos na Lei 14.300/22.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>1.1.3.</b> As Partes firmam, nesta mesma data, o Contrato Particular de Locação de Imóvel (“Contrato de Locação de Imóvel”), sendo de única e
                        exclusiva
                        responsabilidade do <b>LOCADOR</b> arcar com os eventuais custos de aluguel, tributos, manutenção e limpeza, segurança, manutenção da posse entre
                        outras
                        obrigações vinculadas ao imóvel.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1.2.</b> O SGE deverá observar e atender as seguintes definições de produção de energia, a qual serão integral e exclusivamente destinadas para
                        atender
                        o presente Contrato:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>1.2.1.</b> A média de produção anual de energia projetada para o SGE é de 168.000 (cento e sessenta e oito mil) kWh/Ano, utilizando-se o
                        software
                        PVSyst (“Geração Média de Energia Anual”);
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>1.2.2.</b> A média de produção mensal de energia projetada para o SGE é de 14.000 (quatorze mil) kWh/mês, que foi estabelecida levando em
                        consideração
                        1/12 (um doze avos) da Geração Média de Energia Anual (“Performance Alvo”); e
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>1.2.3.</b> As Partes declaram que poderá haver alteração na produção esperada, para mais ou para menos, oportunidade em que deverão ser
                        aplicadas as
                        regras constantes deste Contrato, destacando que a apuração tanto das médias estipuladas quanto das variações será aferida nas faturas de energia
                        do
                        Consórcio
                        emitidas pela Distribuidora de Energia local.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1.3.</b> Através do presente Contrato, o <b>LOCATÁRIO</b> terá acesso a totalidade da energia gerada pelo SGE, para que possa promover a adesão
                        de suas
                        unidades
                        consumidoras ao sistema de compensação de energia elétrica, nos termos da legislação atual ou outra que vier a substitui-la.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1.4.</b> O <b>LOCADOR</b> se responsabiliza em promover a operação e manutenção preventiva e corretiva dos equipamentos, bem como todas e
                        quaisquer
                        obras civis, benfeitorias e ajustes necessários no SGE disponibilizando-o ao <b>LOCATÁRIO</b> em condições de pronta operação para atender as
                        unidades
                        consumidoras de
                        titularidade e/ou vinculadas ao <b>LOCATÁRIO</b>. Além disso, o <b>LOCADOR</b> será responsável por garantir a disponibilidade do imóvel onde se
                        encontra
                        instalado o
                        SGE, razão pela qual permanece na posse dos bens.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1.5.</b> O <b>LOCADOR</b> declara que tanto o Imóvel no qual encontra-se instalado o SGE, bem como todos os equipamentos objeto deste contrato,
                        encontram-se
                        livres e
                        desembaraçados de quaisquer ônus, débitos, obrigações contratuais, encargos e gravames de qualquer natureza, que impeçam a celebração do presente
                        instrumento de locação, sendo o único responsável por quaisquer obrigações que eventualmente tenham assumido com terceiros.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1.6.</b> Fica estabelecido no objeto deste contrato que o <b>LOCATÁRIO</b>, seus sublocatários ou cessionários, com seus afiliados e
                        consequentemente
                        seus
                        consumidores aderentes serão os únicos beneficiados dos créditos de energia gerados pelo excedente de energia elétrica que será́ injetada na rede
                        de
                        distribuição, para os fins inerentes do projeto de Geração Distribuída, e serão responsáveis pelo rateio das despesas para cumprimento das
                        obrigações
                        estabelecidas no presente contrato;
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>2. DOS DOCUMENTOS QUE INTEGRAM O CONTRATO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>2.1.</b> Integram o presente Contrato o documento descrito abaixo, devidamente rubricados pelas Partes.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (i)Anexo I – Descrição da Usina e Lista dos bens que compõem a Usina Fotovoltaica [inserir nome da UFV se houver um nome específico];
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>2.2.</b> As disposições deste Contrato prevalecem sobre as de seus Anexos.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>3. DO PRAZO DE LOCAÇÃO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>3.1.</b> O presente Contrato terá vigência na data de sua assinatura, e terá validade pelo prazo de 5 (cinco) anos (“Prazo de Locação”),
                        contados a
                        partir da data da troca da titularidade do SGE, objeto da locação, para consequente recebimentos dos excedentes de energia gerados (“Início de
                        Operação”).
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>3.2.</b> O presente contrato poderá ser renovado por prazo e condições a serem estabelecidas mediante termo de aditivo contratual a ser firmado
                        entre
                        as partes.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>3.3.</b> Ao término do Prazo da Locação o <b>LOCADOR</b> deverá promover a troca de titularidade do medidor de energia do SGE para seu nome ou
                        de
                        terceiros, não havendo que ser falar em restituição o SGE pelo <b>LOCATÁRIO</b> ao <b>LOCADOR</b>, uma vez que todos os bens permanecerão a todo
                        momento em posse
                        do <b>LOCADOR</b> para
                        efetuar as manutenções preventivas e corretivas, bem como a sua plena operação.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>3.4.</b> Acordam as partes que o presente contrato surtirá efeitos mesmo se o imóvel e/ou os demais bens e equipamentos que compõem o SGE for
                        alienado
                        a outrem, de modo que deverá respeitar o prazo de vigência fixado pela cláusula 3.1, ou o que for aditado na forma da cláusula 3.2.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>4. DA REMUNERAÇÃO TOTAL DA LOCAÇÃO (PARCELA FIXA E PARCELA PERFORMANCE) E FORMA DE PAGAMENTO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>4.1.</b> Pela locação do SGE objeto do presente instrumento, o <b>LOCATÁRIO</b> pagará ao <b>LOCADOR</b>, mensalmente, um aluguel, composto de
                        um preço
                        principal fixo e uma parcela variável baseada na performance e operação do Equipamento (“Remuneração Total da Locação”), calculada conforme
                        definições e a
                        fórmula a seguir apresentada:
                    </Typography>
                    <Typography marginBottom={2}>
                        Remuneração Total da Locação = Parcela Fixa + Bônus por Performance (se houver) – [Malus Performance (se houver) + Custos Distribuidora + Parcela
                        Locação do Imóvel + taxa de administração do consórcio (se houver)]
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>4.1.1.</b> Abaixo seguem as definições a serem consideradas na aplicação da fórmula acima apresentada:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <Typography marginBottom={2} marginInlineStart={4}>
                            (a) Remuneração Total da Locação: corresponde ao valor total a ser pago pelo <b>LOCATÁRIO</b> ao <b>LOCADOR</b>, relativo ao presente
                            Instrumento e
                            considerando o Contrato de Locação do Imóvel, a cada Ciclo de Faturamento. Entende-se por “Ciclo de Faturamento” o período de faturamento
                            adotado pela
                            Distribuidora de Energia. A Remuneração Total é o valor que o <b>LOCATÁRIO</b> deverá pagar ao <b>LOCADOR</b>, pela locação do SGE, com os
                            respectivos
                            abatimentos ajustados neste contrato.
                        </Typography>
                        <Typography marginBottom={2} marginInlineStart={4}>
                            (b) Parcela Fixa: Valor fixo mensal de [R$6.020,00] ([seis mil e vinte reais]).<br/>
                            O Valor Fixo mensal é calculado levando em consideração a média de geração mensal de energia prevista na cláusula 1.2.2 para o SGE de 14.000
                            (quatorze mil) kWh/mês que corresponde a Performance Alvo.
                        </Typography>
                        <Typography marginBottom={2} marginInlineStart={4}>
                            (c) Custos Distribuidora: corresponde aos valores pagos pela Contratante à Distribuidora de Energia a cada Ciclo de Faturamento relativos aos
                            contratos
                            firmados junto à Distribuidora de Energia referentes à Unidade Consumidora com Geração Distribuída onde se encontra instalado o SGE, conforme
                            exigências regulatórias para o enquadramento no SCEE. Entre os custos denominados “Custos Distribuidora” enquadram-se, mas não se limitam, o
                            valor
                            relativo à Demanda Contratada e custos de disponibilidade do fornecimento de energia, Contribuição de Iluminação Pública, Bandeiras
                            Tarifárias,
                            tributos que compõem a tarifa e demais valores faturados pela CONCESSIONÁRIA relativos ao SGE e demais componentes não passíveis de
                            compensação da
                            tarifa de energia.
                        </Typography>
                        <Typography marginBottom={2} marginInlineStart={4}>
                            (d) Parcela Locação Imóvel: corresponde aos valores pagos pelo <b>LOCATÁRIO</b> ao <b>LOCADOR</b>, relativo ao Contrato de Locação do Imóvel
                            onde se
                            encontra instalado o SGE, firmado em [•]/ [•]/[202•] e cujo valor estipulado corresponde à quantia de R$ [•] ([•]);
                        </Typography>
                        <Typography marginBottom={2} marginInlineStart={4}>
                            (e) Taxa de administração do consórcio: corresponde aos custos definidos entre o consórcio <b>LOCATÁRIO</b> e sua consorciada líder pelos
                            serviços
                            definidos e
                            desenvolvidos, relacionados à gestão financeira e de créditos, faturamento para consumidores, cobrança etc, aqui definidos atualmente em
                            [inserir
                            porcentagem] % (extenso por cento) das taxas de rateio recebidas pelo consórcio dos consumidores aderentes. O valor pode ser alterado conforme
                            os
                            ajustes realizados entre as Partes.
                        </Typography>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>4.2.</b> DAS REGRAS DE BÔNUS PERFOMANCE OU MALUS PERFORMANCE
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>4.2.1.</b> As Partes declaram que poderá haver alteração na produção de energia mensal esperada, para mais ou para menos, declarando reconhecer
                        e
                        ajustar que gerações menores ou maiores que a média mínima podem ocorrer ao longo da vigência contratual por força de diversos fatores
                        imprevisíveis que
                        influenciam a geração de energia fotovoltaica, devendo garantir o <b>LOCADOR</b> uma geração de no mínimo 90% (noventa por cento) das médias
                        previstas na
                        cláusula 1.2.2.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>4.2.2.</b> As Partes avaliarão mensalmente se a soma da Energia entregue pelo SGE no intervalo do último ciclo de faturamento da distribuidora
                        foi
                        superior ou inferior à Performance Alvo para o mesmo intervalo, oportunidade em que deverão ser aplicadas as regras constantes abaixo, seja para
                        aplicação
                        do Bônus por Performance ou de Malus Performance (desconto) a seguir, as quais deverão ser utilizadas na fórmula para apuração total da
                        remuneração.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (a) Bônus por Performance: O <b>LOCADOR</b> fará jus ao pagamento de Bônus por Performance, a ser pago pelo <b>LOCATÁRIO</b> caso, ao final do
                        período
                        estabelecido para apuração, a Energia injetada à rede de distribuição e efetivamente compensada nos consumidores aderentes ao consórcio seja
                        superior à
                        “Performance Alvo” para o mesmo período disponibilizada para compensação pelo SGE no Sistema de Compensação de Energia Elétrica - SCEE, aferida
                        nas
                        faturas das unidades consumidoras da Distribuidora de Energia (“Bônus por Performance”). O valor do Bônus por Performance será calculado da
                        seguinte
                        forma:
                    </Typography>
                    <Typography marginBottom={2}>
                        Bônus por Performance (R$) = Parcela Fixa (4.1.1, alínea “b”) x [Energia compensada no período de apuração – Performance Alvo]

                        dividido por

                        Performance Alvo
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>4.2.2.1.</b> O Bônus por Performance deverá ser pago junto com o pagamento do mês de fechamento do período de apuração.
                    </Typography>
                    <Typography marginBottom={2}>
                        b) Malus Performance (desconto) Caso a quantidade de geração de energia injetada à rede de distribuição e efetivamente compensada nos consumidores
                        aderentes apurada seja inferior à Performance Alvo estipulada para o respectivo período, o <b>LOCADOR</b> arcará com um desconto no valor
                        Remuneração
                        Total da Locação em favor do <b>LOCATÁRIO</b>, a título de Malus de Performance, no valor definido conforme fórmula que segue (“Desconto”):
                        Desconto (R$) = Parcela Fixa (4.1.1, alínea “b”) x [Performance Alvo – Energia compensada no período de apuração]
                    </Typography>
                    <Typography marginBottom={2}>
                        dividido por
                        _____________________________________________________________________________________________
                        Performance Alvo
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>4.2.2.2.</b> O Desconto será efetuado no pagamento do mês de fechamento do período de apuração.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>4.2.3.</b> Se em algum ciclo de faturamento, o valor da Remuneração Total da Locação for menor que zero, caberá à <b>LOCATÁRIO</b> descontar
                        do <b>LOCADOR</b> o valor negativo correspondente, no mesmo mês da ocorrência, se houver saldo a pagar, ou nos meses subsequentes.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>4.2.4.</b> Para averiguação da Energia Entregue pelo SGE, as Partes considerarão o medidor instalado nas unidades consumidoras consorciadas ou
                        cooperadas do <b>LOCATÁRIO</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>5. DAS REGRAS DE FATURAMENTO DO PAGAMENTO DA LOCAÇÃO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>5.1.</b> Ciclos de Faturamento da Distribuidora: A compensação de energia elétrica ativa injetada pelo SGE com a energia elétrica ativa
                        consumida pelos
                        consumidores participantes do SCEE, ocorrerá após um ciclo (mês) de faturamento da Distribuidora Local. A data da leitura do medidor do SGE será,
                        na
                        maioria dos casos, diferente da data da leitura da unidade recebedora dos créditos de energia, causando descasamento entre os valores das
                        contribuições mensais dos consorciados e os custos relativos à geração de energia e demais despesas do SCEE.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>5.2.</b> O <b>LOCADOR</b> está ciente de que o valor total da locação será pago por meio do recebimento dos valores das taxas de rateio pagas
                        pelos
                        consumidores
                        vinculados ao consórcio <b>LOCATÁRIO</b> a cada ciclo de faturamento da distribuidora.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>5.3.</b> Faturamento e Vencimento: Para fins de faturamento da Remuneração Total da Locação serão desconsiderados os 02 (dois) primeiros ciclos
                        de
                        faturamento da Distribuidora de Energia. Com isso, o vencimento do pagamento da 1º (primeira) Remuneração Total da Locação ocorrerá em até 05
                        (cinco)
                        dias corridos após 02 (dois) ciclos completos de faturamento da Distribuidora de Energia. A partir do 3º (terceiro) ciclo completo de faturamento
                        da
                        Distribuidora de Energia, a Remuneração Total da Locação será paga mensalmente em até 05 (cinco) dias corridos da emissão do documento de cobrança
                        pelo <b>LOCADOR</b>, o qual deverá ser emitido em até 5 (cinco) dias após o fechamento do ciclo de faturamento da Distribuidora de Energia,
                        referente ao
                        mês anterior à emissão do documento de cobrança.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>5.4.</b> A fatura mensal a ser emitida pelo <b>LOCADOR</b> levará em consideração os valores recebidos pelo rateio dos consumidores relativo ao
                        ciclo
                        anterior.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>5.5.</b> A fatura mensal também incluirá os valores recebidos relativos ao rateio de consumidores de ciclos anteriores inadimplidos, incluindo
                        juros,
                        multas e correção sobre os valores efetivamente recebidos dos consumidores.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>5.6.</b> Em caso de inadimplência dos consumidores, o <b>LOCATÁRIO</b> tomará as medidas necessárias para a cobrança dos valores devidos,
                        incluindo
                        juros, multas e correção monetária, os quais serão repassados ao <b>LOCADOR</b> conforme recebimento.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b> 5.7.</b> O pagamento da Remuneração Total da Locação será realizado por meio de boleto bancário emitido pelo <b>LOCADOR</b> ou deposito
                        bancário (PIX,
                        TED, DOC etc) na conta indicada pelo <b>LOCADOR</b>, ficando destacado que o pagamento poderá ser realizado pelo <b>LOCATÁRIO</b> ou por terceiro,
                        cessionário
                        ou não, a ordem do <b>LOCATÁRIO</b>. Os recibos de pagamento ou de transferência de valores servirão de comprovantes de quitação. O eventual
                        atraso no
                        envio
                        da cobrança/fatura pelo <b>LOCADOR</b> dará o direito ao <b>LOCATÁRIO</b> de postergar o pagamento por igual número de dias do atraso, sem que
                        incorra em
                        encargos de mora.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b> 5.8.</b> O <b>LOCADOR</b> se compromete a emitir as faturas mensais conforme as disposições desta cláusula, respeitando os prazos e valores
                        estabelecidos.
                    </Typography>
                    <Typography marginBottom={2}>
                        5.9.Estas cláusulas visam garantir a transparência e clareza no processo de faturamento e recebimento dos valores de locação das usinas solares,
                        assegurando que ambas as partes estejam cientes e de acordo com os procedimentos estabelecidos.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>6. DAS REGRAS GERAIS SOBRE PAGAMENTO DA LOCAÇÃO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        6.1.Quaisquer valores devidos por uma Parte à outra e em razão do presente Instrumento e do Contrato de Locação de Imóvel, poderão ser compensados
                        no
                        mês subsequente, mediante autorização prévia da parte credora, fazendo-se, quando for o caso, o respectivo encontro de contas.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>6.2.</b> O <b>LOCATÁRIO</b> abaterá do valor do aluguel do SGE o valor relativo à demanda bem como os demais valores relativos aos custos de
                        disponibilidade do fornecimento de energia, taxas do serviço de iluminação pública, CUSD e demais valores faturados pela CONCESSIONÁRIA relativos
                        ao SGE,
                        sendo obrigatória a apresentação desta cobrança e o comprovante de quitação da mesma junto à CONCESSIONÁRIA para validação
                        pelo <b>LOCADOR</b> do
                        abatimento.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>6.3.</b> Penalidades: O atraso no pagamento da Remuneração Total da Locação implicará em: (i) Multa de 2% (dois por cento) sobre o valor
                        devido; (ii)
                        correção pelo IPCA desde a data de seu vencimento até o efetivo pagamento; (iii) juros moratórios de 1% (um por cento) a.m. pro rata tempore.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>6.4.</b> Quaisquer tributos ou encargos legais criados, alterados ou extintos ou alterações de norma e legislação incidentes diretamente sobre
                        o objeto
                        deste CONTRATO DE LOCAÇÃO, de comprovada e relevante repercussão direta nos preços definidos neste instrumento ou na finalidade de utilização dos
                        créditos de energia elétrica oriundos do SGD, implicarão na revisão do valor da locação para mais ou para menos, conforme o caso, a fim de
                        compensar
                        tais disparidades. A possível necessidade de revisão destes valores será de tal forma que cada parte arque com uma fatia proporcional ao impacto
                        em
                        seu modelo de negócio.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>6.5.</b> O Valor da Locação descrito na Cláusula 4 será corrigido, anualmente, nas datas de reajuste da Distribuidora Local, pela variação da
                        tarifa
                        subclasse B3 da concessionária na qual está conectado o SGE. As Partes concordam que o primeiro reajuste poderá ocorrer em prazo inferior a 12
                        (doze)
                        meses.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>6.6.</b> Na ocorrência de caso fortuito ou situação de força maior, nos termos do art. 393 do Código Civil Brasileiro, que impossibilite
                        o <b>LOCATÁRIO</b> a exercer a posse do Imóvel e/ou pagar o aluguel na data de seu vencimento, deverá obrigatoriamente informar
                        o <b>LOCADOR</b> sobre o
                        evento de caso fortuito ou motivo de força maior e deverá fazer o pagamento na data em que cessar o impedimento, sem incidência de encargos de
                        mora.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b> 6.7.</b> O <b>LOCADOR</b> deverá recolher às autoridades governamentais competentes todo e qualquer tributo devido em razão do recebimento do
                        aluguel,
                        incluindo, sem limitação, quaisquer valores devidos a título de imposto de renda, ficando desde já autorizado o <b>LOCATÁRIO</b> a realizar as
                        retenções e
                        recolhimentos
                        que lhe couberem, nos termos das normas aplicáveis.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>7. DAS BENFEITORIAS</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>7.1.</b> Caberá unicamente ao <b>LOCADOR</b> promover acessões, adaptações e/ou benfeitorias no SGE, sendo que caso o poder público ou a
                        Distribuidora
                        Local venham a fazer exigências de adequação do para operação do SGE, o <b>LOCADOR</b> deverá promovê-las por sua conta e risco, não sendo
                        atribuível
                        ao <b>LOCATÁRIO</b>
                        qualquer responsabilidade, a fim de manter a eficácia deste contrato.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>8. DAS OBRIGAÇÕES DAS PARTES</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>8.1.</b> As Partes deverão cumprir com o previsto no Código Civil Brasileiro, Lei nº. 14.300 de 06 de janeiro de 2022, normas legais, normas
                        técnicas e
                        regulamentos aplicáveis a este Contrato ao longo da vigência deste Contrato.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>8.2.</b> Além das outras obrigações previstas acima, o <b>LOCADOR</b> obriga-se a:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (i) Se responsabilizar pela operação e manutenção do SGE, permanecendo na posse dos equipamentos e do imóvel onde se encontram instalados, sendo o
                        único responsável pela guarda e proteção. Em nenhuma hipótese será repassada para o <b>LOCATÁRIO</b>, suas empresas consorciadas, cessionários,
                        sublocatários ou seus consumidores a responsabilidade pela operação e manutenção do SGE, bem como pela guarda e proteção dos equipamentos objeto
                        da
                        locação;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (ii) Promover, como único responsável, todo o licenciamento e autorizações de funcionamento do Sistema de Geração, incluindo, mas não se limitando
                        ao
                        licenciamento ambiental relacionado à implementação e operação da usina. Em nenhuma hipótese será repassada para o <b>LOCATÁRIO</b>, suas empresas
                        consorciadas ou seus consumidores a responsabilidade pelo licenciamento da implementação e operação da usina;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iii) Realizar a contratação de seguro patrimonial, para fins de proteção da integridade do SGE e da finalidade dele nos termos deste Contrato,
                        seja
                        para quaisquer tipos de danos, furtos ou roubo, e demais eventos da natureza ou da ação humana que possam atingir os equipamentos. Caso não seja
                        realizado qualquer tipo de seguro, assume o <b>LOCADOR</b>, forma única e exclusiva os riscos por eventuais sinistros ou perda dos bens.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iv) Dar acesso ao <b>LOCATÁRIO</b> aos inversores instalados no SGE, para que o <b>LOCATÁRIO</b> obtenha acesso aos dados dos equipamentos e
                        possa
                        realizar o monitoramento e a gestão de dados de geração e funcionamento do SGE, inclusive implementando sistemas informatizados.
                        O <b>LOCADOR</b> deverá
                        fornecer ao <b>LOCATÁRIO</b> os dados de login para acesso aos referidos dados, bem como manter no imóvel rede ativa de internet, seja via cabos
                        ou
                        sistema de
                        satélite;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (v) Manter o SGE locado livre e desembaraçado;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vi) Responsabilizar-se por todos os tributos, impostos, taxas e quaisquer despesas do imóvel;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vii) Garantir a entrega do Imóvel com o SGE livre e desembaraçado de quaisquer impedimentos e conectado à Distribuidora Local, permitindo o seu
                        uso e
                        gozo pelo <b>LOCATÁRIO</b> para fins de geração de energia elétrica e compensação com a Distribuidora Local;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (viii) Zelar pelo Sistema de Geração, reduzindo o risco de danos de qualquer natureza;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (ix) Obter e manter válidas e vigentes, durante todo o prazo de vigência do Contrato, todas as licenças e autorizações atinentes às atividades de
                        implantação, operação e exploração do Sistema de Geração;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (x) Arcar com os custos segurança e manutenção do SGE, incluído, mas não se limitando, cercamento, fornecimento de equipamentos de segurança
                        (alarmes,
                        câmeras de monitoramento), vigilância, se for o caso, contratação de seguros, limpeza das áreas, limpeza dos equipamentos do SGE, devendo arcar
                        diretamente com os fornecedores;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xi) Responsabilizar-se, em nome do <b>LOCATÁRIO</b>, pela obtenção de toda a documentação necessária ao planejamento, implementação e operação do
                        SGE,
                        tais como, mas não se limitando a: (i) alvarás de construção; (ii) licenças ambientais, regulatórias, administrativas e/ou de projeto; (iii)
                        demais
                        autorizações governamentais e/ou administrativas necessárias a este propósito;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xii) Colaborar com o <b>LOCATÁRIO</b> na condução dos processos e procedimentos relacionados ao Sistema de Geração perante a Distribuidora, e
                        informar ao
                        <b>LOCATÁRIO</b>, em no máximo 36 (trinta e seis) horas, sobre qualquer comunicado relacionado ao Sistema de Geração recebido da Distribuidora ou
                        de
                        qualquer outro órgão público.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xiii) Responsabilizar-se pelos custos decorrentes de condenações, sentenças e despesas relacionadas (inclusive depósitos, custas judiciais e
                        honorários advocatícios), na hipótese de o <b>LOCATÁRIO</b> ser responsabilizado perante quaisquer terceiros, inclusive autoridades públicas, por
                        eventuais danos ou prejuízos relacionados ao imóvel e à implantação do SGE, que não tenham sido causados pelo exercício da atividade
                        do <b>LOCATÁRIO</b>;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xiv) Assinar quaisquer documentos, requerimentos, projetos, plantas e a entregar todos os documentos que venham a ser necessários para a
                        aprovação e
                        regularização do Imóvel e/ou da atividade do <b>LOCATÁRIO</b> junto aos órgãos públicos competentes;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xv) Informar ao <b>LOCATÁRIO</b>, por escrito, se o Imóvel (incluindo, seu entorno) for tombado e/ou for foreiro, ou ainda, se, a qualquer
                        momento
                        durante
                        o Prazo de Vigência, o Imóvel (incluindo, seu entorno) seja atribuído com tais características;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xvi) Indenizar o <b>LOCATÁRIO</b> de quaisquer perdas relacionados ao Imóvel que não sejam decorrentes do exercício da atividade
                        do <b>LOCATÁRIO</b> no
                        Imóvel ou de alterações no Imóvel realizadas pelo <b>LOCATÁRIO</b>;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xvii) Indenizar o <b>LOCATÁRIO</b> de custos decorrentes de condenações, sentenças e despesas relacionadas (inclusive depósitos, custas judiciais
                        e
                        honorários advocatícios), na hipótese de esse vir a ser responsabilizado perante quaisquer terceiros, inclusive autoridades públicas, por
                        eventuais
                        danos ou prejuízos relacionados ao Imóvel, inclusive o previsto no item anterior, e que não tenham sido causados pelo exercício da atividade do
                        <b>LOCATÁRIO</b>;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xviii) Responsabilizar-se, em nome do <b>LOCATÁRIO</b>, para que sejam obtidas as aprovações necessárias para realização de alterações e reformas
                        no
                        Imóvel, inclusive em caso de tombamento do Imóvel;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xix) Apresentar, sempre que solicitados, no prazo de 15 dias, os documentos que comprovem a regularidade documental do Imóvel, sob pena de multa
                        por
                        infração contratual, facultado ao <b>LOCATÁRIO</b> a rescisão contratual com justa causa sem a penalidade;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xx) Manter, às suas expensas, o Imóvel livre e desimpedido de quaisquer turbações ou restrições de qualquer natureza, sejam legais, técnicas,
                        geológicas ou de outra ordem, que sejam capazes de impedir ou de qualquer maneira restringir o uso e a fruição do Imóvel pelo <b>LOCATÁRIO</b>,
                        para os
                        fins e de acordo com as condições estabelecidas no presente Contrato;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xxi) Se aplicável, não desenvolver quaisquer atividades, implementar ou construir quaisquer instalações em área remanescente do Imóvel, que
                        possam
                        concorrer com, ou impactar a viabilidade econômica do Projeto, ou diminuir ou dificultar, de qualquer forma, sua implantação e/ou a plena operação
                        durante todo o Prazo da Locação;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xxii) Garantir disponibilidade de, no mínimo, 90% (noventa por cento) da unidade de geração (“Disponibilidade”), conforme tratado neste contrato.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (xxiii) Durante o prazo de 02 (dois) anos, caso o contrato seja rescindido antecipadamente, não poderá o <b>LOCADOR</b> operar, seja direta ou
                        indiretamente, ou por quaisquer sócios, algum tipo de negócio, celebrar outro contrato de locação e ou O&M com outro consórcio, cooperativa ou
                        outro tipo
                        de estrutura jurídica permitida por lei para acesso ao sistema de compensação de energia elétrica regulado pela Lei nº. 14.300/2022, ou norma que
                        vier a
                        substitui-la, sob pena de arcar com as penalidades contratuais e as perdas e danos havidos ao <b>LOCATÁRIO</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>8.3.</b> Além das outras obrigações previstas acima, o <b>LOCATÁRIO</b> obriga-se a:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (i) Pagar pontualmente o aluguel, conforme termos e condições do presente Contrato;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (ii) Assinar e assumir os custos da CUSD e demais contratos a serem celebrados com a Distribuidora Local, quando aplicável, em quantidade
                        referente a
                        potência instalada no SGE; e
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iii) Fornecer todos os documentos e informações necessárias para o cumprimento das obrigações do <b>LOCADOR</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>8.4.</b> Salvo o estabelecido na Cláusula 6.3 deste Contrato, qualquer inadimplemento ou atraso no cumprimento de obrigações por qualquer das
                        Partes,
                        que não seja sanado em até 15 (quinze) dias contados da data do recebimento de aviso ou notificação, judicial ou extrajudicial, que deverá ser
                        encaminhada
                        pela Parte inocente à Parte infratora, ficando a Parte infratora sujeita ao pagamento de multa não compensatória no valor equivalente a 03 (três)
                        aluguéis (“Multa de Inadimplemento”), sem prejuízo da possibilidade da apuração e pagamento de indenização pelas perdas e danos devidamente
                        comprovados pela Parte inocente, bem como o direito da parte inocente de promover a execução específica da obrigação, em conformidade com o artigo
                        497
                        do Código de Processo Civil.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>8.4.1.</b> A Multa de Inadimplemento não se reveste de caráter liberatório de obrigações e será devida tantas vezes quantas forem as infrações
                        cometidas,
                        sem prejuízo do <b>LOCATÁRIO</b>, se lhe convier, considerar resolvido o presente Contrato nos termos da cláusula 9 deste Contrato.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>8.4.2.</b> A Multa de Inadimplemento deverá ser paga pela Parte infratora à Parte inocente no prazo de 15 (quinze) dias contados do recebimento
                        da
                        notificação pela Parte infratora, sob pena de pagamento de multa de 2% sobre o valor da Multa de Inadimplemento devido e não pago, acrescido de
                        atualização do índice IPCA/IBGE e juros de mora de 1% ao mês.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>9. DAS PENALIDADES, DO INADIMPLEMENTO E DA RESOLUÇÃO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>9.1.</b> A presente locação terminará de pleno direito, sem qualquer ônus, ou responsabilidades para qualquer das Partes, não sendo devida
                        qualquer
                        remuneração, indenização ou ressarcimento, seja a que título for, nas seguintes hipóteses:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (i) Término final do Prazo de Locação, previsto na Cláusula 3.1 deste Contrato;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (ii) Caso o Poder Público extinga o sistema de compensação de créditos de energia instituído na Lei nº. 14.300/2022, na REN 1.000/2021, na REN
                        1.059/2023 e não o substitua por outro sistema similar de compensação de energia que possa ser aproveitado pelo <b>LOCATÁRIO</b>;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iii) Além das hipóteses acima, eventuais alterações na Lei nº. 14.300 de 06 de janeiro de 2022, na REN 1.000/2021, na REN 1.059/2023ou criação de
                        novas normas, pela ANEEL, Congresso Nacional ou Governo Federal, que venham a substituir, alterar ou prejudicar a aplicação do sistema de
                        compensação
                        de energia elétrica na forma atual, de tal forma que não mais seja viável a continuidade do projeto a critério do <b>LOCATÁRIO</b>.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iv) Em caso de recusa irrecorrível de qualquer órgão administrativo para a outorga de qualquer autorização e/ou licença necessária à operação do
                        Projeto no Imóvel, desde que tal recusa não seja decorrente de erros e defeitos na elaboração dos projetos, e/ou por qualquer das Partes;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (v) Em caso de ocorrência de evento de caso fortuito ou força maior, devidamente comprovado, impeditivo de execução do Contrato por mais de 180
                        (cento
                        e oitenta) dias.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vi) Desapropriação total ou parcial do imóvel no qual o Sistema de Geração está instalado;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vii) Incêndio, acidente ou atos criminosos que determine a interdição do Sistema de Geração e/ou interrompa, em caráter permanente, a geração de
                        energia elétrica pelo período superior a 180 (cento e oitenta) dias;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (viii) Em Caso de mudança regulatória ou tributária que impacte diretamente na remuneração das PARTES, dos consorciados, e as PARTES não tenham
                        chegado
                        à acordo de reequilíbrio financeiro do contrato.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>9.2.</b> A presente locação poderá ser rescindida na ocorrência de qualquer das hipóteses seguintes:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (i) Pedido de recuperação judicial ou extrajudicial das partes, independentemente de ter sido obtida homologação judicial; requerimento de
                        liquidação
                        judicial ou extrajudicial, independentemente de deferimento do processamento ou, ainda, pedido de autofalência ou decretação de falência;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (ii) A utilização do Imóvel com finalidade outra que não aquela estabelecida neste Contrato;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iii) Se ocorrer cessão ou transferência do Contrato pelo <b>LOCADOR</b>, sem ser observado o disposto na Cláusula 10 abaixo;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iv) Nas hipóteses em que o <b>LOCATÁRIO</b> optar pela rescisão contratual, quando o <b>LOCADOR</b> descumprir as obrigações assumidas e que não
                        sanadas
                        no prazo
                        estipulado para tal fim, não inferir a 15 (quinze) dias;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (v) Atraso na data de início de utilização dos créditos de energia através do sistema de compensação na forma da Lei nº. 14.300/2022, da REN
                        1.000/2021, da REN 1.059/2023 por período superior a 3 (três) meses contados a partir do início da vigência, por motivo imputável à conduta (ação
                        ou
                        omissão) do <b>LOCADOR</b> e que optar o <b>LOCATÁRIO</b> pela rescisão contratual;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vi) caso o <b>LOCADOR</b> perca os seus direitos reais sobre o Imóvel e, como consequência, o <b>LOCATÁRIO</b> seja obrigado a desocupá-lo, desde
                        que tal
                        fato seja consequência de fato, conduta, ação ou omissão do <b>LOCADOR</b>; e
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vii) A rescisão antecipada imotivada pelo <b>LOCADOR</b> antes do término do prazo de vigência deste Contrato.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>9.3.</b> A Parte que, durante a vigência deste Contrato e antes do seu término, der causa à sua resolução nos termos da Cláusula 9.2, ficará
                        obrigada a
                        pagar à Parte adimplente, no prazo de 10 (dez) dias contados do recebimento da notificação de resolução, multa compensatória correspondente a 30%
                        (trinta por cento) (aqui no Valderi Venski colocamos 00,00) do saldo remanescente até o final da vigência contratual, apurado com base na média do
                        valor mensal do contrato verificada nos últimos 06 (seis) meses anteriores ao mês de competência da resolução.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>9.4.</b> Caso o <b>LOCADOR</b> dê causa à resolução deste Contrato nos termos do disposto na Cláusula 9.2, ficará obrigado, além do pagamento
                        da multa
                        estabelecida na Cláusula 9.3, a reparar/indenizar as perdas e danos que o <b>LOCATÁRIO</b> vier a experimentar em razão da resolução do presente
                        Contrato,
                        sejam diretos ou indiretos, em importância nunca inferior à quantia de 3(três) aluguéis.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>9.5.</b> As Partes reconhecem que, diante das características deste Contrato, as indenizações estabelecidas são equitativas e não são
                        excessivas, não
                        afastando, porém, a aplicação do disposto nos artigos 413 e 572 do Código Civil.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>9.6.</b> As penalidades previstas nesta cláusula tornar-se-ão exigíveis, independentemente de notificação, em 5 (cinco) dias úteis contadas do
                        evento
                        que
                        der causa à rescisão ou sua aplicação, sob pena de pagamento de multa de 2% sobre o valor devido e não pago, acrescido de atualização do índice
                        IPCA/IBGE e juros de mora de 1% ao mês.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b> 9.7.</b> A ocorrência de qualquer dos eventos abaixo listados não configurará, em hipótese alguma, Caso Fortuito ou Força Maior:
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (i) Problemas e/ou dificuldades de ordem econômico-financeira de qualquer das Partes;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (ii) Qualquer ação de qualquer Autoridade Competente que qualquer das Partes pudesse ter evitado se tivesse cumprido com a Legislação Aplicável;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iii) Insolvência, liquidação, falência ou recuperação judicial ou extrajudicial de quaisquer das Partes;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (iv) Greve e/ou interrupções trabalhistas ou medidas de efeito semelhante, de empregados e contratados de uma das Partes e/ou de suas contratadas;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (v) No caso de o <b>LOCADOR</b> ter necessidade de realização de paradas nas suas instalações, sejam elas previstas ou extraordinárias, para
                        manutenção;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vi) No caso de eventuais falhas nas instalações de distribuição ou transmissão das concessionárias locais, que impeçam ou dificultem o
                        cumprimento do
                        objeto do contrato;
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        (vii)Condições diferenciadas do setor elétrico e/ou do mercado de energia elétrica, derivadas de fatores internos ou externos, tais como, eventos
                        meteorológicos, variações do mercado de combustíveis, queda de torres de transmissão.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>10. DA CESSÃO CONTRATUAL E DA SUBLOCAÇÃO</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>10.1.</b> O <b>LOCATÁRIO</b> poderá ceder os direitos e obrigações do presente Contrato, no todo ou em parte, mediante comunicação prévia, por
                        escrito,
                        aos representantes legais do <b>LOCADOR</b> e desde que obtida a anuência expressa e por escrito do <b>LOCADOR</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>10.2.</b> Não obstante o previsto na Cláusula 10.1 acima, as Partes concordam que o <b>LOCATÁRIO</b> não será responsável pela dívida
                        do <b>LOCADOR</b> perante entidades financiadoras, tampouco será responsável pelas obrigações contraídas pelo <b>LOCADOR</b>, em qualquer
                        hipótese, sob
                        pena de resolução imediata deste
                        Contrato por parte do <b>LOCATÁRIO</b>, sem prejuízo de cobrança da multa estabelecida na cláusula 9.3 e de indenização por perdas e danos, não
                        havendo a
                        possibilidade de ônus ou cobrança de quaisquer valores em desfavor do <b>LOCATÁRIO</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>10.3.</b> O <b>LOCADOR</b> concorda expressamente e autoriza a sublocação e a cessão do imóvel por parte do <b>LOCATÁRIO</b> para consórcio,
                        cooperativa ou sociedade que o <b>LOCATÁRIO</b> ou seus sócios administram ou não, pelo mesmo prazo e condições vigentes neste Contrato,
                        independentemente
                        de comunicação prévia e de anuência expressa e por escrito do <b>LOCADOR</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>10.4.</b> Para fins deste Contrato afiliadas são outras pessoas jurídicas que sejam coligadas, controladas, relacionadas ou que sejam geridas
                        pelos
                        mesmos administradores do <b>LOCATÁRIO</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>11. CONFIDENCIALIDADE</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>11.1.</b> As Partes se obrigam por si e por seus sócios, empregados, subcontratados, prestadores de serviços, prepostos e sucessores, a
                        qualquer
                        título, mesmo após o término deste Contrato, por prazo indeterminado, a manter o sigilo e a confidencialidade sobre todos os termos e condições
                        relativos
                        a este Contrato, não os divulgando sob nenhuma forma, mantendo a confidencialidade e sigilo sobre quaisquer dados, materiais, documentos,
                        especificações
                        técnicas ou comerciais, inovações ou aperfeiçoamentos do <b>LOCADOR</b>, de que venha a ter acesso ou conhecimento em razão deste Contrato, não
                        podendo,
                        em qualquer época, mesmo após o término deste Contrato, sob qualquer pretexto, omissão, culpa ou dolo, revelar, reproduzir ou deles dar
                        conhecimento
                        público, salvo se houver consentimento prévio por escrito das Partes.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>11.2.</b> Para esclarecimento, não será considerada violação do dever de confidencialidade o compartilhamento das informações com as Partes
                        coligadas,
                        controladas, relacionadas ou que sejam geridas pelos mesmos administradores do <b>LOCATÁRIO</b>, com autoridades e/ou órgãos de governo, tal como
                        com a
                        concessionária de distribuição de energia elétrica para atendimento às normas regulatórias.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>11.3.</b> Na hipótese de qualquer Parte receber citação, intimação ou qualquer determinação judicial, solicitando informação confidencial de
                        uma Parte,
                        esta deverá notificar a outra Parte, estando autorizada a atender a tal solicitação, na medida do estritamente exigido pela legislação aplicável.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>12. DO DIREITO DE PREFERÊNCIA</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>12.1.</b> No caso de venda, promessa de venda, cessão ou promessa de cessão de direitos, dação em pagamento, permuta do conjunto de bens móveis
                        que
                        compõem o SGE, em conjunto ou separadamente, o <b>LOCATÁRIO</b> tem preferência para adquirir o imóvel, equipamentos, entre outros bens e direitos
                        locados, em
                        igualdade de condições com terceiros, devendo o <b>LOCADOR</b> dar-lhe conhecimento do negócio mediante notificação judicial, extrajudicial ou
                        outro meio
                        de ciência inequívoca.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>12.1.1.</b> A comunicação deverá conter todas as condições do negócio e, em especial, o preço, a forma de pagamento, a existência de ônus
                        reais, bem
                        como o local e horário em que poderá ser examinada a documentação pertinente.
                    </Typography>
                    <Typography marginBottom={2} marginInlineStart={4}>
                        <b>12.1.2.</b> O direito de preferência não alcança os casos de integralização de capital, cisão, fusão e incorporação.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>12.2.</b> O direito de preferência de que trata a Cláusula 12.1 também alcançará os casos de constituição da propriedade fiduciária e de perda
                        da
                        propriedade ou venda por quaisquer formas de realização de garantia, inclusive mediante leilão extrajudicial, fazendo constar essa condição
                        expressamente na presente cláusula contratual de forma destacada das demais, aplicando-se analogicamente o que dispõe o Parágrafo Único do art. 32
                        da
                        Lei 8.245/1991.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13. DISPOSIÇÕES GERAIS</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.1.</b> Este Contrato será regido e interpretado pelas leis da República Federativa do Brasil.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.2.</b> O presente Contrato não cria qualquer vínculo societário, trabalhista ou tributário entre as Partes ou seus representantes sendo que
                        todos e
                        quaisquer tributos e contribuições – que incidam ou venham a incidir sobre o objeto do presente Contrato – são de inteira responsabilidade do
                        contribuinte como tal definido na norma tributária, sem direito a reembolso.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.3.</b> Independência entre as Partes. O presente Contrato não constitui qualquer espécie de acordo operacional, joint venture ou associação
                        entre as
                        Partes, sendo certo que: (a) as Partes, incluindo as sociedades do mesmo grupo econômico do <b>LOCATÁRIO</b>, são totalmente independentes entre
                        si; e (b)
                        nenhuma disposição deste Contrato deverá ser interpretada no sentido de criar qualquer vínculo societário, trabalhista e/ou tributário entre as
                        Partes
                        ou seus representantes.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.4.</b> Sucessores. O presente Contrato é celebrado de forma irrevogável e irretratável, obrigando as Partes, bem como seus herdeiros e
                        sucessores a
                        qualquer título. As Partes e seus herdeiros ou sucessores deverão cumprir integralmente as obrigações estabelecidas no presente Contrato nos
                        termos
                        das normas aplicáveis.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.5.</b> Responsabilidade do <b>LOCADOR</b>. O <b>LOCADOR</b> indenizará o <b>LOCATÁRIO</b> por todas e quaisquer perdas e danos diretos e/ou
                        indiretos de qualquer natureza incorridas pelo <b>LOCATÁRIO</b>, desde que comprovadas, resultantes de qualquer ato, omissivo ou comissivo, fato,
                        erro,
                        evento ou circunstância relacionados ou decorrentes: (i) da inveracidade ou inexatidão de qualquer das declarações e garantias prestadas
                        pelo <b>LOCADOR</b> neste
                        Contrato; (ii)
                        falha ou intempestividade no cumprimento de qualquer das obrigações previstas neste Contrato; (iii) qualquer reclamação de empregados, prepostos
                        ou
                        subcontratados do <b>LOCADOR</b> decorrente do inadimplemento das obrigações civis, trabalhistas, previdenciárias e/ou fiscais do <b>LOCADOR</b>;
                        (iv)
                        dolo ou fraude do <b>LOCADOR</b> ou de seus profissionais e representantes; (v) violação de obrigações legais ou direito personalíssimo de
                        terceiros
                        pelo <b>LOCADOR</b>; (vi) reclamações trabalhistas; (vii) autuação por entidades governamentais; e (viii) morte, invalidez ou incapacidade de
                        pessoas em
                        decorrência do desempenho das atividades do <b>LOCADOR</b>.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.6.</b> Sobrevivência. Todas as disposições do presente Contrato cujos termos, condições ou obrigações não tenham sido ou não possam ser
                        totalmente
                        cumpridos antes da rescisão ou término do presente Contrato, por qualquer motivo, sobreviverão à resolução ou término do presente Contrato,
                        juntamente
                        com todas as definições utilizadas nessas disposições.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.7.</b> Notificações. Todas e quaisquer notificações, solicitações, aprovações e demais comunicações entre as Partes em decorrência deste
                        Contrato
                        serão feitas por escrito e serão havidas como validamente recebidas quando: (i) entregues pessoalmente à Parte a ser notificada mediante protocolo
                        de
                        recebimento assinado por funcionário ou representante legal; (ii) na data de assinatura do aviso de recebimento da Parte notificada, quando a
                        notificação for enviada por correio; ou (iii) mediante envio de correio eletrônico. Para efeito de qualquer notificação, observar-se-ão os dados
                        abaixo fornecidos pelas Partes, que poderão ser alterados por notificação enviada por uma Parte à outra. Caso a referida comunicação deixe de ser
                        realizada, qualquer notificação entregue aos destinatários e/ou nos endereços abaixo indicados será considerada como tendo sido regularmente feita
                        e
                        recebida:
                    </Typography>
                    <Typography marginBottom={2}>

                        (i)Se para o <b>LOCATÁRIO</b>:

                        At.: [•]
                        End.: [•]
                        Tel.: [•]
                        E-mail: [•]
                    </Typography>
                    <Typography marginBottom={2}>
                        (i)Se para o <b>LOCADOR</b>:

                        At.: [•]
                        End.: [•]
                        Tel.: [•]
                        E-mail: [•]
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.8.</b> Alterações. Todas as alterações do presente Contrato serão válidas somente quando feitas por escrito e assinadas por todas as Partes.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.9.</b> Tolerância. Nenhuma extensão de prazos ou tolerância concedida por qualquer das Partes em favor da outra Parte com relação aos termos
                        do
                        presente
                        Contrato afetará o presente Contrato de qualquer forma ou qualquer dos direitos ou obrigações das Partes, exceto nos termos específicos da
                        tolerância
                        concedida, e não importará novação.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.10.</b> Caso Fortuito ou Força Maior. Nenhuma das Partes será considerada em mora ou inadimplente, nem ficará sujeita ao pagamento de
                        qualquer
                        indenização ou penalidade, se o atraso ou o descumprimento das obrigações decorrer de caso fortuito ou motivo de força maior, devidamente
                        comprovado,
                        nos termos do disposto no parágrafo único do artigo 393 do Código Civil brasileiro. Uma vez cessado o caso fortuito ou o motivo de força maior, as
                        obrigações das Partes serão imediatamente restabelecidas, de forma automática.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.11.</b> Independência entre as Cláusulas. Caso, por qualquer motivo, qualquer das disposições do presente Contrato seja considerada
                        inválida, ilegal
                        ou ineficaz, tal provisão deverá ser excluída do presente Contrato e a validade, legalidade e eficácia das demais disposições do presente Contrato
                        não
                        serão, por tal isso, afetadas ou comprometidas de qualquer forma.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.12.</b> Renúncia. O inadimplemento ou atraso qualquer Parte no exercício de um direito, poder ou privilégio oriundo deste Contrato e seus
                        Anexos não
                        deverão ser interpretados como renúncia, tampouco deverá qualquer exercício singular ou parcial de um direito, poder ou faculdade, impossibilitar
                        qualquer exercício futuro.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.13.</b> Ciência. Ao celebrar este contrato, cada uma das partes declara que o leu, compreendeu e teve a oportunidade de consultar seus
                        assessores
                        legais. A celebração do presente contrato, portanto, obriga as partes a cumprirem todos os seus termos e disposições, sendo certo que não poderá
                        alegar ignorância quanto ao seu conteúdo e consequências.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.14.</b> Exclusivo Benefício das Partes. Este Contrato é celebrado em benefício único e exclusivo das Partes, seus respectivos sucessores e
                        cessionários autorizados, e este Contrato não conferirá a qualquer terceiro qualquer prerrogativa, faculdade, causa de pedir ou direito.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.15.</b> Deveres de Conduta. As Partes atenderão aos princípios da probidade e boa-fé e aos deveres desses decorrentes, como os de lealdade,
                        sigilo,
                        cooperação e informação, abstendo-se, cada uma delas, de adotar conduta que prejudique os interesses da outra, inclusive após a extinção do
                        vínculo
                        contratual.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.16.</b> Pactos Internacionais. As Partes declaram que se encontram em conformidade com os Pactos Internacionais do Trabalho e as leis do
                        país,
                        obrigando-se a: (i) não utilizar de trabalho forçado ou compulsório, (ii) não utilizar de mão-de-obra em condição análoga a de escravo, (iii) não
                        utilizar de mão de obra infantil, não realizar e coibir atos de exploração sexual de crianças e adolescentes, e, ainda, (iv) respeitar o direito à
                        negociação coletiva de trabalho.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.17.</b> Execução Específica. As Partes declaram e reconhecem que as obrigações previstas neste Contrato poderão ser objeto de execução
                        específica,
                        nos termos dos artigos 497 e 784, incisos II e III, do Código de Processo Civil.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.18.</b> Regras Anticorrupção. As Partes declaram neste ato que estão cientes, conhecem e entendem os termos das leis anticorrupção
                        brasileiras ou de
                        quaisquer outras aplicáveis sobre o objeto do presente contrato, compreendendo-se a abster-se de qualquer atividade que constitua uma violação das
                        disposições destas Regras Anticorrupção.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.19.</b> LGPD. As Partes se comprometem a observar as regras previstas na Lei Geral de Proteção de Dados - LGPD (Lei 13.709/2018) sempre que
                        for
                        realizada a transferência de dados pessoais para qualquer terceiro, bem como se comprometem a (i) adotar as medidas de segurança técnicas e
                        organizacionais apropriadas para proteger dados pessoais contra incidentes; (ii) garantem que essas medidas asseguram um nível de segurança
                        condizente
                        com os riscos apresentados pelo processamento e natureza dos dados a serem protegidos.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.20.</b> Mudança da Legislação. Caso haja mudança posterior na legislação e normas do Setor Elétrico, incluindo mas não se limitando, aos
                        Procedimentos
                        de Distribuição – PRODIST e REN 482, que venham alterar substancialmente as condições deste Contrato, as Partes desde já concordam em negociar de
                        boa-fé o(s) seu(s) aditamento(s), visando à manutenção do equilíbrio econômico-financeiro do Contrato, sendo certo que, na impossibilidade de
                        acordo
                        para preservá-lo, o presente Contrato poderá ser extinto, sem quaisquer ônus ou multas, por qualquer das Partes.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.21.</b> Acordo Integral. Este Contrato, uma vez firmado entre as Partes, constituirá compromisso irretratável, irrevogável, incondicional e
                        final
                        entre as Partes, substituindo todos os entendimentos, compromissos, fac-símiles, cartas ou correspondências anteriores relacionadas à matéria
                        tratada
                        neste Contrato.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.22.</b> Lei Aplicável e Foro. Este Contrato deverá ser regido pelas Leis da República Federativa do Brasil. As Partes elegem o Foro Central
                        da
                        Comarca
                        de (Cidade)/Estado, para resolver quaisquer disputas relacionadas a este Contrato, com exclusão de todos os outros, por mais privilegiados que
                        sejam.
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>13.23.</b> Assinatura Digital. As Partes concordam com a possibilidade de assinar o presente Contrato por meio da ferramenta de assinatura
                        eletrônica
                        que seja válida e reconhecida por todos os signatários e nos termos da Legislação vigente. Assim, sem prejuízo da validade e eficácia das vias
                        físicas que
                        serão assinadas pelas Partes, a versão deste instrumento assinada digitalmente é válida e eficaz, produzindo efeitos desde a data de sua
                        assinatura
                        pelas Partes. As Partes ainda reconhecem que: (i) têm capacidade jurídica para assinar digitalmente o presente instrumento, não podendo alegar
                        posteriormente a oposição de assinatura por quaisquer fatores que possam vir a entender como um impedimento; e (ii) que todas as evidências,
                        físicas
                        ou digitais, comunicações e transações eletrônicas entre as Partes se constituirão em evidências probantes e materializadas dos atos perpetrados e
                        da
                        legitimidade da assinatura digital.
                    </Typography>
                    <Typography marginBottom={4}>
                        E, estando assim justas e contratadas, celebram as partes este Contrato em 2 (duas) vias de igual teor e forma, tudo para um só efeito, na
                        presença
                        das testemunhas abaixo assinadas.
                    </Typography>
                    <Typography marginBottom={4}>
                        Cidade, dia de mês de ano
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>LOCADOR</b>:
                    </Typography>
                    <Typography marginBottom={6}>
                        ________________________________________________________________________________________________
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>LOCATÁRIO</b>:
                    </Typography>
                    <Typography marginBottom={4}>
                        ________________________________________________________________________________________________<br/>
                        {locatario.nome.toUpperCase()}
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>Testemunhas:</b>
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>1.</b> _________________________________<br/>
                        Nome:<br/>
                        CPF:
                    </Typography>
                    <Typography marginBottom={2}>
                        <b>2.</b> _________________________________<br/>
                        Nome:<br/>
                        CPF:<br/>
                    </Typography>
                    <Typography marginBottom={2}>
                        ANEXO I - Descrição da Usina e Lista dos bens que compõem a Usina Fotovoltaica [inserir nome da UFV];
                    </Typography>
                    <Typography marginBottom={2}>
                        Nome da Central Geradora
                        Endereço
                        Capacidade Instalada
                        Potência Instalada
                        Descrição
                        Modelo dos Módulos
                        Modelo dos Inversores
                    </Typography>
                </Container>
            </div>
        </Box>

    )
}
export default ContratoUsina

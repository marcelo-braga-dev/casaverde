# M7 · Aula 3 — Importação automática por e-mail

| Campo | Valor |
|-------|-------|
| Tipo | 🎥 expositiva |
| Duração alvo | 11 min (~1.400 palavras) |
| Objetivo | Entender e configurar a importação automática de faturas por e-mail (IMAP) |
| Pré-requisito | M7 aula 1 |
| Referências | Plataforma: Integrações → Configurações de Integração / Histórico de Importação; ficha do cliente → aba Integração (Administrador). No laboratório, a importação por e-mail fica desligada — usa-se upload |

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Com 500 clientes, ninguém baixa fatura à mão"
**Narração:**
Com quinze clientes, dá para pedir a fatura por WhatsApp e subir o PDF à mão. Com quinhentos, é impossível. A plataforma resolve isso com a importação automática por e-mail: as faturas chegam sozinhas, são lidas e entram na fila de revisão. Vamos entender como montar isso.

## Cena 2 — A ideia: uma caixa de e-mail por cliente (0:40–3:20)
**Visual:** ANIMAÇÃO: distribuidora envia a fatura por e-mail → caixa "fatura.cliente123@suaempresa" → plataforma lê a caixa de hora em hora → PDF desbloqueado → dados extraídos → fila de revisão.
**Texto na tela:** "Distribuidora → e-mail da sua empresa (1 por cliente) → plataforma lê de hora em hora → revisão"
**Narração:**
A ideia é simples. Quase toda distribuidora permite cadastrar um e-mail para receber a fatura digital. Em vez do e-mail do cliente, você cadastra um endereço da sua empresa, dedicado àquele cliente. A plataforma tem um conjunto de caixas de e-mail e lê essas caixas de hora em hora. Quando chega uma fatura, ela baixa o PDF, desbloqueia se tiver senha, extrai os dados, identifica o cliente e a unidade consumidora e coloca a fatura na fila de revisão. Ter uma caixa por cliente evita confusão: cada fatura que chega numa caixa já se sabe de quem é. As caixas podem ser criadas pela própria tela de integrações, se a hospedagem de e-mail estiver integrada.

## Cena 3 — Configurando o cliente (3:20–6:00)
**Visual:** TELA — ficha do cliente → aba Integração: "Email de recebimento de faturas", "Senha para desbloquear PDF", "Filtro de remetente (avançado)"; depois Integrações → Configurações de Integração com o pool de caixas.
**Texto na tela:** "Aba Integração: e-mail de recebimento · senha do PDF · filtro de remetente"
**Narração:**
Na ficha do cliente, na aba Integração, você associa a caixa de e-mail que recebe as faturas dele. Muitas distribuidoras enviam o PDF protegido por senha, normalmente com parte do CPF ou do CNPJ do titular; cadastre essa senha no campo de senha para desbloquear o PDF — ela fica guardada de forma criptografada. O filtro de remetente é opcional e serve para aceitar só e-mails vindos do endereço da distribuidora, ignorando propaganda e outros e-mails. Depois, com o cliente, faça o cadastro do e-mail de fatura digital no site ou aplicativo da distribuidora. Combine isso já no onboarding: é um dos documentos do contrato.

## Cena 4 — Acompanhando a importação (6:00–8:40)
**Visual:** TELA — Integrações → Histórico de Importação: execuções, e-mails processados, sucessos e erros; botão para disparar uma importação manual; abrir uma execução e ver o PDF de um e-mail.
**Texto na tela:** "Histórico de Importação: cada execução, cada e-mail, cada erro"
**Narração:**
Em Integrações, Histórico de Importação, você vê cada execução da rotina: quantos e-mails foram lidos, quantas faturas entraram, quantas deram erro e por quê. Também dá para disparar uma importação na hora, sem esperar a próxima rodada. Quando algo falha de forma que compromete o faturamento — uma caixa de e-mail inacessível, uma senha de PDF errada, um PDF ilegível —, a plataforma cria um alerta operacional, que aparece no sino do cabeçalho. E o alerta se resolve sozinho quando a importação volta a funcionar. Você não precisa ficar olhando o histórico: os alertas avisam.

## Cena 5 — O upload manual continua existindo (8:40–10:20)
**Visual:** SLIDE.
**Texto na tela:** "Upload manual: fatura de cliente novo · segunda via · distribuidora sem e-mail · layout não reconhecido"
**Narração:**
E o upload manual continua sendo útil: para o cliente recém-chegado, cuja fatura digital ainda não foi redirecionada; para uma segunda via; para distribuidoras sem envio por e-mail; e para casos em que a leitura automática não reconhece o layout. Nesses casos, você sobe o PDF e preenche ou corrige os dados na revisão. É o que você vai fazer no laboratório, já que no ambiente de aula a importação por e-mail está desligada.

## Cena 6 — Resumo (10:20–11:00)
**Visual:** APRESENTADOR.
**Texto na tela:** "1 caixa por cliente · senha do PDF cadastrada · rotina de hora em hora · alertas avisam falhas · upload para exceções"
**Narração:**
Resumindo: uma caixa de e-mail por cliente, a senha do PDF cadastrada, a rotina lendo de hora em hora, os alertas avisando quando algo falha e o upload manual para as exceções. Na próxima aula, o que conferir na revisão da fatura.

## Materiais da aula
- Passo a passo para o cliente cadastrar a fatura digital (modelo a adaptar por distribuidora).

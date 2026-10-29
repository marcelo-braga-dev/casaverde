# M8 · Aula 7 — Laboratório: vencimento, boleto vencido e reemissão

| Campo | Valor |
|-------|-------|
| Tipo | 🧪 laboratório |
| Duração alvo | 13 min (~1.400 palavras) |
| Objetivo | Ver a régua automática funcionando: lembrete, vencida, boleto vencido, reemissão e alteração de vencimento |
| Pré-requisito | M8 aulas 4 e 6 |
| Referências | `LAB_MODE`: "avançar N dias" (roda marcação de vencidas, expiração de boletos e lembretes com a data simulada). Plataforma: Alertas Operacionais; cobrança → Editar vencimento, Cobrar via WhatsApp, Enviar Lembrete |

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Laboratório: quando o cliente não paga"
**Narração:**
Quatro cobranças ficaram em aberto na aula anterior. Agora vamos avançar o tempo no laboratório e ver a régua automática funcionar: lembrete, cobrança vencida, boleto vencido e reemissão.

## Cena 2 — Três dias antes: o lembrete (0:40–3:20)
**Visual:** TELA — "avançar dias" até D−3; caixa de e-mails do laboratório com o lembrete ao cliente; Relatórios → Alertas Operacionais com o alerta de lembrete atribuído ao consultor; abrir e clicar no link de WhatsApp (mensagem pronta).
**Texto na tela:** "D−3: e-mail ao cliente + alerta ao consultor com WhatsApp pronto"
**Narração:**
Avance o laboratório até três dias antes do vencimento. Na caixa de e-mails do laboratório, aparece o lembrete enviado aos clientes, com o Pix. E, em Alertas Operacionais, há um alerta de lembrete para o consultor responsável, com o link do WhatsApp e a mensagem pronta. Clique e veja a mensagem. Na vida real, o consultor só confere e envia.

## Cena 3 — Venceu: cobrança vencida (3:20–5:20)
**Visual:** TELA — avançar até D+1; Financeiro → Cobranças de Faturas filtrando "vencida"; cobrança com status "Vencida"; dashboard com cobranças vencidas.
**Texto na tela:** "D+1: marcada como vencida automaticamente"
**Narração:**
Avance para o dia seguinte ao vencimento. As cobranças não pagas foram marcadas como vencidas, sem ninguém clicar. No dashboard, o número de cobranças vencidas subiu, e o valor vencido aparece separado. Na lista de cobranças, filtre pelas vencidas: é a fila de trabalho da cobrança.

## Cena 4 — Boleto vencido e reemissão (5:20–9:00)
**Visual:** TELA — cobrança da Clínica (boleto): selo "Boleto vencido", PDF bloqueado; alerta "gere um novo boleto e envie ao cliente"; contador no menu de cobranças aguardando novo boleto; gerar novo pagamento (boleto) com vencimento novo; "Enviar boleto ao cliente"; o boleto antigo continua acompanhado.
**Texto na tela:** "Boleto vencido: PDF bloqueado · alerta para reemitir · novo boleto · o antigo segue monitorado por 10 dias"
**Narração:**
Agora, a clínica, que tinha boleto. Repare no selo de boleto vencido e no PDF bloqueado: o cliente não consegue mais baixar um boleto que o banco devolveria. Em Alertas Operacionais, há um alerta pedindo para gerar um novo boleto e enviar. E o menu mostra quantas cobranças estão aguardando um novo boleto. Gere o novo pagamento para a clínica e envie ao cliente. Lembre do detalhe da aula 3: o boleto antigo não foi cancelado no banco; ele continua sendo acompanhado por dez dias. Se a clínica tiver pago o antigo no último dia, a cobrança é baixada e o novo boleto é cancelado sozinho.

## Cena 5 — O cliente pediu outra data (9:00–11:20)
**Visual:** TELA — cobrança da Residência: "Editar vencimento" → "Nova data de vencimento" → salvar; Pix anterior cancelado e novo emitido; Histórico de Alterações mostrando a mudança.
**Texto na tela:** "Editar vencimento → pagamento anterior cancelado → novo emitido → histórico"
**Narração:**
Por fim, a residência ligou: recebe o salário no dia quinze e pediu para pagar depois disso. Na cobrança, use editar vencimento e informe a nova data. A plataforma cancela o Pix anterior no Mercado Pago e emite um novo com a data nova. O histórico de alterações registra quem mudou e quando. Se o pedido se repetir todo mês, ajuste a data de vencimento padrão desse cliente no contrato.

## Cena 6 — A cobrança humana (11:20–12:20)
**Visual:** TELA — botões "Cobrar via WhatsApp" e "Enviar Lembrete" numa cobrança vencida.
**Texto na tela:** "Cobrar via WhatsApp · Enviar Lembrete — o contato humano da régua"
**Narração:**
Para os contatos humanos da régua, a cobrança tem os botões de cobrar via WhatsApp e enviar lembrete, sempre com a mensagem pronta e o valor correto. Use-os nos dias de contato pessoal.

## Cena 7 — Entregável e encerramento (12:20–13:00)
**Visual:** SLIDE.
**Texto na tela:** "Entregável do M8: mês 1 faturado · 10+ pagas · 1 ajuste · 1 vencimento alterado · 1 boleto reemitido · régua escrita"
**Narração:**
Confira o entregável: o mês um faturado para os quinze clientes, pelo menos dez pagos, um ajuste, um vencimento alterado, um boleto reemitido e a régua de cobrança da sua empresa por escrito. Com isso, você operou o ciclo completo, da usina ao dinheiro. No próximo módulo, vamos transformar isso numa rotina que roda todo mês.

## Materiais da aula
- Roteiro escrito do laboratório.

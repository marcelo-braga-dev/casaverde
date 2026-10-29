# M8 · Aula 1 — Como nasce a cobrança

| Campo | Valor |
|-------|-------|
| Tipo | 🎥 expositiva |
| Duração alvo | 12 min (~1.550 palavras) |
| Objetivo | Entender a fórmula, o momento e o ciclo de status da cobrança |
| Pré-requisito | M7 |
| Referências | Plataforma: geração de cobrança a partir de fatura aprovada (automática de hora em hora ou manual); status da cobrança |

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Da fatura aprovada ao dinheiro na conta"
**Narração:**
Este é o módulo em que a operação vira dinheiro. A fatura foi aprovada; agora nasce a cobrança, que é o que o cliente vai pagar para a sua empresa. Nesta aula, você entende de onde vem cada número da cobrança e por quais status ela passa até ser paga.

## Cena 2 — A fórmula (0:40–3:10)
**Visual:** QUADRO.
**Texto na tela:**
"Valor original = consumo injetado da fatura (R$)"
"Desconto = valor original × margem de desconto (%)"
"Valor final = valor original − desconto − desconto manual + acréscimo manual"
"Padaria: 2.119,00 − 423,80 = R$ 1.695,20"
**Narração:**
A fórmula você já conhece. O valor original é o consumo injetado da fatura, em reais. O desconto é esse valor vezes a margem de desconto do cliente. E o valor final é o original menos o desconto, mais ou menos os ajustes manuais, que veremos na próxima aula. Para a padaria: dois mil, cento e dezenove reais de consumo injetado, menos vinte por cento, que são quatrocentos e vinte e três reais e oitenta, dá mil, seiscentos e noventa e cinco reais e vinte centavos. O vencimento da cobrança, por padrão, acompanha o vencimento da fatura da distribuidora, para que o cliente tenha as duas contas na mesma data.

## Cena 3 — Quando a cobrança é gerada (3:10–5:20)
**Visual:** ANIMAÇÃO: fatura aprovada → (rotina de hora em hora) → cobrança em rascunho; alternativa: botão "gerar cobrança" na fatura.
**Texto na tela:** "Automática: rotina de hora em hora para faturas aprovadas · Manual: botão na fatura · 1 fatura ativa = 1 cobrança"
**Narração:**
A cobrança é gerada de duas formas. Automaticamente: de hora em hora, uma rotina procura faturas aprovadas sem cobrança e gera as cobranças. Ou manualmente, com um clique na fatura, quando você quer adiantar. A plataforma impede gerar duas cobranças ativas para a mesma fatura. E, se uma fatura ficar aprovada sem cobrança por muito tempo, a varredura de saúde operacional avisa.

## Cena 4 — O ciclo de status (5:20–9:20)
**Visual:** ANIMAÇÃO de estados: Rascunho → (Abrir para pagamento) Aberta → (Pix/boleto gerado) Aguardando pagamento → Paga; ramificações: Vencida (marcação automática), Cancelada (com motivo).
**Texto na tela:** "Rascunho → Aberta → Aguardando pagamento → Paga · Vencida · Cancelada"
**Narração:**
Toda cobrança nasce como rascunho. Isso é proposital: é a sua chance de conferir antes de o cliente ver. Quando está tudo certo, você abre a cobrança para pagamento, e ela passa a aberta. Ao gerar o Pix ou o boleto, ela fica aguardando pagamento. Quando o pagamento é confirmado, vira paga. Se o vencimento passa sem pagamento, uma rotina que roda a cada dez minutos marca como vencida. E, se por algum motivo a cobrança não deve existir — por exemplo, a fatura era duplicada —, você cancela, informando o motivo. Rascunhos esquecidos também geram alerta: a varredura avisa sobre cobranças em rascunho há mais de dois dias.

## Cena 5 — Por que o pagamento não é gerado sozinho (9:20–11:00)
**Visual:** SLIDE.
**Texto na tela:** "Decisão de negócio: Pix/boleto é emitido por uma pessoa · alerta: cobrança vencendo em 5 dias sem pagamento gerado"
**Narração:**
Uma decisão importante desta plataforma: o Pix ou o boleto não é gerado automaticamente. É sempre uma pessoa que clica para gerar, na tela da cobrança. O motivo é cuidado: emitir um boleto é um ato com efeito financeiro e de comunicação com o cliente, e a conferência humana evita mandar um valor errado. Para que isso não vire esquecimento, a plataforma alerta o consultor quando uma cobrança vai vencer em cinco dias sem pagamento gerado.

## Cena 6 — Resumo (11:00–12:00)
**Visual:** APRESENTADOR.
**Texto na tela:** "Consumo injetado × (1 − desconto) ± ajustes · rascunho → aberta → aguardando → paga · Pix/boleto por clique humano"
**Narração:**
Resumindo: a cobrança é o consumo injetado com o desconto, mais ou menos ajustes; nasce em rascunho, é aberta para pagamento, fica aguardando, e termina paga, vencida ou cancelada; e o Pix ou boleto é sempre emitido por uma pessoa. Na próxima aula, os ajustes.

## Materiais da aula
- Diagrama do ciclo de vida da cobrança.

# M8 · Aula 6 — Laboratório: pagamento, baixa automática e o portal do cliente

| Campo | Valor |
|-------|-------|
| Tipo | 🧪 laboratório |
| Duração alvo | 12 min (~1.300 palavras) |
| Objetivo | Simular pagamentos, acompanhar a baixa automática, ver o portal do cliente e confirmar pagamento manual |
| Pré-requisito | M8 aula 5 |
| Referências | Plataforma: Financeiro → Pagamentos; cobrança → Pagamentos Gerados / Confirmar Pagamento; portal do Cliente → Minhas Cobranças. Pagamento simulado do `LAB_MODE` (ou Pix sandbox com pagador "APRO") |

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Laboratório: o dinheiro entrando"
**Narração:**
Agora, a melhor parte: receber. Neste laboratório, os seus clientes vão pagar — de forma simulada —, e você vai ver a plataforma dar baixa sozinha, sem você conferir extrato.

## Cena 2 — O cliente paga pelo portal (0:40–3:40)
**Visual:** TELA — trocar para o perfil Cliente (Padaria): Visão Geral → Minhas Cobranças → abrir a cobrança do mês; cartão de pagamento com Pix copia e cola, linha digitável (se boleto) e download do PDF.
**Texto na tela:** "Portal do cliente: Minhas Cobranças → Pix copia e cola / boleto em PDF"
**Narração:**
Primeiro, veja pelo lado do cliente. Troque para o perfil Cliente e abra Minhas Cobranças. A cobrança do mês está lá, com o cartão de pagamento: o Pix copia e cola, pronto para colar no aplicativo do banco, e, quando for boleto, a linha digitável e o PDF para baixar. Repare que o cliente vê só o que precisa para pagar — nenhum dado técnico ou interno. Quanto mais clientes pagam pelo portal, menos mensagens a sua equipe responde.

## Cena 3 — Simulando o pagamento e a baixa (3:40–6:40)
**Visual:** TELA — voltar ao Administrador; na cobrança da Padaria, usar "simular pagamento" do laboratório (ou aguardar a aprovação do Pix sandbox); recarregar; pagamento "pago", cobrança "Paga", "Paga em"; Histórico de Alterações com o evento.
**Texto na tela:** "Pagamento confirmado → webhook/sincronização → cobrança Paga (sem ação manual)"
**Narração:**
Volte ao Administrador. No laboratório, use o botão de simular pagamento na cobrança da padaria — ele imita exatamente o que o Mercado Pago faz quando o cliente paga. Em instantes, o pagamento aparece como pago, e a cobrança como paga, com a data do pagamento. Ninguém clicou em "dar baixa": a confirmação chegou pelo mesmo caminho do mundo real, o aviso do Mercado Pago, conferido pela plataforma. Abra o histórico de alterações: o pagamento está registrado.

## Cena 4 — Acompanhando os pagamentos (6:40–8:40)
**Visual:** TELA — Financeiro → Pagamentos: lista com filtros (status, método, nome do cliente); abrir um pagamento e mostrar o botão de sincronizar; (admin) Webhooks de Pagamento com os eventos recebidos.
**Texto na tela:** "Financeiro → Pagamentos: todos os Pix/boletos · sincronizar sob demanda"
**Narração:**
Em Financeiro, Pagamentos, você vê todos os Pix e boletos emitidos, com filtros por status, método e cliente. Dentro de um pagamento, existe um botão para sincronizar na hora com o Mercado Pago, útil quando um cliente diz "acabei de pagar". Como administrador, você também vê os avisos recebidos do Mercado Pago, um por um — e, se um deles falhou, a plataforma permite reprocessar.

## Cena 5 — Pagamento fora do sistema (8:40–10:40)
**Visual:** TELA — cobrança da Residência: "Confirmar Pagamento" → "Paga em" + "Observação (opcional)" ("Transferência recebida em 12/03, comprovante no e-mail") → confirmar; Pix/boleto ativo cancelado automaticamente.
**Texto na tela:** "Recebeu por fora? Confirmar Pagamento + observação · boleto ativo é cancelado"
**Narração:**
E quando o cliente paga por fora — uma transferência direta, por exemplo? Na cobrança, use confirmar pagamento: informe a data e uma observação com a referência do comprovante. A cobrança fica paga e, se houver um Pix ou boleto ativo, a plataforma cancela no Mercado Pago, para o cliente não pagar duas vezes. Use isso como exceção: o ideal é o pagamento passar pelo Pix ou boleto, que dão baixa sozinhos.

## Cena 6 — Exercício e encerramento (10:40–12:00)
**Visual:** SLIDE.
**Texto na tela:** "Exercício: simule o pagamento de 10 cobranças · confirme 1 pagamento manual · deixe 4 em aberto (próxima aula)"
**Narração:**
Exercício: simule o pagamento de dez cobranças, confirme um pagamento manual com observação e deixe quatro em aberto — elas vão vencer na próxima aula. Confira, no dashboard do administrador, como o valor recebido e o valor a receber mudaram.

## Materiais da aula
- Roteiro escrito do laboratório.

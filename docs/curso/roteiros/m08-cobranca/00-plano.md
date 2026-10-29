# M8 — Cobrança e recebimento · Plano do módulo

**Etapa 3 — Operação ponta a ponta** · 7 aulas · ~1h25 de vídeo + 2h30 de prática

> Laboratórios 5–7 dependem de pagamento simulado e de "avançar o tempo" no `LAB_MODE` (backlog itens 6 e 7). Sem eles, usar a conta sandbox do Mercado Pago (Pix aprovado automaticamente) e demonstrar o vencimento com dados preparados.

## Objetivos
- Explicar o ciclo de vida da cobrança (rascunho → aberta → aguardando pagamento → paga / vencida / cancelada).
- Lançar ajustes, recalcular e alterar vencimento com histórico.
- Entender Pix e boleto pelo Mercado Pago: emissão, baixa por webhook/sincronização, vencimento e reemissão.
- Montar a régua de cobrança e gerir inadimplência.
- Gerar cobranças a partir de faturas, emitir Pix/boleto, acompanhar a baixa e o portal do cliente.

## Aulas
| # | Aula | Tipo | Duração |
|---|------|------|---------|
| 1 | Como nasce a cobrança | 🎥 | 12 min |
| 2 | Ajustes, descontos e recálculo | 🎥 | 11 min |
| 3 | Pix e boleto: como funcionam os meios de pagamento | 🎥 | 13 min |
| 4 | Régua de cobrança e inadimplência | 🎥 | 14 min |
| 5 | Gerando a cobrança e emitindo o Pix | 🧪 | 14 min |
| 6 | Pagamento, baixa automática e o portal do cliente | 🧪 | 12 min |
| 7 | Vencimento, boleto vencido e reemissão | 🧪 | 13 min |

## Entregável do módulo
**Primeiro faturamento**: cobranças do mês 1 geradas e abertas para os 15 clientes; Pix ou boleto emitido para todos; pelo menos 10 pagos (simulados), 1 com ajuste justificado, 1 com vencimento alterado e 1 vencida tratada (boleto reemitido); e a **régua de cobrança** da sua empresa em uma página.

## Exercícios
1. Cobrança de R$ 1.695,20 com um desconto manual de R$ 50 (cortesia pela demora no primeiro crédito). Valor final? (R: R$ 1.645,20)
2. Monte uma régua para uma cobrança com vencimento dia 10: o que acontece nos dias 7, 10, 11, 15, 20 e 30?
3. Por que a plataforma não cancela o boleto vencido no Mercado Pago imediatamente? (R: um pagamento feito no último dia pode compensar em até 3 dias úteis.)

## Quiz (7 questões)
1. A cobrança nasce com status: **(a) rascunho** (b) paga (c) vencida (d) aberta.
2. O Pix ou boleto é gerado: (a) automaticamente ao aprovar a fatura **(b) manualmente na tela da cobrança** (c) pelo cliente (d) pela distribuidora.
3. Para emitir boleto pelo Mercado Pago, é obrigatório: (a) CPF do consultor **(b) endereço completo do pagador** (c) foto do cliente (d) nada.
4. A baixa do pagamento acontece por: **(a) webhook do Mercado Pago e sincronização periódica** (b) só manual (c) só no fim do mês (d) e-mail do cliente.
5. Alterar o vencimento de uma cobrança com boleto ativo: **(a) cancela e reemite o boleto com a nova data** (b) não é permitido (c) muda só na tela (d) gera multa.
6. O lembrete por e-mail ao cliente é enviado: **(a) 3 dias antes do vencimento, se houver boleto/Pix pagável** (b) todo dia (c) só depois de vencer (d) nunca.
7. Comissão e inadimplência: o melhor momento para pagar comissão é: (a) proposta enviada **(b) primeira cobrança paga** (c) contrato emitido (d) nunca.

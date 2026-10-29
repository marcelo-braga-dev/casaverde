# M8 · Aula 3 — Pix e boleto: como funcionam os meios de pagamento

| Campo | Valor |
|-------|-------|
| Tipo | 🎥 expositiva |
| Duração alvo | 13 min (~1.700 palavras) |
| Objetivo | Entender emissão, confirmação, vencimento, reemissão e estorno de Pix/boleto pelo Mercado Pago |
| Pré-requisito | M8 aulas 1–2 |
| Referências | `MERCADO_PAGO.md` (regras operacionais); tarifas do Mercado Pago **[CONFERIR valores atuais]** |

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Pix ou boleto: o cliente escolhe, a plataforma acompanha"
**Narração:**
A sua empresa precisa receber de centenas de clientes, todo mês, com o mínimo de trabalho manual. A plataforma faz isso com o Mercado Pago: emite Pix ou boleto, recebe a confirmação automaticamente e baixa a cobrança. Nesta aula, você entende o que acontece por trás de cada clique.

## Cena 2 — Pix e boleto (0:40–3:40)
**Visual:** SLIDE com duas colunas.
**Texto na tela:**
"Pix: copia e cola · confirmação em minutos · padrão da plataforma"
"Boleto: linha digitável e PDF com código de barras · compensação em até 3 dias úteis · exige endereço completo do pagador"
"Um pedido = um método (Pix OU boleto)"
**Narração:**
A plataforma oferece dois métodos. O Pix, que é o padrão: o cliente recebe um código copia e cola, paga no aplicativo do banco e a confirmação chega em minutos. E o boleto, com linha digitável e um PDF com código de barras e a marca da sua empresa. O boleto leva até três dias úteis para compensar e exige o endereço completo do pagador — sem ele, o Mercado Pago recusa a emissão. Um detalhe: cada emissão é um método. Não dá para gerar Pix e boleto juntos no mesmo pedido; se o cliente quiser os dois, você gera um e, se ele preferir o outro, cancela e gera o outro.

## Cena 3 — O vencimento do Pix e do boleto (3:40–5:40)
**Visual:** SLIDE.
**Texto na tela:** "Vencimento da cobrança enviado ao Mercado Pago · fim de semana → próximo dia útil · data lida do código de barras é a que vale"
**Narração:**
Ao emitir, a plataforma envia ao Mercado Pago o vencimento da cobrança. Se o vencimento cai num fim de semana, o banco joga para o próximo dia útil, e a plataforma registra a data real lida do próprio código de barras — é ela que aparece no PDF e que o banco aceita. Cobrança já vencida, quando emitida, recebe alguns dias de prazo.

## Cena 4 — A confirmação automática (5:40–8:40)
**Visual:** ANIMAÇÃO: cliente paga → Mercado Pago envia notificação (webhook) → plataforma confere o status consultando o Mercado Pago → cobrança paga; em paralelo, "sincronização a cada 5 minutos".
**Texto na tela:** "Dois caminhos de baixa: webhook (na hora) + sincronização a cada 5 min"
**Narração:**
Quando o cliente paga, a baixa acontece por dois caminhos. O principal é o webhook: o Mercado Pago avisa a plataforma no momento em que o status muda. Por segurança, a plataforma não confia só no aviso: ela confere o status diretamente no Mercado Pago antes de dar baixa, e só aceita avisos assinados com a chave secreta da sua conta. O segundo caminho é a sincronização: a cada cinco minutos, a plataforma consulta os pagamentos pendentes. Se o aviso falhar por qualquer motivo, a sincronização pega. Resultado: ninguém precisa conferir extrato para dar baixa. E, se algo falhar repetidamente — credencial recusada, pagamento que não sincroniza há horas, aviso com erro —, vira alerta operacional.

## Cena 5 — Boleto vencido, cancelamento e estorno (8:40–11:40)
**Visual:** SLIDE com três casos.
**Texto na tela:**
"Boleto vencido → marcado como vencido às 06:00 · PDF bloqueado · alerta ao consultor para reemitir · acompanhado por 10 dias"
"Cobrança cancelada ou paga manualmente → boleto cancelado no Mercado Pago"
"Estorno → registrado; cobrança segue paga; caso vai para revisão humana"
**Narração:**
Três situações especiais. Primeiro, o boleto vencido. O Mercado Pago devolve ao pagador um boleto pago depois do vencimento, então todo dia às seis da manhã a plataforma marca como vencidos os boletos e Pix cuja data passou, bloqueia o PDF para o cliente não pagar um boleto que vai ser devolvido e alerta o consultor para gerar um novo e enviar. Mas ela não cancela o boleto antigo na hora: um boleto pago no último dia pode levar até três dias úteis para compensar. Por isso, o boleto vencido continua sendo acompanhado por dez dias; se o pagamento cair, a cobrança é baixada e o boleto substituto é cancelado automaticamente. Segundo: se você cancelar a cobrança ou confirmar um pagamento manualmente, o boleto ativo é cancelado no Mercado Pago — e, se o Mercado Pago responder que ele já foi pago, o pagamento é registrado. Terceiro: estorno. Se um pagamento for estornado no Mercado Pago, ele aparece como estornado, a cobrança continua marcada como paga e o caso fica registrado para revisão humana.

## Cena 6 — Custos e configuração (11:40–12:40)
**Visual:** SLIDE.
**Texto na tela:** "Tarifas do meio de pagamento entram no custo variável (M3) · conta Mercado Pago configurada pelo admin · credenciais criptografadas"
**Narração:**
Lembre que o meio de pagamento cobra tarifas por transação, diferentes para Pix e boleto; elas entram no custo variável da sua conta do módulo 3. A conta do Mercado Pago é configurada pelo administrador, com as credenciais guardadas de forma criptografada. O passo a passo está no material de apoio, e voltamos a isso no módulo 11.

## Cena 7 — Resumo (12:40–13:00)
**Visual:** APRESENTADOR.
**Texto na tela:** "Pix (padrão) ou boleto · baixa automática (webhook + sync) · vencido: alerta e reemissão · estorno: revisão"
**Narração:**
Resumindo: Pix ou boleto, baixa automática por dois caminhos, boleto vencido tratado com alerta e reemissão, e estornos registrados. Na próxima aula, a régua de cobrança.

## Materiais da aula
- Resumo operacional do Mercado Pago (extraído de `MERCADO_PAGO.md`, seção 8).
- Exercício 3 do módulo.

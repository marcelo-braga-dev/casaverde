# M6 · Aula 6 — Laboratório: alocando uma usina entre quinze clientes

| Campo | Valor |
|-------|-------|
| Tipo | 🧪 laboratório |
| Duração alvo | 15 min (~1.550 palavras) |
| Objetivo | Ocupar a usina entre 90% e 98%, provocar e entender as duas travas de alocação e resolver o alerta crítico |
| Pré-requisito | M6 aula 5 |
| Referências | Plataforma: Unidades Consumidoras (vínculo) · Usinas Solar → Gestão de Energia / Geração Mensal · Relatórios → Alertas Operacionais (Escanear Agora) |

> Para agilizar, carregue o "checkpoint do M6" no laboratório (10 clientes adicionais com UC e proposta). Sem o checkpoint, cadastre manualmente clientes com consumo variado.

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Laboratório: encher a usina — e testar os limites"
**Narração:**
Agora você vai encher a usina. Vamos alocar quinze clientes, chegar perto de noventa e cinco por cento de ocupação e, depois, forçar as duas situações de risco que você estudou: tentar vender mais do que existe e ver a geração cair abaixo do que foi vendido.

## Cena 2 — O plano de ocupação (0:40–3:00)
**Visual:** TELA — planilha "Plano de ocupação": 15 clientes com cota; soma; % de ocupação; maior participação.
**Texto na tela:** "Meta: 90–98% · maior cliente < 25% (idealmente < 15%)"
**Narração:**
Antes de vincular, abra a planilha de plano de ocupação. Liste os quinze clientes — os cinco do módulo 5 e os dez do checkpoint — com a cota de cada um. Some e compare com a energia disponível da usina. O objetivo é ficar entre noventa e noventa e oito por cento. Confira também a maior participação: nenhum cliente deve passar de vinte e cinco por cento, e, idealmente, nem de quinze.

## Cena 3 — Vinculando os clientes (3:00–6:40)
**Visual:** TELA — vincular rapidamente 3 ou 4 UCs (acelerar a gravação); abrir Gestão de Energia ao final mostrando alocada ~95% e saldo.
**Texto na tela:** "Vincule e acompanhe o saldo na Gestão de Energia"
**Narração:**
Agora vincule os clientes, um por um, pela unidade consumidora de cada um, como na aula anterior. A cada vínculo, o saldo da usina diminui. Ao terminar, abra a Gestão de Energia: a sua usina deve estar perto de noventa e cinco por cento de ocupação, com um pequeno saldo. Anote esse saldo.

## Cena 4 — Trava 1: tentando vender o que não existe (6:40–8:40)
**Visual:** TELA — tentar vincular um 16º cliente com energia maior que o saldo; mostrar a mensagem "A energia solicitada excede o saldo disponível da usina."; refazer com energia igual ao saldo e mostrar sucesso; desfazer em seguida (encerrar o vínculo) para voltar a ~95%.
**Texto na tela:** "Trava 1: vínculo recusado acima do saldo"
**Narração:**
Agora, o primeiro teste. Imagine que um vendedor fechou um cliente grande e tenta vinculá-lo com uma cota maior do que o saldo. Tente. A plataforma recusa: a energia solicitada excede o saldo disponível da usina. É a trava que impede dois vendedores de venderem a mesma energia. O que fazer na vida real? Oferecer ao cliente a cota que cabe agora, alocar o restante em outra usina ou colocá-lo na fila. Faça o teste com a energia igual ao saldo e veja que funciona. Depois, encerre esse vínculo de teste para voltar ao plano.

## Cena 5 — Trava 2: a geração caiu (8:40–12:00)
**Visual:** TELA — Usinas Solar → Geração Mensal → novo mês com "Energia disponível para alocação" 15% abaixo da alocada; salvar; Relatórios → Alertas Operacionais → "Escanear Agora"; mostrar o alerta crítico de energia alocada acima da disponível; abrir o alerta.
**Texto na tela:** "Trava 2: disponível < alocada → alerta crítico (Escanear Agora)"
**Narração:**
Agora, o segundo teste. Imagine que a usina teve um problema e você decidiu, de forma conservadora, reduzir a energia disponível. Registre um novo mês de geração com a energia disponível uns quinze por cento abaixo da energia já alocada. Salve. Agora abra Relatórios, Alertas Operacionais, e clique em Escanear Agora — a varredura que a operação roda para checar a saúde das usinas. Aparece um alerta crítico: a energia alocada excede a disponível. Abra o alerta e veja os detalhes: a usina, quanto está alocado, quanto está disponível. Repare também no sino do cabeçalho, que passa a mostrar o alerta.

## Cena 6 — Resolvendo o alerta (12:00–13:50)
**Visual:** TELA — duas opções: (a) registrar novamente a geração com a disponível original (problema resolvido na usina) ou (b) reduzir cotas de alguns clientes / encerrar um vínculo; "Escanear Agora" de novo; alerta resolvido automaticamente.
**Texto na tela:** "Resolva a causa → nova varredura → o alerta se resolve sozinho"
**Narração:**
Como resolver? Depende da causa, como vimos na aula 4. Se a usina voltou a gerar normalmente, registre a disponibilidade correta. Se a queda é estrutural, reduza cotas ou mova clientes para outra usina. Para o laboratório, registre de novo a energia disponível original e clique em Escanear Agora. O alerta se resolve sozinho, porque a condição deixou de existir. Esse é um princípio dos alertas da plataforma: eles não são uma lista que só cresce; eles refletem a situação atual da operação.

## Cena 7 — Entregável e encerramento (13:50–15:00)
**Visual:** SLIDE com o entregável.
**Texto na tela:**
Entregável do M6:
- 15 clientes com contrato, vínculo e convite
- Ocupação entre 90% e 98% · maior cliente < 25%
- Planilha de rateio com percentuais
**Narração:**
Confira o entregável: quinze clientes com contrato, vínculo e convite, ocupação entre noventa e noventa e oito por cento, nenhum cliente acima de vinte e cinco por cento e a planilha de rateio pronta. A sua usina está cheia. No próximo módulo, chegam as primeiras faturas da distribuidora — e com elas, o dinheiro.

## Materiais da aula
- Planilha "Plano de ocupação"; roteiro escrito do laboratório.

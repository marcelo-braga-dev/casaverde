# M1 · Aula 8 — Laboratório: lendo uma fatura de concessionária na plataforma

| Campo | Valor |
|-------|-------|
| Tipo | 🧪 laboratório |
| Duração alvo | 12 min (~1.300 palavras) |
| Objetivo | Localizar na plataforma uma fatura da distribuidora, abrir o PDF e reconhecer os dados extraídos |
| Pré-requisito | M1 aulas 5–7 |
| Referências | Tela de fatura de concessionária (perfil Administrador ou Consultor) |

> Gravar com os dados-padrão do curso: cliente-exemplo "Padaria", fatura do mês mais recente.

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Laboratório: a fatura dentro da plataforma"
**Narração:**
Chegou a hora de juntar tudo o que vimos neste módulo. Vamos abrir uma fatura de distribuidora dentro da plataforma, ver o PDF original e entender os dados que o sistema extraiu dele. Neste módulo, o objetivo é só ler. Conferir e aprovar faturas é o assunto do módulo 7.

## Cena 2 — Encontrando a fatura (0:40–2:30)
**Visual:** TELA — perfil Administrador → menu Cliente Consumidor → Clientes → buscar "Padaria" → abrir o cliente → aba de faturas da concessionária → clicar na fatura mais recente. Mostrar também o atalho Financeiro → Faturas de Concessionárias.
**Texto na tela:** "Cliente Consumidor → Clientes → Padaria → Faturas"
**Narração:**
Entre como Administrador. No menu, abra Cliente Consumidor, depois Clientes, e procure a Padaria, um dos nossos clientes de exemplo. Na ficha do cliente, vá até as faturas da concessionária. Aqui ficam todas as contas de luz que a distribuidora emitiu para esse cliente e que chegaram à sua empresa, seja automaticamente por e-mail, seja por upload. Clique na fatura do mês mais recente. Outro caminho para chegar às faturas de todos os clientes de uma vez é o menu Financeiro, Faturas de Concessionárias.

## Cena 3 — O PDF original (2:30–4:30)
**Visual:** TELA — seção "PDF da Fatura de Concessionária"; abrir o PDF; dar zoom em: titular, número da instalação, classe/subgrupo, tipo de ligação, consumo, tarifa, tributos, bandeira, total.
**Texto na tela:** "Sempre confira com o PDF original"
**Narração:**
Primeiro, abra o PDF da fatura. É a conta original, do jeito que a distribuidora emitiu. Repare nos campos que estudamos: o nome do titular, o número da instalação — que é a identificação da unidade consumidora —, a classe e o subgrupo, o tipo de ligação, o consumo do mês em quilowatt-hora, os itens com tarifa, os tributos, a bandeira e o valor total. Cada distribuidora organiza o layout de um jeito, mas, depois desta aula, você sabe o que procurar em qualquer uma.

## Cena 4 — O resumo técnico extraído (4:30–7:30)
**Visual:** TELA — seção "Resumo Técnico" e "Campos Extraídos do PDF": Referência / Mês-Ano, Vencimento, Consumo kWh, Valor total, Unidade Consumidora, Número da instalação, Nome do titular; seção "Extração de Dados" com o status.
**Texto na tela:** "A plataforma lê o PDF e extrai os dados automaticamente"
**Narração:**
Agora volte para a tela da plataforma. Aqui está a mágica que economiza horas de trabalho: o sistema leu o PDF e extraiu os dados automaticamente. Veja o resumo técnico: referência, ou seja, o mês e o ano da conta; vencimento; consumo em quilowatt-hora; valor total da fatura; unidade consumidora e número da instalação; e o nome do titular. Compare cada um desses campos com o PDF. Eles devem bater. Também aparece o status da extração de dados, que diz se o sistema conseguiu ler tudo ou se algum campo ficou faltando ou inválido. Numa operação com centenas de clientes, ler fatura por fatura à mão é inviável. A extração automática é o que permite escalar — mas sempre com uma revisão humana, como você vai aprender no módulo 7.

## Cena 5 — Primeiro contato com energia injetada (7:30–9:40)
**Visual:** TELA — seção "Energia Injetada e Consumo Injetado"; passar o mouse sobre as linhas da fatura correspondentes e sobre "Valor da Fatura ao Cliente", sem explicar o cálculo em detalhe.
**Texto na tela:** "Energia injetada / consumo injetado = os créditos da GD na fatura (detalhes no M7)"
**Narração:**
Repare nesta seção: energia injetada e consumo injetado. São as linhas da fatura que mostram os créditos da geração distribuída que esse cliente recebeu e quanto do consumo dele foi compensado. É daqui que sai o valor que a sua empresa vai cobrar do cliente. Não se preocupe em entender o cálculo agora. Você ainda não viu as regras da compensação, que são o assunto do próximo módulo. Só registre: a fatura da distribuidora é a matéria-prima de toda a cobrança da sua empresa. Se a fatura for lida errado, a cobrança sai errada.

## Cena 6 — Exercício (9:40–11:30)
**Visual:** SLIDE com o exercício; depois TELA rápida mostrando a fatura da "Residência".
**Texto na tela:**
Exercício — fatura da Residência:
1. Referência e vencimento
2. Consumo (kWh) e tipo de ligação
3. Custo de disponibilidade (kWh)
4. Valor total
5. Tarifa com impostos aproximada (valor ÷ kWh)
**Narração:**
Agora faça sozinho. Abra a fatura mais recente do cliente Residência e anote: a referência e o vencimento; o consumo em quilowatt-hora e o tipo de ligação; qual é o custo de disponibilidade em quilowatt-hora para essa ligação; o valor total; e, dividindo o valor pelo consumo, uma estimativa da tarifa com impostos. Compare o resultado com a tarifa que calculamos na aula anterior. Por que eles não são iguais? Dica: lembre da iluminação pública, da bandeira e dos créditos.

## Cena 7 — Encerramento (11:30–12:00)
**Visual:** APRESENTADOR.
**Texto na tela:** "Etapa 1 concluída · Próximo: M2 — o marco legal da GD"
**Narração:**
Parabéns, você concluiu os fundamentos. Você já sabe o que é um quilowatt-hora, como uma usina gera energia, como a energia chega ao cliente, como a tarifa é formada e como ler uma conta de luz. Faça o quiz e o entregável do módulo — o raio-X de uma conta real. No próximo módulo, entramos nas regras do jogo: a Lei 14.300 e a geração distribuída.

## Materiais da aula
- Roteiro escrito do laboratório.
- Modelo "Raio-X da fatura" (entregável do módulo).

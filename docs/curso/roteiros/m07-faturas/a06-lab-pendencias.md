# M7 · Aula 6 — Laboratório: resolvendo pendências de fatura

| Campo | Valor |
|-------|-------|
| Tipo | 🧪 laboratório |
| Duração alvo | 13 min (~1.400 palavras) |
| Objetivo | Resolver as pendências mais comuns: UC ausente, duplicidade, valor/consumo inválido, cliente sem desconto |
| Pré-requisito | M7 aula 5 |
| Referências | Tela de fatura: Pendências, Correção Manual dos Dados, Status da revisão. PDFs "problemáticos" da pasta "Faturas M7" |

> Nota de produção: conferir, na gravação, os campos exatos da "Correção Manual dos Dados" (em especial a seleção de UC) e o local da regra de desconto na ficha do cliente; ajustar a narração se divergirem.

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR.
**Texto na tela:** "Laboratório: quando a fatura não vem redonda"
**Narração:**
Na vida real, uma parte das faturas vem com algum problema. Neste laboratório, você vai resolver as quatro pendências mais comuns, usando as faturas que ficaram para trás na aula anterior.

## Cena 2 — Pendência: fatura sem UC vinculada (0:40–3:40)
**Visual:** TELA — abrir a fatura da "Clínica — filial" com a pendência "Esta fatura não está vinculada a nenhuma Unidade Consumidora do cliente."; ir à ficha do cliente → aba UCs → cadastrar a UC com o número da instalação da fatura; voltar à fatura → Correção Manual dos Dados → selecionar a UC → salvar; marcar a pendência como resolvida.
**Texto na tela:** "Sem UC → cadastrar a UC (código + concessionária) → vincular na correção → resolver"
**Narração:**
Primeira pendência: a fatura não está vinculada a nenhuma unidade consumidora. A clínica abriu uma filial, a fatura dela chegou, mas a UC da filial não estava cadastrada. Resolva na origem: na ficha da clínica, cadastre a nova unidade consumidora com o número da instalação que aparece na fatura. Volte à fatura, abra a correção manual dos dados, selecione a UC e salve. Marque a pendência como resolvida. E lembre: se essa UC vai receber créditos, ela precisa de vínculo com a usina e de entrar na lista de rateio.

## Cena 3 — Pendência: fatura duplicada (3:40–5:40)
**Visual:** TELA — fatura com "Já existe outra fatura para esta Unidade Consumidora e referência."; comparar com a existente; rejeitar a duplicata (status rejeitada) com observação; ou excluir.
**Texto na tela:** "Duplicada → comparar → rejeitar (com observação)"
**Narração:**
Segunda: fatura duplicada. Aconteceu porque a mesma fatura chegou por e-mail e também foi enviada pelo cliente no WhatsApp. Compare com a fatura existente — mesma unidade, mesma referência, mesmos valores. Se for igual, rejeite a duplicata, com uma observação. Se for uma refaturação da distribuidora, com valores diferentes, a análise é outra: descubra qual é a válida antes de decidir, e, se a cobrança da original já tiver sido gerada, ajuste a cobrança, como você vai ver no módulo 8.

## Cena 4 — Pendência: valor ou consumo inválido (5:40–8:40)
**Visual:** TELA — fatura com layout diferente (leitura parcial): pendências "O valor total da fatura é inválido." e "O consumo em kWh está ausente ou inválido."; abrir o PDF; Correção Manual dos Dados: preencher Valor total, Consumo kWh, Consumo Injetado (kWh e R$), Energia Injetada; tentar salvar com valor vazio → bloqueio; preencher e salvar; status "corrigida".
**Texto na tela:** "Leitura incompleta → correção manual a partir do PDF → status 'corrigida' · valor vazio é bloqueado"
**Narração:**
Terceira: valor ou consumo inválido. Isso acontece quando o PDF tem um layout que o leitor automático não reconhece por completo, por exemplo de outra distribuidora, ou uma segunda via com formato diferente. Abra o PDF e use a correção manual: preencha o valor total, o consumo, a energia injetada e o consumo injetado, em quilowatts-hora e em reais, copiando da fatura. Repare que a plataforma não deixa salvar a revisão sem um valor total válido — uma trava que evita cobranças erradas. Salve: o status da revisão fica como corrigida, e a correção fica registrada. Justifique nas observações.

## Cena 5 — Pendência: cliente sem regra de desconto (8:40–10:40)
**Visual:** TELA — pendência "O cliente não possui regra de desconto ativa."; ficha do cliente → aba Desconto/Margens → criar regra ativa (20%); voltar à fatura; conferir margem de desconto; resolver.
**Texto na tela:** "Sem desconto ativo → criar a regra na ficha do cliente → conferir a margem na fatura"
**Narração:**
Quarta: o cliente não tem regra de desconto ativa. Sem ela, a fatura não sabe que margem aplicar. Vá à ficha do cliente, na parte de desconto, e crie uma regra ativa com o percentual do contrato. Volte à fatura e confira que a margem de desconto apareceu. Resolva a pendência.

## Cena 6 — Alertas e encerramento (10:40–13:00)
**Visual:** TELA — Relatórios → Alertas Operacionais filtrando o módulo "fatura"; depois SLIDE com o entregável.
**Texto na tela:** "Entregável do M7: mês 1 aprovado · 3+ pendências resolvidas com justificativa"
**Narração:**
Antes de terminar, abra os Alertas Operacionais e filtre pelo módulo de faturas. É aqui que aparecem os problemas de importação, como senha de PDF errada ou fatura ilegível, e as faturas paradas em revisão há mais de três dias. Agora aprove as faturas que você corrigiu. O entregável do módulo é o primeiro ciclo de faturas: todas as faturas do mês um aprovadas e pelo menos três pendências resolvidas, com justificativa. No próximo módulo, essas faturas viram dinheiro: cobrança, Pix e boleto.

## Materiais da aula
- PDFs problemáticos da pasta "Faturas M7"; roteiro escrito do laboratório.

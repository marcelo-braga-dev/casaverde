# M7 — Faturas e compensação · Plano do módulo

**Etapa 3 — Operação ponta a ponta** · 6 aulas · ~1h15 de vídeo + 2 h de prática

> Faturas de concessionária são telas **exclusivas do Administrador** na plataforma. O leitor automático de PDF reconhece hoje o layout da distribuidora de referência do curso; faturas de outros layouts entram com pendência e são completadas na correção manual (ver `08-decisoes-pendentes.md`, item sobre cobertura de distribuidoras).

## Objetivos
- Ler as linhas de compensação de uma fatura (energia injetada/compensada, bandeira, saldo de créditos).
- Diagnosticar quando os créditos não batem com o rateio esperado.
- Configurar a importação automática por e-mail (caixa por cliente, senha do PDF, filtro de remetente).
- Revisar uma fatura com critério: dados extraídos, pendências, margem de desconto, usina vinculada.
- Importar, revisar, corrigir e aprovar faturas na plataforma, resolvendo pendências.

## Aulas
| # | Aula | Tipo | Duração |
|---|------|------|---------|
| 1 | Anatomia da fatura com compensação | 🎥 | 13 min |
| 2 | Créditos, saldo e quando a conta não fecha | 🎥 | 12 min |
| 3 | Importação automática por e-mail | 🎥 | 11 min |
| 4 | Revisão de fatura: o que conferir | 🎥 | 12 min |
| 5 | Upload, revisão e aprovação de faturas | 🧪 | 15 min |
| 6 | Resolvendo pendências de fatura | 🧪 | 13 min |

## Entregável do módulo
**Primeiro ciclo de faturas**: faturas de 1 mês dos 15 clientes importadas (PDFs fictícios do curso), revisadas e aprovadas; registro de pelo menos 3 pendências resolvidas (UC ausente, fatura duplicada, dado corrigido manualmente), com a justificativa nas observações da revisão.

## Exercícios
1. A fatura mostra 2.400 kWh de energia compensada e o rateio previa 4% de uma usina que gerou 58.000 kWh. Bate? (R: 4% × 58.000 = 2.320; diferença de 80 kWh — investigar saldo anterior/leitura.)
2. A fatura veio sem nenhuma linha de energia injetada. Liste três causas possíveis. (R: rateio não aplicado/protocolo pendente; UC errada na lista; troca de titularidade; ciclo de leitura anterior ao início.)
3. Valor do consumo injetado R$ 2.119,00 e margem de desconto 20%: valor ao cliente? (R: R$ 1.695,20)

## Quiz (6 questões)
1. Na fatura, as linhas de energia injetada/compensada costumam aparecer com valores: **(a) negativos (créditos)** (b) positivos (c) em branco (d) só em kWh.
2. Se o cliente recebeu mais créditos do que consumiu, o excedente: (a) é perdido na hora **(b) fica como saldo por até 60 meses** (c) volta para a usina (d) vira dinheiro.
3. A cobrança da plataforma incide sobre: (a) o valor total da fatura **(b) o consumo injetado (compensado) da fatura, com o desconto** (c) a tarifa cheia (d) o saldo de créditos.
4. A senha de PDF das faturas costuma ser cadastrada: **(a) na integração do cliente (senha para desbloquear PDF)** (b) no navegador (c) na distribuidora (d) não é possível.
5. Pendência "duplicate_reference" significa: (a) PDF ilegível **(b) já existe outra fatura para a mesma UC e referência** (c) cliente sem desconto (d) usina errada.
6. Uma fatura com valor total vazio ou zero pode ser aprovada? (a) Sim **(b) Não, a revisão exige valor válido** (c) Só pelo consultor (d) Só no fim do mês.

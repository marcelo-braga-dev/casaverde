# M9 · Aula 2 — Alertas operacionais

| Campo | Valor |
|-------|-------|
| Tipo | 🎥 expositiva |
| Duração alvo | 12 min (~1.550 palavras) |
| Objetivo | Usar os alertas como fila de trabalho: módulos, severidade, responsáveis, autorresolução e "ignorar" |
| Pré-requisito | M9 aula 1 |
| Referências | Plataforma: Relatórios → Alertas Operacionais; sino do cabeçalho; varredura de saúde operacional |

## Cena 1 — Abertura (0:00–0:40)
**Visual:** APRESENTADOR apontando para um sino.
**Texto na tela:** "Falha que vira alerta não vira prejuízo"
**Narração:**
Numa operação com centenas de clientes, muita coisa pode dar errado sem ninguém perceber: uma caixa de e-mail para de funcionar, uma fatura fica parada na revisão, um pagamento não sincroniza. A plataforma foi construída com um princípio: toda falha que ameaça o faturamento vira um alerta, e não só uma linha num arquivo de log. Nesta aula, você aprende a trabalhar com eles.

## Cena 2 — De onde vêm os alertas (0:40–4:40)
**Visual:** SLIDE com quatro grupos.
**Texto na tela:**
"Faturas: caixa de e-mail inacessível · senha de PDF inválida · fatura ilegível · falha ao gravar · rotina falhando · fatura em revisão há 3 dias"
"Financeiro: Mercado Pago recusou emitir · credencial recusada · pagamento sem sincronizar · webhook falhando · rascunho há 2 dias · vencendo em 5 dias sem boleto/Pix · lembretes · boleto vencido"
"Usinas: sem geração no mês · energia zerada · alocada > disponível · saldo baixo · consumo acima da cota"
"Sistema: tarefa agendada falhou · tarefa em fila esgotou tentativas · conta Mercado Pago ausente · webhook sem chave secreta"
**Narração:**
Os alertas vêm de quatro grupos. Faturas: problemas na importação por e-mail — caixa inacessível, senha de PDF errada, fatura ilegível, falha ao gravar — e faturas paradas em revisão há três dias. Financeiro: o Mercado Pago recusou emitir um pagamento, a credencial foi recusada, um pagamento não sincroniza há horas, os avisos de pagamento estão falhando, cobranças em rascunho há dois dias, cobranças vencendo em cinco dias sem Pix ou boleto, e os lembretes da régua. Usinas: sem geração registrada no mês, sem energia disponível, energia alocada maior que a disponível, saldo baixo e cliente consumindo acima da cota. E sistema: uma tarefa automática que falhou, uma conta de pagamento ausente ou sem a chave de segurança dos avisos.

## Cena 3 — Severidade e prioridade (4:40–6:40)
**Visual:** SLIDE com três níveis de cor.
**Texto na tela:** "Crítico: trate hoje (ameaça receita/clientes) · Aviso: trate na semana · Informativo: acompanhe"
**Narração:**
Cada alerta tem uma severidade. Os críticos ameaçam a receita ou os clientes agora — credencial do Mercado Pago recusada, energia alocada acima da disponível, rotina de importação parada: trate no mesmo dia. Os avisos pedem ação, mas não são urgentes. E os informativos servem para acompanhar. Na fila diária, a ordem é: críticos, depois o que tem data — como cobranças perto do vencimento —, depois o resto.

## Cena 4 — Um alerta por problema, e ele se resolve sozinho (6:40–9:00)
**Visual:** ANIMAÇÃO: o mesmo problema acontece 3 vezes → um único alerta com contador renovado; a causa some → varredura → alerta resolvido.
**Texto na tela:** "Único por módulo + tipo + registro · renovado se repetir · resolvido automaticamente quando a causa some"
**Narração:**
Duas características deixam os alertas úteis em vez de barulhentos. Primeiro, cada problema gera um único alerta — por módulo, tipo e registro. Se a mesma caixa de e-mail falha dez vezes, você vê um alerta, renovado, e não dez. Segundo, o alerta se resolve sozinho quando a causa desaparece: a caixa voltou a funcionar, a fatura foi revisada, a geração foi registrada. Você não precisa ficar limpando a lista: ela mostra a situação real. Você também pode marcar um alerta como resolvido manualmente, ou como ignorado, quando ele não se aplica — por exemplo, uma usina em manutenção programada —, e a varredura respeita essa decisão.

## Cena 5 — Quem vê o quê (9:00–10:40)
**Visual:** SLIDE.
**Texto na tela:** "Admin: todos os alertas · Consultor: só alertas financeiros da própria carteira (com link de WhatsApp pronto)"
**Narração:**
O administrador vê todos os alertas. O consultor vê apenas os alertas financeiros da própria carteira — lembretes, cobranças sem boleto, boletos vencidos —, muitas vezes já com o link do WhatsApp e a mensagem pronta. Ele não vê alertas de faturas nem de sistema, que são responsabilidade da operação. Assim, cada pessoa tem a própria fila, sem ruído.

## Cena 6 — Resumo (10:40–12:00)
**Visual:** APRESENTADOR.
**Texto na tela:** "4 grupos · severidade define a ordem · 1 alerta por problema · resolve sozinho · cada perfil vê a sua fila"
**Narração:**
Resumindo: os alertas cobrem faturas, financeiro, usinas e sistema; a severidade define a ordem; cada problema gera um alerta único que se resolve sozinho; e cada perfil vê a sua fila. A meta diária é simples: sino sem críticos. Na próxima aula, a saúde das usinas.

## Materiais da aula
- Tabela de alertas: tipo, severidade, causa provável e ação.
- Exercício 2 do módulo.

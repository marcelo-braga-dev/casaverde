# 08 — Decisões pendentes

Decisões a tomar antes de produzir e gravar. Cada uma indica a recomendação e o que muda conforme a resposta.

## Produto e oferta

| # | Decisão | Recomendação | Impacto |
|---|---------|-------------|---------|
| 1 | Nome do curso | "Empresa de Assinatura de Energia Solar — do zero à operação" | Página de vendas, certificado, vinhetas |
| 2 | Nome da plataforma nas aulas | "GD Solar ERP" (marca da demonstração) | Narração e gravações de tela; Identidade Visual da instância de laboratório |
| 3 | Planos e preços | Essencial e Profissional + in-company (ver `01-proposta-e-oferta.md`), validados em 10–15 entrevistas | Escopo de suporte e correção |
| 4 | Instrutor / apresentador | Pessoa real com experiência de operação no M0, M3, M12 e ao vivo; IA de vídeo/avatar nas demais | Credibilidade; custo de produção |
| 5 | Uso do caso real (operação que usa a plataforma) | Só de forma anônima, salvo autorização escrita | Prova social |
| 6 | Plataforma de curso | Escolher uma com quizzes, certificado e comunidade (ou comunidade separada) | Entrega e avaliação |

## Laboratório e plataforma (desenvolvimento)

| # | Decisão | Recomendação | Impacto |
|---|---------|-------------|---------|
| 7 | Arquitetura do laboratório | `LAB_MODE` com uma empresa (banco) por aluno e troca de perfil; piloto pode usar instância por turma com aluno = consultor | Todos os laboratórios; custo de infraestrutura |
| 8 | Pagamento simulado e "avançar o tempo" | Desenvolver (itens 6 e 7 do backlog) antes do piloto | M8 aulas 5–7, M9 aula 5 |
| 9 | **Cobertura de distribuidoras do leitor de faturas** | Hoje o leitor automático reconhece o layout da distribuidora de referência; alunos de outros estados terão faturas lidas parcialmente (correção manual). Priorizar leitores para as maiores distribuidoras do público do curso | Valor percebido pelo aluno fora da área de referência; argumento de venda da plataforma |
| 10 | **Extrato de repasse ao produtor** | Hoje o repasse é calculado fora da plataforma (M10 aula 3). Desenvolver extrato automático por usina/mês (também item 13 do `LANCAMENTO.md`) | M9 aula 5, M10 aula 3, portal do produtor |
| 11 | **"Pagamento Anual Líquido" da proposta de produtor** | Hoje desconta só a taxa de administração; o mensal previsto × 12 desconta também o desconto do cliente. Decidir se o líquido deve passar a considerar o desconto do cliente (recomendado) ou renomear o campo | M4 aula 3 (o roteiro já explica a diferença) |
| 12 | Cockpit executivo e Kanban de produtores fora do menu | Incluir no menu do administrador antes de gravar M4 aula 4 e M10 aula 4 | Gravações de tela |
| 13 | PDF de proposta moderno fora do `DEMO_MODE` | Usar o modelo novo também no laboratório (e avaliar em produção) | M5 aula 6, M4 aula 5 |
| 14 | Caixa de e-mails do laboratório | Desenvolver (item 5 do backlog) | M6 aula 5, M8 aulas 5 e 7 |

## Conteúdo regulatório, jurídico e tributário

| # | Decisão | Recomendação |
|---|---------|-------------|
| 15 | Revisores | Contratar advogado regulatório de energia e contador especializado para revisar todos os itens [CONFERIR] antes da gravação |
| 16 | Distribuidora de exemplo | Usar números ilustrativos (tarifa R$ 0,80, Fio B R$ 0,20) nas aulas e ensinar a obter os reais; não vincular o curso a uma distribuidora |
| 17 | Modelos de contrato | Entregar só checklists e modelos marcados "a validar com advogado" — não vender contrato pronto (responsabilidade) |
| 18 | Política de atualização | Revisão semestral (abril e outubro) com aula de atualização no M2 |

## Próximos passos sugeridos

1. Decidir 1–6 e 15 (1 semana).
2. Especificar e desenvolver o `LAB_MODE` (itens 7, 8, 12–14) e os dados do laboratório (`06-materiais-de-apoio.md`).
3. Revisão técnica dos roteiros M2, M3, M6 e M11.
4. Produzir a calculadora do curso (é também a isca de captação).
5. Gravar M0–M3 e abrir a pré-venda da turma piloto.

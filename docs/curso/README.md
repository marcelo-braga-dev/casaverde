# Curso de Geração Distribuída na Prática — plano completo

> Planejamento do curso vendido à parte, que usa esta plataforma (GD Solar ERP) como laboratório prático.
> Criado em 2026-10-29. Documento vivo: atualize ao fechar decisões (ver `08-decisoes-pendentes.md`).

## A ideia em uma frase

Formar empreendedores para **montar e operar uma empresa de assinatura de energia por geração distribuída compartilhada** — do marco legal ao Pix do cliente — fazendo cada etapa de verdade numa plataforma real, com dados fictícios, durante as aulas.

## Por que este curso é diferente

A maioria dos cursos de GD/energia solar ensina **instalação** (dimensionar sistema, homologar, montar painel) ou **teoria regulatória** em slides. Quase nenhum ensina a **operação do negócio de GD compartilhada**: captar usinas, vender cotas, alocar energia sem vender o que não existe, ler a fatura de compensação, cobrar, receber, medir margem e reter cliente. É exatamente o que esta plataforma faz — e o aluno sai do curso sabendo operar o ciclo inteiro, não só entendendo.

## Mapa dos documentos

| Arquivo | Conteúdo |
|---------|----------|
| `01-proposta-e-oferta.md` | Nome, promessa, público, diferenciais, formato, oferta, preço e lançamento |
| `02-grade-curricular.md` | As 4 etapas, os 13 módulos e as 76 aulas, carga horária e cronograma da turma |
| `roteiros/mXX-*/00-plano.md` | Plano de cada módulo: objetivos, aulas, entregável, exercícios e quiz com gabarito |
| `roteiros/mXX-*/aYY-*.md` | **Roteiro completo de cada aula** (cenas com visual, texto na tela e narração palavra por palavra), pronto para IA de vídeo — formato em `05-producao-e-cronograma.md` |
| `03-ambiente-de-laboratorio.md` | Como o aluno usa a plataforma: instâncias, perfis, dados, reset, Mercado Pago sandbox, e-mails e o que precisa ser desenvolvido (`LAB_MODE`) |
| `04-avaliacao-e-certificacao.md` | Quizzes, entregáveis, projeto final, rubricas e certificado |
| `05-producao-e-cronograma.md` | Roteiro-padrão de aula, gravação, equipe, cronograma de produção e manutenção do conteúdo |
| `06-materiais-de-apoio.md` | Planilhas, modelos de contrato, checklists, SOPs e dados de exemplo a produzir |
| `07-glossario.md` | Termos do setor elétrico e da plataforma, para alunos e para padronizar a gravação |
| `08-decisoes-pendentes.md` | O que precisa ser decidido antes de produzir e gravar (inclui melhorias da plataforma) |
| `slides/mXX-*/aYY-*.pptx` | **Slides 16:9 de cada aula** (capa + 1 slide por cena, numerados como no roteiro; narração nas anotações). Regerar: `NODE_PATH=<node_modules com pptxgenjs> node slides/gerar-slides.cjs [m01]` |
| `09-alcance-vendas-e-sucesso-do-aluno.md` | Posicionamento, escada de produtos, canais, oferta, sucesso do aluno, métricas e lançamento |

## Números do curso (proposta)

| Item | Valor |
|------|-------|
| Público | Empreendedores: quem vai abrir uma empresa de assinatura de energia e empresas solares que querem vender assinaturas |
| Etapas | 4: Fundamentos → Regulação e negócio → Operação ponta a ponta → Gestão e estratégia |
| Módulos | 13 (M0 a M12), sendo o M12 o projeto final |
| Aulas | 76 roteiros completos (57 expositivas + 19 laboratórios), de 7 a 16 min (~16 h de vídeo) |
| Encontros ao vivo | 8 (quinzenais, 90 min) na turma com acompanhamento |
| Carga horária total certificada | 60 h |
| Duração recomendada | 10 semanas (turma) ou livre (autoestudo, acesso de 12 meses) |
| Projeto final | Montar e operar por 3 meses simulados uma operação de GD compartilhada com 2 usinas, 20+ clientes e relatório executivo |

## Princípios pedagógicos

1. **Fazer antes de decorar** — toda aula teórica termina num laboratório que usa aquilo na plataforma.
2. **Um caso contínuo** — o aluno constrói a mesma empresa fictícia do M0 ao M12 (a "sua" comercializadora), e cada módulo acrescenta uma peça.
3. **Números reais de mercado, dados fictícios** — tarifas, percentuais e regras são os do mercado; pessoas, CPFs, usinas e faturas são fictícios (padrão já usado na demonstração).
4. **Regulação com data** — toda afirmação regulatória traz a norma e a data de referência, e é revista a cada semestre (ver `05-producao-e-cronograma.md`).
5. **Do operador para o operador** — linguagem de quem roda a operação; o caso real que inspirou a plataforma é a prova de que funciona.

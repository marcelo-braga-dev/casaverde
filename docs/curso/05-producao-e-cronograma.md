# 05 — Produção, formato dos roteiros e cronograma

## Formato-padrão dos roteiros

Todo arquivo em `roteiros/mXX-*/aYY-*.md` segue esta estrutura, pensada para ser colada numa IA de vídeo (avatar/narração + slides) e para orientar a gravação de tela:

```markdown
# M2 · Aula 5 — Título da aula

| Campo | Valor |
|-------|-------|
| Tipo | 🎥 expositiva / 🧪 laboratório |
| Duração alvo | 10 min (~1.300 palavras de narração, 130 palavras/min) |
| Objetivo | O que o aluno sabe/faz ao final |
| Pré-requisito | Aulas anteriores necessárias |
| Referências | Normas e documentos citados (com data) |

## Cena 1 — Nome da cena (0:00–0:40)
**Visual:** o que aparece na tela (apresentador, slide, animação, gravação de tela).
**Texto na tela:** frases curtas que aparecem sobrepostas (títulos, números, listas).
**Narração:**
Texto falado, palavra por palavra.

…

## Materiais da aula
Arquivos, planilhas e links que acompanham a aula.
```

Tipos de visual usados nos roteiros:

| Marcação | Como produzir |
|----------|---------------|
| `APRESENTADOR` | Avatar/apresentador falando para a câmera (IA de vídeo ou gravação real) |
| `SLIDE` | Slide gerado a partir do "Texto na tela"; manter 1 ideia por slide, até 6 linhas |
| `ANIMAÇÃO` | Diagrama simples animado (setas, fluxos, barras); a descrição no roteiro é o briefing |
| `TELA` | **Gravação de tela da plataforma** — não pode ser gerada por IA. Gravar na instância de laboratório seguindo o passo a passo descrito, com a narração do roteiro (ou gravar a tela sem áudio e sobrepor a narração gerada) |
| `QUADRO` | Conta passo a passo (escrita à mão ou animada), para cálculos |

## Como usar os roteiros com uma IA de vídeo

1. **Uma aula por vez**: cole o arquivo inteiro da aula.
2. **Prompt de produção sugerido**:

   > Você vai produzir uma videoaula a partir do roteiro abaixo. Use a narração exatamente como está escrita, em português do Brasil, tom profissional, próximo e didático, ritmo de ~130 palavras por minuto. Para cada cena, gere o visual descrito em "Visual" e sobreponha o "Texto na tela". Cenas marcadas como TELA são gravações de tela que eu vou inserir: deixe um espaço com a duração indicada e mantenha a narração. Identidade visual: [cores/fontes/logo do curso]. Roteiro: [colar].

3. **Gravações de tela** (`TELA`): grave antes, na instância de laboratório com os dados-padrão do curso (`03-ambiente-de-laboratorio.md`), seguindo os passos da cena; resolução 1920×1080, zoom do navegador em 125%, cursor destacado, sem dados reais.
4. **Revisão técnica**: toda aula com números ou normas passa por revisão antes de publicar (ver "Manutenção do conteúdo").
5. **Legenda e transcrição**: a narração do roteiro já é a transcrição; publicar junto com a aula.

## Tom de voz

- Fala com o **empreendedor**: "a sua empresa", "o seu cliente", "a sua usina".
- Português claro, frases curtas, sem jargão sem explicação; todo termo técnico é explicado na primeira vez (ver `07-glossario.md`).
- Sempre um exemplo concreto com números.
- Sem promessas de ganho garantido. Números de mercado são **exemplos** e a narração diz isso.
- Nunca citar a marca da operação real sem autorização; a plataforma é chamada de **GD Solar ERP** (ou pelo nome definido em `08-decisoes-pendentes.md`).

## Regulação com data

Os roteiros citam normas com data de referência (**outubro de 2026**). Itens que mudam com frequência ou dependem de estado/distribuidora estão marcados no roteiro com **[CONFERIR]** e devem ser validados por especialista (advogado/consultor regulatório e contador) antes da gravação:

- percentuais e regras do Fio B a partir de 2029 (valoração em andamento na ANEEL);
- ICMS sobre energia compensada (varia por estado, Convênio ICMS 16/2015 e adesões);
- efeitos da reforma tributária (EC 132/2023, LC 214/2025) sobre energia a partir de 2027;
- procedimentos e prazos de cada distribuidora (cadastro de rateio, troca de titularidade).

## Equipe mínima

| Papel | Responsabilidade |
|-------|-----------------|
| Coordenador do curso | Dono do conteúdo, revisão final, encontros ao vivo |
| Especialista regulatório | Revisão de M2, M3, M6 e M11 (itens [CONFERIR]) |
| Contador com experiência em energia | Revisão de M11 aula 2 |
| Operador da plataforma | Grava as cenas TELA, mantém a instância de laboratório e os dados-padrão |
| Editor/produtor de vídeo | IA de vídeo, montagem, legendas, identidade visual |
| Suporte/monitor | Comunidade, dúvidas de laboratório, correção de entregáveis |

## Cronograma de produção (12 semanas)

| Semanas | Entregas |
|---------|----------|
| 1–2 | Fechar decisões (`08-decisoes-pendentes.md`); identidade visual do curso; desenvolver o `LAB_MODE` (ver `03-ambiente-de-laboratorio.md`) |
| 3 | Revisão técnica dos roteiros M0–M3; dados-padrão do laboratório prontos |
| 4–5 | Produção M0–M3 (vídeos + gravações de tela); planilha de unit economics |
| 6–7 | Revisão e produção M4–M7 |
| 8–9 | Revisão e produção M8–M11; materiais de apoio |
| 10 | M12, quizzes na plataforma de curso, certificado |
| 11 | Turma piloto (beta) com 20–30 alunos |
| 12 | Ajustes do piloto, página de vendas, lançamento |

## Manutenção do conteúdo

- **Semestral** (abril e outubro): revisar todos os itens [CONFERIR], tarifas de exemplo e prints da plataforma; publicar uma aula curta "Atualização regulatória — semestre/ano" no M2.
- **A cada versão relevante da plataforma**: regravar só as cenas TELA afetadas (os roteiros indicam a tela exata de cada cena).
- Registrar cada revisão no topo do roteiro: `Revisado em AAAA-MM por <nome>`.

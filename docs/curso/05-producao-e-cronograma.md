# 05 — Produção do curso

Como as aulas da **Formação em Energia por Assinatura** são produzidas: do roteiro ao vídeo publicado. Atualizado em 2026-11-05.

## Visão geral

```
roteiros/ ──► audio/narracao/ ──► audio/lotes/ ──► ElevenLabs ──► lotes/lote-NN/N.mp3 ─┐
    │                                                                                    ├─► publicar.cjs ──► publicacao/
    └──────► slides/gerar-slides.cjs ──► slides/aulas/ + slides/mXX-*.pptx ──────────────┘    (áudio, slides, transcrição,
                     ▲                                                                         vídeo MP4, legendas .srt)
     ferramentas/capturar-telas.cjs ──► slides/telas/*.jpg          audio/trilha.mp3 (fundo) ──┘
```

| Etapa | Entrada | Ferramenta | Saída | No git? |
|-------|---------|------------|-------|:------:|
| 1. Roteiro | — | edição manual | `roteiros/mXX-*/aYY-*.md` e `00-plano.md` (com quiz) | sim |
| 2. Narração enxuta | roteiros | edição manual | `audio/narracao/mXX.json` | sim |
| 3. Lotes de voz | narração | `audio/gerar-audio.cjs lotes` | `audio/lotes/lote-NN/*.txt` + `PLANO-DE-CREDITOS.md` | sim |
| 4. Voz | textos do lote | ElevenLabs (Studio ou API) | `audio/lotes/lote-NN/N.mp3` | sim |
| 5. Telas da plataforma | instância de demonstração | `ferramentas/capturar-telas.cjs` | `slides/telas/*.jpg` | sim |
| 6. Slides | roteiros, narração, telas | `slides/gerar-slides.cjs` | `slides/mXX-*.pptx` (por módulo) e `slides/aulas/mXX/aYY.pptx` + `aYY.json` (por aula, com a linha do tempo) | módulos sim; aulas não |
| 7. Publicação | MP3 dos lotes, slides por aula, trilha | `publicar.cjs` | `publicacao/<Módulo>/<Aula>/` | não |

## Formato enxuto (decisão de 2026-10-30)

Para reduzir o custo de voz em ~84% (de ~233 mil para ~37 mil caracteres), a voz explica o porquê e conecta as ideias, e o detalhe fica na tela:

- **Voz** (`audio/narracao/mXX.json`): 1 a 3 frases por cena. Resumos, encerramentos e demonstrações de tela não têm voz.
- **Slides**: listas, tabelas, números, contas e uma faixa explicativa por slide. Nos laboratórios, o passo a passo escrito (chave `passos` no JSON) com a tela real da plataforma.
- **Atividades**: o teste rápido de cada módulo (quiz de múltipla escolha com gabarito, do `00-plano.md`) fecha a última aula do módulo.

Os roteiros completos (`roteiros/`) continuam sendo a referência de conteúdo e a base de uma eventual versão estendida (`NARRACAO_COMPLETA=1`).

## Ferramentas e requisitos do servidor

| Requisito | Uso | Situação no servidor |
|-----------|-----|---------------------|
| Node 18+ | todos os geradores | instalado |
| `pptxgenjs`, `playwright-core` | slides e captura de telas | `cd docs/curso/ferramentas && npm ci` (cria `ferramentas/node_modules`, fora do git) |
| ffmpeg | junção de áudio, vídeo, trilha | instalado via apt (2026-10-30) |
| LibreOffice Impress + fontes Liberation/DejaVu | pptx → PDF para o vídeo | instalado via apt (2026-10-30) |
| pdftoppm (poppler-utils) | PDF → imagens 1920×1080 | instalado |
| Chrome headless | captura de telas | baixado pelo Playwright; precisa de `libasound2` (no servidor, extraída à parte e passada por `LD_LIBRARY_PATH`) |
| Conta ElevenLabs (plano pago) | voz | do produtor; chave só em `audio/.env.elevenlabs` (fora do git) |

## Passo a passo

### 1–2. Roteiro e narração
1. Edite o roteiro da aula (`roteiros/mXX-*/aYY-*.md`). O formato está em "Formato dos roteiros", no fim deste documento.
2. Ajuste a fala enxuta da cena em `audio/narracao/mXX.json` (`"aYY": { "N": "fala", "passos": { "N": "passo escrito" } }`). A cena `N` é a mesma do roteiro.
3. Palavra que a voz pode pronunciar mal (sigla, número, unidade) → regra em `audio/pronuncia.json`.

### 3–4. Voz por lotes de créditos
A produção é dividida em **lotes de ~8 mil créditos** (1 caractere = 1 crédito no `eleven_multilingual_v2`), na ordem do curso. O controle está em `audio/PLANO-DE-CREDITOS.md`; o guia completo, em `audio/README.md`.

1. `node docs/curso/audio/gerar-audio.cjs lotes` — refaz os textos e o plano (só depois de mudar a narração).
2. No **ElevenLabs Studio**, cole os arquivos `lotes/lote-NN/NN_*.txt` na ordem (um capítulo por arquivo; as pausas entre cenas já estão marcadas com `<break time="0.8s" />`). Pela API: `node --env-file=.env.elevenlabs gerar-audio.cjs gerar lote-NN`.
3. Baixe os MP3 e salve na pasta do lote com o número do texto: `1.mp3` = `01_….txt`, `2.mp3` = `02_….txt`…
4. Marque o lote como feito em `PLANO-DE-CREDITOS.md`.

Aula dividida entre dois lotes (arquivo com `_cenas-X-Y` no nome) só é publicada quando o segundo lote chega; o montador junta as partes sozinho.

### 5. Telas da plataforma
As telas são capturadas da instância de demonstração (`gdsolar.rexar.com.br`, com `DEMO_MODE=false` para permitir login por senha) com os dados do `MarketingDemoSeeder`. Lista de telas e perfis: `ferramentas/telas.json`.

```bash
cd docs/curso/ferramentas
LAB_SENHA=<senha das contas demo> CHROME=<chrome-headless-shell> node capturar-telas.cjs
```

Recapture quando uma tela da plataforma mudar. Os IDs de registro em `telas.json` (fatura 400, cobrança 395, propostas 13 e 47, UC 1) dependem do seeder: confira se continuam existindo após reseed.

### 6. Slides
```bash
NODE_PATH=docs/curso/ferramentas/node_modules node docs/curso/slides/gerar-slides.cjs        # tudo
NODE_PATH=docs/curso/ferramentas/node_modules node docs/curso/slides/gerar-slides.cjs m03    # um módulo
```

- **Identidade**: paleta do GD Solar (azul `1B3A6B`, laranja `F7A23B`, escuro `0B1F3A`, destaque `11396F`), fonte Arial, logo em `slides/assets/logo-gdsolar.png`, 16:9.
- **Regras de conteúdo**: slide pronto (sem texto pedindo edição ou instrução ao produtor), sem espaço para vídeo, compacto (cenas curtas viram cartões; item único vira destaque central; explicação longa ganha slide próprio).
- **Telas por aula**: mapa `TELAS_AULA` no gerador. Passo a passo com tela só nos laboratórios (título "Laboratório: …").
- **Saídas**: deck por módulo (para revisão e para o aluno baixar) e deck por aula com a linha do tempo `aYY.json` (que slide mostra quais cenas e o tipo do slide), usada pelo vídeo.

### 7. Publicação e vídeo
```bash
node docs/curso/publicar.cjs
```

Monta `docs/curso/publicacao/` (fora do git) com uma pasta por módulo e por aula, `Materiais/` e um `README.md` com o status de cada aula. Rode de novo a cada lote, a cada mudança de slides ou ao trocar a trilha: só o que mudou é refeito (~45 s por aula de vídeo).

| Arquivo da aula | Como é gerado |
|-----------------|---------------|
| `Aula NN - título - áudio.mp3` | MP3 dos lotes juntado quadro a quadro (sem recodificar), tags ID3 removidas |
| `… - slides.pptx` | cópia do deck da aula |
| `… - transcrição.txt` | a narração da aula |
| `… - vídeo.mp4` | 1920×1080, 25 fps, H.264 + AAC 160 kbps, `faststart` |
| `… - legendas.srt` | fala de cada cena em frases de até ~90 caracteres, distribuídas no tempo da cena |

**Como o vídeo é montado**
1. O deck da aula vira PDF (LibreOffice) e imagens 1920×1080 (pdftoppm).
2. O início de cada cena no MP3 é achado pelas pausas entre cenas (`silencedetect`, -38 dB, ≥0,35 s). Se as pausas não baterem com o número de cenas, o corte é proporcional ao tamanho do texto.
3. Cada slide narrado fica na tela pelo tempo das suas cenas. Slide sem voz ganha **tempo de leitura**: seção 5 s, capa 6 s, tela 8 s, teste rápido 20 s, gabarito 10 s, passo a passo até 45 s, resumo até 20 s, fechamento até 35 s (proporcional ao texto).
4. Clipes por slide com fade de entrada, unidos sem recodificar.
5. **Trilha de fundo** (`audio/trilha.mp3`, instrumental de uso livre): em loop, com fade de 2 s na entrada e 3 s na saída, volume `VOLUME_TRILHA` (padrão 0.08) e abaixada automaticamente sob a voz (sidechain). Medido: com voz, o volume é praticamente o da narração sozinha; nas pausas, a música fica ~9 dB abaixo do nível da voz.

| Variável | Efeito |
|----------|--------|
| `SEM_VIDEO=1` | só áudio, slides e transcrição |
| `SEM_TRILHA=1` | vídeos sem música |
| `VOLUME_TRILHA=0.05` | música mais discreta (0.12 = mais presente) |

### 8. Revisão antes de publicar
- [ ] Assistir à primeira e à última aula de cada módulo inteiras e um trecho das demais.
- [ ] Slide troca no momento certo da fala (se não trocar, a pausa entre cenas no MP3 ficou curta: regere o trecho no ElevenLabs).
- [ ] Siglas, números e valores em reais pronunciados corretamente.
- [ ] Legenda alinhada à fala; nenhum slide com texto cortado.
- [ ] Nenhum dado real, nenhuma marca de operação real ("Casa Verde" nunca aparece).
- [ ] Itens [CONFERIR] da aula revisados por especialista.
- [ ] Música não compete com a voz.

### 9. Envio para a plataforma de cursos
Para cada aula: suba o `vídeo.mp4`, anexe as `legendas.srt` (pt-BR), cole a `transcrição.txt` na descrição e ofereça os `slides.pptx` para download. O teste rápido do módulo (no `00-plano.md`) vira o quiz da plataforma de cursos, e `Materiais/` vai para a área de downloads.

## Situação da produção (2026-11-05)

| Item | Situação |
|------|----------|
| Roteiros | 76 aulas e 13 planos de módulo prontos |
| Narração enxuta | 37.307 caracteres, 5 lotes |
| Voz | lote 1 recebido (M00, M01 e cenas 1–6 de M02·A01); lotes 2–5 pendentes |
| Slides | 415 slides em 13 decks de módulo + 1 deck por aula; 28 telas capturadas |
| Vídeos | 12 de 76 publicados (M00 e M01; 47 s a 3min13s), com legendas e trilha |
| Materiais | calculadora do curso (`materiais/calculadora-do-curso.xlsx`) |

## Cronograma até o lançamento

| Fase | Entregas | Depende de |
|------|----------|-----------|
| Voz | Lotes 2 a 5 no ElevenLabs (~29 mil créditos) e `publicar.cjs` a cada lote | Compra de créditos |
| Revisão técnica | Itens [CONFERIR] de M2, M3, M6 e M11 por advogado regulatório e contador; ajustes regravam só as aulas afetadas | Contratação dos revisores (decisão 15) |
| Laboratório | `LAB_MODE` (empresa por aluno, troca de perfil, teste de 1 mês), pagamento simulado e "avançar o tempo" | Decisões 7 e 8 em `08-decisoes-pendentes.md` |
| Plataforma de cursos | Escolher a plataforma (decisão 6), subir vídeos, legendas, quizzes, materiais e certificado | Vídeos dos 13 módulos |
| Piloto | Turma beta de 20–30 alunos; colher dúvidas e ajustar roteiros/slides | Laboratório pronto |
| Lançamento | Página de vendas e campanha (`09-alcance-vendas-e-sucesso-do-aluno.md`) | Piloto concluído |

## Formato dos roteiros

Todo arquivo em `roteiros/mXX-*/aYY-*.md` segue esta estrutura:

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

## Materiais da aula
Arquivos, planilhas e links que acompanham a aula.
```

O gerador de slides lê esse formato: o título vem do `#`, cada `## Cena N` vira conteúdo de slide a partir do "Texto na tela" e do "Visual", e a narração completa vai nas anotações. Mantenha a numeração das cenas igual em roteiro, `narracao/mXX.json` e lotes.

| Marcação de visual | Como vira slide |
|--------------------|-----------------|
| `APRESENTADOR` | abertura da aula (não gera slide de conteúdo) |
| `SLIDE`, `ANIMAÇÃO`, `QUADRO` | slide de conteúdo (bloco, cartões ou tabela, conforme o texto) |
| `TELA` | nos laboratórios, passo a passo com a captura da tela; nas aulas teóricas, cartões |

## Tom de voz

- Fala com o **empreendedor**: "a sua empresa", "o seu cliente", "a sua usina".
- Português claro, frases curtas, sem jargão sem explicação; todo termo técnico é explicado na primeira vez (ver `07-glossario.md`).
- Sempre um exemplo concreto com números.
- Sem promessas de ganho garantido. Números de mercado são **exemplos** e a narração diz isso.
- Nunca citar a marca da operação real sem autorização; a plataforma é chamada de **GD Solar ERP**.
- O acesso de teste do aluno à plataforma (1 mês grátis, depois assinatura) **não entra** nas aulas por enquanto.

## Regulação com data

Os roteiros citam normas com data de referência (**outubro de 2026**). Itens que mudam com frequência ou dependem de estado/distribuidora estão marcados com **[CONFERIR]** e devem ser validados por especialista (advogado/consultor regulatório e contador) antes da publicação:

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
| Produtor (com o Claude Code) | Narração no ElevenLabs, geração de slides, capturas de tela e publicação |
| Suporte/monitor | Comunidade, dúvidas de laboratório, correção de entregáveis |

## Manutenção do conteúdo

| Quando | O que fazer | Comandos |
|--------|-------------|----------|
| Mudou o texto de uma cena | Editar `narracao/mXX.json`, regerar os lotes, gravar só a aula no ElevenLabs e substituir o MP3 | `gerar-audio.cjs lotes` → ElevenLabs → `publicar.cjs` |
| Mudou só o slide | Editar o roteiro (Texto na tela) ou o gerador | `gerar-slides.cjs mXX` → `publicar.cjs` |
| Mudou uma tela da plataforma | Recapturar e regerar os slides das aulas afetadas | `capturar-telas.cjs` → `gerar-slides.cjs` → `publicar.cjs` |
| Semestral (abril e outubro) | Revisar todos os [CONFERIR], tarifas de exemplo e telas; publicar uma aula curta "Atualização regulatória — semestre/ano" no M2 | — |

Registre cada revisão no topo do roteiro: `Revisado em AAAA-MM por <nome>`.

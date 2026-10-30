# Narração do curso com o ElevenLabs

Tudo o que é preciso para gerar a narração das 76 aulas da **Formação em Energia por Assinatura** com uma voz única e profissional.

| Item | Valor |
|------|-------|
| Conteúdo | 76 aulas · 463 cenas · ~233 mil caracteres |
| Duração estimada | ~4h20 de áudio |
| Saída | 1 MP3 por cena (`saida/mXX/aYY/cNN.mp3`) e 1 MP3 por aula (`saida/mXX/aYY.mp3`) |
| Origem do texto | Narração dos roteiros (`docs/curso/roteiros`), normalizada para fala |

## Estrutura

```
docs/curso/audio/
├── README.md                  este guia
├── gerar-audio.cjs            gerador (Node 18+, sem dependências)
├── pronuncia.json             dicionário de pronúncia (siglas, números, unidades)
├── .env.elevenlabs.example    modelo de configuração (copie para .env.elevenlabs)
├── PLANO-DE-CREDITOS.md       produção em 31 lotes de ~8 mil créditos, com controle do que já foi feito
├── lotes/lote-NN/             textos de cada lote, prontos para o ElevenLabs Studio (um arquivo por aula ou trecho)
└── saida/                     áudios gerados (fora do git)
```

A numeração das cenas é a mesma dos roteiros e dos slides (`M1 · Aula 6 · Cena 3` → `saida/m01-fundamentos/a06/c03.mp3`). Isso facilita sincronizar áudio, slides e vídeo na edição.

## Passo a passo

### 1. Conta e plano
1. Crie a conta em **elevenlabs.io**.
2. Assine um plano **pago**: o uso comercial do áudio (curso vendido) exige plano pago. Confira a licença e a cota de caracteres do plano na página de preços.
3. O curso inteiro consome cerca de **233 mil caracteres** por rodada completa. Reserve uma margem para testes e regerações (sugestão: 30%).

### 2. Escolha da voz
- **Voz pronta:** em *Voices → Voice Library*, filtre por **Portuguese (Brazil)** e por estilo *Narrative/Educational*. Teste com o mesmo trecho (o primeiro arquivo de `lotes/lote-03/`) em 3 ou 4 vozes antes de decidir.
- **Sua própria voz (clonagem):**
  - *Instant Voice Clone*: alguns minutos de áudio limpo, gravado em ambiente silencioso, num único microfone, lendo em tom de aula.
  - *Professional Voice Clone*: qualidade superior; exige bem mais áudio gravado (consulte o requisito atual no painel) e verificação de identidade.
- Escolhida a voz, copie o **Voice ID** (*Voices → … → Copy voice ID*).

Perfil de voz recomendado para o curso: **adulto, tom próximo e seguro, ritmo médio, sem entonação de locutor de propaganda** — um especialista explicando para um empreendedor.

### 3. Configuração
```bash
cd docs/curso/audio
cp .env.elevenlabs.example .env.elevenlabs
# edite .env.elevenlabs: ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID
```
A chave fica só nesse arquivo local (ignorado pelo git). Nunca a coloque em roteiros, commits ou mensagens.

### 4. Teste com uma aula
```bash
node --env-file=.env.elevenlabs gerar-audio.cjs vozes          # confere a chave e lista as vozes
node --env-file=.env.elevenlabs gerar-audio.cjs gerar m00/a01  # gera as cenas da aula de boas-vindas
```
Ouça os arquivos em `saida/m00-boas-vindas/a01/`. Ajuste voz e configurações (seção "Ajuste fino") até ficar como você quer — só então gere o restante.

### 5. Produção por lotes de créditos
A produção está dividida em **31 lotes de ~8 mil créditos**, na ordem do curso (`PLANO-DE-CREDITOS.md`). A cada recarga de créditos, gere os próximos lotes:
```bash
node gerar-audio.cjs status                                     # o que já foi gerado e quanto falta
node --env-file=.env.elevenlabs gerar-audio.cjs gerar lote-01   # gera um lote (~8 mil créditos)
node --env-file=.env.elevenlabs gerar-audio.cjs juntar m00      # junta as aulas completas do módulo
```
Aula dividida entre dois lotes só fica completa (e pode ser juntada) depois do segundo lote. Para mudar o tamanho dos lotes: `CREDITOS_POR_LOTE=10000 node gerar-audio.cjs lotes`.

### 5b. Produção de uma vez (se houver créditos para tudo)
```bash
node --env-file=.env.elevenlabs gerar-audio.cjs estimar        # caracteres que serão consumidos
node --env-file=.env.elevenlabs gerar-audio.cjs gerar          # todas as aulas (ou: gerar m01)
node --env-file=.env.elevenlabs gerar-audio.cjs juntar         # 1 MP3 por aula, com pausa entre cenas
```
- O gerador **não regera** o que já existe e não mudou (controle em `saida/manifesto.json`). Se a geração for interrompida, basta rodar de novo.
- Mudou um roteiro? Rode `gerar` de novo: só as cenas alteradas são refeitas. Para refazer à força: `gerar m01/a06 --forcar`.
- Cada cena é gerada com o final da cena anterior e o início da seguinte como contexto, para a entonação fluir entre cenas.
- O comando `juntar` precisa do **ffmpeg** instalado (ou `FFMPEG=/caminho/ffmpeg` no `.env.elevenlabs`).

### 6. Alternativa sem programação: ElevenLabs Studio
Os arquivos de `lotes/lote-NN/` já estão prontos para colar no **Studio**, na ordem do nome (um capítulo por arquivo; arquivos com "cenas X-Y" no nome continuam no lote seguinte). As pausas entre cenas estão marcadas com `<break time="0.8s" />`, que o ElevenLabs entende. Para atualizar os textos depois de editar roteiros: `node gerar-audio.cjs lotes` (lotes já gerados não são afetados: o gerador só refaz cenas cujo texto mudou).

## Ajuste fino da voz

| Variável | Padrão | Efeito |
|----------|--------|--------|
| `ELEVENLABS_STABILITY` | 0.5 | Mais alto = leitura mais uniforme; mais baixo = mais expressiva (e menos previsível) |
| `ELEVENLABS_SIMILARITY` | 0.75 | Fidelidade ao timbre da voz escolhida |
| `ELEVENLABS_STYLE` | 0.15 | Exagero de estilo; para aula, mantenha baixo (0–0.3) |
| `ELEVENLABS_SPEAKER_BOOST` | true | Realça a semelhança com a voz original |
| `ELEVENLABS_SPEED` | 1.0 | Velocidade (os roteiros foram escritos para ~130 palavras/min) |
| `PAUSA_ENTRE_CENAS` | 0.8 | Silêncio entre cenas no áudio da aula |

Problemas comuns: voz "cansada" ou monótona → baixe a estabilidade para 0.4; variações estranhas de tom → suba para 0.6; leitura apressada → velocidade 0.95.

## Pronúncia

Antes de enviar, o gerador reescreve o que soaria mal numa voz sintética, conforme `pronuncia.json`:

| No roteiro | Falado |
|------------|--------|
| Lei 14.300 | Lei catorze mil e trezentos |
| GD II, GD2 | gê dê dois |
| TUSD · TE · UC | tê u ésse dê · tê é · u cê |
| CNPJ · ICMS · PDF | cê ene pê jota · i cê ême ésse · pê dê éfe |
| 500 kWp · kWh | 500 quilowatts-pico · quilowatt-hora |
| ANEEL | Aneel |

Ouviu uma palavra errada? Acrescente uma regra em `pronuncia.json` (expressão regular → como deve ser falado) e regere só aquela aula com `--forcar`.

## Checklist de qualidade (por módulo)

- [ ] Ouvir a primeira e a última cena de cada aula e um trecho do meio.
- [ ] Conferir siglas, números e valores em reais.
- [ ] Volume consistente entre aulas (normalizar no editor de vídeo, alvo de -16 LUFS para vídeo online).
- [ ] Pausas naturais entre cenas, sem cortes no meio de palavras.
- [ ] Revisar de novo os trechos de regulação e tributos após qualquer atualização dos roteiros.

## Integração com vídeo e slides

- Cada `cNN.mp3` corresponde ao slide/cena de mesmo número. No editor, posicione o slide (`docs/curso/slides/mXX-….pptx`) e o áudio da cena lado a lado.
- Se a IA de vídeo usar áudio próprio, envie o MP3 da aula (`saida/mXX/aYY.mp3`) como trilha de voz.
- A narração também está nas anotações de cada slide.

# Plano de créditos — narração do curso

Gerado por `node gerar-audio.cjs lotes` (lotes de até 8.000 créditos, na ordem do curso; aula dividida entre lotes aparece com o trecho de cenas).
Modelo `eleven_multilingual_v2`: 1 caractere = 1 crédito. Total: **37.307 créditos** em **5 lotes**.

Como usar: gere os lotes em ordem, conforme os créditos disponíveis, e marque a coluna "Feito".
- Pela API: `node --env-file=.env.elevenlabs gerar-audio.cjs gerar lote-01`
- Pelo Studio: cole os arquivos de `lotes/lote-01/` (um capítulo por arquivo)
- Conferir o andamento: `node gerar-audio.cjs status`

Reserve ~10% a mais de créditos por lote para regravar trechos que precisem de ajuste.

| Lote | Aulas | Créditos | Acumulado | Feito |
|------|-------|---------:|----------:|:-----:|
| lote-01 | M00·A01, M00·A02, M00·A03, M00·A04, M01·A01, M01·A02, M01·A03, M01·A04, M01·A05, M01·A06, M01·A07, M01·A08, M02·A01 (cenas 1-6) | 7.979 | 7.979 | ☐ |
| lote-02 | M02·A01 (cena 7), M02·A02, M02·A03, M02·A04, M02·A05, M02·A06, M02·A07, M03·A01, M03·A02, M03·A03, M03·A04, M03·A05 (cenas 1-2) | 7.998 | 15.977 | ☐ |
| lote-03 | M03·A05 (cenas 3-6), M03·A06, M04·A01, M04·A02, M04·A03, M04·A04, M04·A05, M04·A06, M05·A01, M05·A02, M05·A03, M05·A04, M05·A05, M05·A06, M06·A01, M06·A02, M06·A03 (cenas 1-3) | 7.982 | 23.959 | ☐ |
| lote-04 | M06·A03 (cenas 4-5), M06·A04, M06·A05, M06·A06, M07·A01, M07·A02, M07·A03, M07·A04, M07·A05, M07·A06, M08·A01, M08·A02, M08·A03, M08·A04, M08·A05, M08·A06, M08·A07, M09·A01, M09·A02, M09·A03, M09·A04 (cenas 1-3) | 7.986 | 31.945 | ☐ |
| lote-05 | M09·A04 (cenas 4-5), M09·A05, M10·A01, M10·A02, M10·A03, M10·A04, M10·A05, M11·A01, M11·A02, M11·A03, M11·A04, M11·A05, M11·A06, M12·A01, M12·A02, M12·A03, M12·A04 | 5.362 | 37.307 | ☐ |

# Plano de créditos — narração do curso

Gerado por `node gerar-audio.cjs lotes` (lotes de até 8.000 créditos, na ordem do curso; aula dividida entre lotes aparece com o trecho de cenas).
Modelo `eleven_multilingual_v2`: 1 caractere = 1 crédito. Total: **233.017 créditos** em **31 lotes**.

Como usar: gere os lotes em ordem, conforme os créditos disponíveis, e marque a coluna "Feito".
- Pela API: `node --env-file=.env.elevenlabs gerar-audio.cjs gerar lote-01`
- Pelo Studio: cole os arquivos de `lotes/lote-01/` (um capítulo por arquivo)
- Conferir o andamento: `node gerar-audio.cjs status`

Reserve ~10% a mais de créditos por lote para regravar trechos que precisem de ajuste.

| Lote | Aulas | Créditos | Acumulado | Feito |
|------|-------|---------:|----------:|:-----:|
| lote-01 | M00·A01, M00·A02, M00·A03 (cenas 1-2) | 7.630 | 7.630 | ☐ |
| lote-02 | M00·A03 (cenas 3-7), M00·A04, M01·A01 (cenas 1-3) | 7.458 | 15.088 | ☐ |
| lote-03 | M01·A01 (cenas 4-7), M01·A02, M01·A03 (cenas 1-2) | 7.432 | 22.520 | ☐ |
| lote-04 | M01·A03 (cenas 3-6), M01·A04, M01·A05 (cenas 1-2) | 7.308 | 29.828 | ☐ |
| lote-05 | M01·A05 (cenas 3-6), M01·A06, M01·A07 (cenas 1-2) | 7.851 | 37.679 | ☐ |
| lote-06 | M01·A07 (cenas 3-6), M01·A08, M02·A01 (cenas 1-4) | 7.981 | 45.660 | ☐ |
| lote-07 | M02·A01 (cenas 5-7), M02·A02, M02·A03 (cenas 1-3) | 7.244 | 52.904 | ☐ |
| lote-08 | M02·A03 (cenas 4-7), M02·A04, M02·A05 (cenas 1-2) | 7.728 | 60.632 | ☐ |
| lote-09 | M02·A05 (cenas 3-7), M02·A06, M02·A07 (cenas 1-2) | 7.964 | 68.596 | ☐ |
| lote-10 | M02·A07 (cenas 3-6), M03·A01, M03·A02 (cenas 1-2) | 7.356 | 75.952 | ☐ |
| lote-11 | M03·A02 (cenas 3-7), M03·A03, M03·A04 (cenas 1-2) | 7.242 | 83.194 | ☐ |
| lote-12 | M03·A04 (cenas 3-9), M03·A05 (cenas 1-4) | 7.644 | 90.838 | ☐ |
| lote-13 | M03·A05 (cenas 5-7), M03·A06, M04·A01 (cenas 1-3) | 7.579 | 98.417 | ☐ |
| lote-14 | M04·A01 (cenas 4-6), M04·A02, M04·A03 (cenas 1-4) | 7.848 | 106.265 | ☐ |
| lote-15 | M04·A03 (cena 5), M04·A04, M04·A05, M04·A06 (cenas 1-2) | 7.175 | 113.440 | ☐ |
| lote-16 | M04·A06 (cenas 3-6), M05·A01, M05·A02 (cenas 1-4) | 7.830 | 121.270 | ☐ |
| lote-17 | M05·A02 (cenas 5-6), M05·A03, M05·A04, M05·A05 (cena 1) | 7.492 | 128.762 | ☐ |
| lote-18 | M05·A05 (cenas 2-6), M05·A06, M06·A01 (cenas 1-3) | 7.604 | 136.366 | ☐ |
| lote-19 | M06·A01 (cenas 4-6), M06·A02, M06·A03, M06·A04 (cenas 1-2) | 7.486 | 143.852 | ☐ |
| lote-20 | M06·A04 (cenas 3-7), M06·A05, M06·A06 (cenas 1-5) | 7.611 | 151.463 | ☐ |
| lote-21 | M06·A06 (cenas 6-7), M07·A01, M07·A02, M07·A03 (cena 1) | 7.380 | 158.843 | ☐ |
| lote-22 | M07·A03 (cenas 2-6), M07·A04, M07·A05 (cenas 1-6) | 7.831 | 166.674 | ☐ |
| lote-23 | M07·A05 (cena 7), M07·A06, M08·A01, M08·A02, M08·A03 (cena 1) | 7.965 | 174.639 | ☐ |
| lote-24 | M08·A03 (cenas 2-7), M08·A04, M08·A05 (cenas 1-4) | 7.750 | 182.389 | ☐ |
| lote-25 | M08·A05 (cenas 5-7), M08·A06, M08·A07, M09·A01 (cenas 1-5) | 7.991 | 190.380 | ☐ |
| lote-26 | M09·A01 (cena 6), M09·A02, M09·A03, M09·A04, M09·A05 (cenas 1-2) | 7.950 | 198.330 | ☐ |
| lote-27 | M09·A05 (cenas 3-6), M10·A01, M10·A02, M10·A03 (cenas 1-2) | 7.497 | 205.827 | ☐ |
| lote-28 | M10·A03 (cenas 3-5), M10·A04, M10·A05, M11·A01, M11·A02 (cena 1) | 7.858 | 213.685 | ☐ |
| lote-29 | M11·A02 (cenas 2-6), M11·A03, M11·A04 (cenas 1-5) | 7.787 | 221.472 | ☐ |
| lote-30 | M11·A04 (cena 6), M11·A05, M11·A06, M12·A01, M12·A02 (cenas 1-3) | 7.915 | 229.387 | ☐ |
| lote-31 | M12·A02 (cena 4), M12·A03, M12·A04 | 3.630 | 233.017 | ☐ |

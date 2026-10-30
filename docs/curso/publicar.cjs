#!/usr/bin/env node
// Monta a pasta final de publicação do curso (docs/curso/publicacao), aula a aula.
// Uso: node docs/curso/publicar.cjs        (rode de novo a cada lote de áudio recebido)
//
// Entrada: áudios em audio/lotes/lote-NN/ (N.mp3, NN.mp3 ou NN_*.mp3, na ordem dos textos NN_*.txt do lote),
//          slides por aula em slides/aulas/, narração em audio/narracao/, roteiros em roteiros/.
// Saída:   publicacao/<módulo>/<aula>/ com áudio, slides e transcrição, e publicacao/README.md com o status.
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const BASE = __dirname;
const LOTES = path.join(BASE, 'audio', 'lotes');
const OUT = path.join(BASE, 'publicacao');
const CURSO = 'Formação em Energia por Assinatura';

const seguro = (s) => s.replace(/[:/\\?*"<>|]/g, ' -').replace(/\s+/g, ' ').replace(/ - -/g, ' -').trim();
const dois = (n) => String(n).padStart(2, '0');

// ---------- MP3 ----------
const BR = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const SR = [44100, 48000, 32000];
function quadros(buf) {
    let p = 0;
    if (buf.slice(0, 3).toString() === 'ID3') p = 10 + (((buf[6] & 127) << 21) | ((buf[7] & 127) << 14) | ((buf[8] & 127) << 7) | (buf[9] & 127));
    let fim = buf.length;
    if (fim > 128 && buf.slice(fim - 128, fim - 125).toString() === 'TAG') fim -= 128;
    const inicio = p;
    let segundos = 0;
    while (p + 4 < fim) {
        if (buf[p] === 0xff && (buf[p + 1] & 0xe0) === 0xe0 && BR[buf[p + 2] >> 4]) {
            const sr = SR[(buf[p + 2] >> 2) & 3];
            segundos += 1152 / sr;
            p += Math.floor((144 * BR[buf[p + 2] >> 4] * 1000) / sr) + ((buf[p + 2] >> 1) & 1);
        } else p++;
    }
    return { dados: buf.slice(inicio, fim), segundos };
}
const duracao = (s) => `${Math.floor(s / 60)}min ${dois(Math.round(s % 60))}s`;

// ---------- catálogo ----------
function catalogo() {
    return fs.readdirSync(path.join(BASE, 'roteiros')).filter((d) => /^m\d\d-/.test(d)).sort().map((d) => {
        const plano = fs.readFileSync(path.join(BASE, 'roteiros', d, '00-plano.md'), 'utf8');
        const titulo = (plano.match(/^# M\d+ — (.+?) · Plano/m) || [])[1] || d;
        const narr = fs.existsSync(path.join(BASE, 'audio', 'narracao', `${d.slice(0, 3)}.json`))
            ? JSON.parse(fs.readFileSync(path.join(BASE, 'audio', 'narracao', `${d.slice(0, 3)}.json`), 'utf8')) : {};
        const aulas = fs.readdirSync(path.join(BASE, 'roteiros', d)).filter((f) => /^a\d\d-.*\.md$/.test(f)).sort().map((f) => {
            const md = fs.readFileSync(path.join(BASE, 'roteiros', d, f), 'utf8');
            const head = md.match(/^# (M\d+) · Aula (\d+) — (.+)$/m);
            const id = f.slice(0, 3);
            const falas = narr[id] || {};
            const cenas = Object.keys(falas).filter((k) => /^\d+$/.test(k)).map(Number).sort((x, y) => x - y);
            return { mod: d, id, num: Number(head[2]), titulo: head[3].replace(/^Laboratório: /, 'Laboratório - '), falas, cenas };
        });
        return { dir: d, codigo: d.slice(0, 3).toUpperCase(), titulo, aulas };
    });
}

// Partes de áudio recebidas: { 'm02/a01': [{ ini, fim, arquivo }] }
function partesRecebidas() {
    const partes = {};
    if (!fs.existsSync(LOTES)) return partes;
    for (const lote of fs.readdirSync(LOTES).filter((l) => /^lote-\d+$/.test(l)).sort()) {
        const dir = path.join(LOTES, lote);
        const arquivos = fs.readdirSync(dir);
        for (const txt of arquivos.filter((f) => /^\d+_m\d\d-a\d\d-.*\.txt$/.test(f))) {
            const n = Number(txt.match(/^(\d+)_/)[1]);
            const mp3 = arquivos.find((f) => new RegExp(`^0*${n}(_.*)?\\.mp3$`, 'i').test(f));
            if (!mp3) continue;
            const [, mod, id] = txt.match(/_(m\d\d)-(a\d\d)-/);
            const faixa = txt.match(/_cenas?-(\d+)(?:-(\d+))?\.txt$/);
            (partes[`${mod}/${id}`] ||= []).push({ ini: faixa ? Number(faixa[1]) : 0, fim: faixa ? Number(faixa[2] || faixa[1]) : 999, arquivo: path.join(dir, mp3), lote });
        }
    }
    return partes;
}

// ---------- montagem ----------
// ---------- vídeo (precisa de ffmpeg, LibreOffice e pdftoppm) ----------
const temVideo = ['ffmpeg', 'soffice', 'pdftoppm'].every((b) => spawnSync('which', [b]).status === 0) && process.env.SEM_VIDEO !== '1';
const FPS = 25;
const run = (bin, args) => execFileSync(bin, args, { stdio: ['ignore', 'ignore', 'pipe'], maxBuffer: 64 * 1024 * 1024 });

// Tempo de leitura (s) de slides sem narração.
function leitura(t) {
    const k = t.leitura || 0;
    return { secao: 5, capa: 6, tela: 8, quiz: 20, gabarito: 10, passos: Math.min(45, 8 + k / 13), resumo: Math.min(20, 6 + k / 14), fechamento: Math.min(35, 8 + k / 14) }[t.tipo] ?? Math.min(25, 4 + k / 14);
}

// Fronteiras entre cenas: as N-1 maiores pausas do áudio (o ElevenLabs insere ~0,8 s entre cenas).
function cortes(audio, falas, total) {
    const n = falas.length;
    if (n <= 1) return [0, total];
    const log = spawnSync('ffmpeg', ['-hide_banner', '-i', audio, '-af', 'silencedetect=noise=-38dB:d=0.35', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
    const sil = [...log.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)].map((m) => ({ ini: +m[1], fim: +m[2] }))
        .filter((x) => x.ini > 0.5 && x.fim < total - 0.5);
    if (sil.length >= n - 1) {
        const meios = sil.sort((x, y) => (y.fim - y.ini) - (x.fim - x.ini)).slice(0, n - 1).map((x) => (x.ini + x.fim) / 2).sort((x, y) => x - y);
        return [0, ...meios, total];
    }
    const pesos = falas.map((f) => f.length);
    const soma = pesos.reduce((t, v) => t + v, 0);
    let acc = 0;
    return [0, ...pesos.slice(0, -1).map((p) => (acc += (p / soma) * total)), total];
}

function srtTempo(s) {
    const ms = Math.round(s * 1000);
    const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000); const sec = Math.floor((ms % 60000) / 1000);
    return `${dois(h)}:${dois(m)}:${dois(sec)},${String(ms % 1000).padStart(3, '0')}`;
}

function gerarVideo(a, pasta, nome, audio) {
    const pptx = path.join(BASE, 'slides', 'aulas', a.mod, `${a.id}.pptx`);
    const tlFile = path.join(BASE, 'slides', 'aulas', a.mod, `${a.id}.json`);
    const video = path.join(pasta, `${nome} - vídeo.mp4`);
    if (!fs.existsSync(pptx) || !fs.existsSync(tlFile)) return false;
    const mais = Math.max(...[pptx, tlFile, audio].map((f) => fs.statSync(f).mtimeMs));
    if (fs.existsSync(video) && fs.statSync(video).mtimeMs > mais) return true;

    const tmp = path.join(OUT, '.render', `${a.mod}-${a.id}`);
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    run('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', tmp, pptx]);
    run('pdftoppm', ['-png', '-scale-to-x', '1920', '-scale-to-y', '1080', path.join(tmp, `${a.id}.pdf`), path.join(tmp, 's')]);
    const imagens = fs.readdirSync(tmp).filter((f) => /^s-\d+\.png$/.test(f)).sort((x, y) => parseInt(x.slice(2), 10) - parseInt(y.slice(2), 10));
    const tl = JSON.parse(fs.readFileSync(tlFile, 'utf8'));
    if (imagens.length !== tl.length) throw new Error(`slides renderizados (${imagens.length}) ≠ linha do tempo (${tl.length})`);

    // Cenas narradas → slide em que aparecem; cena sem slide fica no slide anterior (ou na abertura).
    const total = quadros(fs.readFileSync(audio)).segundos;
    const falas = a.cenas.map((c) => a.falas[String(c)]);
    const t = cortes(audio, falas, total);
    const abertura = Math.max(0, tl.findIndex((x) => x.tipo === 'secao'));
    const doSlide = tl.map(() => []);
    let ultimo = abertura;
    a.cenas.forEach((c, i) => {
        const idx = tl.findIndex((x) => x.cenas.includes(c));
        ultimo = idx >= 0 ? idx : ultimo;
        doSlide[ultimo].push(i);
    });

    const lista = [];
    const legendas = [];
    let relogio = 0;
    tl.forEach((slide, k) => {
        const clipe = path.join(tmp, `c${dois(k)}.mp4`);
        const img = path.join(tmp, imagens[k]);
        const cenas = doSlide[k];
        const v = ['-y', '-loop', '1', '-framerate', String(FPS), '-i', img];
        const enc = ['-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', String(FPS),
            '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-ac', '2'];
        let dur;
        if (cenas.length) {
            const ini = t[cenas[0]];
            const fim = t[cenas[cenas.length - 1] + 1];
            dur = fim - ini + 0.4;
            run('ffmpeg', [...v, '-ss', ini.toFixed(3), '-t', (fim - ini).toFixed(3), '-i', audio,
                '-filter_complex', `[1:a]apad=pad_dur=0.4,afade=t=in:d=0.05[a];[0:v]fade=t=in:d=0.25[v]`, '-map', '[v]', '-map', '[a]',
                '-t', dur.toFixed(3), ...enc, clipe]);
            cenas.forEach((i) => {
                // Legenda: texto da cena em blocos de ~90 caracteres, distribuídos no tempo da cena.
                const blocos = (falas[i].match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [falas[i]]).flatMap((f) => f.match(/.{1,90}(\s|$)/g) || [f]);
                const ci = relogio + (t[i] - ini);
                const cd = t[i + 1] - t[i];
                const soma = blocos.reduce((s2, b) => s2 + b.length, 0);
                let acc = 0;
                blocos.forEach((b) => {
                    const bi = ci + (acc / soma) * cd; acc += b.length;
                    legendas.push([bi, ci + (acc / soma) * cd, b.trim()]);
                });
            });
        } else {
            dur = leitura(slide);
            run('ffmpeg', [...v, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-filter_complex', '[0:v]fade=t=in:d=0.25[v]',
                '-map', '[v]', '-map', '1:a', '-t', dur.toFixed(3), ...enc, clipe]);
        }
        relogio += dur;
        lista.push(`file '${clipe}'`);
    });
    fs.writeFileSync(path.join(tmp, 'lista.txt'), lista.join('\n'));
    run('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'lista.txt'), '-c', 'copy', '-movflags', '+faststart', video]);
    fs.writeFileSync(path.join(pasta, `${nome} - legendas.srt`), legendas.map(([i, f, txt], n) => `${n + 1}\n${srtTempo(i)} --> ${srtTempo(f)}\n${txt}\n`).join('\n'));
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`  🎬 ${a.mod}/${a.id}: ${duracao(relogio)}`);
    return true;
}

function montar() {
    const cat = catalogo();
    const partes = partesRecebidas();
    fs.mkdirSync(OUT, { recursive: true });
    const linhas = [];
    let prontas = 0;
    let totalSeg = 0;

    for (const m of cat) {
        const pastaMod = path.join(OUT, seguro(`${m.codigo} - ${m.titulo}`));
        linhas.push(`\n## ${m.codigo} — ${m.titulo}\n\n| Aula | Status | Duração do áudio |\n|------|--------|-----------------:|`);
        for (const a of m.aulas) {
            const nome = seguro(`Aula ${dois(a.num)} - ${a.titulo}`);
            const pasta = path.join(pastaMod, nome);
            const recebidas = (partes[`${a.mod.slice(0, 3)}/${a.id}`] || []).sort((x, y) => x.ini - y.ini);
            const cobertas = new Set(recebidas.flatMap((p) => a.cenas.filter((c) => c >= p.ini && c <= p.fim)));
            const completa = a.cenas.length > 0 && a.cenas.every((c) => cobertas.has(c));
            let status;
            let dur = '';
            fs.mkdirSync(pasta, { recursive: true });
            // Slides e transcrição sempre; o áudio só quando todas as cenas narradas chegaram.
            const slides = path.join(BASE, 'slides', 'aulas', a.mod, `${a.id}.pptx`);
            if (fs.existsSync(slides)) fs.copyFileSync(slides, path.join(pasta, `${nome} - slides.pptx`));
            const transcricao = a.cenas.map((c) => a.falas[String(c)]).join('\n\n');
            fs.writeFileSync(path.join(pasta, `${nome} - transcrição.txt`), `${CURSO}\n${m.codigo} · ${nome}\n\n${transcricao}\n`);
            const destino = path.join(pasta, `${nome} - áudio.mp3`);
            if (completa) {
                const blocos = recebidas.map((p) => quadros(fs.readFileSync(p.arquivo)));
                fs.writeFileSync(destino, Buffer.concat(blocos.map((b) => b.dados)));
                const seg = blocos.reduce((t, b) => t + b.segundos, 0);
                totalSeg += seg;
                dur = duracao(seg);
                status = '✅ pronta';
                prontas++;
                if (temVideo) {
                    try {
                        const v = gerarVideo(a, pasta, nome, destino);
                        status += v ? ' · 🎬 vídeo' : '';
                    } catch (e) {
                        console.error(`  vídeo de ${a.mod}/${a.id} falhou: ${e.message.split('\n')[0]}`);
                        status += ' · vídeo com erro';
                    }
                }
            } else {
                if (fs.existsSync(destino)) fs.unlinkSync(destino);
                status = recebidas.length ? `◐ áudio parcial (falta${a.cenas.filter((c) => !cobertas.has(c)).length > 1 ? 'm as cenas' : ' a cena'} ${a.cenas.filter((c) => !cobertas.has(c)).join(', ')})` : '⏳ aguardando áudio';
            }
            linhas.push(`| ${dois(a.num)} · ${a.titulo} | ${status} | ${dur} |`);
        }
    }

    const calc = path.join(BASE, 'materiais', 'calculadora-do-curso.xlsx');
    if (fs.existsSync(calc)) {
        fs.mkdirSync(path.join(OUT, 'Materiais'), { recursive: true });
        fs.copyFileSync(calc, path.join(OUT, 'Materiais', 'Calculadora do curso.xlsx'));
    }
    const total = cat.reduce((t, m) => t + m.aulas.length, 0);
    fs.writeFileSync(path.join(OUT, 'README.md'), `# ${CURSO} — pasta de publicação

Gerada por \`node docs/curso/publicar.cjs\`. **${prontas} de ${total} aulas prontas** · ${duracao(totalSeg)} de áudio publicado.

Cada aula tem uma pasta com:
- **áudio** (MP3 da narração, 128 kbps) — só aparece quando a aula está completa;
- **slides** (.pptx 16:9; a primeira aula do módulo traz a capa, a última traz o teste rápido e o fechamento);
- **transcrição** (texto da narração, para acessibilidade e para a plataforma de cursos);
- **vídeo** (MP4 1920×1080: slides sincronizados com a narração, slides sem voz com tempo de leitura) e **legendas** (.srt) — gerados quando o servidor tem ffmpeg, LibreOffice e pdftoppm.

Materiais de apoio em \`Materiais/\`.
${linhas.join('\n')}
`);
    console.log(`${prontas}/${total} aulas prontas · ${duracao(totalSeg)} de áudio · ${OUT}`);
}

montar();

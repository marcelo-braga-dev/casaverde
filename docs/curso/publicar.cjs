#!/usr/bin/env node
// Monta a pasta final de publicação do curso (docs/curso/publicacao), aula a aula.
// Uso: node docs/curso/publicar.cjs        (rode de novo a cada lote de áudio recebido)
//
// Entrada: áudios em audio/lotes/lote-NN/ (N.mp3, NN.mp3 ou NN_*.mp3, na ordem dos textos NN_*.txt do lote),
//          slides por aula em slides/aulas/, narração em audio/narracao/, roteiros em roteiros/.
// Saída:   publicacao/<módulo>/<aula>/ com áudio, slides e transcrição, e publicacao/README.md com o status.
const fs = require('fs');
const path = require('path');

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
- **transcrição** (texto da narração, para acessibilidade e para a plataforma de cursos).

Materiais de apoio em \`Materiais/\`.
${linhas.join('\n')}
`);
    console.log(`${prontas}/${total} aulas prontas · ${duracao(totalSeg)} de áudio · ${OUT}`);
}

montar();

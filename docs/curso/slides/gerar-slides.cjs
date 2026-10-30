// Gera um .pptx (16:9) por aula a partir dos roteiros (docs/curso/roteiros).
// Uso: NODE_PATH=<pasta com node_modules/pptxgenjs> node gerar-slides.cjs [filtro-de-modulo, ex.: m01]
// Um slide por cena (mesma numeração do roteiro); a narração vai nas anotações do slide.
const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const CURSO = 'Formação em Energia por Assinatura';
const SUB = 'Geração distribuída compartilhada, da regulação à operação';
const ROOT = path.resolve(__dirname, '..', 'roteiros');
const OUT = __dirname;
const LOGO = path.join(__dirname, 'assets', 'logo-rexar.png');
const C = { verde: '1F7A4D', verdeClaro: 'E6F2EC', grafite: '2B2F33', sol: 'F5B700', fundo: 'F7F8F5', branco: 'FFFFFF', cinza: '6B7280' };
const F = 'Arial';
const filtro = process.argv[2] || '';

const clean = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').trim();
const unquote = (s) => clean(s).replace(/^["“]|["”]$/g, '').trim();

function parseAula(file) {
    const md = fs.readFileSync(file, 'utf8');
    const head = md.match(/^# (M\d+) · Aula (\d+) — (.+)$/m);
    const objetivo = (md.match(/^\| Objetivo \| (.+) \|$/m) || [])[1] || '';
    const lab = /\| Tipo \| 🧪/.test(md);
    const cenas = [];
    const re = /^## Cena (\d+) — (.+?) \(([^)]*)\)\s*$/gm;
    const marks = [...md.matchAll(re)];
    marks.forEach((m, i) => {
        const body = md.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : md.indexOf('\n## Materiais', m.index) > 0 ? md.indexOf('\n## Materiais', m.index) : md.length);
        const visual = clean((body.match(/\*\*Visual:\*\*([\s\S]*?)(?=\n\*\*Texto na tela:\*\*|\n\*\*Narração:\*\*)/) || [])[1] || '');
        const texto = ((body.match(/\*\*Texto na tela:\*\*([\s\S]*?)(?=\n\*\*Narração:\*\*)/) || [])[1] || '').trim();
        const narracao = clean((body.match(/\*\*Narração:\*\*([\s\S]*)$/) || [])[1] || '');
        const tipos = ['SLIDE', 'ANIMAÇÃO', 'QUADRO', 'TELA', 'APRESENTADOR']
            .map((t) => [t, visual.indexOf(t)]).filter(([, p]) => p >= 0).sort((a, b) => a[1] - b[1]);
        cenas.push({ n: m[1], nome: m[2], tempo: m[3], visual, texto, narracao, tipo: tipos.length ? tipos[0][0] : 'SLIDE' });
    });
    return { mod: head[1], aula: head[2], titulo: head[3], objetivo, lab, cenas };
}

function parseTexto(texto) {
    const lines = texto.split('\n').map((l) => l.trim()).filter(Boolean);
    const rows = lines.filter((l) => l.startsWith('|') && !/^\|[-\s|]+\|$/.test(l))
        .map((l) => l.slice(1, -1).split('|').map((c) => clean(c)));
    let items = lines.filter((l) => !l.startsWith('|')).map(unquote).filter(Boolean);
    if (items.length === 1 && !rows.length && items[0].includes(' · ')) {
        items = items[0].split(' · ').map((s) => s.trim());
    }
    return { rows, items };
}

const sizeFor = (items) => {
    const n = items.join(' ').length;
    return n > 420 ? 13 : n > 300 ? 15 : n > 200 ? 17 : n > 110 ? 20 : 24;
};

function frame(pptx, a, cena, dark = false) {
    const s = pptx.addSlide();
    s.background = { color: dark ? C.grafite : C.fundo };
    s.addShape('rect', { x: 0, y: 0, w: 13.333, h: 0.12, fill: { color: C.verde } });
    s.addShape('rect', { x: 0, y: 0.12, w: 2.2, h: 0.06, fill: { color: C.sol } });
    s.addText(`${CURSO}  ·  ${a.mod} · Aula ${a.aula}${cena ? ` · Cena ${cena.n}` : ''}`, {
        x: 0.5, y: 7.05, w: 9.5, h: 0.3, fontFace: F, fontSize: 10, color: dark ? 'C9CDD2' : C.cinza,
    });
    if (!dark) s.addImage({ path: LOGO, x: 11.55, y: 6.92, w: 1.35, h: 0.45 });
    return s;
}

function titulo(s, text, dark = false) {
    s.addText(text, { x: 0.5, y: 0.35, w: 12.3, h: 0.8, fontFace: F, fontSize: 28, bold: true, color: dark ? C.branco : C.grafite, fit: 'shrink' });
}

function bullets(s, items, y = 1.35, h = 5.4, color = C.grafite) {
    const size = sizeFor(items);
    if (items.length === 1) {
        s.addText(items[0], { x: 0.8, y, w: 11.7, h, fontFace: F, fontSize: Math.min(size + 6, 32), bold: true, color: C.verde, valign: 'middle', align: 'center', fit: 'shrink' });
        return;
    }
    s.addText(items.map((t) => ({ text: t, options: { bullet: /^(\d+\.|☐|•)/.test(t) ? false : { code: '25A0' }, breakLine: true, paraSpaceAfter: 8 } })), {
        x: 0.7, y, w: 11.9, h, fontFace: F, fontSize: size, color, valign: 'top', fit: 'shrink',
    });
}

function tabela(s, rows, y) {
    const fs_ = rows.length > 6 || rows[0].length > 4 ? 13 : 16;
    s.addTable(rows.map((r, i) => r.map((c) => ({
        text: c,
        options: i === 0 ? { bold: true, color: C.branco, fill: { color: C.verde } } : { color: C.grafite, fill: { color: i % 2 ? C.branco : C.verdeClaro } },
    }))), { x: 0.6, y, w: 12.1, fontFace: F, fontSize: fs_, border: { type: 'solid', color: 'D1D5DB', pt: 0.75 }, autoPage: false });
}

function fluxo(s, item, y = 2.6) {
    const parts = item.split('→').map((p) => p.trim()).filter(Boolean).slice(0, 6);
    const gap = 0.45;
    const w = (12.1 - gap * (parts.length - 1)) / parts.length;
    parts.forEach((p, i) => {
        const x = 0.6 + i * (w + gap);
        s.addShape('roundRect', { x, y, w, h: 1.7, fill: { color: i === parts.length - 1 ? C.verde : C.branco }, line: { color: C.verde, width: 1.5 }, rectRadius: 0.12 });
        s.addText(p, { x: x + 0.1, y, w: w - 0.2, h: 1.7, fontFace: F, fontSize: parts.length > 4 ? 13 : 16, bold: true, align: 'center', valign: 'middle', color: i === parts.length - 1 ? C.branco : C.grafite, fit: 'shrink' });
        if (i < parts.length - 1) s.addText('➜', { x: x + w, y, w: gap, h: 1.7, fontFace: F, fontSize: 20, color: C.sol, align: 'center', valign: 'middle', bold: true });
    });
}

function notas(s, cena) {
    s.addNotes(`[${cena.tipo}] ${cena.nome} (${cena.tempo})\nVisual: ${cena.visual}\n\nNarração:\n${cena.narracao}`);
}

function capa(pptx, a) {
    const s = pptx.addSlide();
    s.background = { color: C.grafite };
    s.addShape('rect', { x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: C.verde } });
    s.addShape('rect', { x: 0.35, y: 0, w: 0.12, h: 7.5, fill: { color: C.sol } });
    s.addText(CURSO.toUpperCase(), { x: 1.0, y: 0.7, w: 11, h: 0.5, fontFace: F, fontSize: 16, bold: true, color: C.sol, charSpacing: 2 });
    s.addText(`${a.mod} · Aula ${a.aula}${a.lab ? ' · Laboratório' : ''}`, { x: 1.0, y: 2.0, w: 11, h: 0.6, fontFace: F, fontSize: 22, color: 'C9CDD2' });
    s.addText(a.titulo.replace(/^Laboratório: /, ''), { x: 1.0, y: 2.6, w: 11.3, h: 1.9, fontFace: F, fontSize: 40, bold: true, color: C.branco, valign: 'top', fit: 'shrink' });
    if (a.objetivo) s.addText(a.objetivo, { x: 1.0, y: 4.7, w: 11.3, h: 1.0, fontFace: F, fontSize: 18, color: 'C9CDD2', valign: 'top', fit: 'shrink' });
    s.addShape('roundRect', { x: 10.6, y: 6.35, w: 2.4, h: 0.85, fill: { color: C.branco }, rectRadius: 0.1 });
    s.addImage({ path: LOGO, x: 10.75, y: 6.43, w: 2.1, h: 0.69 });
    s.addText(SUB, { x: 1.0, y: 6.55, w: 9, h: 0.4, fontFace: F, fontSize: 12, color: 'C9CDD2' });
}

function cenaSlide(pptx, a, cena) {
    const { rows, items } = parseTexto(cena.texto);
    const dark = cena.tipo === 'QUADRO' || cena.tipo === 'TELA';
    const s = frame(pptx, a, cena, dark);

    if (cena.tipo === 'APRESENTADOR') {
        s.addShape('rect', { x: 0.5, y: 5.2, w: 12.3, h: 1.4, fill: { color: C.verde } });
        s.addShape('rect', { x: 0.5, y: 5.2, w: 0.15, h: 1.4, fill: { color: C.sol } });
        s.addText(items.length ? items.join('  ·  ') : cena.nome, { x: 0.85, y: 5.25, w: 11.8, h: 1.3, fontFace: F, fontSize: 24, bold: true, color: C.branco, valign: 'middle', fit: 'shrink' });
        s.addText('[ APRESENTADOR — área do vídeo ]', { x: 0.5, y: 1.0, w: 12.3, h: 3.8, fontFace: F, fontSize: 16, color: 'B0B6BD', align: 'center', valign: 'middle' });
    } else if (cena.tipo === 'TELA') {
        titulo(s, cena.nome, true);
        s.addShape('roundRect', { x: 0.6, y: 1.35, w: 12.1, h: 3.9, fill: { color: '1E2125' }, line: { color: C.sol, width: 1.5, dashType: 'dash' }, rectRadius: 0.1 });
        s.addText([{ text: '▶ GRAVAÇÃO DE TELA DA PLATAFORMA\n', options: { bold: true, color: C.sol, fontSize: 16 } }, { text: cena.visual.replace(/^TELA\s*—?\s*/, ''), options: { color: 'D1D5DB', fontSize: 13 } }],
            { x: 0.9, y: 1.5, w: 11.5, h: 3.6, fontFace: F, valign: 'top', fit: 'shrink' });
        if (items.length) s.addText(items.join('  ·  '), { x: 0.6, y: 5.45, w: 12.1, h: 1.2, fontFace: F, fontSize: 20, bold: true, color: C.branco, fill: { color: C.verde }, align: 'center', valign: 'middle', fit: 'shrink' });
    } else if (cena.tipo === 'QUADRO') {
        titulo(s, cena.nome, true);
        s.addText(items.map((t, i) => ({ text: t, options: { breakLine: true, color: i === items.length - 1 ? C.sol : C.branco, bold: i === items.length - 1, paraSpaceAfter: 10 } })),
            { x: 0.8, y: 1.5, w: 11.8, h: 5.2, fontFace: 'Consolas', fontSize: Math.min(sizeFor(items) + 2, 26), valign: 'middle', fit: 'shrink' });
        if (rows.length) tabela(s, rows, 4.2);
    } else {
        titulo(s, cena.nome);
        if (cena.tipo === 'ANIMAÇÃO' && items.length === 1 && items[0].includes('→') && !rows.length) {
            fluxo(s, items[0]);
        } else if (rows.length && items.length) {
            bullets(s, items, 1.3, 1.3);
            tabela(s, rows, 2.75);
        } else if (rows.length) {
            tabela(s, rows, 1.45);
        } else if (items.length) {
            bullets(s, items);
        }
    }
    notas(s, cena);
}

const dirs = fs.readdirSync(ROOT).filter((d) => /^m\d\d-/.test(d) && d.startsWith(filtro)).sort();
let total = 0;
(async () => {
    for (const d of dirs) {
        fs.mkdirSync(path.join(OUT, d), { recursive: true });
        for (const f of fs.readdirSync(path.join(ROOT, d)).filter((x) => /^a\d\d-.*\.md$/.test(x)).sort()) {
            const a = parseAula(path.join(ROOT, d, f));
            const pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_WIDE';
            pptx.title = `${a.mod} · Aula ${a.aula} — ${a.titulo}`;
            pptx.company = 'Rexar Sistemas';
            capa(pptx, a);
            a.cenas.forEach((c) => cenaSlide(pptx, a, c));
            await pptx.writeFile({ fileName: path.join(OUT, d, f.replace(/\.md$/, '.pptx')) });
            total += a.cenas.length + 1;
        }
    }
    console.log(`aulas: ${dirs.length} módulos · slides: ${total}`);
})();

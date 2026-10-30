// Gera um .pptx (16:9) por módulo a partir dos roteiros (docs/curso/roteiros), na identidade visual do GD Solar.
// Uso: NODE_PATH=<pasta node_modules com pptxgenjs> node gerar-slides.cjs [filtro, ex.: m01]
// Cenas de apresentador e de gravação de tela não viram slide (os vídeos são separados);
// cenas curtas são agrupadas em cartões; a narração das cenas vai nas anotações do slide.
const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const CURSO = 'Formação em Energia por Assinatura';
const SUB = 'Geração distribuída compartilhada, da regulação à operação';
const MARCA = 'GD Solar';
const ROOT = path.resolve(__dirname, '..', 'roteiros');
const LOGO = path.join(__dirname, 'assets', 'logo-gdsolar.png');
const C = {
    azul: '1B3A6B', laranja: 'F7A23B', escuro: '0B1F3A', destaque: '11396F',
    claro: 'EEF3FA', fundo: 'F6F8FB', branco: 'FFFFFF', texto: '1F2937', cinza: '64748B', linha: 'D8E0EC',
};
const F = 'Arial';
const W = 13.333;
const filtro = process.argv[2] || '';
const TELAS = path.join(__dirname, 'telas');
const NOME_TELA = {
    dashboard: 'Dashboard do administrador', consultor_dashboard: 'Dashboard do consultor', cliente_dashboard: 'Portal do cliente',
    produtor_dashboard: 'Portal do produtor', fatura: 'Fatura de concessionária', faturas: 'Faturas de concessionárias',
    concessionarias: 'Concessionárias e tarifa GD', configuracoes: 'Configurações padrão', produtores: 'Produtores',
    proposta_produtor: 'Proposta de produtor', onboarding: 'Onboarding de usinas', geracao: 'Geração mensal',
    gestao_energia: 'Gestão de energia', clientes: 'Clientes', proposta_cliente: 'Proposta comercial', uc: 'Unidade consumidora e vínculo com a usina',
    contratos: 'Contratos', alertas: 'Alertas operacionais', cobrancas: 'Cobranças', cobranca: 'Detalhe da cobrança',
    pagamentos: 'Pagamentos', relatorio_executivo: 'Relatório executivo', relatorio_usinas: 'Relatório por usina',
    identidade: 'Identidade visual', templates: 'Modelos de mensagem', cockpit: 'Cockpit executivo',
    cliente_cobrancas: 'Cobranças no portal do cliente', cliente_economia: 'Relatório de economia do cliente',
};
// Telas da plataforma exibidas em cada aula (arquivo do roteiro → capturas em slides/telas).
const TELAS_AULA = {
    'm00-boas-vindas/a03': ['dashboard', 'consultor_dashboard', 'cliente_dashboard', 'produtor_dashboard'],
    'm01-fundamentos/a08': ['fatura'], 'm02-marco-legal/a07': ['concessionarias'], 'm03-modelos-de-negocio/a06': ['configuracoes'],
    'm04-usinas-e-produtores/a04': ['onboarding'], 'm04-usinas-e-produtores/a05': ['produtores', 'proposta_produtor'],
    'm04-usinas-e-produtores/a06': ['geracao', 'gestao_energia'], 'm05-comercial/a06': ['clientes', 'proposta_cliente'],
    'm06-contratos-e-alocacao/a05': ['uc', 'contratos'], 'm06-contratos-e-alocacao/a06': ['gestao_energia', 'alertas'],
    'm07-faturas/a05': ['faturas', 'fatura'], 'm07-faturas/a06': ['fatura'], 'm08-cobranca/a05': ['cobranca', 'cobrancas'],
    'm08-cobranca/a06': ['cliente_cobrancas', 'pagamentos'], 'm08-cobranca/a07': ['cobranca', 'alertas'],
    'm09-operacao/a02': ['alertas'], 'm09-operacao/a05': ['alertas', 'relatorio_usinas'], 'm10-indicadores/a02': ['cliente_economia'],
    'm10-indicadores/a04': ['cockpit', 'dashboard'], 'm10-indicadores/a05': ['relatorio_executivo', 'relatorio_usinas'],
    'm11-gestao/a05': ['identidade', 'templates'], 'm12-projeto-final/a03': ['cockpit', 'gestao_energia'],
};
const NARR_DIR = path.resolve(__dirname, '..', 'audio', 'narracao');
const narr = (d) => { const f = path.join(NARR_DIR, `${d.slice(0, 3)}.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; };
const tela = (k) => path.join(TELAS, `${k}.jpg`);
const temTela = (k) => fs.existsSync(tela(k));

function imagemTela(s, k, x, y, w) {
    const h = w * 9 / 16;
    s.addShape('roundRect', { x: x - 0.04, y: y - 0.04, w: w + 0.08, h: h + 0.08, fill: { color: C.branco }, line: { color: C.linha, width: 1 }, rectRadius: 0.06, shadow: { type: 'outer', blur: 6, offset: 2, angle: 90, color: '000000', opacity: 0.15 } });
    s.addImage({ path: tela(k), x, y, w, h });
    return h;
}

function slideTela(pptx, a, k, rodape) {
    const s = base(pptx, rodape);
    cabecalho(s, NOME_TELA[k] || 'Na plataforma', `Aula ${a.aula} · na plataforma`);
    imagemTela(s, k, 1.55, 1.38, 10.2);
}
const ETAPA = { M0: 'Etapa 1 · Fundamentos', M1: 'Etapa 1 · Fundamentos', M2: 'Etapa 2 · Regulação e negócio', M3: 'Etapa 2 · Regulação e negócio', M10: 'Etapa 4 · Gestão e estratégia', M11: 'Etapa 4 · Gestão e estratégia', M12: 'Etapa 4 · Gestão e estratégia' };

const clean = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s*\[CONFERIR[^\]]*\]/gi, '').trim();
const unquote = (s) => clean(s).replace(/^["“]|["”]$/g, '').trim();
const isLab = (t) => t.startsWith('Laboratório: ');
const semLab = (t) => { const x = t.replace(/^Laboratório: /, ''); return x.charAt(0).toUpperCase() + x.slice(1); };
const SKIP_NAME = /^(Abertura|Encerramento|Exercício e encerramento|Entregável e encerramento|Resumo e encerramento)/i;

// ---------- leitura ----------
function parseAula(file) {
    const md = fs.readFileSync(file, 'utf8');
    const head = md.match(/^# (M\d+) · Aula (\d+) — (.+)$/m);
    const objetivo = clean((md.match(/^\| Objetivo \| (.+) \|$/m) || [])[1] || '');
    const marks = [...md.matchAll(/^## Cena (\d+) — (.+?) \(([^)]*)\)\s*$/gm)];
    const fim = md.indexOf('\n## Materiais') > 0 ? md.indexOf('\n## Materiais') : md.length;
    const cenas = marks.map((m, i) => {
        const body = md.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : fim);
        const visual = clean((body.match(/\*\*Visual:\*\*([\s\S]*?)(?=\n\*\*Texto na tela:\*\*|\n\*\*Narração:\*\*)/) || [])[1] || '');
        const texto = ((body.match(/\*\*Texto na tela:\*\*([\s\S]*?)(?=\n\*\*Narração:\*\*)/) || [])[1] || '').trim();
        const narracao = clean((body.match(/\*\*Narração:\*\*([\s\S]*)$/) || [])[1] || '');
        const tipo = ['SLIDE', 'ANIMAÇÃO', 'QUADRO', 'TELA', 'APRESENTADOR']
            .map((t) => [t, visual.indexOf(t)]).filter(([, p]) => p >= 0).sort((a, b) => a[1] - b[1])[0]?.[0] || 'SLIDE';
        return { nome: clean(m[2]), tipo, narracao, ...parseTexto(texto) };
    });
    return { mod: head[1], aula: Number(head[2]), titulo: head[3], objetivo, cenas };
}

function parseTexto(texto) {
    const lines = texto.split('\n').map((l) => l.trim()).filter(Boolean);
    const rows = lines.filter((l) => l.startsWith('|') && !/^\|[-\s|:]+\|$/.test(l))
        .map((l) => l.slice(1, -1).split('|').map((c) => clean(c)));
    let items = lines.filter((l) => !l.startsWith('|')).map(unquote).filter(Boolean)
        .filter((t) => !/^(Próxim[ao]|Etapa \d concluída)/i.test(t));
    if (items.length === 1 && !rows.length && items[0].includes(' · ')) items = items[0].split(' · ').map((s) => s.trim());
    items = items.map((t) => t.replace(/^(Exercício|Entregável[^:]*):\s*$/i, '').trim()).filter(Boolean);
    return { rows, items };
}

function parsePlano(file) {
    const md = fs.readFileSync(file, 'utf8');
    const titulo = (md.match(/^# (M\d+) — (.+?) · Plano/m) || [])[2] || '';
    const sec = (name) => (md.split(new RegExp(`^## ${name}.*$`, 'm'))[1] || '').split(/^## /m)[0];
    const objetivos = sec('Objetivo').split('\n').filter((l) => /^- /.test(l)).map((l) => clean(l.slice(2)));
    const entregavel = clean(sec('Entregável').trim().split('\n\n')[0] || '');
    const exercicios = sec('Exercícios').split('\n').filter((l) => /^\d+\. /.test(l))
        .map((l) => clean(l.replace(/^\d+\.\s*/, '').replace(/\s*\(R:[^)]*\)\s*$/, '').replace(/\s*\([^)]*discussão[^)]*\)\s*$/i, '')));
    const quiz = sec('Quiz').split('\n').filter((l) => /^\d+\. /.test(l)).map((l) => {
        const txt = l.replace(/^\d+\.\s*/, '');
        const pergunta = clean(txt.split(/\s\*{0,2}\(a\)/)[0]);
        const opcoes = [...txt.matchAll(/(\*\*)?\(([a-d])\)\s*([^(*]+?)(\*\*)?(?=\s*(\*\*)?\([a-d]\)|\.?\s*$)/g)]
            .map((m) => ({ letra: m[2], texto: clean(m[3]).replace(/\.$/, ''), certa: Boolean(m[1]) }));
        return { pergunta, opcoes };
    }).filter((q) => q.opcoes.length >= 2);
    return { titulo, objetivos, entregavel, exercicios, quiz };
}

// ---------- utilidades de desenho ----------
const len = (b) => (b.items.join(' ').length + b.rows.flat().join(' ').length);
const fsz = (n, max = 22, min = 11) => Math.max(min, Math.min(max, n > 520 ? 12 : n > 380 ? 13 : n > 280 ? 14 : n > 190 ? 16 : n > 120 ? 18 : 20));
// Maior fonte (pt) em que o texto cabe na caixa. Estimativa para Arial: caractere ≈ 0,52 da fonte; linha ≈ 1,25.
function caber(texto, w, h, max = 24, min = 10, extraPt = 0) {
    for (let t = max; t > min; t--) {
        const porLinha = Math.max(1, Math.floor((w * 72) / (t * 0.52)));
        const linhas = String(texto).split('\n').reduce((n, l) => n + Math.max(1, Math.ceil(l.length / porLinha)), 0);
        if (linhas * t * 1.25 + extraPt <= h * 72) return t;
    }
    return min;
}
const num = (s) => {
    const m = String(s).replace(/R\$|kWh|kWp|%|\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.').match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
};

function base(pptx, rodape, dark = false) {
    const s = pptx.addSlide();
    s.background = { color: dark ? C.escuro : C.fundo };
    if (!dark) {
        s.addShape('rect', { x: 0, y: 7.12, w: W, h: 0.38, fill: { color: C.branco }, line: { color: C.linha, width: 0.5 } });
        s.addImage({ path: LOGO, x: 0.6, y: 7.16, w: 0.3, h: 0.3 });
        s.addText(`${MARCA}  ·  ${CURSO}`, { x: 0.97, y: 7.14, w: 7, h: 0.34, fontFace: F, fontSize: 9, color: C.cinza, bold: true });
        s.addText(rodape, { x: 7.8, y: 7.14, w: 4.4, h: 0.34, fontFace: F, fontSize: 9, color: C.cinza, align: 'right' });
        s.slideNumber = { x: 12.35, y: 7.17, w: 0.6, h: 0.28, fontFace: F, fontSize: 9, color: C.azul, bold: true, align: 'right' };
    }
    return s;
}

function cabecalho(s, titulo, sobre) {
    s.addShape('rect', { x: 0.6, y: 0.42, w: 0.09, h: 0.72, fill: { color: C.laranja } });
    if (sobre) s.addText(sobre.toUpperCase(), { x: 0.85, y: 0.32, w: 12, h: 0.3, fontFace: F, fontSize: 10, bold: true, color: C.laranja, charSpacing: 1 });
    s.addText(titulo, { x: 0.85, y: sobre ? 0.58 : 0.42, w: 11.9, h: 0.62, fontFace: F, fontSize: 26, bold: true, color: C.azul, fit: 'shrink' });
}

function bullets(s, items, x, y, w, h, size, color = C.texto) {
    size = Math.min(size, caber(items.join('\n'), w - 0.35, h - 0.1, size, 10, items.length * 6));
    s.addText(items.map((t) => ({ text: t, options: { bullet: /^(\d+\.|☐)/.test(t) ? false : { code: '25CF' }, breakLine: true, paraSpaceAfter: 6 } })),
        { x, y, w, h, fontFace: F, fontSize: size, color, valign: 'top', fit: 'shrink' });
}

function tiles(s, items, x, y, w, h) {
    const cols = items.length <= 3 ? items.length : items.length === 4 ? 2 : 3;
    const lines = Math.ceil(items.length / cols);
    const gap = 0.25;
    const tw = (w - gap * (cols - 1)) / cols;
    const th = (h - gap * (lines - 1)) / lines;
    const maior = items.reduce((m, t) => (t.length > m.length ? t : m), '');
    const size = caber(maior, tw - 1.1, th - 0.3, 18, 10);
    items.forEach((t, i) => {
        const cx = x + (i % cols) * (tw + gap);
        const cy = y + Math.floor(i / cols) * (th + gap);
        const txt = t.replace(/^(\d+\.|☐)\s*/, '');
        s.addShape('roundRect', { x: cx, y: cy, w: tw, h: th, fill: { color: C.branco }, line: { color: C.linha, width: 0.75 }, rectRadius: 0.08, shadow: { type: 'outer', blur: 3, offset: 1, angle: 90, color: '000000', opacity: 0.08 } });
        s.addShape('ellipse', { x: cx + 0.2, y: cy + 0.2, w: 0.5, h: 0.5, fill: { color: i % 2 ? C.laranja : C.azul } });
        s.addText(String(i + 1), { x: cx + 0.2, y: cy + 0.2, w: 0.5, h: 0.5, fontFace: F, fontSize: 14, bold: true, color: C.branco, align: 'center', valign: 'middle' });
        s.addText(txt, { x: cx + 0.85, y: cy + 0.12, w: tw - 1.0, h: th - 0.24, fontFace: F, fontSize: size, color: C.texto, valign: 'middle', fit: 'shrink' });
    });
}

// Itens curtos com um número de destaque (R$, %, kWh, anos…) viram cartões de indicador.
const RE_NUM = /(R\$\s?[\d.,]+|[\d.,]+\s?(%|kWh|kWp|MW|kW|anos|meses|dias|h)\b)/;
const destaques = (items) => items.length >= 2 && items.length <= 4 && items.every((t) => t.length <= 70 && RE_NUM.test(t));

function numeros(s, items, x, y, w, h) {
    const gap = 0.3;
    const tw = (w - gap * (items.length - 1)) / items.length;
    items.forEach((t, i) => {
        const valor = t.match(RE_NUM)[0];
        const resto = t.replace(valor, '').replace(/^[\s:=·→-]+|[\s:=·→-]+$/g, '').trim();
        const cx = x + i * (tw + gap);
        s.addShape('roundRect', { x: cx, y, w: tw, h, fill: { color: i % 2 ? C.branco : C.azul }, line: { color: C.linha, width: 0.75 }, rectRadius: 0.1, shadow: { type: 'outer', blur: 4, offset: 1, angle: 90, color: '000000', opacity: 0.1 } });
        s.addText(valor, { x: cx + 0.2, y: y + 0.5, w: tw - 0.4, h: 1.6, fontFace: F, fontSize: caber(valor, tw - 0.4, 1.5, 44, 20), bold: true, color: i % 2 ? C.azul : C.laranja, align: 'center', valign: 'middle' });
        s.addShape('rect', { x: cx + tw / 2 - 0.4, y: y + 2.25, w: 0.8, h: 0.05, fill: { color: C.laranja } });
        s.addText(resto || t, { x: cx + 0.25, y: y + 2.45, w: tw - 0.5, h: h - 2.7, fontFace: F, fontSize: caber(resto || t, tw - 0.5, h - 2.8, 18, 11), color: i % 2 ? C.texto : C.branco, align: 'center', valign: 'top' });
    });
}

function tabela(s, rows, x, y, w) {
    const size = rows.length > 7 || rows[0].length > 4 ? 12 : 14;
    s.addTable(rows.map((r, i) => r.map((c) => ({
        text: c,
        options: i === 0 ? { bold: true, color: C.branco, fill: { color: C.azul } } : { color: C.texto, fill: { color: i % 2 ? C.branco : C.claro } },
    }))), { x, y, w, fontFace: F, fontSize: size, border: { type: 'solid', color: C.linha, pt: 0.75 }, valign: 'middle', autoPage: false });
}

// Tabela com uma coluna numérica em todas as linhas vira gráfico de barras.
function chartable(rows) {
    if (rows.length < 4) return null;
    const body = rows.slice(1);
    for (let c = rows[0].length - 1; c >= 1; c--) {
        const vals = body.map((r) => num(r[c]));
        if (vals.every((v) => v !== null)) return { col: c, labels: body.map((r) => r[0]), vals, pct: body.every((r) => /%/.test(r[c])) };
    }
    return null;
}

function grafico(s, rows, ch, x, y, w, h) {
    s.addChart('bar', [{ name: rows[0][ch.col], labels: ch.labels, values: ch.pct ? ch.vals.map((v) => v / 100) : ch.vals }], {
        x, y, w, h, barDir: 'col', chartColors: [C.azul], valAxisHidden: true, valGridLine: { style: 'none' },
        catAxisLabelFontFace: F, catAxisLabelFontSize: 11, catAxisLabelColor: C.texto,
        showValue: true, dataLabelFontFace: F, dataLabelFontSize: 11, dataLabelColor: C.azul, dataLabelFontBold: true,
        dataLabelFormatCode: ch.pct ? '0%' : '#,##0.##', barGapWidthPct: 60,
        showTitle: true, title: rows[0][ch.col], titleFontFace: F, titleFontSize: 12, titleColor: C.cinza,
    });
}

function fluxo(s, item, y) {
    const parts = item.split('→').map((p) => p.trim()).filter(Boolean).slice(0, 6);
    const w = (12.0) / parts.length;
    parts.forEach((p, i) => {
        s.addShape('chevron', { x: 0.6 + i * w, y, w: w + 0.12, h: 1.6, fill: { color: [C.azul, C.destaque, C.azul, C.destaque, C.azul, C.destaque][i] }, line: { color: C.branco, width: 2 } });
        s.addText(p, { x: 0.6 + i * w + 0.35, y, w: w - 0.45, h: 1.6, fontFace: F, fontSize: parts.length > 4 ? 12 : 15, bold: true, color: C.branco, align: 'center', valign: 'middle', fit: 'shrink' });
    });
}

function calculo(s, items, x, y, w, h) {
    s.addShape('roundRect', { x, y, w, h, fill: { color: C.escuro }, rectRadius: 0.1 });
    s.addText(items.map((t, i) => ({ text: t, options: { breakLine: true, color: i === items.length - 1 ? C.laranja : C.branco, bold: i === 0 || i === items.length - 1, paraSpaceAfter: 10 } })),
        { x: x + 0.4, y: y + 0.25, w: w - 0.8, h: h - 0.5, fontFace: 'Consolas', fontSize: caber(items.join('\n'), w - 0.9, h - 0.6, 24, 11, items.length * 10), valign: 'middle', fit: 'shrink' });
}

// ---------- blocos ----------
const pesado = (b) => (b.fala || '').length > 200 || b.rows.length > 0 || b.tipo === 'QUADRO' || (b.items.length === 1 && b.items[0].includes('→')) || b.items.length > 5 || len(b) > 300;

function faixa(s, texto, y) {
    s.addShape('roundRect', { x: 0.6, y, w: 12.13, h: 0.95, fill: { color: C.claro }, line: { color: C.linha, width: 0.5 }, rectRadius: 0.08 });
    s.addShape('rect', { x: 0.6, y, w: 0.1, h: 0.95, fill: { color: C.laranja } });
    s.addText(texto, { x: 0.85, y: y + 0.05, w: 11.75, h: 0.85, fontFace: F, fontSize: caber(texto, 11.6, 0.8, 15, 10), color: C.texto, valign: 'middle' });
}

function slideBloco(pptx, a, b, rodape) {
    const s = base(pptx, rodape);
    cabecalho(s, b.nome, `Aula ${a.aula} · ${a.titulo}`);
    const y = 1.45;
    const H = b.fala ? 4.35 : 5.4;
    const ch = b.rows.length ? chartable(b.rows) : null;
    if (b.tipo === 'QUADRO') {
        if (b.rows.length) { calculo(s, b.items.length ? b.items : [b.nome], 0.6, y, 5.9, H); tabela(s, b.rows, 6.75, y, 5.98); } else calculo(s, b.items, 0.6, y, 12.13, H);
    } else if (b.items.length === 1 && b.items[0].includes('→') && !b.rows.length) {
        fluxo(s, b.items[0], y + H / 2 - 0.8);
    } else if (ch) {
        grafico(s, b.rows, ch, 0.6, y, 6.2, H);
        if (b.items.length) { bullets(s, b.items, 7.05, y, 5.68, 1.4, 14); tabela(s, b.rows, 7.05, y + 1.5, 5.68); } else tabela(s, b.rows, 7.05, y + 0.2, 5.68);
    } else if (b.rows.length) {
        if (b.items.length) { bullets(s, b.items, 0.6, y, 12.2, 1.1, 15); tabela(s, b.rows, 0.6, y + 1.2, 12.13); } else tabela(s, b.rows, 0.6, y + 0.1, 12.13);
    } else if (b.items.length === 1) {
        s.addShape('roundRect', { x: 1.6, y: y + 0.3, w: 10.13, h: H - 0.6, fill: { color: C.branco }, line: { color: C.linha, width: 0.75 }, rectRadius: 0.12, shadow: { type: 'outer', blur: 4, offset: 1, angle: 90, color: '000000', opacity: 0.1 } });
        s.addShape('rect', { x: 1.6, y: y + 0.3, w: 0.14, h: H - 0.6, fill: { color: C.laranja } });
        s.addText(b.items[0], { x: 2.2, y: y + 0.5, w: 9.2, h: H - 1.0, fontFace: F, fontSize: caber(b.items[0], 9.1, H - 1.1, 32, 16), bold: true, color: C.azul, align: 'center', valign: 'middle' });
    } else if (destaques(b.items)) {
        numeros(s, b.items, 0.6, y + 0.2, 12.13, H - 0.3);
    } else if (b.items.length <= 6 && b.items.every((t) => t.length <= 110)) {
        tiles(s, b.items, 0.6, y, 12.13, H);
    } else if (b.items.length > 6) {
        const meio = Math.ceil(b.items.length / 2);
        bullets(s, b.items.slice(0, meio), 0.6, y, 6.0, H, 18);
        bullets(s, b.items.slice(meio), 6.85, y, 6.0, H, 18);
    } else {
        bullets(s, b.items, 0.6, y, 12.2, H, fsz(len(b)));
    }
    if (b.fala) faixa(s, b.fala, y + H + 0.12);
    s.addNotes(b.fala || '');
}

function slideCartoes(pptx, a, blocos, rodape, titulo) {
    const s = base(pptx, rodape);
    cabecalho(s, titulo, `Aula ${a.aula}`);
    const gap = 0.3;
    const w = (12.13 - gap * (blocos.length - 1)) / blocos.length;
    blocos.forEach((b, i) => {
        const x = 0.6 + i * (w + gap);
        s.addShape('roundRect', { x, y: 1.45, w, h: 5.4, fill: { color: C.branco }, line: { color: C.linha, width: 0.75 }, rectRadius: 0.08, shadow: { type: 'outer', blur: 3, offset: 1, angle: 90, color: '000000', opacity: 0.08 } });
        s.addShape('rect', { x, y: 1.45, w, h: 0.12, fill: { color: i % 2 ? C.laranja : C.azul } });
        s.addText(b.nome, { x: x + 0.3, y: 1.7, w: w - 0.6, h: 0.75, fontFace: F, fontSize: 16, bold: true, color: C.azul, valign: 'top', fit: 'shrink' });
        const items = b.items.length ? b.items : [b.nome];
        if (items.length === 1) {
            if (b.fala) s.addText(b.fala, { x: x + 0.3, y: 4.4, w: w - 0.6, h: 2.3, fontFace: F, fontSize: caber(b.fala, w - 0.7, 2.2, 15, 11), italic: true, color: C.cinza, valign: 'top' });
            s.addText(items[0], { x: x + 0.3, y: 2.5, w: w - 0.6, h: b.fala ? 1.8 : 4.1, fontFace: F, fontSize: caber(items[0], w - 0.7, b.fala ? 1.7 : 4.0, 22, 11), color: C.texto, valign: 'middle', fit: 'shrink' });
        } else bullets(s, items, x + 0.3, 2.5, w - 0.6, b.fala ? 2.5 : 4.1, 17);
        if (b.fala && items.length > 1) {
            s.addShape('rect', { x: x + 0.3, y: 5.1, w: w - 0.6, h: 0.02, fill: { color: C.linha } });
            s.addText(b.fala, { x: x + 0.3, y: 5.2, w: w - 0.6, h: 1.5, fontFace: F, fontSize: caber(b.fala, w - 0.7, 1.45, 14, 11), italic: true, color: C.cinza, valign: 'top' });
        }
    });
    s.addNotes(blocos.map((b) => b.fala || '').join('\n\n'));
}

function slidePassos(pptx, a, passos, rodape, parte, k) {
    const s = base(pptx, rodape);
    cabecalho(s, parte ? `Passo a passo (${parte})` : 'Passo a passo na plataforma', `Aula ${a.aula} · ${semLab(a.titulo)}`);
    if (k) {
        const h = imagemTela(s, k, 0.5, 1.45, 7.7);
        s.addText(NOME_TELA[k] || '', { x: 0.5, y: 1.5 + h, w: 7.7, h: 0.35, fontFace: F, fontSize: 11, italic: true, color: C.cinza, align: 'center' });
        s.addText(passos.map((p) => [
            { text: `${p.n}  `, options: { bold: true, color: C.laranja, fontSize: 15 } },
            { text: p.nome, options: { bold: true, color: C.azul, fontSize: 14, breakLine: true } },
            ...(p.items.length ? [{ text: p.items.join(' · '), options: { color: C.texto, fontSize: 11, breakLine: true, paraSpaceAfter: 8 } }] : []),
        ]).flat(), { x: 8.55, y: 1.45, w: 4.35, h: 5.4, fontFace: F, valign: 'top', fit: 'shrink' });
        s.addNotes(passos.map((p) => p.items.join(' ')).join('\n'));
        return;
    }
    const cols = passos.length <= 3 ? passos.length : 3;
    const lines = Math.ceil(passos.length / cols);
    const gap = 0.25;
    const tw = (12.13 - gap * (cols - 1)) / cols;
    const th = (5.4 - gap * (lines - 1)) / lines;
    passos.forEach((p, i) => {
        const x = 0.6 + (i % cols) * (tw + gap);
        const y = 1.45 + Math.floor(i / cols) * (th + gap);
        s.addShape('roundRect', { x, y, w: tw, h: th, fill: { color: C.branco }, line: { color: C.linha, width: 0.75 }, rectRadius: 0.08 });
        s.addShape('roundRect', { x: x + 0.2, y: y + 0.2, w: 0.9, h: 0.42, fill: { color: C.laranja }, rectRadius: 0.2 });
        s.addText(`PASSO ${p.n}`, { x: x + 0.2, y: y + 0.2, w: 0.9, h: 0.42, fontFace: F, fontSize: 10, bold: true, color: C.branco, align: 'center', valign: 'middle' });
        s.addText(p.nome, { x: x + 1.2, y: y + 0.15, w: tw - 1.35, h: 0.55, fontFace: F, fontSize: 14, bold: true, color: C.azul, valign: 'middle', fit: 'shrink' });
        if (p.items.length) s.addText(p.items.join('\n'), { x: x + 0.25, y: y + 0.8, w: tw - 0.5, h: th - 0.95, fontFace: F, fontSize: fsz(p.items.join(' ').length * 2, 15, 10), color: C.texto, valign: 'top', fit: 'shrink' });
    });
    s.addNotes(passos.map((p) => p.items.join(' ')).join('\n'));
}

function slideSecao(pptx, a, temas, rodape) {
    const s = base(pptx, rodape, true);
    s.addShape('rect', { x: 0, y: 0, w: 4.6, h: 7.5, fill: { color: C.azul } });
    s.addText(String(a.aula).padStart(2, '0'), { x: 0.5, y: 0.6, w: 3.8, h: 1.9, fontFace: F, fontSize: 110, bold: true, color: C.laranja });
    s.addText(`AULA ${a.aula}`, { x: 0.6, y: 2.4, w: 3.6, h: 0.6, fontFace: F, fontSize: 18, bold: true, color: C.laranja, charSpacing: 2 });
    s.addText(`${a.mod} · ${ETAPA[a.mod] || 'Etapa 3 · Operação ponta a ponta'}`, { x: 0.6, y: 3.5, w: 3.7, h: 0.5, fontFace: F, fontSize: 11, color: 'C7D2E3' });
    s.addText(isLab(a.titulo) ? 'Prática na plataforma' : 'Aula teórica', { x: 0.6, y: 3.0, w: 3.6, h: 0.5, fontFace: F, fontSize: 14, color: 'C7D2E3' });
    s.addImage({ path: LOGO, x: 0.6, y: 6.2, w: 0.7, h: 0.7 });
    s.addText(semLab(a.titulo), { x: 5.1, y: 0.9, w: 7.8, h: 1.6, fontFace: F, fontSize: 32, bold: true, color: C.branco, valign: 'bottom', fit: 'shrink' });
    if (a.objetivo) s.addText(a.objetivo, { x: 5.1, y: 2.6, w: 7.8, h: 0.9, fontFace: F, fontSize: caber(a.objetivo, 7.7, 0.85, 15, 11), color: 'C7D2E3', valign: 'top', fit: 'shrink' });
    if (temas.length) {
        s.addText(temas.slice(0, 7).map((t) => ({ text: t, options: { bullet: { code: '25B8' }, breakLine: true, paraSpaceAfter: 6 } })),
            { x: 5.1, y: 3.7, w: 7.8, h: 3.2, fontFace: F, fontSize: 15, color: C.branco, valign: 'top', fit: 'shrink' });
    }
}

function capaModulo(pptx, mod, plano, aulas) {
    const s = pptx.addSlide();
    s.background = { color: C.escuro };
    s.addShape('rect', { x: 0, y: 0, w: W, h: 0.14, fill: { color: C.laranja } });
    s.addImage({ path: LOGO, x: 0.7, y: 0.65, w: 0.9, h: 0.9 });
    s.addText([{ text: `${MARCA}\n`, options: { fontSize: 18, bold: true, color: C.branco } }, { text: CURSO, options: { fontSize: 13, color: 'C7D2E3' } }], { x: 1.75, y: 0.62, w: 8, h: 0.95, fontFace: F, valign: 'middle' });
    s.addText(`${mod}  ·  ${ETAPA[mod] || 'Etapa 3 · Operação ponta a ponta'}`.toUpperCase(), { x: 0.7, y: 2.1, w: 12, h: 0.45, fontFace: F, fontSize: 14, bold: true, color: C.laranja, charSpacing: 1 });
    s.addText(plano.titulo, { x: 0.7, y: 2.55, w: 12, h: 1.3, fontFace: F, fontSize: 40, bold: true, color: C.branco, valign: 'top', fit: 'shrink' });
    s.addText(aulas.map((a) => ({ text: `${a.aula}. ${semLab(a.titulo)}`, options: { breakLine: true, paraSpaceAfter: 4 } })),
        { x: 0.7, y: 4.0, w: 7.2, h: 3.0, fontFace: F, fontSize: aulas.length > 6 ? 12 : 14, color: 'C7D2E3', valign: 'top', fit: 'shrink' });
    s.addShape('roundRect', { x: 8.3, y: 4.0, w: 4.35, h: 3.0, fill: { color: C.destaque }, rectRadius: 0.1 });
    s.addText([{ text: 'Ao final do módulo\n', options: { bold: true, color: C.laranja, fontSize: 13 } },
        ...plano.objetivos.slice(0, 5).map((o) => ({ text: o, options: { bullet: { code: '2714' }, breakLine: true, color: C.branco, fontSize: 11 } }))],
    { x: 8.5, y: 4.1, w: 3.95, h: 2.8, fontFace: F, valign: 'top', fit: 'shrink' });
}

function slideFechamento(pptx, plano, rodape) {
    const s = base(pptx, rodape);
    cabecalho(s, 'Pratique e entregue', 'Fechamento do módulo');
    const temEx = plano.exercicios.length > 0;
    if (temEx) {
        s.addText('Exercícios', { x: 0.6, y: 1.45, w: 5.9, h: 0.45, fontFace: F, fontSize: 16, bold: true, color: C.azul });
        s.addText(plano.exercicios.map((e, i) => ({ text: `${i + 1}. ${e}`, options: { breakLine: true, paraSpaceAfter: 8 } })),
            { x: 0.6, y: 1.95, w: 5.9, h: 4.9, fontFace: F, fontSize: caber(plano.exercicios.join('\n'), 5.8, 4.8, 16, 10, plano.exercicios.length * 8), color: C.texto, valign: 'top', fit: 'shrink' });
    }
    const x = temEx ? 6.75 : 0.6;
    const w = temEx ? 5.98 : 12.13;
    s.addShape('roundRect', { x, y: 1.45, w, h: 5.4, fill: { color: C.azul }, rectRadius: 0.1 });
    s.addText([{ text: 'ENTREGÁVEL DO MÓDULO\n', options: { bold: true, color: C.laranja, fontSize: 13, charSpacing: 1 } }, { text: plano.entregavel, options: { color: C.branco, fontSize: 16 } }],
        { x: x + 0.35, y: 1.7, w: w - 0.7, h: 4.9, fontFace: F, valign: 'top', fit: 'shrink' });
}

function slideQuiz(pptx, plano, rodape) {
    for (let i = 0; i < plano.quiz.length; i += 2) {
        const s = base(pptx, rodape);
        cabecalho(s, 'Teste rápido', `Questões ${i + 1}–${Math.min(i + 2, plano.quiz.length)} de ${plano.quiz.length}`);
        plano.quiz.slice(i, i + 2).forEach((q, k) => {
            const y = 1.45 + k * 2.75;
            s.addShape('ellipse', { x: 0.6, y, w: 0.55, h: 0.55, fill: { color: C.azul } });
            s.addText(String(i + k + 1), { x: 0.6, y, w: 0.55, h: 0.55, fontFace: F, fontSize: 16, bold: true, color: C.branco, align: 'center', valign: 'middle' });
            s.addText(q.pergunta, { x: 1.35, y: y - 0.05, w: 11.4, h: 0.7, fontFace: F, fontSize: caber(q.pergunta, 11.3, 0.65, 18, 12), bold: true, color: C.azul, valign: 'middle' });
            const ow = (12.13 - 0.25 * 3) / 4;
            q.opcoes.slice(0, 4).forEach((o, j) => {
                const ox = 0.6 + j * (ow + 0.25);
                s.addShape('roundRect', { x: ox, y: y + 0.8, w: ow, h: 1.6, fill: { color: C.branco }, line: { color: C.linha, width: 0.75 }, rectRadius: 0.08 });
                s.addText(o.letra.toUpperCase(), { x: ox + 0.15, y: y + 0.9, w: 0.4, h: 0.4, fontFace: F, fontSize: 14, bold: true, color: C.laranja });
                s.addText(o.texto, { x: ox + 0.15, y: y + 1.3, w: ow - 0.3, h: 1.0, fontFace: F, fontSize: caber(o.texto, ow - 0.35, 0.95, 15, 9), color: C.texto, valign: 'top' });
            });
        });
    }
    const s = base(pptx, rodape);
    s.background = { color: C.claro };
    cabecalho(s, 'Gabarito do teste rápido', 'Confira suas respostas');
    tiles(s, plano.quiz.map((q, n) => { const c = q.opcoes.find((o) => o.certa); return `${c ? c.letra.toUpperCase() : '-'}) ${c ? c.texto : ''}`; }), 0.6, 1.45, 12.13, 5.35);
}

// ---------- montagem ----------
// Linha do tempo para o vídeo: para cada slide criado, as cenas narradas que ele mostra e o volume de texto.
function marcar(pptx, cenas = [], leitura = 0, tipo = 'conteudo') {
    pptx._tl ||= [];
    while (pptx._tl.length < pptx.slides.length) pptx._tl.push({ tipo, cenas: [...cenas], leitura });
}

function montarAula(pptx, a, falas) {
    const rodape = `${a.mod} · Aula ${a.aula}`;
    const fa = falas[a.chave.slice(-3)] || {};
    a.cenas.forEach((c, i) => {
        c.n = i + 1;
        c.fala = fa[String(i + 1)] || '';
        if (fa.passos?.[String(i + 1)]) c.items = [fa.passos[String(i + 1)]];
    });
    // Passo a passo só em laboratório; em aula teórica, a demonstração de tela vira um cartão.
    const lab = isLab(a.titulo);
    if (!lab) a.cenas.filter((c) => c.tipo === 'TELA' && c.items.length && !SKIP_NAME.test(c.nome)).forEach((c) => { c.tipo = 'SLIDE'; });
    const passos = lab ? a.cenas.filter((c) => c.tipo === 'TELA').map((c, i) => ({ ...c, n: i + 1 })) : [];
    const conteudo = a.cenas.filter((c) => ['SLIDE', 'ANIMAÇÃO', 'QUADRO'].includes(c.tipo) && (c.items.length || c.rows.length) && !SKIP_NAME.test(c.nome));
    const resumo = a.cenas.find((c) => /^Resumo/i.test(c.nome) && c.items.length);
    const temas = [...conteudo.map((c) => c.nome), ...(passos.length ? ['Passo a passo na plataforma'] : [])].filter((t) => !/^Resumo/i.test(t));
    slideSecao(pptx, a, temas, rodape);
    marcar(pptx, [], 0, 'secao');

    let leves = [];
    const flush = () => {
        if (leves.length === 1) slideBloco(pptx, a, leves[0], rodape);
        else if (leves.length) slideCartoes(pptx, a, leves, rodape, semLab(a.titulo));
        marcar(pptx, leves.map((b) => b.n), leves.reduce((t, b) => t + len(b), 0));
        leves = [];
    };
    conteudo.filter((c) => !/^Resumo/i.test(c.nome)).forEach((b) => {
        if (pesado(b)) { flush(); slideBloco(pptx, a, b, rodape); marcar(pptx, [b.n], len(b)); } else { leves.push(b); if (leves.length === 3) flush(); }
    });
    flush();
    const telas = (TELAS_AULA[a.chave] || []).filter(temTela);
    const porSlide = telas.length ? 4 : 6;
    for (let i = 0; i < passos.length; i += porSlide) {
        const partes = Math.ceil(passos.length / porSlide);
        slidePassos(pptx, a, passos.slice(i, i + porSlide), rodape, partes > 1 ? `${i / porSlide + 1}/${partes}` : '', telas[i / porSlide]);
        marcar(pptx, [], passos.slice(i, i + porSlide).reduce((t, p) => t + p.items.join(' ').length, 0), 'passos');
    }
    telas.slice(passos.length ? Math.ceil(passos.length / porSlide) : 0).forEach((k) => { slideTela(pptx, a, k, rodape); marcar(pptx, [], 120, 'tela'); });
    if (resumo) {
        const s = base(pptx, rodape);
        s.background = { color: C.claro };
        cabecalho(s, 'Para levar desta aula', `Aula ${a.aula} · resumo`);
        tiles(s, resumo.items.slice(0, 6), 0.6, 1.45, 12.13, 5.35);
        marcar(pptx, [], resumo.items.join(' ').length, 'resumo');
    }
}

const dirs = fs.readdirSync(ROOT).filter((d) => /^m\d\d-/.test(d) && d.startsWith(filtro)).sort();
(async () => {
    let total = 0;
    for (const d of dirs) {
        const plano = parsePlano(path.join(ROOT, d, '00-plano.md'));
        const aulas = fs.readdirSync(path.join(ROOT, d)).filter((x) => /^a\d\d-.*\.md$/.test(x)).sort()
            .map((f) => ({ ...parseAula(path.join(ROOT, d, f)), chave: `${d}/${f.slice(0, 3)}` }));
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        pptx.title = `${aulas[0].mod} — ${plano.titulo}`;
        pptx.company = MARCA;
        capaModulo(pptx, aulas[0].mod, plano, aulas);
        const falas = narr(d);
        aulas.forEach((a) => montarAula(pptx, a, falas));
        if (plano.quiz.length) slideQuiz(pptx, plano, `${aulas[0].mod} · Teste rápido`);
        if (plano.entregavel || plano.exercicios.length) slideFechamento(pptx, plano, `${aulas[0].mod} · Fechamento`);
        const file = path.join(__dirname, `${d}.pptx`);
        await pptx.writeFile({ fileName: file });
        const n = pptx.slides.length;
        total += n;
        console.log(`${d}: ${n} slides`);

        // Um arquivo por aula (slides/aulas/mXX-…/aYY-….pptx), para publicar aula a aula:
        // a capa do módulo abre a primeira aula; teste rápido e fechamento encerram a última.
        fs.mkdirSync(path.join(__dirname, 'aulas', d), { recursive: true });
        for (const [i, a] of aulas.entries()) {
            const px = new PptxGenJS();
            px.layout = 'LAYOUT_WIDE';
            px.title = `${a.mod} · Aula ${a.aula} — ${a.titulo}`;
            px.company = MARCA;
            if (i === 0) { capaModulo(px, a.mod, plano, aulas); marcar(px, [], 0, 'capa'); }
            montarAula(px, a, falas);
            if (i === aulas.length - 1) {
                if (plano.quiz.length) { slideQuiz(px, plano, `${a.mod} · Teste rápido`); marcar(px, [], 0, 'quiz'); px._tl[px._tl.length - 1].tipo = 'gabarito'; }
                if (plano.entregavel || plano.exercicios.length) { slideFechamento(px, plano, `${a.mod} · Fechamento`); marcar(px, [], (plano.entregavel + plano.exercicios.join(' ')).length, 'fechamento'); }
            }
            fs.writeFileSync(path.join(__dirname, 'aulas', d, `${a.chave.slice(-3)}.json`), JSON.stringify(px._tl));
            await px.writeFile({ fileName: path.join(__dirname, 'aulas', d, `${a.chave.slice(-3)}.pptx`) });
        }
    }
    console.log(`total: ${total} slides em ${dirs.length} arquivos`);
})();

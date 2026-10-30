#!/usr/bin/env node
// Narração do curso com o ElevenLabs. Sem dependências: Node 18+ (fetch nativo).
//
//   node gerar-audio.cjs textos  [filtro]            exporta os textos prontos (textos/mXX/aYY.txt), sem usar a API
//   node gerar-audio.cjs estimar [filtro]            conta caracteres que seriam enviados
//   node gerar-audio.cjs vozes                       lista as vozes da conta (precisa da chave)
//   node gerar-audio.cjs gerar   [filtro] [--forcar] gera um MP3 por cena em saida/mXX/aYY/cNN.mp3
//   node gerar-audio.cjs juntar  [filtro]            junta as cenas em saida/mXX/aYY.mp3 (precisa do ffmpeg)
//
// filtro: "m01" (módulo) ou "m01/a03" (aula). Configuração por variáveis de ambiente — ver README.md.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', 'roteiros');
const SAIDA = path.join(__dirname, 'saida');
const TEXTOS = path.join(__dirname, 'textos');
const REGRAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'pronuncia.json'), 'utf8')).regras
    .map(([re, sub]) => [new RegExp(re, 'g'), sub]);

const env = (k, d) => (process.env[k] === undefined || process.env[k] === '' ? d : process.env[k]);
const CFG = {
    chave: env('ELEVENLABS_API_KEY'),
    voz: env('ELEVENLABS_VOICE_ID'),
    modelo: env('ELEVENLABS_MODEL', 'eleven_multilingual_v2'),
    formato: env('ELEVENLABS_OUTPUT', 'mp3_44100_128'),
    settings: {
        stability: Number(env('ELEVENLABS_STABILITY', 0.5)),
        similarity_boost: Number(env('ELEVENLABS_SIMILARITY', 0.75)),
        style: Number(env('ELEVENLABS_STYLE', 0.15)),
        use_speaker_boost: env('ELEVENLABS_SPEAKER_BOOST', 'true') === 'true',
        speed: Number(env('ELEVENLABS_SPEED', 1.0)),
    },
    pausa: Number(env('PAUSA_ENTRE_CENAS', 0.8)),
    paralelo: Number(env('ELEVENLABS_CONCORRENCIA', 2)),
};
const LIMITE = 4500; // caracteres por requisição (o modelo aceita mais; blocos menores soam mais estáveis)

// ---------- textos ----------
function normalizar(t) {
    let s = t.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s*\[CONFERIR[^\]]*\]/gi, '');
    for (const [re, sub] of REGRAS) s = s.replace(re, sub);
    s = s.replace(/\s+/g, ' ').replace(/\s([,.;:!?])/g, '$1').trim();
    return /[.!?…]$/.test(s) ? s : `${s}.`;
}

function aulas(filtro = '') {
    const [fm, fa] = filtro.split('/');
    return fs.readdirSync(ROOT).filter((d) => /^m\d\d-/.test(d) && (!fm || d.startsWith(fm))).sort().flatMap((d) =>
        fs.readdirSync(path.join(ROOT, d)).filter((f) => /^a\d\d-.*\.md$/.test(f) && (!fa || f.startsWith(fa))).sort().map((f) => {
            const md = fs.readFileSync(path.join(ROOT, d, f), 'utf8');
            const titulo = (md.match(/^# (.+)$/m) || [])[1] || f;
            const marks = [...md.matchAll(/^## Cena (\d+) — (.+?) \(([^)]*)\)\s*$/gm)];
            const fim = md.indexOf('\n## Materiais') > 0 ? md.indexOf('\n## Materiais') : md.length;
            const cenas = marks.map((m, i) => {
                const body = md.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : fim);
                const narracao = ((body.match(/\*\*Narração:\*\*([\s\S]*)$/) || [])[1] || '').trim();
                return { n: Number(m[1]), nome: m[2], texto: normalizar(narracao) };
            }).filter((c) => c.texto.length > 1);
            return { mod: d, id: f.slice(0, 3), titulo, cenas };
        }));
}

function blocos(texto) {
    if (texto.length <= LIMITE) return [texto];
    const frases = texto.match(/[^.!?…]+[.!?…]+(\s|$)/g) || [texto];
    const out = [''];
    for (const f of frases) {
        if ((out[out.length - 1] + f).length > LIMITE) out.push('');
        out[out.length - 1] += f;
    }
    return out.map((b) => b.trim()).filter(Boolean);
}

// ---------- API ----------
async function api(url, opts, tentativa = 1) {
    const res = await fetch(`https://api.elevenlabs.io${url}`, { ...opts, headers: { 'xi-api-key': CFG.chave, ...(opts.headers || {}) } });
    if (res.ok) return res;
    const corpo = await res.text();
    if ((res.status === 429 || res.status >= 500) && tentativa < 6) {
        const espera = Math.min(60, 2 ** tentativa) * 1000;
        console.log(`  … ${res.status}, nova tentativa em ${espera / 1000}s`);
        await new Promise((r) => setTimeout(r, espera));
        return api(url, opts, tentativa + 1);
    }
    throw new Error(`ElevenLabs ${res.status}: ${corpo.slice(0, 300)}`);
}

async function falar(texto, anterior, seguinte) {
    const res = await api(`/v1/text-to-speech/${CFG.voz}?output_format=${CFG.formato}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({
            text: texto, model_id: CFG.modelo, voice_settings: CFG.settings, language_code: 'pt',
            previous_text: anterior?.slice(-500), next_text: seguinte?.slice(0, 500),
        }),
    });
    return Buffer.from(await res.arrayBuffer());
}

// ---------- comandos ----------
function exigir(...chaves) {
    const faltando = chaves.filter((k) => !CFG[k]);
    if (faltando.length) {
        console.error(`Defina ${faltando.map((k) => ({ chave: 'ELEVENLABS_API_KEY', voz: 'ELEVENLABS_VOICE_ID' }[k])).join(' e ')} (ver README.md).`);
        process.exit(1);
    }
}

function cmdTextos(filtro) {
    let total = 0;
    for (const a of aulas(filtro)) {
        const dir = path.join(TEXTOS, a.mod);
        fs.mkdirSync(dir, { recursive: true });
        // <break> é entendido pelo ElevenLabs (Studio e API): pausa entre cenas.
        const txt = a.cenas.map((c) => c.texto).join(`\n\n<break time="${CFG.pausa}s" />\n\n`);
        fs.writeFileSync(path.join(dir, `${a.id}.txt`), `${txt}\n`);
        total += txt.length;
    }
    console.log(`textos exportados em ${TEXTOS} (${total.toLocaleString('pt-BR')} caracteres)`);
}

function cmdEstimar(filtro) {
    const lista = aulas(filtro);
    const chars = lista.reduce((t, a) => t + a.cenas.reduce((s, c) => s + c.texto.length, 0), 0);
    const cenas = lista.reduce((t, a) => t + a.cenas.length, 0);
    console.log(`${lista.length} aulas · ${cenas} cenas · ${chars.toLocaleString('pt-BR')} caracteres · ~${Math.round(chars / 900)} min de áudio`);
}

async function cmdVozes() {
    exigir('chave');
    const { voices } = await (await api('/v1/voices', { method: 'GET' })).json();
    voices.forEach((v) => console.log(`${v.voice_id}  ${v.name}  [${v.category}]  ${Object.values(v.labels || {}).join(', ')}`));
}

async function cmdGerar(filtro, forcar) {
    exigir('chave', 'voz');
    const manifestoFile = path.join(SAIDA, 'manifesto.json');
    const manifesto = fs.existsSync(manifestoFile) ? JSON.parse(fs.readFileSync(manifestoFile, 'utf8')) : {};
    const tarefas = [];
    for (const a of aulas(filtro)) {
        a.cenas.forEach((c, i) => {
            const arquivo = path.join(SAIDA, a.mod, a.id, `c${String(c.n).padStart(2, '0')}.mp3`);
            const hash = crypto.createHash('sha1').update(JSON.stringify([c.texto, CFG.voz, CFG.modelo, CFG.settings])).digest('hex');
            const chave = path.relative(SAIDA, arquivo);
            if (!forcar && manifesto[chave] === hash && fs.existsSync(arquivo)) return;
            tarefas.push({ a, c, arquivo, hash, chave, anterior: a.cenas[i - 1]?.texto, seguinte: a.cenas[i + 1]?.texto });
        });
    }
    console.log(`${tarefas.length} cena(s) para gerar (${tarefas.reduce((t, x) => t + x.c.texto.length, 0).toLocaleString('pt-BR')} caracteres)`);
    let feitas = 0;
    const trabalhar = async () => {
        for (let t = tarefas.shift(); t; t = tarefas.shift()) {
            const partes = blocos(t.c.texto);
            const audios = [];
            for (let i = 0; i < partes.length; i++) audios.push(await falar(partes[i], i ? partes[i - 1] : t.anterior, partes[i + 1] || t.seguinte));
            fs.mkdirSync(path.dirname(t.arquivo), { recursive: true });
            fs.writeFileSync(t.arquivo, Buffer.concat(audios));
            manifesto[t.chave] = t.hash;
            fs.writeFileSync(manifestoFile, JSON.stringify(manifesto, null, 2));
            console.log(`  ✓ ${t.chave}  (${++feitas})`);
        }
    };
    fs.mkdirSync(SAIDA, { recursive: true });
    await Promise.all(Array.from({ length: Math.max(1, CFG.paralelo) }, trabalhar));
}

function ffmpeg() {
    const candidatos = [env('FFMPEG'), 'ffmpeg'].filter(Boolean);
    for (const c of candidatos) { try { execFileSync(c, ['-version'], { stdio: 'ignore' }); return c; } catch { /* tenta o próximo */ } }
    console.error('ffmpeg não encontrado: instale-o ou defina FFMPEG=/caminho/ffmpeg.');
    process.exit(1);
}

function cmdJuntar(filtro) {
    const bin = ffmpeg();
    for (const a of aulas(filtro)) {
        const dir = path.join(SAIDA, a.mod, a.id);
        const cenas = a.cenas.map((c) => path.join(dir, `c${String(c.n).padStart(2, '0')}.mp3`));
        const faltando = cenas.filter((f) => !fs.existsSync(f));
        if (faltando.length) { console.log(`  · ${a.mod}/${a.id}: faltam ${faltando.length} cena(s), gere antes`); continue; }
        const silencio = path.join(SAIDA, `silencio-${CFG.pausa}s.mp3`);
        if (!fs.existsSync(silencio)) execFileSync(bin, ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(CFG.pausa), '-b:a', '128k', silencio]);
        const lista = path.join(dir, 'lista.txt');
        fs.writeFileSync(lista, cenas.flatMap((f, i) => (i ? [silencio, f] : [f])).map((f) => `file '${f}'`).join('\n'));
        const destino = path.join(SAIDA, a.mod, `${a.id}.mp3`);
        execFileSync(bin, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-ar', '44100', '-b:a', '128k', destino]);
        fs.unlinkSync(lista);
        console.log(`  ✓ ${path.relative(SAIDA, destino)}`);
    }
}

const [cmd, ...args] = process.argv.slice(2);
const filtro = args.find((x) => !x.startsWith('--')) || '';
const comandos = {
    textos: () => cmdTextos(filtro), estimar: () => cmdEstimar(filtro), vozes: cmdVozes,
    gerar: () => cmdGerar(filtro, args.includes('--forcar')), juntar: () => cmdJuntar(filtro),
};
if (!comandos[cmd]) {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 9).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    process.exit(cmd ? 1 : 0);
}
Promise.resolve(comandos[cmd]()).catch((e) => { console.error(e.message); process.exit(1); });

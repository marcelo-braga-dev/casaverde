// Captura as telas da plataforma usadas nos slides (docs/curso/slides/telas/*.jpg), uma sessão por perfil.
// Uso (de docs/curso/ferramentas, após npm ci):
//   LAB_URL=https://gdsolar.rexar.com.br LAB_SENHA=... CHROME=/caminho/chrome-headless-shell node capturar-telas.cjs [telas.json] [../slides/telas]
// A instância precisa estar com DEMO_MODE=false (login por senha) e os dados de demonstração carregados.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const telasFile = process.argv[2] || path.join(__dirname, 'telas.json');
const outDir = process.argv[3] || path.join(__dirname, '..', 'slides', 'telas');
const BASE = (process.env.LAB_URL || 'https://gdsolar.rexar.com.br').replace(/\/$/, '');
const SENHA = process.env.LAB_SENHA;
const CONTAS = { admin: 'admin@teste.com', consultor: 'joao.consultor@demo.com', cliente: 'sabor.serra@cliente.demo', produtor: 'sertao.solar@cliente.demo' };
if (!SENHA) { console.error('Defina LAB_SENHA (senha das contas de demonstração).'); process.exit(1); }

(async () => {
    const telas = JSON.parse(fs.readFileSync(telasFile, 'utf8'));
    fs.mkdirSync(outDir, { recursive: true });
    const browser = await chromium.launch({ executablePath: process.env.CHROME, args: ['--no-sandbox'] });
    const porPerfil = {};
    Object.entries(telas).forEach(([chave, [url, perfil]]) => { (porPerfil[perfil] ||= []).push([chave, url]); });
    for (const [perfil, lista] of Object.entries(porPerfil)) {
        const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, locale: 'pt-BR' });
        const page = await ctx.newPage();
        await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
        await page.fill('input[name=email]', CONTAS[perfil]);
        await page.fill('input[name=password]', SENHA);
        await page.press('input[name=password]', 'Enter');
        await page.waitForTimeout(4000);
        for (const [chave, url] of lista) {
            try {
                await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 45000 });
                await page.waitForTimeout(1200);
                await page.screenshot({ path: path.join(outDir, `${chave}.jpg`), type: 'jpeg', quality: 82 });
                console.log('ok', perfil, chave);
            } catch (e) {
                console.log('erro', chave, e.message.split('\n')[0]);
            }
        }
        await ctx.close();
    }
    await browser.close();
})();

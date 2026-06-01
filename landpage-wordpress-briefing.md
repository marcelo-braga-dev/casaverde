# BRIEFING COMPLETO — Landing Page WordPress · Casa Verde Consórcio

> **Destinatário:** Claude Code  
> **Objetivo:** Criar um tema WordPress completo, autossuficiente, para uma landing page de alta conversão para a Casa Verde Consórcio — empresa de energia solar por compensação/assinatura em Maringá-PR.  
> **Resultado esperado:** Um diretório de tema WordPress pronto para ser copiado para `wp-content/themes/casaverde-lp/` e ativado no painel, sem dependência de construtores de página.

---

## 1. SOBRE O NEGÓCIO

**Empresa:** Casa Verde Consórcio / Casa Verde LTDA  
**CNPJ:** 042.386.993/0001-21  
**Endereço:** Av. Mandacarú, 4943, Maringá – PR  
**Telefone:** (44) 99838-0170  
**E-mail:** contato@casaverdeconsorcio.com.br  
**Instagram:** @casa.verdeenergia  
**Site atual (referência de conteúdo):** casaverdeconsorcio.com.br  

**O que a empresa faz:**  
Intermedia energia solar por compensação. Proprietários de usinas solares (Produtores) geram energia limpa, e consumidores (Clientes) usufruem dessa energia com **até 25% de desconto** na conta de luz, **sem investir nada** em equipamentos próprios. É permitido pela **Lei 14.300 da ANEEL** (geração distribuída compartilhada).

**Dois públicos-alvo desta landing page:**
1. **Clientes (consumidores):** Pessoas físicas e jurídicas que querem reduzir a conta de luz sem instalar painéis.
2. **Produtores (proprietários de usinas solares):** Quem tem terreno/galpão e quer hospedar uma usina com a Casa Verde gerenciando tudo.

---

## 2. PALETA DE CORES

```
--cv-green-dark:    #1B5E20   /* Verde floresta — identidade principal */
--cv-green-mid:     #2E7D32   /* Verde primário — botões, links */
--cv-green-light:   #43A047   /* Verde secundário — hovers, destaques */
--cv-green-pale:    #E8F5E9   /* Verde pálido — fundos de seções alternadas */
--cv-green-ultra:   #F1F8F1   /* Verde ultra-claro — fundo geral */

--cv-solar-yellow:  #F9A825   /* Amarelo solar — acento decorativo */
--cv-solar-orange:  #E65100   /* Laranja — CTA principal, urgência */
--cv-solar-warm:    #FFF8E1   /* Amarelo claro — fundo de destaques */

--cv-white:         #FFFFFF
--cv-gray-100:      #F5F5F5
--cv-gray-200:      #EEEEEE
--cv-gray-400:      #BDBDBD
--cv-gray-600:      #757575
--cv-gray-800:      #424242
--cv-text-dark:     #1A2B1A   /* Quase preto com toque verde */
--cv-text-mid:      #4A5A4A

/* Gradientes principais */
--cv-gradient-hero: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #1B5E20 100%);
--cv-gradient-cta:  linear-gradient(135deg, #E65100 0%, #F57C00 100%);
--cv-gradient-card: linear-gradient(180deg, #FFFFFF 0%, #F1F8F1 100%);
```

---

## 3. TIPOGRAFIA

**Google Fonts usadas:**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

- **Headings (h1–h4):** `Poppins`, weights 700–900
- **Subtítulos/labels:** `Poppins`, weight 500–600
- **Corpo de texto:** `Inter`, weight 400–500
- **Tamanho base:** 16px, line-height 1.65
- **Escala modular (1.25):**
  - xs: 12px
  - sm: 14px
  - base: 16px
  - md: 20px
  - lg: 25px
  - xl: 32px
  - 2xl: 40px
  - 3xl: 50px
  - 4xl: 64px (hero)

---

## 4. ESTRUTURA DE ARQUIVOS DO TEMA

```
casaverde-lp/
├── style.css                  (obrigatório WordPress — theme info + reset + variables)
├── index.php                  (landing page completa — template único)
├── functions.php              (enqueue de scripts/styles, menus, widgets básicos)
├── header.php                 (navegação sticky com logo + menu + CTA button)
├── footer.php                 (rodapé completo)
├── page.php                   (fallback para outras páginas, ex: blog, contato)
├── screenshot.png             (1200x900, preview do tema no painel — pode ser placeholder)
├── assets/
│   ├── css/
│   │   ├── landing.css        (estilos específicos da landing page)
│   │   └── animations.css     (keyframes, transitions, scroll-reveal classes)
│   ├── js/
│   │   ├── main.js            (menu mobile, scroll behavior, counter animation)
│   │   ├── slider.js          (carrossel de depoimentos — vanilla JS, sem jQuery)
│   │   └── form.js            (validação + envio AJAX do formulário de contato)
│   └── img/
│       └── (README dizendo quais imagens colocar — usando Unsplash URLs como placeholder)
└── template-parts/
    ├── section-hero.php
    ├── section-benefits.php
    ├── section-how-it-works.php
    ├── section-about.php
    ├── section-stats.php
    ├── section-testimonials.php
    ├── section-portfolio.php
    ├── section-faq.php
    ├── section-cta.php
    └── section-contact.php
```

---

## 5. SECTIONS COMPLETAS — CONTEÚDO E ESTRUTURA

### 5.1 NAVIGATION (header.php)

**Comportamento:**
- Sticky ao fazer scroll (classe `.scrolled` adicionada via JS após 80px)
- Fundo transparente no topo sobre o hero, muda para `#1B5E20` sólido ao scrollar
- Logo à esquerda: texto "CASA VERDE" em Poppins 700, cor branca com ícone de folha (SVG inline)
- Menu central: Home | Quem Somos | Benefícios | FAQ | Contato
- Botão CTA à direita: "Economize Agora" — laranja (`--cv-solar-orange`)
- Ícone hamburguer no mobile, menu drawer lateral verde

**HTML estrutura:**
```html
<header id="site-header" class="site-header">
  <div class="container header-inner">
    <a href="#hero" class="logo">
      <!-- SVG de folha + texto "CASA VERDE" + subtexto "CONSÓRCIO" menor -->
    </a>
    <nav class="main-nav">
      <ul>
        <li><a href="#hero">Home</a></li>
        <li><a href="#sobre">Quem Somos</a></li>
        <li><a href="#beneficios">Benefícios</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
    </nav>
    <a href="#lead-form" class="btn btn-cta">Economize Agora</a>
    <button class="mobile-toggle" aria-label="Menu"><!-- hamburguer SVG --></button>
  </div>
</header>
```

---

### 5.2 HERO SECTION (section-hero.php)

**Design:**
- Full viewport height (100vh), background com gradiente verde escuro
- Overlay de partículas animadas simulando células solares (SVG pattern ou canvas)
- Imagem de fundo: painel solar com família feliz (Unsplash placeholder)
- Background: `linear-gradient(135deg, rgba(27,94,32,0.92) 0%, rgba(46,125,50,0.85) 100%)` sobre a imagem
- Animação de entrada: texto aparece de baixo para cima com `opacity 0→1`

**Conteúdo:**
```
[TAG/BADGE] ☀ Lei 14.300 ANEEL • Energia Solar Garantida

[H1] Economize até 25% na
Sua Conta de Energia
Sem Investir Nada.

[SUBTÍTULO]
Energia solar limpa e renovável direto para sua casa ou empresa.
Sem instalação. Sem fidelidade. Só economia todo mês.

[DOIS BOTÕES]
→ [PRIMÁRIO LARANJA] "Quero Economizar Agora" (ancora para #lead-form)
→ [SECUNDÁRIO BRANCO OUTLINE] "Como Funciona?" (ancora para #como-funciona)

[SELOS/TRUST BADGES — 3 ícones inline abaixo dos botões]
✓ Sem investimento    ✓ Sem instalação    ✓ Sem fidelidade

[SCROLL INDICATOR — seta pulsante para baixo]
```

**Floating card de destaque (posicionado canto inferior direito do hero):**
```
┌─────────────────────┐
│  💰 Desconto fixo   │
│   até 25%           │
│  na fatura mensal   │
│  Garantido!         │
└─────────────────────┘
```

---

### 5.3 LEAD FORM SECTION (ainda dentro de hero ou seção própria)

**ID:** `#lead-form`  
**Design:** Card branco centralizado com sombra, logo abaixo do hero, fundo `--cv-green-pale`

**Conteúdo:**
```
[H2] Saiba Quanto Você Pode Economizar Todo Mês!

[FORMULÁRIO — 3 campos inline no desktop, empilhados no mobile]
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐
│  Seu Nome    │ │   Telefone   │ │    E-mail    │ │ CALCULAR   │
│              │ │ (44) 9...    │ │              │ │  ECONOMIA  │
└──────────────┘ └──────────────┘ └──────────────┘ └────────────┘

[PEQUENO TEXTO ABAIXO]
🔒 Seus dados estão seguros. Não enviamos spam.
Retorno em até 24 horas.
```

**Ação do form:** POST para `admin-ajax.php` ou `wp_mail()` — enviar para contato@casaverdeconsorcio.com.br com os dados. Mostrar mensagem de sucesso "Ótimo! Em breve nossa equipe entrará em contato." com animação verde.

---

### 5.4 BENEFITS STRIP — 3 cards rápidos

**Design:** 3 cards horizontais, fundo branco, ícones SVG coloridos, sem fundo

**Conteúdo:**
```
[ÍCONE SOL] Reduza Sua Conta
Desconto fixo de até 25% todo mês, garantido por contrato.

[ÍCONE FOLHA] 100% Sustentável  
Energia limpa gerada por usinas solares parceiras.

[ÍCONE ESCUDO] Sem Bandeiras Tarifárias
Fique imune às variações de bandeiras amarela e vermelha.
```

---

### 5.5 HOW IT WORKS — "Como Funciona" (section-how-it-works.php)

**ID:** `#como-funciona`  
**Design:** Fundo branco, 4 steps com numeração grande verde, linha conectora horizontal no desktop

**Conteúdo:**
```
[H2] Como Funciona em 4 Passos Simples?

[STEP 1 — Número "01" grande verde]
Você Se Cadastra
Entre em contato e nossa equipe realiza um diagnóstico
gratuito do seu consumo de energia.

[STEP 2 — Número "02"]
Assinamos o Contrato
Você recebe uma proposta personalizada e assina o contrato
de participação. Sem investimento.

[STEP 3 — Número "03"]
Usina Gera Energia
Nossas usinas solares parceiras geram energia limpa e
a injetam na rede da sua concessionária.

[STEP 4 — Número "04"]
Você Economiza
A concessionária aplica o desconto direto na sua fatura.
Você recebe relatórios mensais pela plataforma.

[BOTÃO ABAIXO] "Quero Participar" → ancora #lead-form
```

---

### 5.6 MAIN BENEFITS SECTION (section-benefits.php)

**ID:** `#beneficios`  
**Design:** Fundo `--cv-green-pale`, grid 3 colunas desktop / 1 coluna mobile, cards com ícone + título + texto

**Título da seção:**
```
[TAG] Por que escolher a Casa Verde?
[H2] Principais Benefícios em Ser Nosso Parceiro
[SUBTÍTULO] Energia limpa, economia garantida e gestão completa. Sem complicações.
```

**6 cards de benefícios:**
```
🌱 Economia Real e Garantida
Reduza sua fatura de energia elétrica com desconto fixo de até 25% todo mês,
garantido por contrato. Sem surpresas, sem variações.

🏭 Gestão Completa pela Casa Verde
Nossa equipe cuida de todos os aspectos operacionais: contrato, fatura,
atendimento e relatórios. Você só aproveita o desconto.

⚡ Livre das Bandeiras Tarifárias
Fica imune às variações das bandeiras tarifárias. Bandeira amarela ou vermelha?
Não é mais o seu problema.

🌍 Energia 100% Sustentável
Contribua para um futuro mais sustentável. Cada kWh que você consome
vem de fontes renováveis, reduzindo sua emissão de carbono.

📊 Monitoramento e Relatórios
Acompanhe seu histórico de consumo, economia gerada e valores pagos
diretamente na plataforma. Tudo transparente.

🛡️ Suporte Técnico Especializado
Nossa equipe está disponível para atender emergências e tirar dúvidas.
Você nunca estará sozinho.
```

---

### 5.7 ABOUT SECTION (section-about.php)

**ID:** `#sobre`  
**Design:** Dois colunas — imagem à esquerda (usina solar, Unsplash), texto à direita. Fundo branco.

**Conteúdo:**
```
[TAG] Quem Somos?

[H2] Casa Verde Consórcio

[TEXTO]
Por meio de fontes renováveis de energia, buscamos proporcionar economia na
conta de luz de nossos parceiros. Com a geração compartilhada de nossas usinas,
os nossos parceiros da Casa Verde não precisam investir em sistemas próprios para
ter acesso à energia limpa e ainda garantir descontos em suas contas de luz.

Somos intermediadores entre produtores de energia solar e consumidores,
operando dentro das normas da Lei 14.300 da ANEEL, que regulamenta a
geração distribuída compartilhada no Brasil.

Ao tornar-se parceiro da CASA VERDE, você passa a fazer parte de um grupo que
valoriza a sustentabilidade e a inovação.

[3 checkmarks]
✓ Reduza sua Emissão de Carbono
✓ Reduza os custos da sua conta de energia  
✓ Utilize energia de Fonte Sustentável

[BOTÃO OUTLINE VERDE] "Conheça Nossa História"  → scroll para #contato
```

---

### 5.8 STATS SECTION — Números que impressionam

**Design:** Fundo gradiente verde escuro, texto branco, 4 contadores animados com JavaScript (count-up ao entrar na tela via Intersection Observer)

**Conteúdo:**
```
[H2 branco] Resultados que Falam por Si

[4 stat cards]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 500+              25%
 Parceiros        Economia média
 ativos           garantida
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 100%             0
 Energia          Necessidade de
 renovável        instalação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 5.9 TESTIMONIALS SECTION (section-testimonials.php)

**Design:** Fundo branco, carrossel automático com autoplay de 4s, 3 cards visíveis no desktop, 1 no mobile, setas e dots de navegação. Cards com foto de perfil (avatar colorido com iniciais como placeholder), estrelas douradas, aspas estilizadas.

**Conteúdo (depoimentos — adicionar mais 2 além dos 3 existentes):**
```
★★★★★
"Desde que virei parceiro da Casa Verde, tive bastante redução na minha conta
de energia. Energia limpa e economia de verdade!"
— Maria Santana, Paraná

★★★★★
"Economizo todo mês e sei que estou investindo em um futuro mais sustentável.
Vale muito a pena!"
— Jennifer Santos, Paraná

★★★★★
"Adorei fazer parte da cooperativa. Atendimento excelente e ainda ajudo o
meio ambiente."
— Maicon Lacerda, Paraná

★★★★★
"Processo super simples, sem burocracia. Em menos de 15 dias já estava
economizando na conta."
— Carlos Mendonça, Maringá-PR

★★★★★
"A equipe da Casa Verde é muito atenciosa. Recomendo para todos os amigos e
familiares."
— Ana Paula Ribeiro, Londrina-PR
```

---

### 5.10 PORTFOLIO SECTION (section-portfolio.php)

**Design:** Fundo `--cv-green-pale`, grid de cards de usinas com imagens (Unsplash: solar farm). Cada card com overlay verde escuro no hover mostrando mais detalhes.

**Conteúdo:**
```
[TAG] Nossas Instalações
[H2] Portfólio de Usinas Parceiras
[SUBTÍTULO] Infraestrutura real gerando energia limpa para nossos parceiros.

[3 cards de usina — placeholder]
┌──────────────────────────────┐
│ [imagem usina solar]         │
│ Usina Solar PR-01            │
│ Maringá – PR                 │
│ Capacidade: 250 kWp          │
│ Geração: ~30.000 kWh/mês     │
└──────────────────────────────┘

(repetir para Usina PR-02 e Usina PR-03 com dados similares)

[BOTÃO] "Quero Ser um Produtor Parceiro" → ancora #contato
```

---

### 5.11 PRODUCER CTA SECTION — Seção especial para produtores

**Design:** Fundo bicolor — metade verde, metade solar, com divisória diagonal. Seção distinta visualmente.

**Conteúdo:**
```
[BADGE] Para Proprietários de Imóvel / Usinas

[H2] Você Tem Terreno ou Galpão?
Seja um Produtor Parceiro Casa Verde!

[TEXTO]
Monetize seu espaço ocioso com uma usina solar. Nós cuidamos de toda a
operação: instalação, gestão, clientes e pagamentos. Você recebe renda
passiva com energia limpa.

[4 benefícios do produtor]
✓ Renda passiva garantida por contrato
✓ Gestão operacional 100% pela Casa Verde
✓ Sem custos de manutenção para você
✓ Contribuição para a sustentabilidade

[BOTÃO LARANJA] "Quero Ser um Produtor" → ancora #contato
```

---

### 5.12 FAQ SECTION (section-faq.php)

**ID:** `#faq`  
**Design:** Fundo branco, accordion com animação de abertura/fechamento suave, ícone "+" que vira "−", borda esquerda verde ao abrir.

**Perguntas e respostas completas:**

```
Q: QUAL O CUSTO?
A: Para se tornar um parceiro Casa Verde, existe apenas o valor simbólico de R$1,00
que será cobrado na sua primeira fatura. Após isso, você paga somente o valor com
desconto da sua energia — sem taxas de adesão, sem mensalidade extra.

Q: EXISTE REAJUSTE?
A: Sim, existe reajuste anual indexado ao IPCA (índice oficial de inflação), o mesmo
índice que as concessionárias utilizam. Isso garante que seu desconto de até 25% se
mantenha real ao longo do tempo.

Q: COMO É FEITO O RATEIO?
A: A energia gerada pelas nossas usinas é injetada na rede elétrica da concessionária.
Cada parceiro recebe créditos de energia proporcionais à sua cota contratada, que são
abatidos automaticamente na sua fatura mensal.

Q: ME MUDEI, E AGORA?
A: Sem problemas! Se você mudou de endereço dentro da área de atuação da mesma
concessionária, basta atualizar seus dados conosco. Se mudou para outra área de
concessão, nossa equipe analisará as opções disponíveis para você.

Q: QUERO AJUSTAR A MINHA MÉDIA COMPENSADA, CONSIGO?
A: Sim! Você pode ajustar sua cota de energia conforme sua necessidade de consumo,
respeitando um prazo de aviso prévio. Fale com nossa equipe para fazer o ajuste.

Q: DE ONDE VEM A ENERGIA?
A: A energia é gerada exclusivamente por usinas fotovoltaicas (painéis solares) parceiras
da Casa Verde, todas devidamente registradas na ANEEL e operando dentro das normas
da Lei 14.300/2022.

Q: PRECISO MUDAR ALGO NA MINHA INSTALAÇÃO ELÉTRICA?
A: Não! Você não precisa instalar nada em sua casa ou empresa. A energia solar é injetada
diretamente na rede da concessionária e os créditos são aplicados automaticamente na
sua conta de luz. Zero obras, zero complicação.

Q: E AS BANDEIRAS TARIFÁRIAS?
A: Como parceiro Casa Verde, você fica imune às bandeiras tarifárias (amarela, vermelha 1
e vermelha 2). Seu desconto é calculado sobre a tarifa sem bandeira, proporcionando
ainda mais economia nos períodos de estiagem.

Q: COMO FAÇO PARA ADERIR?
A: É simples! Preencha o formulário nesta página ou entre em contato pelo WhatsApp
(44) 99838-0170. Nossa equipe fará um diagnóstico gratuito do seu consumo e apresentará
uma proposta personalizada. Todo o processo é rápido e sem burocracia.
```

---

### 5.13 CONTACT SECTION (section-contact.php)

**ID:** `#contato`  
**Design:** Fundo `--cv-green-pale`, dois cards lado a lado — formulário à esquerda, info de contato à direita.

**Formulário:**
```
[H2] Entre em Contato!
[SUBTÍTULO] Nossa equipe responde em até 24 horas.

[FORM FIELDS]
Nome Completo *
E-mail *
Telefone/WhatsApp *
Mensagem
[Dropdown] Sou: [ Cliente / Produtor / Outro ]

[BOTÃO LARANJA] "Enviar Mensagem"
```

**Info de contato (card direito):**
```
📞 Telefone / WhatsApp
(44) 99838-0170

📧 E-mail
contato@casaverdeconsorcio.com.br

📍 Endereço
Av. Mandacarú, 4943
Maringá – PR, Brasil

📱 Instagram
@casa.verdeenergia

🕐 Horário de Atendimento
Segunda a Sexta: 8h às 18h
Sábado: 8h às 12h
```

**Botões de ação rápida:**
- WhatsApp button flutuante (fixo no canto inferior direito durante todo scroll)
- Link direto: `https://wa.me/5544998380170`

---

### 5.14 FOOTER (footer.php)

**Design:** Fundo `--cv-green-dark`, texto branco/cinza claro, 3 colunas + linha final.

**Colunas:**
```
[COL 1] Logo + Tagline
CASA VERDE CONSÓRCIO
"Energia limpa para um futuro sustentável"
[Links redes sociais: Instagram]

[COL 2] Links Rápidos
Home | Quem Somos | Benefícios | Como Funciona | FAQ | Contato | Blog

[COL 3] Contato
📞 (44) 99838-0170
📧 contato@casaverdeconsorcio.com.br
📍 Av. Mandacarú, 4943, Maringá – PR

[LINHA FINAL]
© 2025 Casa Verde LTDA — CNPJ: 042.386.993/0001-21
Desenvolvido com ♡ | Política de Privacidade
```

---

## 6. LAYOUT E DESIGN SPECS

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Seções
```css
section {
  padding: 80px 0; /* desktop */
  padding: 60px 0; /* mobile */
}
```

### Bordas e sombras
```css
--shadow-sm: 0 2px 8px rgba(27,94,32,0.08);
--shadow-md: 0 4px 20px rgba(27,94,32,0.12);
--shadow-lg: 0 8px 40px rgba(27,94,32,0.18);
--shadow-xl: 0 20px 60px rgba(27,94,32,0.22);
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
```

### Botões
```css
/* Primário (laranja) */
.btn-primary {
  background: linear-gradient(135deg, #E65100, #F57C00);
  color: white;
  padding: 16px 32px;
  border-radius: 50px; /* pill shape */
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(230,81,0,0.35);
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(230,81,0,0.45);
}

/* Secundário (outline branco) */
.btn-outline-white {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 14px 30px;
  border-radius: 50px;
  /* mesmas demais props */
}
.btn-outline-white:hover {
  background: white;
  color: #1B5E20;
}

/* CTA verde */
.btn-green {
  background: linear-gradient(135deg, #2E7D32, #43A047);
  color: white;
  /* demais props similares ao primário */
}
```

### Section Tags/Badges
```css
.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E8F5E9;
  color: #2E7D32;
  border: 1px solid #A5D6A7;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}
```

---

## 7. JAVASCRIPT FUNCIONALIDADES

### 7.1 Sticky Header com mudança de estilo
```js
// Em main.js
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
```

### 7.2 Smooth Scroll para âncoras
```js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // altura do header
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
```

### 7.3 Scroll Reveal (sem biblioteca externa — puro Intersection Observer)
```js
// Em animations.css — adicionar classe reveal-hidden a elementos
// Em main.js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

### 7.4 Counter Animation (stats section)
```js
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }
  }, 16);
}
// Ativar quando a seção entrar na viewport via Intersection Observer
```

### 7.5 FAQ Accordion (vanilla JS)
```js
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    
    // Fechar todos
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = '0';
    });
    
    // Abrir o clicado (se estava fechado)
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});
```

### 7.6 Testimonials Carousel (vanilla JS)
```js
// Carrossel com autoplay, touch/swipe suporte, dots de navegação
// 3 visíveis no desktop, 1 no mobile
// Autoplay de 4 segundos, pausa no hover
```

### 7.7 Form AJAX (form.js)
```js
// Validação client-side (campos obrigatórios, formato email, formato telefone)
// Submit via fetch() para admin-ajax.php com nonce WordPress
// Sucesso: mostrar mensagem verde animada
// Erro: mostrar mensagem vermelha
// Loading state no botão durante envio
```

### 7.8 WhatsApp Float Button
```js
// Botão flutuante fixo no canto inferior direito
// Verde com ícone WhatsApp (SVG)
// Pulsação suave via CSS animation
// Link: https://wa.me/5544998380170?text=Olá! Vim pelo site e quero saber mais sobre a Casa Verde.
```

### 7.9 Mobile Menu
```js
// Toggle classe 'open' no body
// Drawer lateral com overlay backdrop
// Fechar ao clicar em link ou backdrop
```

---

## 8. ANIMAÇÕES CSS (animations.css)

```css
/* Reveal de baixo para cima */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Delay classes */
.delay-100 { transition-delay: 0.1s; }
.delay-200 { transition-delay: 0.2s; }
.delay-300 { transition-delay: 0.3s; }

/* Reveal da esquerda */
.reveal-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal-left.reveal-visible {
  opacity: 1;
  transform: translateX(0);
}

/* Pulse (WhatsApp button) */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
  50% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
}

/* Scroll indicator */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* Hero background particles / pattern */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

/* Shimmer em loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 9. WORDPRESS functions.php

```php
<?php
// Theme setup
function casaverde_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    register_nav_menus(['primary' => 'Menu Principal']);
}
add_action('after_setup_theme', 'casaverde_setup');

// Enqueue scripts e styles
function casaverde_assets() {
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap', [], null);
    wp_enqueue_style('casaverde-style', get_stylesheet_uri(), [], '1.0.0');
    wp_enqueue_style('casaverde-landing', get_template_directory_uri() . '/assets/css/landing.css', ['casaverde-style'], '1.0.0');
    wp_enqueue_style('casaverde-animations', get_template_directory_uri() . '/assets/css/animations.css', [], '1.0.0');
    
    wp_enqueue_script('casaverde-main', get_template_directory_uri() . '/assets/js/main.js', [], '1.0.0', true);
    wp_enqueue_script('casaverde-slider', get_template_directory_uri() . '/assets/js/slider.js', [], '1.0.0', true);
    wp_enqueue_script('casaverde-form', get_template_directory_uri() . '/assets/js/form.js', ['jquery'], '1.0.0', true);
    
    // Passar dados PHP → JS (nonce para AJAX)
    wp_localize_script('casaverde-form', 'casaverdeAjax', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('casaverde_contact_nonce'),
    ]);
}
add_action('wp_enqueue_scripts', 'casaverde_assets');

// Handler AJAX para formulário de contato
function casaverde_handle_contact() {
    check_ajax_referer('casaverde_contact_nonce', 'nonce');
    
    $name    = sanitize_text_field($_POST['name'] ?? '');
    $email   = sanitize_email($_POST['email'] ?? '');
    $phone   = sanitize_text_field($_POST['phone'] ?? '');
    $message = sanitize_textarea_field($_POST['message'] ?? '');
    $type    = sanitize_text_field($_POST['type'] ?? '');
    
    if (!$name || !$email || !is_email($email)) {
        wp_send_json_error(['message' => 'Preencha os campos obrigatórios corretamente.']);
        return;
    }
    
    $to      = 'contato@casaverdeconsorcio.com.br';
    $subject = "Novo contato via site - $name ($type)";
    $body    = "Nome: $name\nE-mail: $email\nTelefone: $phone\nTipo: $type\n\nMensagem:\n$message";
    $headers = ['Content-Type: text/plain; charset=UTF-8', "Reply-To: $email"];
    
    $sent = wp_mail($to, $subject, $body, $headers);
    
    if ($sent) {
        wp_send_json_success(['message' => 'Mensagem enviada! Retornaremos em breve.']);
    } else {
        wp_send_json_error(['message' => 'Erro ao enviar. Tente pelo WhatsApp.']);
    }
}
add_action('wp_ajax_casaverde_contact', 'casaverde_handle_contact');
add_action('wp_ajax_nopriv_casaverde_contact', 'casaverde_handle_contact');

// Handler AJAX para lead form (calculadora de economia)
function casaverde_handle_lead() {
    check_ajax_referer('casaverde_contact_nonce', 'nonce');
    
    $name  = sanitize_text_field($_POST['name'] ?? '');
    $phone = sanitize_text_field($_POST['phone'] ?? '');
    $email = sanitize_email($_POST['email'] ?? '');
    
    if (!$name || !$phone) {
        wp_send_json_error(['message' => 'Preencha nome e telefone.']);
        return;
    }
    
    $to      = 'contato@casaverdeconsorcio.com.br';
    $subject = "Novo Lead via site - $name";
    $body    = "Novo lead interessado:\nNome: $name\nTelefone: $phone\nE-mail: $email";
    $headers = ['Content-Type: text/plain; charset=UTF-8'];
    
    wp_mail($to, $subject, $body, $headers);
    wp_send_json_success(['message' => 'Ótimo! Nossa equipe entrará em contato em breve!']);
}
add_action('wp_ajax_casaverde_lead', 'casaverde_handle_lead');
add_action('wp_ajax_nopriv_casaverde_lead', 'casaverde_handle_lead');

// Remove emojis e bloat desnecessário
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
```

---

## 10. META TAGS SEO (no header.php)

```html
<meta name="description" content="Economize até 25% na sua conta de energia elétrica com energia solar limpa. Sem investimento, sem instalação, sem fidelidade. Casa Verde Consórcio em Maringá-PR.">
<meta name="keywords" content="energia solar, desconto conta de luz, energia limpa, solar por assinatura, ANEEL Lei 14300, economia energia, Maringá PR, Casa Verde">
<meta property="og:title" content="Casa Verde Consórcio – Economize até 25% na Conta de Energia">
<meta property="og:description" content="Energia solar limpa sem investir nada. Desconto garantido na sua conta de luz todo mês. Conheça a Casa Verde Consórcio.">
<meta property="og:type" content="website">
<meta property="og:url" content="<?php echo home_url(); ?>">
<meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/assets/img/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="<?php echo home_url(); ?>">
```

---

## 11. SCHEMA.ORG (JSON-LD no footer)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Casa Verde Consórcio",
  "description": "Empresa de energia solar por compensação. Economia de até 25% na conta de energia sem investimento.",
  "url": "https://casaverdeconsorcio.com.br",
  "telephone": "+55-44-99838-0170",
  "email": "contato@casaverdeconsorcio.com.br",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Mandacarú, 4943",
    "addressLocality": "Maringá",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "sameAs": ["https://www.instagram.com/casa.verdeenergia"],
  "priceRange": "R$",
  "openingHours": ["Mo-Fr 08:00-18:00", "Sa 08:00-12:00"]
}
</script>
```

---

## 12. RESPONSIVIDADE — BREAKPOINTS

```css
/* Mobile first */
/* Base: 320px+ */

/* Tablet */
@media (min-width: 768px) {
  /* 2 colunas em grids */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Layout completo de desktop */
}

/* Large desktop */
@media (min-width: 1280px) {
  /* Refinamentos opcionais */
}
```

**Comportamento mobile específico:**
- Navigation: hamburguer com drawer lateral
- Hero: altura auto (min 90vh), botões em coluna
- Lead form: campos empilhados (coluna única)
- Benefits: 1 coluna
- How it works: steps em lista vertical com linha conectora vertical
- Stats: 2×2 grid
- Testimonials: 1 card por vez
- Portfolio: 1 coluna
- FAQ: full width
- Footer: 1 coluna
- WhatsApp button: sempre visível

---

## 13. IMAGES PLACEHOLDER (usar links Unsplash)

Incluir comentário em cada template-part indicando qual imagem usar:

```
Hero background:    https://images.unsplash.com/photo-1509391366360-2e959784a276 (painel solar + céu azul)
About section:      https://images.unsplash.com/photo-1466611653911-95081537e5b7 (usina solar campo)
Portfolio card 1:   https://images.unsplash.com/photo-1508514177221-188b1cf16e9d (painel solar fazenda)
Portfolio card 2:   https://images.unsplash.com/photo-1558618666-fcd25c85cd64 (painel industrial)
Portfolio card 3:   https://images.unsplash.com/photo-1497440001374-f26997328c1b (usina solar grande)
OG Image:           Composição da logo + headline sobre fundo verde
```

Todos com parâmetro `?auto=format&fit=crop&w=1200&q=80` para otimização.

---

## 14. ACESSIBILIDADE

- Todos imagens com `alt` descritivo
- Contraste WCAG AA em todos textos (verificar com ferramentas)
- Focus states visíveis (`:focus-visible` outline)
- Skip link: "Pular para conteúdo principal" (visível no focus)
- ARIA labels em botões sem texto (hamburguer, setas do carrossel)
- FAQ com `aria-expanded` no botão
- Form com labels explícitos (não só placeholder)
- Lang: `<html lang="pt-BR">`

---

## 15. PERFORMANCE

- Google Fonts com `display=swap`
- Imagens com `loading="lazy"` (exceto hero que usa CSS background)
- CSS crítico inline no `<head>` (above-the-fold): header + hero
- Scripts com `defer` ou no footer
- Nenhuma dependência de jQuery exceto o form.js (e mesmo assim pode ser vanilla)
- SVG inline para ícones (sem chamadas HTTP extras)
- Minificar CSS/JS via WordPress (ou deixar comentário instruindo a usar plugin Autoptimize)

---

## 16. PLUGINS WORDPRESS RECOMENDADOS

Incluir este texto como comentário no README do tema:

```
Plugins recomendados para produção:
- Contact Form 7 ou WPForms (alternativa ao AJAX customizado, opcional)
- Yoast SEO ou Rank Math (SEO)
- Autoptimize (minificação CSS/JS)  
- WP Rocket ou LiteSpeed Cache (cache e performance)
- UpdraftPlus (backups)
- Really Simple SSL (HTTPS)
- WP Mail SMTP (configurar envio de e-mail confiável)
```

---

## 17. INSTRUÇÕES FINAIS DE IMPLEMENTAÇÃO

1. Criar diretório `/wp-content/themes/casaverde-lp/`
2. Criar todos os arquivos listados na estrutura (seção 4)
3. O `index.php` deve incluir `header.php`, depois cada `template-part/*.php` em ordem, depois `footer.php`
4. As seções devem seguir esta ordem:
   1. Hero (section-hero.php) + Lead Form (inline ou seção própria)
   2. Benefits Strip (3 quick cards)
   3. How It Works (section-how-it-works.php)
   4. Main Benefits (section-benefits.php)
   5. About (section-about.php)
   6. Stats Counter (section-stats.php)
   7. Testimonials (section-testimonials.php)
   8. Portfolio (section-portfolio.php)
   9. Producer CTA (inline em section-portfolio.php ou seção própria)
   10. FAQ (section-faq.php)
   11. Final CTA (section-cta.php)
   12. Contact (section-contact.php)
5. Ativar tema no painel WordPress → Aparência → Temas
6. Definir a página inicial como "Página estática" → página criada com o template landing
7. Testar todos os formulários com endereço real de e-mail
8. Verificar responsividade em 320px, 768px, 1024px, 1440px
9. Testar scroll suave em todos os links de âncora
10. Verificar que o header muda de transparente para sólido ao scrollar
11. Configurar WP Mail SMTP antes de ir para produção

---

## 18. NOTA SOBRE O CRM (integração futura opcional)

O CRM Casa Verde (Laravel + React) tem um sistema completo de cadastro de clientes e produtores. No futuro, o formulário da landing page pode:
- Criar um lead diretamente via API REST do CRM (endpoint `POST /api/leads`)
- Ou continuar enviando por e-mail para processamento manual

Por enquanto, o envio por e-mail via `wp_mail()` é suficiente e seguro.

---

**FIM DO BRIEFING**

Este briefing é suficiente para criar uma landing page WordPress profissional, moderna, de alta conversão, sem dependência de page builders ou temas premium. Todo o código deve ser escrito do zero, em HTML/CSS/JS/PHP puros dentro da estrutura de tema WordPress.

# GD Solar ERP — Relatório para Página de Vendas/Assinaturas

> **Destinatário:** Claude Code (uso para construir o site de divulgação)
> **Objetivo deste documento:** reunir tudo que existe de valioso no produto (tecnicamente comprovado no código-fonte, não suposição) para embasar copy, estrutura e argumentos de conversão de uma landing page **B2B SaaS**.
> **Nome comercial do produto:** **GD Solar ERP**

---

## 0. ATENÇÃO — NÃO CONFUNDIR COM O SITE DA CASA VERDE CONSÓRCIO

Este repositório já contém `landpage-wordpress-briefing.md`, um briefing para a landing page da **Casa Verde Consórcio** (B2C: venda de assinatura de energia solar para consumidores finais, com paleta verde/laranja, foco em "economize até 25% na conta de luz").

**Este relatório é para um produto diferente:**

| | Casa Verde Consórcio (briefing existente) | **GD Solar ERP (este relatório)** |
|---|---|---|
| O que vende | Assinatura de energia solar por compensação | **O software/plataforma** que gerencia esse tipo de negócio |
| Para quem | Consumidor final (pessoa física/jurídica que quer desconto na conta de luz) | **Outras empresas** de energia por compensação/assinatura, consórcios, comercializadoras, gestoras de usinas GD |
| Modelo | B2C, venda de kWh com desconto | **B2B SaaS**, venda de licença/assinatura de software |
| CTA típico | "Quero economizar agora" | "Agende uma demonstração" / "Fale com nosso time" |

O CRM Casa Verde (código deste repositório) é, na verdade, a **prova viva** de que o GD Solar ERP funciona: é o sistema que a própria Casa Verde Consórcio usa para rodar sua operação. Isso pode (e deve) ser usado como case/prova social — "a plataforma que já opera uma comercializadora real de energia solar por compensação".

---

## 1. POSICIONAMENTO DO PRODUTO

**GD Solar ERP** é uma plataforma completa de gestão para empresas que operam **energia solar por compensação/assinatura (Geração Distribuída Compartilhada, Lei 14.300/ANEEL)**: consórcios de energia solar, comercializadoras de GD, gestoras de portfólio de usinas, integradoras que também administram carteira de clientes assinantes.

Cobre o ciclo operacional inteiro, ponta a ponta, sem depender de planilhas soltas ou sistemas fragmentados:

```
Prospecção → Proposta comercial → Contrato → Vínculo cliente-usina →
Importação de faturas (IMAP + upload) → Geração de cobranças →
Pagamento (Pix/Boleto via Cora) → Relatórios de economia e financeiro
```

**Frase-síntese sugerida para hero:** *"O ERP feito para quem vende energia solar por assinatura — da proposta ao Pix, sem planilha."*

### Público-alvo (ICP)

1. **Comercializadoras/consórcios de energia por compensação** que já têm clientes ativos e ainda operam em planilhas Excel, WhatsApp manual e leitura visual de fatura.
2. **Gestoras de usinas GD** que precisam alocar energia de uma usina entre vários clientes com segurança (sem vender mais do que a usina gera).
3. **Escritórios/consultorias de energia solar** que atuam como intermediários entre produtores (donos de usina) e consumidores.
4. **Integradoras solares** que querem adicionar uma linha de receita recorrente via GD compartilhada e precisam de operação (não só instalação).

### Dor central que o produto resolve

Esse mercado cresce rápido no Brasil (Lei 14.300 destravou a GD compartilhada), mas a maioria dos operadores ainda gerencia tudo manualmente: leem fatura de concessionária no olho, calculam desconto em planilha, cobram por boleto avulso, mandam lembrete de pagamento manualmente no WhatsApp, e não têm nenhum controle formal de quanto de energia de uma usina já foi comprometida com clientes — um erro fácil de cometer (vender mais energia do que a usina realmente gera) que gera prejuízo financeiro e problema contratual.

**GD Solar ERP automatiza justamente esse ponto cego operacional.**

---

## 2. MAPA DE DORES → FUNCIONALIDADE → BENEFÍCIO

| Dor do operador GD | O que o GD Solar ERP faz | Benefício para conversão |
|---|---|---|
| Leio fatura de concessionária manualmente, erro de digitação | Importação automática via **IMAP** (e-mail) + upload, com extração de texto até de **PDFs protegidos por senha** | Zero retrabalho manual, elimina erro humano de leitura de fatura |
| Não sei se estou vendendo mais energia do que minha usina gera | Alerta automático **`allocated_energy_exceeds_available`** (crítico) — a plataforma cruza energia alocada × energia disponível todo mês | Protege a empresa de vender energia que não existe — risco jurídico e financeiro real |
| Cobro por boleto avulso e demoro para receber | Geração automática de cobrança a partir de fatura aprovada + **Pix e Boleto simultâneos** (QR Code, copia-e-cola, linha digitável) via integração Cora | Reduz inadimplência, acelera recebimento |
| Esqueço de cobrar cliente inadimplente | Lembrete automático: **3 dias antes do vencimento** e **a cada 5 dias em atraso**, com link `wa.me` pronto para o consultor | Menos inadimplência sem precisar de time de cobrança dedicado |
| Não sei quanto cada cliente está economizando de fato | Relatório de economia por cliente e por carteira: `economia = valor original - valor final`, % de economia, evolução mês a mês | Vira munição comercial (mostrar economia real fideliza e ajuda em indicação/upsell) |
| Cada consultor tem sua própria planilha de clientes | **Scoping automático por consultor** — cada vendedor só vê sua carteira, sem filtro manual | Escala o time comercial sem vazamento de carteira entre vendedores |
| Não tenho visão executiva do negócio | **Cockpit executivo**: kWh disponível/alocado/restante da frota inteira, usinas em saldo crítico, ranking de consultores, funil de revisão de faturas, feed de "ações pendentes" | Dá ao dono/gestor visão de helicóptero em uma tela só |
| Cliente me liga perguntando status da fatura/pagamento | **Portal do cliente** com faturas, cobranças, contrato, histórico de desconto e relatório de economia em PDF/Excel — self-service | Reduz volume de suporte, aumenta percepção de profissionalismo |
| Produtor (dono de usina) quer saber quanto está gerando/recebendo | **Portal do produtor** com geração, alocação e contratos | Fortaleça relação com fornecedores de energia (usinas parceiras) |
| Onboarding de novo produtor é bagunçado (documento aqui, contrato ali) | **Kanban de 7 etapas** (drag-and-drop) do onboarding de usina: análise de documentos → assinatura de contrato → ficha de inscrição → contrato de adesão → contrato de aluguel → troca de titularidade → concluído | Padroniza processo, nada se perde entre etapas |
| Não tenho como provar histórico/auditoria de decisões | Cada cobrança/ajuste/alerta guarda `created_by`/`resolved_by`, com trilha de quem fez o quê | Segurança jurídica e operacional |
| Meu financeiro não sabe se um webhook de pagamento falhou | Dashboard admin mostra **pagamentos e webhooks com falha** em tempo real | Detecta problema de reconciliação financeira antes que vire prejuízo |

---

## 3. FUNCIONALIDADES POR MÓDULO (para seções de "features" da página)

### 3.1 Dashboards por papel (Admin, Consultor, Produtor, Cliente)

- **Cockpit Executivo** (dono/diretoria): saldo de energia da frota inteira (disponível/alocada/restante), usinas em **saldo crítico (≤0 kWh)** ou **baixo (≤10%)**, clientes sem usina vinculada, funil de revisão de faturas, alertas críticos abertos, **ranking dos top 10 consultores**, crescimento mês a mês (novos clientes/usinas/vínculos), feed de "próximas ações" com link direto para resolver.
- **Dashboard Admin**: contadores de clientes ativos/prospects, propostas, faturas pendentes de revisão, cobranças em aberto/atrasadas, valor a receber, receita mensal, **pagamentos e webhooks com falha**, últimos 8 eventos de cada tipo.
- **Dashboard Consultor**: carteira pessoal — clientes/produtores ativos e novos no mês, propostas em aberto, leads, atalhos de 1 clique para nova proposta/cliente/produtor.
- **Dashboard Cliente**: faturas aprovadas, consumo do mês, cobranças pendentes/atrasadas, total pago no ano, **quanto já economizou no total (histórico completo)**, gráfico de 12 meses de kWh × R$.

### 3.2 Alocação de energia com trava de segurança (diferencial forte)

A `UsinaSolar` mantém `energia_disponivel_kwh`, `energia_alocada_kwh`, `energia_saldo_kwh` como campos de primeira classe. Uma usina pode ser **fracionada entre vários clientes** (`ClientUsinaLink`), cada um com sua própria cota (`allocated_energy_kwh`), percentual de desconto e percentual de consumo — o modelo real de compensação compartilhada da Lei 14.300.

Todo mês, a plataforma varre automaticamente cada usina e dispara alertas tipados:

- `missing_generation_record` — usina sem leitura de geração no mês
- `zero_available_energy` — usina zerada
- `allocated_energy_exceeds_available` (**crítico**) — vendeu mais do que a usina gera
- `low_energy_balance` — saldo ≤10%
- `consumption_exceeds_allocated` — cliente consumiu mais do que sua cota
- `pending_bill_review`, `overdue_charges`, `active_client_without_bill`

Os alertas se **auto-resolvem** quando a condição desaparece — não é uma lista que só cresce.

### 3.3 Faturamento e pagamento omnichannel

- Fatura de concessionária aprovada → gera cobrança automaticamente, sem digitação manual.
- Cobrança gera **boleto E Pix ao mesmo tempo** (QR Code, copia-e-cola, linha digitável, URL de checkout, PDF) via integração com o **Cora**.
- Arquitetura de pagamento é **agnóstica de provedor** (`PaymentProviderManager`) — Cora hoje, mas pronta para novos provedores amanhã.
- Lembrete automático pré-vencimento (3 dias antes) e pós-vencimento (a cada 5 dias) via job assíncrono, com link `wa.me` pré-preenchido gerado automaticamente.
- Reconciliação de pagamento via webhook assíncrono, com painel de falhas visível ao admin.

### 3.4 Propostas comerciais e contratos

- Duas trilhas de proposta: para **cliente** (consumidor de energia) e para **produtor** (dono de usina).
- Cadastro inline: cria cliente/produtor novo durante a própria proposta (sem sair da tela), evita duplicidade de CPF/CNPJ.
- Aplica desconto padrão configurável automaticamente.
- Ciclo de status da proposta (emitida → enviada → em análise → pendente...).
- Geração de **PDF de proposta e contrato** (locação de usina) prontos para assinatura.
- Simulação de investimento para propostas de produtor (ROI).

### 3.5 Relatórios que viram argumento de venda

- **Relatório de economia** (nível carteira e por cliente): quanto cada cliente economizou, em R$ e %, evolução mensal, ranking dos clientes que mais economizaram.
- **Relatório financeiro**: valores brutos, com desconto de contrato, ajustes manuais, evolução de 12 meses.
- **Relatório executivo**: visão consolidada de toda a operação (clientes, propostas, contratos, faturas, cobranças, usinas) com breakdown por status.
- **Relatório por usina**: desempenho financeiro por usina, casado com potência instalada e média de geração.
- Todos exportáveis em **PDF e Excel** — inclusive o relatório de economia que o próprio cliente final acessa no portal dele.

### 3.6 Portais dedicados por papel

- **Portal do Cliente**: faturas, cobranças, contrato, histórico de desconto, vínculo com usina e histórico, relatório de economia (PDF/Excel), chamados de suporte — tudo self-service.
- **Portal do Produtor**: usinas próprias, geração, propostas, pipeline Kanban do onboarding.
- **Portal do Consultor**: carteira própria com scoping automático (nunca vê cliente de outro consultor).

### 3.7 Suporte integrado

Sistema de chamados com categoria, prioridade, SLA de primeira resposta, notas internas invisíveis ao cliente, e máquina de estados (Novo → Em Atendimento → Aguardando Cliente → Resolvido → Fechado) com transições automáticas (ex.: cliente responde → volta para "Em Atendimento" sozinho).

---

## 4. DIFERENCIAIS COMPETITIVOS (para seção "por que nós")

1. **Único no mercado com trava anti-oversell de energia** — a maioria das planilhas/sistemas genéricos de CRM não modela `energia_alocada_kwh` vs `energia_disponivel_kwh` com alerta automático. Isso é risco financeiro real que o produto elimina.
2. **Feito especificamente para GD compartilhada (Lei 14.300)** — não é um ERP genérico adaptado; o modelo de dados nasceu para usina, unidade consumidora, concessionária e vínculo cliente-usina.
3. **Pagamento nativo Pix + Boleto** sem sistema externo — cobrança sai da plataforma já pronta para pagar.
4. **Automação de cobrança e lembrete de ponta a ponta** — de fatura aprovada até lembrete de atraso, zero toque manual.
5. **4 portais em 1 produto só** (Admin, Consultor, Produtor, Cliente) — cliente final e produtor (fornecedor de energia) também usam a plataforma, não só a equipe interna.
6. **Prova real de uso em produção** — já roda a operação real de uma comercializadora de energia solar por compensação (Casa Verde), não é um MVP sem tração.
7. **Stack moderna e testada**: Laravel 12 + React 18, 96 migrations, 62 arquivos de teste automatizado (Pest + SQLite), autorização via Policies por papel — não é um sistema legado remendado.
8. **Importação automática de fatura por e-mail (IMAP)**, incluindo faturas em PDF protegido por senha — um detalhe técnico raro que resolve uma dor muito específica e muito comum (concessionárias enviam PDF travado).

---

## 5. SINAIS DE CONFIANÇA / ROBUSTEZ (seção de credibilidade técnica)

Use como prova social técnica, não como jargão para o visitante leigo — traduzir em linguagem de benefício:

- **96 migrations, 40+ tabelas, 56 models** → "sistema maduro, não gambiarra."
- **62 arquivos de teste automatizado** rodando em cada mudança → "mudanças não quebram o que já funciona."
- **Autorização por Policy em cada módulo crítico** (usina, cobrança, proposta, produtor) com regra de bypass só para Admin → "dado do seu negócio só é visto por quem deveria ver."
- **9 comandos automatizados agendados** (reimportação de fatura, lembrete de cobrança, marcação de atraso, sincronização de pagamento, geração de cobrança/pagamento faltante, varredura de alertas) → "o sistema trabalha sozinho todo dia, mesmo sem ninguém logado."
- **6 filas assíncronas (Jobs)** para processar webhook, pagamento, lembrete, cobrança → "não trava a tela do usuário esperando processamento pesado."
- **Trilha de autoria** (`created_by`, `resolved_by`) em alertas e vínculos → "rastreabilidade para auditoria."
- **Arquitetura de pagamento plugável** (não hard-coded no Cora) → "não fica refém de um único provedor de pagamento."

---

## 6. ESTRUTURA SUGERIDA DA PÁGINA (seções, em ordem)

1. **Hero** — problema + promessa + CTA "Agendar demonstração". Prova social imediata: "usado por uma comercializadora de energia solar em operação real".
2. **Dor/Antes-Depois** — bloco visual comparando "hoje: planilha, WhatsApp manual, fatura lida no olho, risco de vender energia demais" vs "com GD Solar ERP: automático, sem planilha, sem risco de oversell".
3. **Como funciona** — o fluxo completo em 6 passos (prospecção → proposta → contrato → vínculo → fatura → cobrança/pagamento → relatório), reaproveitando o ciclo do CLAUDE.md.
4. **Módulos/Features** — grid com os 7 blocos da seção 3 acima, cada um com ícone + 2 linhas + (idealmente) mockup/screenshot do dashboard real.
5. **Diferencial "trava de energia"** — seção dedicada só a esse ponto (é o gancho mais forte e mais difícil de copiar), com visual de gauge mostrando energia disponível/alocada/saldo e o alerta crítico disparando.
6. **4 portais, 1 produto** — mostrar mockups dos 4 dashboards (Admin/Consultor/Produtor/Cliente) lado a lado.
7. **Pagamento Pix + Boleto nativo** — seção de confiança financeira, com selo visual "Integração Cora".
8. **Robustez técnica** — números da seção 5 traduzidos ("99 automações rodando por você", "testado automaticamente a cada atualização").
9. **Prova social / case** — "conheça quem já usa" (a própria Casa Verde, se autorizado a divulgar, ou "empresa real de energia solar por compensação").
10. **Planos/Pricing** (ver seção 8) ou, se ainda não definido, "Fale com o time para um plano sob medida".
11. **FAQ** — perguntas típicas de decisor B2B (ver seção 7).
12. **CTA final** — "Agende uma demonstração" / "Fale com um especialista", formulário curto (nome, empresa, e-mail, telefone, quantas usinas/clientes gerencia hoje).

---

## 7. FAQ SUGERIDO (decisor B2B, não consumidor final)

- **Preciso trocar todo meu sistema de uma vez?** Não — o time de onboarding migra dados de clientes, usinas e contratos existentes.
- **O sistema calcula automaticamente o desconto de cada cliente?** Sim, com base em regra de desconto configurável por cliente ou padrão do sistema.
- **Meus consultores vão ver a carteira uns dos outros?** Não — cada consultor só vê e gerencia sua própria carteira.
- **O sistema me avisa se eu vender mais energia do que minha usina gera?** Sim — é um alerta crítico automático, mensal, por usina.
- **Como funciona a cobrança dos meus clientes?** Boleto e Pix gerados automaticamente a partir da fatura aprovada, com lembrete automático de vencimento e atraso.
- **Meu cliente final vai poder acessar o sistema?** Sim, com um portal próprio para ver fatura, cobrança, contrato e quanto já economizou.
- **E os produtores (donos de usina)?** Também têm portal próprio, com visão de geração e contratos.
- **É seguro?** Autorização por papel em cada módulo, trilha de quem alterou o quê, e testes automatizados a cada atualização.
- **Preciso de equipe técnica para operar?** Não — as automações (importação de fatura, geração de cobrança, lembretes) rodam sozinhas; sua equipe só acompanha os alertas e o dashboard.

---

## 8. SUGESTÃO DE MODELO DE PLANOS (para a Claude Code compor a seção de pricing)

Não há indicação de pricing real no código (é um produto interno hoje). Sugestão de estrutura, a validar com o usuário antes de publicar valores reais:

| Plano | Indicado para | Módulos |
|---|---|---|
| **Start** | Comercializadora pequena (até X usinas / Y clientes) | Propostas, contratos, cobrança, portal do cliente |
| **Growth** | Operação em expansão, múltiplos consultores | + Alertas operacionais, relatórios de economia, portal do produtor |
| **Enterprise** | Múltiplas usinas, operação madura | + Cockpit executivo, integrações de pagamento customizadas, suporte prioritário |

> Recomendo **não publicar preço fixo** na primeira versão do site — usar CTA "Fale com o time" / "Agende uma demonstração", comum em ERP B2B, e coletar contato via formulário curto. Preço público, se aplicável, deve vir do usuário — não inventar valores em R$.

---

## 9. ATIVOS VISUAIS PARA MOCKUPS (o que vale a pena representar visualmente no site)

- Gauge de energia disponível/alocada/saldo por usina (o diferencial mais forte visualmente).
- Kanban de onboarding de produtor (7 colunas coloridas) — transmite organização.
- Gráfico de evolução de economia do cliente (12 meses, kWh × R$).
- Tela de cobrança com Pix (QR Code) e boleto lado a lado.
- Cockpit executivo com KPIs e feed de "ações pendentes".
- Ranking de consultores (gamificação natural para vendas internas do próprio cliente B2B).

Ao construir o site, usar o skill de design de artifacts/dataviz se forem gerados gráficos ilustrativos reais (não apenas imagens estáticas).

---

## 10. TOM DE VOZ E ÂNGULOS DE COPY

- Falar como **operador para operador** — quem escreve entende a dor de ler fatura de concessionária travada em PDF, de perder tempo cobrando no WhatsApp, de não saber se vendeu energia demais.
- Evitar jargão de "IA"/genérico de SaaS. O gancho é **especificidade de domínio**: Lei 14.300, GD compartilhada, kWh alocado vs disponível, UC, concessionária.
- Headline candidatas:
  - "O ERP que sabe quanto de energia sua usina ainda pode vender."
  - "Da fatura da concessionária ao Pix do cliente, sem planilha no meio."
  - "Feito para quem vende energia solar por assinatura — não adaptado, nascido para isso."
- CTA principal: **"Agendar demonstração"** (não "teste grátis" — é um ERP operacional, decisão B2B costuma passar por demo guiada).

---

## 11. RESUMO EXECUTIVO (1 parágrafo, pronto para usar)

> GD Solar ERP é a plataforma completa para quem opera energia solar por compensação/assinatura no Brasil: da prospecção do cliente à cobrança via Pix ou boleto, passando por importação automática de fatura, geração automática de cobrança, alertas de segurança sobre alocação de energia, e relatórios de economia que viram argumento comercial. Com portais dedicados para consultor, cliente e produtor, dashboards executivos em tempo real e automações que rodam sozinhas todo dia, é o único sistema pensado desde a raiz para o modelo real da Geração Distribuída Compartilhada (Lei 14.300/ANEEL) — não um CRM genérico adaptado.

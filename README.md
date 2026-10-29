# Casa Verde CRM / GD Solar ERP

Sistema CRM/ERP em **Laravel 12 + Inertia + React** para empresas de energia solar por compensação/assinatura (geração distribuída compartilhada, Lei 14.300): prospecção, propostas, contratos, usinas, produtores, clientes, importação de faturas de concessionária, cobrança, pagamento (Mercado Pago) e relatórios.

O mesmo código roda a operação real da Casa Verde e é oferecido a outras empresas como **GD Solar ERP** (há uma instância de demonstração aberta — ver `DEMO.md`). O nome exibido nas telas, PDFs e e-mails vem da **Identidade Visual** configurada no painel; nunca escreva o nome da marca fixo no código.

> Este README é a **visão geral e o guia de onboarding** (propósito, arquitetura, regras de negócio, fluxos).
> A **referência operacional do dia a dia** — lista completa de models, enums, jobs, agendamentos, convenções, dívida técnica e comandos — é o **`CLAUDE.md`**. Mantenha os dois em sincronia ao fazer mudanças estruturais.

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Documentação do projeto](#2-documentação-do-projeto)
3. [Stack](#3-stack)
4. [Perfis de acesso](#4-perfis-de-acesso)
5. [Arquitetura e domínios](#5-arquitetura-e-domínios)
6. [Regras de negócio](#6-regras-de-negócio)
7. [Fluxos principais](#7-fluxos-principais)
8. [Automações e alertas](#8-automações-e-alertas)
9. [Segurança e autorização](#9-segurança-e-autorização)
10. [Frontend](#10-frontend)
11. [Instalação e execução](#11-instalação-e-execução)
12. [Testes e qualidade](#12-testes-e-qualidade)
13. [Diretrizes de manutenção](#13-diretrizes-de-manutenção)
14. [Arquivos-chave](#14-arquivos-chave)
15. [Histórico de decisões](#15-histórico-de-decisões)
16. [Próximos passos](#16-próximos-passos)
17. [Resumo para nova equipe](#17-resumo-para-nova-equipe)

---

# 1. Visão geral

Ciclo completo coberto pelo sistema:

> Prospecção → Proposta comercial → Contrato → Vínculo cliente-usina → Importação de faturas (IMAP + upload) → Geração de cobranças → Pagamento (Mercado Pago, Pix ou boleto) → Relatórios

Macro-regra de negócio:

1. a empresa opera/intermedeia energia de usinas solares por compensação/assinatura;
2. **produtores** são os proprietários das usinas;
3. **consultores** fazem a prospecção e cuidam de uma carteira de clientes, produtores e usinas;
4. **clientes** aderem via proposta → contrato → vínculo com uma ou mais usinas (por unidade consumidora);
5. o sistema importa as faturas de concessionária do cliente (e-mail IMAP ou upload), um humano revisa e aprova;
6. a fatura aprovada gera a cobrança do cliente (`CustomerCharge`) com o desconto contratado;
7. o pagamento (Pix ou boleto Mercado Pago) é gerado **manualmente** na tela da cobrança e baixado automaticamente por webhook/sincronização;
8. lembretes, vencimentos, falhas e inconsistências viram alertas operacionais;
9. relatórios financeiros, de economia e executivos acompanham a operação.

Combina **CRM** (propostas, leads, Kanban de produtor), **ERP operacional/financeiro** (faturas, cobranças, pagamentos, alocação de energia) e **portais** para cliente e produtor.

---

# 2. Documentação do projeto

| Arquivo | Para quê | Situação |
|---------|----------|----------|
| `README.md` | Visão geral, arquitetura, fluxos, onboarding | Viva |
| `CLAUDE.md` | Referência operacional: convenções, regras de domínio, automações, comandos, dívida técnica | Viva |
| `MERCADO_PAGO.md` | Credenciais, webhook e regras operacionais de pagamento | Viva |
| `DEMO.md` | Instância de demonstração (`DEMO_MODE`) | Viva |
| `LANCAMENTO.md` | Prontidão para lançamento, pendências e checklist de deploy | Viva |
| `GD_SOLAR_ERP_RELATORIO_VENDAS.md` | Material de vendas B2B do GD Solar ERP | Viva |
| `landpage-wordpress-briefing.md` | Briefing de landing page B2C de um cliente (outro site, não é do sistema) | Referência externa |
| `ANALISE.md`, `RELATORIO_ERROS.md` | Retratos de maio/junho de 2026 | Históricos — não refletem o estado atual |

---

# 3. Stack

## Backend
- PHP 8.2+ (produção em **PHP 8.3**: php-fpm 8.3 e `php83` no cron/worker; `composer.json` fixa `config.platform.php = 8.3.24`)
- Laravel 12, Eloquent, Inertia.js (adapter), Sanctum, Ziggy
- `barryvdh/laravel-dompdf` (PDFs de boleto, relatórios, propostas novas) e `barryvdh/laravel-snappy` + wkhtmltopdf (propostas legadas)
- `maatwebsite/excel` — exportações Excel
- Extensão `imap` (importação de faturas) e binários `qpdf`/`pdftotext` (desbloqueio e leitura de PDF de fatura) — exigem `exec` liberado no PHP

## Frontend
- React 18 + Inertia.js + MUI 6 + Tailwind 3.2 + Vite 5
- `@react-pdf/renderer`, `@dnd-kit` (Kanban), `chart.js`/`recharts`, `framer-motion`, `@tabler/icons-react`, `date-fns`, `lodash`, `numeral`

## Banco, fila e integrações
- MySQL 8.0 (100 migrations); testes em SQLite in-memory
- Fila `database`, worker systemd; agendador via cron (`php83 artisan schedule:run`)
- Pagamentos: **somente Mercado Pago** (Orders API) — a integração Cora foi removida em 2026-10-03
- E-mail: IMAP para importar faturas; SMTP (pela fila) para avisar o cliente sobre boleto/Pix
- WhatsApp: apenas links `wa.me` para clique humano (sem envio automático)

---

# 4. Perfis de acesso

Definidos em `app/src/Roles/RoleUser.php` (`ADMIN = 1`, `CONSULTOR = 2`, `PRODUTOR = 3`, `CLIENTE = 4`, com helpers `nameById()`, `idByName()`, `ids()`, `names()`).

| Perfil | O que faz | Onde entra |
|--------|-----------|------------|
| **Admin** | Acesso total: usuários, usinas, faturas, configurações, integrações, cockpit | `admin/*`, `auth/*` (legado), tudo |
| **Consultor** | Propostas, clientes, produtores, usinas e cobranças **da própria carteira** | `consultor/*`; em `admin/*` só cobranças, pagamentos, alertas e relatórios de clientes/usinas (filtrados pela carteira) |
| **Cliente** | Consumidor final: faturas, cobranças (com Pix/boleto para pagar), contratos, perfil, relatório de economia | `cliente/*` |
| **Produtor** | Dono de usina: dashboard e usinas próprias (com histórico de geração) | `produtor/*` |

Após o login, `/dashboard` redireciona pela role (`RedirectUserByRole`): `admin.dashboard`, `consultor.dashboard`, `cliente.dashboard`, `produtor.dashboard`.

Não há cadastro público: clientes entram por convite por e-mail (`ClientAccessInvite` → `ClientActivationInviteMail`); produtores e usuários internos são criados pelo admin.

---

# 5. Arquitetura e domínios

Organização por **domínio de negócio**:

| Domínio | Models principais |
|---------|-------------------|
| Usuários | `User`, `UserData`, `UserContact`, `UserAddress`, `Roles`; log de acesso `UserAccessLog` |
| Cliente | `ClientProfile`, `ConsumerUnit`, `ClientContract`, `ClientUsinaLink`, `ClientDiscountRule`, `ClientAccessInvite`, `ClienteProposta` |
| Produtor | `ProducerProfile`, `ProducerLead`, `ProducerAdministrationFeeRules`, `ProdutorPropostas`, `ProdutorContratos`, `ProducerAccessInvite` |
| Usina | `UsinaSolar`, `UsinaBlock`, `UsinaGenerationRecord`, `Concessionaria`, `UsinaAddress` |
| Propostas | `CommercialProposal` (cliente), `ProducerProposal` (produtor) |
| Faturas / Importação | `ConcessionaireBill`, `ConcessionaireBillIssue`, `ImportedConcessionaireEmail`, `ImportRun`, `ImportEmailAccount`, `ClientEmailImportSetting`, `InstitutionalEmailAccount` |
| Cobrança | `CustomerCharge`, `CustomerChargeAdjustment`, `CustomerChargeHistory` |
| Pagamento | `PaymentSlip`, `PaymentTransaction`, `PaymentProviderAccount`, `PaymentWebhookEvent` |
| Operação | `OperationalAlert`, `SupportTicket`/`SupportTicketMessage`, `WhatsAppMessageTemplate`, `SystemSetting`, `DemoVisitor` |

Camadas:

- **Controllers finos**; lógica em **Services** (`app/Services/<Domínio>/`), injetados por construtor.
- **Repositories** (`app/Repositories/`) para listagens/paginação com filtros.
- **DTOs** em `app/DTOs/` (`Endereco/`, `Payments/`, `UsinaSolar/`, `Usuario/`).
- **FormRequests** validam dados e a role (e a carteira, na edição).
- **Policies** (`ClientProfile`, `CommercialProposal`, `UsinaSolar`, `CustomerCharge`, `ProducerProfile`) registradas em `AppServiceProvider::boot()` via `Gate::policy()`.
- **Enums** em `app/Enums/` para status (cobrança, boleto, fatura, vínculo, contrato, alerta, suporte, usina).
- Pagamentos atrás de `PaymentProviderContract`/`PaymentProviderManager` (hoje só Mercado Pago).

> Lista completa e atualizada de models, enums, jobs e comandos: `CLAUDE.md`.

---

# 6. Regras de negócio

## 6.1 Usina
- `UsinaSolar.producer_profile_id` = **produtor proprietário** (obrigatório).
- `UsinaSolar.consultor_user_id` = **consultor responsável** (obrigatório).
- `UsinaSolar.user_id` **não existe** (removido na migration `2026_05_19`; o método `user()` também foi removido). Não recriar.
- Energia: `energia_disponivel_kwh`, `energia_alocada_kwh`, `energia_saldo_kwh`; status operacional em `operational_status` (`UsinaOperationalStatus`).
- Alocar mais do que a usina gera dispara alerta crítico (`allocated_energy_exceeds_available`, via `usinas:scan-alerts`).

## 6.2 Produtor
- Role oficial, com dashboard, rotas e `ProducerProfile` obrigatório.
- `ProducerProfile` guarda documento e nome diretamente (`tipo_pessoa`, `cpf`, `cnpj`, `nome`, `razao_social`, `nome_fantasia`), contato em `UserContact` (`contacts_id`), consultor em `consultor_user_id` e o usuário da plataforma, quando ativado, em `platform_user_id`.
- **Nunca duplicar por CPF/CNPJ**: procurar primeiro em `ProducerProfile` (`CreateOrFindProducerProfileService`).
- Taxa de administração do produtor em `ProducerAdministrationFeeRules` (padrão do sistema: `default_producer_fee_percentage`).
- Soft delete zera CPF/CNPJ (evento `deleting`), permitindo recadastro.

## 6.3 Cliente e unidade consumidora
- `ClientProfile` guarda CPF/CNPJ diretamente (validação de dígitos verificadores); soft delete zera os documentos.
- `ConsumerUnit` pertence a um cliente e a uma concessionária; `uc_code` é normalizado para dígitos e `uc_code + concessionaria_id` é único.
- `ConcessionaireBill.consumer_unit_id` associa a fatura à UC.

## 6.4 Vínculo cliente-usina (`ClientUsinaLink`)
- Campos: `allocated_energy_kwh`, `discount_percentage`, `consumption_percentage`; status em `ClientUsinaLinkStatus`.
- Com `consumer_unit_id`: encerra só o vínculo ativo da mesma UC + usina (uma UC pode ter vínculos ativos com usinas diferentes).
- Sem `consumer_unit_id`: encerra todos os vínculos ativos do cliente (legado).

## 6.5 Consultor e carteira
- Carteira via `users.consultor_id`, `client_profiles`/`producer_profiles.consultor_user_id`, `producer_leads.consultor_user_id`, `usina_solars.consultor_user_id`.
- Scoping sempre por **query scopes** (`CustomerCharge::somenteMinhasCobrancas()`, `ClientProfile::somenteDoConsultor()`, `User::somenteMeusClientes()`), nunca por filtro manual repetido.
- Toda ação com `{id}` acessível ao consultor confere o dono (policy ou `abort_if`).

## 6.6 Cobrança e pagamento
- Fatura aprovada → `CustomerCharge` (automático: `GenerateChargeFromApprovedBillJob` / `casaverde:generate-monthly-charges`). Uma fatura pode originar mais de uma cobrança.
- Status da cobrança: `draft`, `open`, `waiting_payment`, `paid`, `overdue`, `cancelled`.
- **O pagamento nunca é gerado automaticamente**: o consultor/admin escolhe Pix ou boleto na tela da cobrança. Pix e boleto não podem estar na mesma order do Mercado Pago.
- Status do boleto/Pix (`PaymentSlipStatus`): `pending`, `generated`, `paid`, `cancelled`, `expired`, `failed`, `refunded`.
- Alterar vencimento ou valor cancela e reemite o boleto; toda alteração fica em `CustomerChargeHistory`.
- Detalhes (vencimento, boleto vencido, estorno, idempotência): `MERCADO_PAGO.md`.

## 6.7 Marca
- Nome da plataforma, cores e logotipos vêm da **Identidade Visual** (`SystemSettingService::brandName()` no backend, `useBrandName()` no frontend). Nunca escrever "Casa Verde" fixo em texto visível.

---

# 7. Fluxos principais

## 7.1 Proposta de cliente
`consultor.propostas.cliente.*` → `Admin\Proposta\ClientProposalController` + `CommercialProposalPolicy`. Pode criar o cliente inline (sem duplicar CPF/CNPJ), aplica o desconto padrão configurado e gera PDF (modelo novo `commercial-proposal-modern.blade.php` na demonstração; modelo original fora dela). O PDF é entregue por link assinado temporário (`TemporaryPdfStorageService`).

## 7.2 Proposta de produtor
`consultor.propostas.produtor.*` → `Admin\Proposta\ProducerProposalController` + `CreateProducerProposalService`:
1. o consultor escolhe um produtor existente ou informa um novo;
2. `CreateOrFindProducerProfileService` busca por CPF/CNPJ em `ProducerProfile`; se não houver, cria `UserContact` + `ProducerProfile` (status `prospect`) + regra de taxa de administração padrão;
3. grava a `ProducerProposal` e gera o PDF (`producer-proposal-modern.blade.php`, rota `consultor.propostas.produtor.pdf`).

> O fluxo legado em `auth/*` (`Auth\Produtor\ProdutorPropostasController` + `ProdutorPropostaRepository` → `User`/`UserData`/`UserContact`/`ProducerProfile`) é restrito ao admin e não deve ser usado como modelo para código novo.

## 7.3 Cadastro de usina
`Admin\Usina\UsinaSolarController` + `StoreUsinaSolarRequest` (admin ou consultor): exige `producer_profile_id` existente e `consultor_user_id` com role consultor; telas em `Consultor/Producer/Usina/{Create,Edit}`.

## 7.4 Faturas de concessionária
1. `concessionaire-bills:import` (de hora em hora) lê as caixas IMAP (`ImportEmailAccount`, uma por cliente via `ClientEmailImportSetting`), desbloqueia o PDF com a senha cadastrada e extrai os dados (parser por concessionária, ex.: `CopelBillParserService`); também há upload manual.
2. Cada execução fica em `ImportRun` (tela de histórico de importação, com disparo manual).
3. A fatura entra em revisão (`BillReviewStatus`); o consultor/admin confere, corrige e aprova.
4. A aprovação gera a cobrança.
5. `concessionaire-bills:reprocess` reprocessa o parser de faturas já importadas.

## 7.5 Pagamento
1. Na cobrança: **Gerar pagamento → Mercado Pago Pix ou Boleto** (`GeneratePaymentSlipService`, com `Cache::lock` e `X-Idempotency-Key`).
2. O cliente recebe e-mail (`ChargePaymentMail`) e vê Pix copia e cola, linha digitável e PDF no portal (`cliente.cobrancas.show`).
3. Baixa por webhook (`/webhooks/payments/mercado-pago`, assinatura obrigatória, processado em fila) ou pela sincronização a cada 5 min.
4. Boleto vencido vira `expired`, alerta o consultor e continua sendo sincronizado por 10 dias.

## 7.6 Dashboards
| Perfil | Controller | Conteúdo |
|--------|-----------|----------|
| Admin | `Admin\Dashboard\AdminDashboardController` (+ cockpit executivo em `admin/cockpit`) | Visão global: clientes, propostas, faturas em revisão, cobranças, receita, falhas de pagamento/webhook |
| Consultor | `Consultor\Dashboard\ConsultorDashboardController` | Carteira própria |
| Cliente | `Cliente\DashboardController` | Faturas, consumo, cobranças, economia acumulada |
| Produtor | `Produtor\DashboardController` | Perfil, usinas e leads relacionados |

---

# 8. Automações e alertas

Agendamentos (`routes/console.php`, todos com `withoutOverlapping()`; desligados em `DEMO_MODE`):

| Comando | Frequência | O que faz |
|---------|-----------|-----------|
| `concessionaire-bills:import` | de hora em hora | Importa faturas por IMAP |
| `casaverde:generate-monthly-charges` | de hora em hora | Gera cobranças de faturas aprovadas |
| `casaverde:mark-overdue-charges` | 10 min | Marca cobranças vencidas |
| `casaverde:sync-payments` | 5 min | Sincroniza pagamentos pendentes com o Mercado Pago |
| `casaverde:expire-payment-slips` | 06:00 | Expira boletos/Pix vencidos |
| `casaverde:send-charge-reminders` | 08:00 | Lembretes pré e pós-vencimento (alerta + link WhatsApp; e-mail ao cliente 3 dias antes) |
| `casaverde:scan-operational-health` | hora:30 | Varredura de saúde operacional |
| `queue:prune-failed` | diário | Limpa jobs falhos com mais de 30 dias |
| `prune-temporary-pdfs` | diário | Apaga PDFs temporários (roda também na demonstração) |

**Alertas operacionais** (`OperationalAlert`, tela Alertas Operacionais + sino no cabeçalho): toda falha que compromete faturamento ou operação — caixa IMAP inacessível, PDF ilegível, Mercado Pago recusando, credencial inválida, webhook falhando, job que esgota tentativas, tarefa agendada que falha, faturas paradas em revisão, cobranças sem boleto perto do vencimento etc. O alerta é único por módulo + tipo + registro, é renovado se a falha se repete e se resolve sozinho. Admin vê tudo; consultor vê só alertas financeiros da própria carteira. Detalhes em `CLAUDE.md`.

---

# 9. Segurança e autorização

- `EnsureUserHasRole` (`role:admin,consultor` etc.) nos grupos de rota; Policies e `abort_if` por registro; FormRequests validam a role.
- `admin/*` é só admin, exceto o grupo de cobranças, pagamentos, alertas e relatórios (admin + consultor, filtrado pela carteira). Webhooks de pagamento, contas de pagamento, integrações, configurações e cockpit são só admin.
- `auth/*` (módulo legado) é só admin, porque os controllers não filtram por carteira.
- Portais de cliente e produtor filtram por `platform_user_id`.
- Senhas: `Password::defaults()` (8+ caracteres, letras e números; em produção também `uncompromised()`); rate limit no login, recuperação de senha e ativações.
- Segredos (`client_secret`, `webhook_secret`, senhas IMAP e de PDF) com cast `encrypted` e `$hidden`.
- `SecurityHeaders` (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS); `trustProxies(at: '*')` porque a aplicação roda atrás de Cloudflare + nginx.
- Faturas e PDFs de proposta ficam no disco `local`, servidos por controller autenticado ou link assinado.
- Isolamento entre roles e carteiras coberto por `tests/Feature/Security/AccessIsolationTest.php`.

---

# 10. Frontend

- Páginas Inertia + React em `resources/js/Pages/<Área>/<Entidade>/<Ação>/Page.jsx`; componentes compartilhados em `resources/js/Components/`; layout em `Layouts/AppShell/`.
- Menu montado por `auth.user.role_name` — apenas conveniência; a segurança é sempre do backend.
- Props globais (`HandleInertiaRequests`): `auth.user`, `alert`, `flash`, `navBadges`, `whatsappTemplates`, `brand` (Identidade Visual) e `demo`.
- Hooks: `useAuthUser`, `useCanAccess`, `useInputMask`, `useBrandName`.
- Toda listagem com filtros cuja entidade se relaciona com `ClientProfile` tem filtro `client_name` (nome, razão social, nome fantasia).

---

# 11. Instalação e execução

## Requisitos
- PHP 8.3 (extensões `imap`, `pdo_mysql`, `pdo_sqlite` para testes), Composer
- Node.js 22 + npm
- MySQL 8.0
- `wkhtmltopdf`, `qpdf` e `poppler-utils` (`pdftotext`)

## Desenvolvimento
```bash
composer install
npm install
cp .env.example .env
php83 artisan key:generate
php83 artisan migrate --seed
npm run dev
php83 artisan serve
```

O `DatabaseSeeder` cria roles, usuários iniciais (admin `admin@teste.com` / `1020` — troque em qualquer ambiente acessível), concessionárias, configurações, modelos de WhatsApp e dados de exemplo. Para a conta do Mercado Pago: preencha `MERCADOPAGO_*` no `.env` e rode `php83 artisan db:seed --class=PaymentProviderAccountSeeder` (ou cadastre em **Financeiro → Contas de Pagamento**).

## Laravel Sail
```bash
./vendor/bin/sail up -d
./vendor/bin/sail composer install
./vendor/bin/sail npm install
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail npm run dev
```
A imagem do Sail já instala o `wkhtmltopdf`.

## wkhtmltopdf fora do Sail (Ubuntu)
```bash
sudo apt update -y
sudo apt install -y wkhtmltopdf qpdf poppler-utils
```

## Produção
Cron (`* * * * * cd /caminho && php83 artisan schedule:run`), worker permanente (`php83 artisan queue:work --tries=3 --max-time=3600`, systemd com reinício automático), `.env` de produção e checklist de deploy: ver **`LANCAMENTO.md`**. Configuração do Mercado Pago: **`MERCADO_PAGO.md`**. Instância de demonstração: **`DEMO.md`**.

---

# 12. Testes e qualidade

- Pest PHP + SQLite in-memory (`phpunit.xml`); nunca MySQL nos testes.
- `php83 artisan test` — 94 arquivos, ~558 casos (out/2026). Requer as dependências de desenvolvimento do Composer.
- `Http::preventStrayRequests()` em `tests/Pest.php`: nenhuma chamada sai para o Mercado Pago; helpers `mercadoPagoAccount()` e `mpOrder()`.
- `./vendor/bin/pint` para formatação.
- CI em `.github/workflows/ci.yml`: Pint, testes (PHP 8.3) e build do frontend (Node 22).
- Sem cobertura: geração de PDF via snappy (propostas legadas).

---

# 13. Diretrizes de manutenção

1. **Antes de alterar uma entidade, localize todos os pontos de impacto** — migration/model, FormRequest, controller/service/repository, página React, PDFs, filtros por consultor, dashboards, testes.
2. **Produtor não é variação de cliente** — role e domínio próprios.
3. **`producer_profile_id` na usina é o dono**; não reutilizar o campo para outro tipo de usuário.
4. **Não duplicar cadastros por documento** (cliente em `ClientProfile`, produtor em `ProducerProfile`).
5. **Autorização no backend**: role no grupo de rotas + policy/`abort_if` por registro + `FormRequest::authorize()` validando role (e carteira na edição).
6. **Toda falha que afeta faturamento vira `OperationalAlert`** (via `OperationalAlertNotifier`), não só log.
7. **Rota POST que só lê dados** precisa entrar em `config/demo.php` → `readonly_post_routes`.
8. **Nada de nome de marca fixo** em telas, PDFs, e-mails ou seeders.
9. **Não remover campos "redundantes" sem checar** PDFs, filtros, sincronizações e relatórios.
10. **Documentação no mesmo commit**: mudou estrutura, atualize `CLAUDE.md` (e o documento específico).

Ordem de leitura sugerida para quem chega: este README → `CLAUDE.md` → `RoleUser` → models `User`, `ClientProfile`, `ProducerProfile`, `UsinaSolar`, `CustomerCharge` → middlewares → `routes/` → FormRequests e Policies → Services do domínio que vai mexer → páginas React.

---

# 14. Arquivos-chave

## Backend
- `app/src/Roles/RoleUser.php`
- `app/Http/Middleware/{EnsureUserHasRole,RedirectUserByRole,HandleInertiaRequests,SecurityHeaders,DemoMode}.php`
- `app/Providers/AppServiceProvider.php` (policies, `Password::defaults()`, ouvintes de falha de job/agendamento)
- `app/Models/Usina/UsinaSolar.php`, `app/Models/Produtor/ProducerProfile.php`, `app/Models/Cliente/ClientProfile.php`, `app/Models/Cobranca/CustomerCharge.php`
- `app/Http/Controllers/Admin/Proposta/{ClientProposalController,ProducerProposalController}.php`
- `app/Services/Produtor/CreateOrFindProducerProfileService.php`
- `app/Http/Controllers/Admin/Usina/UsinaSolarController.php` + `app/Http/Requests/Usina/StoreUsinaSolarRequest.php`
- `app/Http/Controllers/Admin/Cobranca/CustomerChargeController.php` + `app/Repositories/Cobranca/CustomerChargeRepository.php`
- `app/Http/Controllers/Admin/Pagamento/PaymentSlipController.php` + `app/Repositories/Pagamento/PaymentSlipRepository.php`
- `app/Services/Pagamento/GeneratePaymentSlipService.php` e `app/Services/Pagamento/Providers/MercadoPago/`
- `app/Http/Controllers/Webhook/Payments/MercadoPagoWebhookController.php`
- `app/Services/Fatura/ImportAutomaticConcessionaireBillService.php` e `app/Services/Imap/AbstractImapFetcherService.php`
- `app/Services/Automation/` (cobrança, pagamento, lembretes) e `app/Services/Alert/` (alertas)
- `app/Http/Controllers/Admin/Relatorio/BillReportController.php` + `app/Services/Admin/Reports/`
- `routes/console.php` (agendamentos), `config/demo.php`

## Frontend
- `resources/js/Layouts/AppShell/` (sidebar, header, breadcrumbs)
- `resources/js/Pages/Admin/Cobranca/{Index,Show}/Page.jsx`
- `resources/js/Pages/Admin/Financeiro/Pagamento/{Index,Show}/Page.jsx`
- `resources/js/Pages/Consultor/Cliente/Fatura/Show/Page.jsx` (revisão de fatura)
- `resources/js/Pages/Consultor/Producer/Usina/{Create,Edit}/Page.jsx`
- `resources/js/Pages/Cliente/Cobrancas/Show/` (pagamento pelo portal)
- `resources/js/Pages/Admin/Relatorio/Fatura/Page.jsx`
- `resources/js/Components/Demo/DemoBar.jsx`, `resources/js/Demo/demoGuard.js`

---

# 15. Histórico de decisões

| Data | Decisão |
|------|---------|
| 2026-05 | Produtor deixa de ser legado e vira role oficial com `ProducerProfile` obrigatório. |
| 2026-05-19 | `UsinaSolar.user_id` removido; dono da usina passa a ser `producer_profile_id`. |
| 2026-06 | Lembretes de cobrança via alerta + link WhatsApp; Policies de usina, cobrança e produtor. |
| 2026-07 | Integração Mercado Pago (Orders API). |
| 2026-08 | Histórico de alterações da cobrança, PDF do boleto com código de barras, várias cobranças por fatura. |
| 2026-10-02/03 | Endurecimento do Mercado Pago (webhook com assinatura obrigatória, boleto vencido); isolamento de dados entre roles; **Cora removida**; alertas operacionais para toda falha de faturamento; pagamento pelo portal do cliente e e-mails ao cliente; PDFs de proposta por link assinado; política de senha; CI. |
| 2026-10-04/05 | Identidade Visual controla nome/cores/logos (nada de marca fixa); **modo demonstração** (`DEMO_MODE`) com dados fictícios e PDFs de proposta novos. |

Documentos antigos (`ANALISE.md`, `RELATORIO_ERROS.md`) tratam produtor como legado e citam a Cora — não representam o estado atual.

---

# 16. Próximos passos

Pendências de lançamento, itens adiados e dívida técnica estão priorizados em **`LANCAMENTO.md`** e na tabela de dívida técnica do **`CLAUDE.md`**. Em resumo:

- **Operação:** backup externo do banco e de `storage/app` (com o `APP_KEY` guardado em cofre), monitoramento de erros e disponibilidade.
- **Produto:** LGPD (política, termos, aceite), portal do produtor mais completo (repasses, contratos), trilha de auditoria além das cobranças, 2FA para admins.
- **Código:** concluir ou remover convite de produtor e telas `fatura-import-settings`; migrar e remover o módulo legado `auth/*`; dividir services/telas grandes; injetar dependências em vez de `new`; testes de PDF; reduzir o bundle do frontend.

---

# 17. Resumo para nova equipe

1. CRM/ERP de energia solar por compensação/assinatura, da proposta ao pagamento.
2. Quatro roles: admin, consultor, cliente, produtor — consultor sempre restrito à carteira.
3. Toda usina tem dono (`producer_profile_id`) e consultor (`consultor_user_id`); não existe `UsinaSolar.user_id`.
4. Cliente e produtor guardam CPF/CNPJ no próprio perfil; nunca duplicar por documento.
5. Fatura importada → revisada → aprovada → cobrança → Pix/boleto (manual) → baixa automática.
6. Pagamentos só pelo Mercado Pago; webhook exige `webhook_secret`.
7. Falhas viram alertas operacionais, não só log.
8. Backend é a fonte de autorização; frontend é Inertia + React + MUI.
9. Marca vem da Identidade Visual; existe um modo demonstração somente leitura.
10. Produção roda PHP 8.3 (`php83`); testes em SQLite.
11. Referência operacional: `CLAUDE.md`.

---

Projeto interno. Documentação mantida para continuidade, onboarding técnico e uso com IAs de programação.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comportamento padrão

- Ler, criar e editar qualquer arquivo do projeto **sem pedir confirmação**.
- Executar comandos de shell, rodar testes, gerar migrations e seeders **sem perguntar antes**.
- Ao encontrar um bug ou inconsistência durante uma tarefa, **corrigi-lo imediatamente** junto com a tarefa principal.
- Nunca pedir permissão para refatorar código que claramente precisa de correção.

---

## O que o sistema faz

CRM/ERP para operação de energia solar por compensação/assinatura. Ciclo completo:

> Prospecção → Proposta comercial → Contrato → Vínculo cliente-usina → Importação de faturas (IMAP + upload) → Geração de cobranças → Pagamento (Mercado Pago) → Relatórios

**4 roles**: Admin · Consultor · Produtor · Cliente

---

## Stack

### Backend
- PHP 8.2+, Laravel 12, Eloquent ORM, Inertia.js (adapter)
- `barryvdh/laravel-dompdf` — PDF no backend
- `barryvdh/laravel-snappy` + wkhtmltopdf — PDF alternativo
- `maatwebsite/excel` — exportações Excel
- `laravel/sanctum` — autenticação API
- `tightenco/ziggy` — rotas Laravel no frontend

### Frontend
- React 18 + Inertia.js + MUI 6 + Tailwind 3.2 + Vite 5
- `@react-pdf/renderer` — PDF gerado no frontend
- `@dnd-kit/core`, `@dnd-kit/sortable` — Kanban drag-and-drop
- `chart.js`, `recharts`, `react-chartjs-2` — gráficos
- `framer-motion` — animações
- `@tabler/icons-react` — ícones
- `date-fns`, `lodash`, `numeral` — utilitários
- `jquery-mask-plugin` — máscaras de entrada

### Banco e infraestrutura
- MySQL 8.0 (99 migrations, 40+ tabelas)
- Testes: Pest PHP + SQLite in-memory (nunca MySQL nos testes)
- Pagamentos: **somente Mercado Pago** (Orders API), via `PaymentProviderContract`/`PaymentProviderManager`; webhook de retorno exige `webhook_secret`. A integração Cora foi removida (2026-10-03) — não reintroduzir sem decisão de negócio
- **PHP de produção é 8.3** (php-fpm 8.3; cron usa `php83`). O `php` da linha de comando é 8.4: rode testes e Composer com `php83` (`composer.json` fixa `config.platform.php = 8.3.24`)
- Email: IMAP para importação automática de faturas de concessionária

---

## Roles do sistema

```php
// app/src/Roles/RoleUser.php
ADMIN = 1 | CONSULTOR = 2 | PRODUTOR = 3 | CLIENTE = 4
```

`RoleUser` tem helpers: `nameById()`, `idByName()`, `ids()`, `names()`.

Redirecionamento pós-login (`app/Http/Middleware/RedirectUserByRole.php`):
- `admin` → `admin.dashboard`
- `consultor` → `consultor.dashboard`
- `cliente` → `cliente.dashboard`
- `produtor` → `produtor.dashboard`

---

## Arquitetura e convenções

- Controllers finos — lógica de negócio nos Services.
- Services injetados via construtor (DI) — **nunca `new Service()` direto**.
- Repositories em `app/Repositories/` — consultas de listagem/paginação complexas ficam aqui, não nos controllers.
- DTOs em `app/DTOs/` — único diretório válido. Subpastas: `Endereco/`, `Payments/`, `UsinaSolar/`, `Usuario/`.
- Policies para autorização (`app/Policies/`). Atualmente: `ClientProfilePolicy` (view/update/delete), `CommercialProposalPolicy`, `UsinaSolarPolicy`, `CustomerChargePolicy`, `ProducerProfilePolicy`. Todas seguem o padrão `before()` com bypass para ADMIN e checagem por `consultor_user_id`/`platform_user_id` para as demais roles. Registradas em `AppServiceProvider::boot()` via `Gate::policy()` — não há `AuthServiceProvider` neste Laravel 12, então não há auto-discovery. Demais entidades usam verificação manual — expandir quando possível.
- Scoping de consultor via Query Scopes — nunca filtros manuais repetidos. Exemplo: `scopeSomenteMeusClientes()` em `User`.
- Nomenclatura: inglês em models/classes; português aceitável em variáveis/comentários.
- `FormRequest::authorize()` deve validar a role, não só `auth()->check()`.
- Toda página de listagem (Index) que já possui filtros e cuja entidade se relaciona com `ClientProfile` (direta ou via `ConsumerUnit`) deve incluir um filtro `client_name` por nome, buscando em `nome`/`razao_social`/`nome_fantasia` via `whereHas('clientProfile', ...)` (ou relação aninhada equivalente). Padrão de referência: `CustomerChargeRepository`, `ClientContractRepository`, `PaymentSlipRepository`, `BillReportService`.

---

## Regras de domínio críticas

### Usina Solar
- `UsinaSolar.producer_profile_id` = referência ao `ProducerProfile` do produtor proprietário (**campo crítico**).
- `UsinaSolar.consultor_user_id` = FK para `users` (role consultor).
- **NÃO existe mais `UsinaSolar.user_id`** — foi removido na migration `2026_05_19`. Não recriar o relacionamento `user()` no model.
- Toda usina DEVE ter `producer_profile_id` e `consultor_user_id`.
- Campos de energia: `energia_disponivel_kwh`, `energia_alocada_kwh`, `energia_saldo_kwh`.

### Unidade Consumidora (ConsumerUnit)
- `ConsumerUnit` pertence a um `ClientProfile` e a uma `Concessionaria`.
- Código da UC (`uc_code`) é normalizado para apenas dígitos no evento `saving`.
- Combinação `uc_code + concessionaria_id` é única — não criar UCs duplicadas.
- `ConcessionaireBill` referencia `consumer_unit_id` para associar faturas à UC correta.

### ClientUsinaLink
- Vincula `ClientProfile` ↔ `UsinaSolar`, opcionalmente via `ConsumerUnit`.
- Campos: `allocated_energy_kwh`, `discount_percentage`, `consumption_percentage`.
- Se `consumer_unit_id` informado: encerra apenas o vínculo ativo da mesma UC+usina (uma UC pode ter múltiplos vínculos ativos com usinas diferentes simultaneamente).
- Sem `consumer_unit_id`: encerra todos os vínculos ativos do cliente (comportamento legado).
- Status controlado pelo enum `ClientUsinaLinkStatus`; `scopeActive()` filtra por `is_active=true` e status `Active`.

### Produtor
- Produtor é **role oficial** com dashboard próprio, rotas próprias e `ProducerProfile` obrigatório.
- `ProducerProfile.platform_user_id` = FK para `users` do produtor (quando ativado na plataforma).
- Fluxo de criação inline (via proposta): `User` → `UserData` → `UserContact` → `ProducerProfile`.
- Não duplicar produtor por CPF/CNPJ: buscar primeiro em `UserData`.
- Ao excluir `ProducerProfile` (soft delete), CPF e CNPJ são zerados no evento `deleting`.

### Cliente
- `ClientProfile` armazena CPF/CNPJ diretamente (não via `UserData`).
- Ao excluir `ClientProfile` (soft delete), CPF e CNPJ são zerados no evento `deleting` — permite recadastro futuro com o mesmo documento.
- Ativação via convite por email (`ClientActivationInviteMail`).

### Consultor
- Vê apenas clientes/produtores da própria carteira (scoping obrigatório nas queries).
- Vinculado via `users.consultor_id`, `producer_profiles.consultor_user_id`, `producer_leads.consultor_user_id`.
- Scopes de carteira: `CustomerCharge::somenteMinhasCobrancas()`, `ClientProfile::somenteDoConsultor()`, `User::somenteMeusClientes()`. Toda ação com `{id}` acessível ao consultor checa o dono (policy ou `abort_if`) — coberto por `tests/Feature/Security/AccessIsolationTest.php`.

### Mapa de acesso por role (rotas)
- `admin/*`: **só admin por padrão** (`routes/admin/index.php`). Consultor entra apenas em cobranças, pagamentos, alertas operacionais e relatórios de clientes/usinas — todos filtrados pela carteira. Faturas de concessionária, dashboard admin, cockpit, configurações, usuários e integrações são exclusivos do admin.
- `auth/*` (módulo legado de cadastros): só admin, porque os controllers não filtram por carteira; exceções: ferramentas de WhatsApp (admin + consultor), perfil e suporte (todas as roles).
- `cliente/*` e `produtor/*`: portais próprios, cada `show` confere o dono do registro.
- Não há cadastro público (`/register` removido): clientes entram por convite (`ClientAccessInvite`); produtores são criados pelo admin.

---

## Domínios e modelos

```
app/Models/
├── Users/       User, UserData, UserContact, Admin, Produtor, Vendedor, Roles
├── Cliente/     ClientProfile, ClienteProposta, ClientContract, ClientUsinaLink,
│                ClientDiscountRule, ClientAccessInvite, ClientePropostaAddress,
│                ConsumerUnit
├── Produtor/    ProducerProfile, ProducerLead, ProdutorPropostas,
│                ProdutorContratos, ProducerAdministrationFeeRules, ProducerAccessInvite,
│                ProdutorPropostasEnderecos
├── Usina/       UsinaSolar, UsinaBlock, UsinaGenerationRecord, Concessionaria, UsinaAddress
├── Proposta/    CommercialProposal, ProducerProposal
├── Energia/     EnergyBill
├── Fatura/      ConcessionaireBill, ConcessionaireBillIssue, ImportedConcessionaireEmail
├── Cobranca/    CustomerCharge, CustomerChargeAdjustment
├── Pagamento/   PaymentSlip, PaymentTransaction, PaymentProviderAccount, PaymentWebhookEvent
├── Alert/       OperationalAlert
├── Importacao/  ClientEmailImportSetting, ImportEmailAccount, ImportedEnergyBillEmail
├── Config/      SystemSetting
├── Support/     SupportTicket, SupportTicketMessage
├── WhatsApp/    WhatsAppMessageTemplate
└── Endereco/    Address, UserAddress, UsinaAddress
```

Models com SoftDeletes: `User`, `ClientProfile`, `ProducerProfile`, `UsinaSolar`, `UsinaBlock`, `Concessionaria`, `SupportTicket`.

---

## Enums

```
app/Enums/
├── Alert/     OperationalAlertSeverity, OperationalAlertStatus
├── Cliente/   ClientUsinaLinkStatus, ContractStatus
├── Cobranca/  CustomerChargeStatus
├── Fatura/    BillParserStatus, BillReviewStatus
├── Pagamento/ PaymentSlipStatus
├── Support/   SupportTicketCategory, SupportTicketPriority, SupportTicketStatus
└── Usina/     UsinaOperationalStatus
```

---

## Jobs e automações

```
app/Jobs/
├── GenerateChargeFromApprovedBillJob.php
├── MarkChargeAsOverdueJob.php
├── SendChargeReminderJob.php
├── SyncPaymentStatusJob.php
└── Pagamento/ProcessPaymentWebhookJob.php
```

Serviços de automação recorrente em `app/Services/Automation/`:
- `ChargeAutomationService` — gera `CustomerCharge` a partir de fatura aprovada.
- `PaymentAutomationService` — marca cobranças vencidas, sincroniza pagamentos pendentes com o Mercado Pago e expira boletos vencidos.
- `ChargeReminderService` — dispara lembrete de cobrança: pré-vencimento (3 dias antes do `due_date`, uma vez), pós-vencimento (a cada 5 dias enquanto `status=overdue`) e boleto vencido sem substituto (a cada 5 dias, via `PaymentSlipExpiredAlertService`; nesses casos o lembrete de vencida comum não é enviado). Despacha `SendChargeReminderJob`, que delega para `GenerateChargeReminderAlertService` (cria um `OperationalAlert` com link `wa.me` pronto no `payload`, atribuído ao consultor responsável). Controlado pela coluna `customer_charges.reminder_sent_at`.
- `PaymentAutomationService::expireOverdueSlips()` — marca como `expired` o boleto/Pix cuja data (lida do código de barras) passou, sem cancelar no provider; o slip vencido segue sincronizado por 10 dias.
- **Não há geração automática de boletos**: o pagamento é sempre gerado manualmente na tela da cobrança (decisão de negócio). O antigo `casaverde:generate-missing-payments`/`GeneratePaymentForChargeJob` foi removido junto com a Cora.

Agendamento (`routes/console.php`, cron com `php83 artisan schedule:run`):
- `casaverde:expire-payment-slips` (`ExpireOverduePaymentSlipsCommand`) — `dailyAt('06:00')`.
- `casaverde:send-charge-reminders` (`SendChargeRemindersCommand`) — `dailyAt('08:00')`.
- `casaverde:scan-operational-health` (`ScanOperationalHealthCommand`) — `hourlyAt(30)`.
- `casaverde:sync-payments` (`SyncPendingPaymentsCommand`) — `everyFiveMinutes()`.
- `casaverde:mark-overdue-charges` — `everyTenMinutes()`.
- `concessionaire-bills:import`, `casaverde:generate-monthly-charges` — `hourly()`. (`energy-bills:import`, pipeline `EnergyBill` antigo, está fora do agendamento: nunca importou nada e duplicava a leitura das caixas — candidato a remoção.)

Worker da fila: serviço systemd `casa-verde-queue` (`/usr/bin/php83`, `Restart=always`), conexão `database`. Após deploy: `php artisan queue:restart`.

### Alertas de falha operacional

Toda falha que compromete o faturamento ou a operação contínua vira `OperationalAlert` (tela Alertas Operacionais + sino com contador no cabeçalho) via `App\Services\Alert\OperationalAlertNotifier` — nunca só log. O alerta é único por módulo + tipo + registro, é renovado se a falha se repete e resolvido sozinho quando a operação volta a funcionar.
- Importação de faturas (`BillImportAlertService`): caixa IMAP inacessível, senha do PDF inválida, fatura ilegível, falha ao gravar, rotina inteira falhando.
- Pagamentos (`PaymentAlertService`): Mercado Pago recusou gerar (alerta ao consultor), credencial recusada (401/403, crítico), pagamento que não sincroniza, webhook que falha.
- Sistema (`SystemFailureAlertService`, ouvintes em `AppServiceProvider`): job que esgota tentativas na fila, tarefa agendada que falha.
- Varredura (`OperationalHealthScanService`): caixas não verificadas há 3h, faturas em revisão há 3 dias, faturas aprovadas sem cobrança, cobranças em rascunho há 2 dias e cobranças vencendo em 5 dias sem boleto/Pix (um alerta por consultor), pagamentos sem sync há 2h, conta Mercado Pago ausente e webhook sem secret. Respeita alertas marcados como "ignorado".
- Visibilidade (`OperationalAlert::scopeVisibleTo`): admin vê tudo; consultor só alertas `financeiro` da própria carteira (nunca `fatura`/`sistema`).

Não existe envio automático de WhatsApp (sem credenciais de Business API/Twilio/Z-API) — `WhatsAppLinkService` apenas gera o link `wa.me` para clique humano do consultor a partir do alerta.

---

## Rotas

```
routes/
├── web.php                    # carrega todos os módulos
├── admin/                     # auth + role:admin (consultor só nos módulos listados em "Mapa de acesso")
│   ├── index.php
│   ├── users/                 # admin.php, produtor.php, vendedor.php
│   ├── financeiro/
│   └── [usinas, fatura, relatorios, config, alerts, whatsapp...]
├── auth/                      # rotas compartilhadas por roles
├── cliente/index.php          # auth + role:cliente
├── consultor/                 # auth + role:consultor
│   ├── index.php
│   ├── cliente/               # clientes, consumer units, vínculos usina
│   ├── producer/
│   └── propostas/
├── produtor/index.php         # auth + role:produtor
└── user/                      # perfil, suporte
```

---

## Middlewares críticos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `EnsureUserHasRole.php` | Bloqueia acesso por role (`role:admin,consultor` etc.) |
| `RedirectUserByRole.php` | Redireciona `/dashboard` para o dashboard correto por role |
| `HandleInertiaRequests.php` | Compartilha `auth.user` (id, nome, email, role_id, role_name, status, consultor_id), `alert`, `flash` e `navBadges` (inclui `chargesAwaitingNewSlip`) |
| `SecurityHeaders.php` | X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy e HSTS (em HTTPS) |

`bootstrap/app.php` confia nos proxies (`trustProxies(at: '*')`): a aplicação roda atrás de Cloudflare + nginx, e sem isso o Laravel vê HTTP e o IP do proxy.

---

## Integração de pagamentos (Mercado Pago)

Mercado Pago (`app/Services/Pagamento/Providers/MercadoPago/`) é o provider em produção; guia de configuração e regras operacionais (vencimento, boleto vencido, reemissão, estorno) em `MERCADO_PAGO.md`. Webhook: `MercadoPagoWebhookController` (consulta a API antes de dar baixa). O webhook recusa tudo quando a conta não tem `webhook_secret`; no painel do MP o evento a assinar é **Order (Mercado Pago)**. Métodos: `pix` (padrão) ou `boleto` (exige endereço do pagador).

---

## Integração IMAP (faturas)

```
app/Services/Imap/AbstractImapFetcherService.php   # classe base
app/Services/Energia/Imap/ImapEnergyBillFetcherService.php
app/Services/Fatura/Imap/ImapConcessionaireFetcherService.php
```

Pool de contas IMAP gerenciado via `ImportEmailAccount`. Cada cliente pode ter uma conta dedicada referenciada por `ClientEmailImportSetting.import_email_account_id`.

---

## Integração WhatsApp

`WhatsAppLinkService` (`app/Services/WhatsApp/`) gera links `wa.me` com templates configuráveis.  
Templates com placeholders `{{variavel}}` armazenados em `WhatsAppMessageTemplate`.

---

## Frontend — estrutura principal

```
resources/js/
├── Pages/        (páginas JSX por domínio: Admin, Auth, Consultor, Cliente, Produtor...)
├── Components/   (DataTable, Modal, Forms, Charts, PDF, Filters...)
├── Layouts/
│   ├── AppShell/ (AppSidebar, AppHeader, AppBreadcrumbs, AppMobileDrawer...)
│   └── DashboardLayout/
├── Hooks/
│   ├── useAuthUser.js    — dados do usuário autenticado via Inertia
│   ├── useCanAccess.js   — verificação de permissões no frontend
│   └── useInputMask.js   — máscara CPF, CNPJ, telefone etc.
├── Utils/        (formatCurrency, statusLabels, buscarCepUtil, permissions...)
└── Contexts/
```

Menu construído com base em `auth.user.role_name` — segurança real sempre no backend.

---

## Testes

- Framework: Pest PHP
- Ambiente: SQLite in-memory (`phpunit.xml` define `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`)
- Rodar com `php83 artisan test` (mesma versão de produção).
- `tests/Pest.php` liga `Http::preventStrayRequests()`: chamada HTTP sem `Http::fake()` falha o teste (nunca sai para o Mercado Pago); helpers `mercadoPagoAccount()` e `mpOrder()` simulam conta e pedido. `phpunit.xml` manda logs para o canal `null`.
- Cobertura atual: 83 arquivos de teste (Feature + Unit), 523 testes
- Áreas cobertas: Auth, Middleware, Dashboard (Admin/Consultor), Services (Cliente, Cobrança, Usina, Fatura, Proposta, Automation), Controllers (ConsumerUnit, ClientUsinaLink, ConcessionariaController, ProducerFeeRule), Policies (UsinaSolar, CustomerCharge, ProducerProfile), Pagamento/Mercado Pago (provider, assinatura e controller de webhook, processamento de webhook, geração/cancelamento/sync de boleto e Pix), IMAP (`ImportAutomaticConcessionaireBillService`, com fetcher/extrator/desbloqueio de PDF mockados), WhatsApp (`WhatsAppLinkService`)
- Também cobertos: Mercado Pago (provider, vencimento, estorno, webhook com assinatura), ciclo de vida de boletos vencidos, isolamento de acesso por role/carteira (`tests/Feature/Security/`).
- **Áreas sem cobertura**: geração de PDF via snappy (propostas legadas)

Preferir testes de integração com SQLite — sem mocks de DB.

---

## Dívida técnica — corrigir ao encontrar

| Problema | Local | Ação |
|----------|-------|------|
| `FormRequest::authorize()` valida role, mas não carteira | Requests de edição usados por consultor | Na edição, checar carteira no `authorize()` (padrão: `StoreClientProfileRequest`) |
| Módulo legado `auth/*` sem filtro de carteira | `app/Http/Controllers/Auth/**` | Restrito a admin; migrar telas ainda úteis para os módulos novos e remover o resto |
| Funcionalidades inacabadas | convite de produtor (`ProducerAccessInvite` nunca é criado, sem página de ativação); telas `fatura-import-settings` (só o `update` está ativo) | Concluir ou remover |
| Status de slip como strings soltas | `app/Services/Pagamento/**` | Migrar para `PaymentSlipStatus` (já tem `REFUNDED`) |
| Controllers/Services acima de 200 linhas | `ClientReportService`, `ImportAutomaticConcessionaireBillService`, `ScanUsinaOperationalAlertsService`, `ClienteEconomiaRelatorioService`, `AdminDashboardMetricsService`, `ExecutiveCockpitService` | Dividir em classes menores |
| N+1 potenciais | Services sem eager loading | Adicionar `.with()` onde necessário |
| Sem cobertura de teste para geração de PDF | dompdf/snappy | Criar testes quando o fluxo for revisado |

---

## Padrões de código

- Sem comentários óbvios — só comentar o **porquê** quando não óbvio.
- Sem docblocks longos.
- Sem feature flags ou backward-compat shims desnecessários.
- Testes com Pest — integração com SQLite real (sem mocks de DB).
- Remover `dd()` imediatamente se encontrado em código de produção.

---

## Comandos úteis

```bash
# Testes
php artisan test
php artisan test --filter=NomeDoTeste

# Frontend
npm run dev
npm run build

# Migrations
php artisan migrate
php artisan migrate:fresh --seed

# Automações financeiras (também agendadas via routes/console.php)
php artisan casaverde:expire-payment-slips
php artisan casaverde:send-charge-reminders
php artisan casaverde:sync-payments

# Seeders disponíveis
# RolesSeeder, UserSeeder, ConcessionariasSeeder,
# SystemSettingSeeder, PaymentProviderAccountSeeder, DemoDataSeeder

# Lint / format
./vendor/bin/pint

# Instalar wkhtmltopdf (necessário para PDF backend)
sudo apt install -y wkhtmltopdf
```

---

## Setup inicial

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```

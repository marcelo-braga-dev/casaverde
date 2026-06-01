# CLAUDE.md — Casa Verde CRM

## Comportamento padrão

- Ler, criar e editar qualquer arquivo do projeto **sem pedir confirmação**.
- Executar comandos de shell, rodar testes, gerar migrations e seeders **sem perguntar antes**.
- Ao encontrar um bug ou inconsistência durante uma tarefa, **corrigi-lo imediatamente** junto com a tarefa principal.
- Nunca pedir permissão para refatorar código que claramente precisa de correção.

---

## O que o sistema faz

CRM/ERP para operação de energia solar por compensação/assinatura. Ciclo completo:

> Prospecção → Proposta comercial → Contrato → Vínculo cliente-usina → Importação de faturas (IMAP + upload) → Geração de cobranças → Pagamento via Cora → Relatórios

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
- MySQL 8.0 (77 migrations, 40+ tabelas)
- Testes: Pest PHP + SQLite in-memory (nunca MySQL nos testes)
- Pagamentos: Cora API (sandbox e produção), webhook de retorno
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
- Services injetados via construtor (DI) — **nunca `new Service()` direto** (ainda existem ~25 ocorrências legacy em `app/Http/Controllers/Auth/` — migrar para DI ao tocar esses arquivos).
- DTOs em `app/DTOs/` — único diretório válido. Subpastas: `Endereco/`, `Payments/`, `UsinaSolar/`, `Usuario/`.
- Policies para autorização (`app/Policies/`). Atualmente: `ClientProfilePolicy`, `CommercialProposalPolicy`. Demais entidades usam verificação manual — expandir quando possível.
- Scoping de consultor via Query Scopes — nunca filtros manuais repetidos. Exemplo: `scopeSomenteMeusClientes()` em `User`.
- Nomenclatura: inglês em models/classes; português aceitável em variáveis/comentários.
- `FormRequest::authorize()` deve validar a role, não só `auth()->check()`.

---

## Regras de domínio críticas

### Usina Solar
- `UsinaSolar.producer_profile_id` = referência ao `ProducerProfile` do produtor proprietário (**campo crítico**).
- `UsinaSolar.consultor_user_id` = FK para `users` (role consultor).
- **NÃO existe mais `UsinaSolar.user_id`** — foi removido na migration `2026_05_19`. O relacionamento `user()` no model é código legado sem coluna correspondente. Não usar.
- Toda usina DEVE ter `producer_profile_id` e `consultor_user_id`.
- Campos de energia: `energia_disponivel_kwh`, `energia_alocada_kwh`, `energia_saldo_kwh`.
- `StoreUsinaSolarRequest` valida que `producer_profile_id` existe em `producer_profiles` e que `consultor_user_id` é usuário com role consultor.

### Produtor
- Produtor é **role oficial** com dashboard próprio, rotas próprias e `ProducerProfile` obrigatório.
- `ProducerProfile.platform_user_id` = FK para `users` do produtor (quando ativado na plataforma).
- Fluxo de criação inline (via proposta): `User` → `UserData` → `UserContact` → `ProducerProfile`.
- Identificação por CPF/CNPJ em `UserData` — reutilizar usuário existente se encontrado.
- Não duplicar produtor por CPF/CNPJ: buscar primeiro em `UserData`.

### Cliente
- `ClientUsinaLink` vincula cliente a usina com alocação de energia (kWh e percentual).
- Ativação via convite por email (`ClientActivationInviteMail`).

### Consultor
- Vê apenas clientes/produtores da própria carteira (scoping obrigatório nas queries).
- Vinculado via `users.consultor_id`, `producer_profiles.consultor_user_id`, `producer_leads.consultor_user_id`.

---

## Domínios e modelos

```
app/Models/
├── Users/       User, UserData, UserContact, Admin, Produtor, Vendedor, Roles
├── Cliente/     ClientProfile, ClienteProposta, ClientContract, ClientUsinaLink,
│                ClientDiscountRule, ClientAccessInvite, ClientePropostaAddress
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
├── Importacao/  ClientEmailImportSetting, ImportedEnergyBillEmail
├── Config/      SystemSetting
├── Support/     SupportTicket, SupportTicketMessage
└── Endereco/    Address, UserAddress, UsinaAddress
```

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
├── GeneratePaymentForChargeJob.php
├── MarkChargeAsOverdueJob.php
├── SendChargeReminderJob.php
├── SyncPaymentStatusJob.php
└── Pagamento/ProcessPaymentWebhookJob.php
```

---

## Rotas

```
routes/
├── web.php                    # carrega todos os módulos
├── admin/                     # auth + role:admin,consultor
│   ├── index.php
│   ├── users/
│   ├── financeiro/
│   └── [usinas, fatura, relatorios, config, alerts...]
├── auth/                      # rotas compartilhadas por roles
├── cliente/index.php          # auth + role:cliente
├── consultor/                 # auth + role:consultor
├── produtor/index.php         # auth + role:produtor
└── user/                      # perfil, suporte
```

---

## Middlewares críticos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `EnsureUserHasRole.php` | Bloqueia acesso por role (`role:admin,consultor` etc.) |
| `RedirectUserByRole.php` | Redireciona `/dashboard` para o dashboard correto por role |
| `HandleInertiaRequests.php` | Compartilha `auth.user` (id, nome, email, role_id, role_name, status, consultor_id), `alert` e `flash` |

---

## Integração Cora (pagamentos)

```
app/Services/Pagamento/Providers/Cora/
├── CoraAuthService.php
├── CoraHttpClient.php
├── CoraPaymentProvider.php
├── CoraWebhookPayloadMapper.php
└── CoraWebhookSignatureValidator.php
```

Webhook recebido em `app/Http/Controllers/Webhook/Payments/CoraWebhookController.php`.

---

## Integração IMAP (faturas)

```
app/Services/Imap/AbstractImapFetcherService.php   # classe base
app/Services/Energia/Imap/ImapEnergyBillFetcherService.php
app/Services/Fatura/Imap/ImapConcessionaireFetcherService.php
```

---

## Frontend — estrutura principal

```
resources/js/
├── Pages/        (227 páginas JSX por domínio: Admin, Auth, Consultor, Cliente, Produtor...)
├── Components/   (84 componentes: DataTable, Modal, Forms, Charts, PDF, Filters...)
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
- Cobertura atual: ~30 arquivos de teste (Feature + Unit)
- Áreas cobertas: Auth, Middleware, Dashboard (Admin/Consultor), Services (Cliente, Cobrança, Usina)
- **Áreas sem cobertura**: Cora/pagamentos, IMAP, proposta de produtor, PDF

Preferir testes de integração com SQLite — sem mocks de DB.

---

## Dívida técnica — corrigir ao encontrar

| Problema | Local | Ação |
|----------|-------|------|
| `new Service()` sem DI (~25 ocorrências) | `app/Http/Controllers/Auth/` legado | Migrar para injeção via construtor |
| `UsinaSolar::user()` referencia coluna removida | `app/Models/Usina/UsinaSolar.php:60` | Remover método legado |
| `FormRequest::authorize()` retorna só `auth()->check()` | Vários Requests | Validar role explicitamente |
| Controllers/Services acima de 200 linhas | `ClientReportService`, `StoreProdutorPropostaRequest` | Dividir em classes menores |
| Policies faltando para UsinaSolar, CustomerCharge, ProducerProfile | `app/Policies/` | Criar e registrar |
| Scoping de consultor manual por query | Queries espalhadas | Centralizar em Query Scopes |
| N+1 potenciais | Services sem eager loading | Adicionar `.with()` onde necessário |

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

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
- MySQL 8.0 (100 migrations, 40+ tabelas)
- Testes: Pest PHP + SQLite in-memory (nunca MySQL nos testes)
- Pagamentos: **somente Mercado Pago** (Orders API), via `PaymentProviderContract`/`PaymentProviderManager`; webhook de retorno exige `webhook_secret`. A integração Cora foi removida (2026-10-03) — não reintroduzir sem decisão de negócio
- **PHP de produção é 8.3** (php-fpm 8.3; cron usa `php83`). O `php` da linha de comando é 8.4: rode testes e Composer com `php83` (`composer.json` fixa `config.platform.php = 8.3.24`)
- Email: IMAP para importação automática de faturas de concessionária; SMTP (fila) para os e-mails ao cliente

### Instâncias no servidor
- **Produção** (Casa Verde): `/www/wwwroot/casa_verde/crm` — cron `php83 artisan schedule:run` e worker `casa-verde-queue`.
- **Demonstração** (`gdsolar.rexar.com.br`, `DEMO_MODE=true`): `/www/wwwroot/rexar/gdsolar` — instalada com `composer install --no-dev` (Pest/Pint não ficam disponíveis; rode testes numa cópia de desenvolvimento ou no CI, `.github/workflows/ci.yml`).

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
- **Nunca escrever "Casa Verde" fixo em texto visível** (telas, PDFs, e-mails, mensagens, seeders): usar `SystemSettingService::brandName()` no backend/Blade e o hook `useBrandName()` no frontend (componentes `@react-pdf` recebem o nome por prop). A demonstração usa outra marca; `tests/Feature/Demo/BrandNameTest.php` cobre o básico.
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
- `ProducerProfile` guarda o documento e o nome diretamente (`tipo_pessoa`, `cpf`, `cnpj`, `nome`, `razao_social`, `nome_fantasia`), como o `ClientProfile`; contato via `contacts_id` → `UserContact`; consultor em `consultor_user_id`.
- `ProducerProfile.platform_user_id` = FK para `users` do produtor (quando ativado na plataforma). As colunas antigas `user_id`/`created_by_user_id` não são mais usadas pelo model.
- Criação inline (proposta de produtor do consultor, `consultor.propostas.produtor.*`): `CreateOrFindProducerProfileService` busca por CPF/CNPJ em `ProducerProfile`; se não existir, cria `UserContact` → `ProducerProfile` (status `prospect`) e a regra de taxa de administração padrão (`default_producer_fee_percentage`).
- Não duplicar produtor por CPF/CNPJ: buscar primeiro em `ProducerProfile`. (O módulo legado `auth/*` — `ProdutorPropostaRepository` — ainda busca em `UserData` e cria `User`/`UserData`; não replicar esse caminho em código novo.)
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
├── Users/       User, UserData, UserContact, UserAddress, Admin, Produtor, Vendedor, Roles
├── Acesso/      UserAccessLog            (login/logout e ações de acesso)
├── Cliente/     ClientProfile, ClienteProposta, ClientContract, ClientUsinaLink,
│                ClientDiscountRule, ClientAccessInvite, ClientePropostaAddress,
│                ConsumerUnit
├── Produtor/    ProducerProfile, ProducerLead, ProdutorPropostas,
│                ProdutorContratos, ProducerAdministrationFeeRules, ProducerAccessInvite,
│                ProdutorPropostasEnderecos
├── Usina/       UsinaSolar, UsinaBlock, UsinaGenerationRecord, Concessionaria, UsinaAddress
├── Proposta/    CommercialProposal, ProducerProposal
├── Energia/     EnergyBill               (pipeline antigo, fora do agendamento)
├── Fatura/      ConcessionaireBill, ConcessionaireBillIssue, ImportedConcessionaireEmail,
│                ImportRun                (histórico de execuções da importação)
├── Cobranca/    CustomerCharge, CustomerChargeAdjustment, CustomerChargeHistory
├── Pagamento/   PaymentSlip, PaymentTransaction, PaymentProviderAccount, PaymentWebhookEvent
├── Alert/       OperationalAlert
├── Importacao/  ClientEmailImportSetting, ImportEmailAccount, ImportedEnergyBillEmail,
│                InstitutionalEmailAccount (caixas institucionais, tela Integração)
├── Config/      SystemSetting
├── Demo/        DemoVisitor              (visitantes do modo demonstração)
├── Support/     SupportTicket, SupportTicketMessage
├── WhatsApp/    WhatsAppMessageTemplate
├── Endereco/    Address
└── (raiz)       BaseModel, Concessionarias, Config, Enderecos — legado; não usar em código novo
```

Models com SoftDeletes: `User`, `ClientProfile`, `ProducerProfile`, `UsinaSolar`, `UsinaBlock`, `Concessionaria`, `SupportTicket`.

`CustomerChargeHistory` registra toda alteração da cobrança (vencimento, valor, status, boleto) e aparece no detalhe da cobrança — é a única trilha de auditoria do sistema.

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
- `queue:prune-failed --hours=720` — `daily()`.
- `prune-temporary-pdfs` (`TemporaryPdfStorageService::prune()`) — `daily()`; único agendamento que roda também em `DEMO_MODE`.
- Todos os comandos usam `withoutOverlapping()`. Em `DEMO_MODE` só a limpeza de PDFs temporários é agendada.

Comandos manuais (não agendados): `concessionaire-bills:reprocess {--id=}` (reprocessa o parser de faturas já importadas), `usinas:scan-alerts` (alertas de energia por usina), `energy-bills:import`, `demo:visitantes`.

Worker da fila: serviço systemd `casa-verde-queue` (`/usr/bin/php83 artisan queue:work --tries=3 --max-time=3600`, `Restart=always`), conexão `database`. Após deploy: `php83 artisan queue:restart`.

### E-mails ao cliente

`ChargePaymentMail` (fila, `afterCommit`) é enviado pelo `ClientChargeNotificationService` ao gerar boleto/Pix (`GeneratePaymentSlipService`) e no lembrete de 3 dias antes do vencimento (`SendChargeReminderJob`, só se houver boleto pagável). O destinatário vem do `ClientContactEmailResolver` — nunca o e-mail sintético `@casaverde.local`. Único outro e-mail: `ClientActivationInviteMail`.

### PDFs temporários de proposta

`TemporaryPdfStorageService` grava os PDFs de proposta no disco `local` (`storage/app/pdfs-temporarios/`) e entrega por link assinado de 2h (`pdfs.temporarios.show`); apagados após 1 dia. Nunca gravar documentos com dados pessoais no disco `public`.

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
├── web.php                    # carrega todos os módulos + webhook do Mercado Pago
├── auth.php                   # login, senha, verificação de e-mail (Breeze)
├── demo.php                   # acesso/troca de perfil/CSV do modo demonstração (404 fora dele)
├── console.php                # agendamentos
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
| `HandleInertiaRequests.php` | Compartilha `auth.user` (id, name, nome, email, role_id, role_name, status, consultor_id, dados_acesso), `alert`, `flash`, `navBadges` (inclui `chargesAwaitingNewSlip`), `whatsappTemplates`, `brand` (Identidade Visual: nome, cores, logotipo) e `demo` (só com `DEMO_MODE`) |
| `SecurityHeaders.php` | X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy e HSTS (em HTTPS) |
| `DemoMode.php` | Em `DEMO_MODE`, recusa escrita e rotas `.create`/`.edit` e conta as telas vistas pelo visitante |

`bootstrap/app.php` confia nos proxies (`trustProxies(at: '*')`): a aplicação roda atrás de Cloudflare + nginx, e sem isso o Laravel vê HTTP e o IP do proxy.

---

## Modo demonstração (`DEMO_MODE`)

Instância separada (domínio e banco próprios) para interessados testarem a plataforma; guia completo em `DEMO.md`. Desligado por padrão — com `DEMO_MODE=false` nada muda.
- `/login` vira acesso sem senha (nome + e-mail/telefone + aceite); visitantes gravados em `demo_visitors` (`DemoAccessService`).
- Barra de troca de perfil (admin/consultor/cliente/produtor) em `Components/Demo/DemoBar.jsx`, montada na raiz (`app.jsx`).
- Somente leitura garantido no servidor pelo middleware `DemoMode` (bloqueia escrita e rotas `.create`/`.edit`); `resources/js/Demo/demoGuard.js` só esmaece botões e avisa.
- **Rota POST que apenas lê dados** precisa entrar em `config/demo.php` → `readonly_post_routes`, senão é bloqueada na demonstração.
- Agendamentos desligados em demonstração (`routes/console.php`). Exportação de visitantes: `php artisan demo:visitantes` ou `/demo/visitantes.csv?token=DEMO_LEADS_TOKEN`.

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
│   ├── useInputMask.js   — máscara CPF, CNPJ, telefone etc.
│   └── useBrandName.js   — nome da marca (Identidade Visual)
├── Utils/        (formatCurrency, statusLabels, buscarCepUtil, permissions...)
└── Contexts/
```

Menu construído com base em `auth.user.role_name` — segurança real sempre no backend.

---

## Testes

- Framework: Pest PHP
- Ambiente: SQLite in-memory (`phpunit.xml` define `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`)
- Rodar com `php83 artisan test` (mesma versão de produção). Exige as dependências de desenvolvimento do Composer — na instância de demonstração elas não estão instaladas.
- `tests/Pest.php` liga `Http::preventStrayRequests()`: chamada HTTP sem `Http::fake()` falha o teste (nunca sai para o Mercado Pago); helpers `mercadoPagoAccount()` e `mpOrder()` simulam conta e pedido. `phpunit.xml` manda logs para o canal `null`.
- Cobertura atual: 94 arquivos de teste (Feature + Unit), ~558 casos `it()`/`test()` (contagem de 2026-10-29)
- CI: `.github/workflows/ci.yml` roda Pint, testes (PHP 8.3) e `npm ci && npm run build` (Node 22) a cada push/PR
- Áreas cobertas: Auth, Middleware, Dashboard (Admin/Consultor), Services (Cliente, Cobrança, Usina, Fatura, Proposta, Automation), Controllers (ConsumerUnit, ClientUsinaLink, ConcessionariaController, ProducerFeeRule), Policies (UsinaSolar, CustomerCharge, ProducerProfile), Pagamento/Mercado Pago (provider, assinatura e controller de webhook, processamento de webhook, geração/cancelamento/sync de boleto e Pix), IMAP (`ImportAutomaticConcessionaireBillService`, com fetcher/extrator/desbloqueio de PDF mockados), WhatsApp (`WhatsAppLinkService`)
- Também cobertos: Mercado Pago (provider, vencimento, estorno, webhook com assinatura), ciclo de vida de boletos vencidos, isolamento de acesso por role/carteira (`tests/Feature/Security/`), alertas operacionais, e-mails ao cliente, PDFs temporários por link assinado, portal do cliente (pagamento), modo demonstração e nome da marca (`tests/Feature/Demo/`).
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
| Instanciação direta (`new XService`/`new XRepository`) | ~32 ocorrências em `app/` (ex.: `Admin/Config/ConfigController.php`, `Contratos/Usina/ContratoUsinaController.php`) | Injetar via construtor |
| Models legados na raiz | `app/Models/{BaseModel,Concessionarias,Config,Enderecos}.php` | Migrar usos para os models de domínio e remover |
| Telas JSX acima de 1000 linhas | `Auth/Contratos/Usinas/Contrato/ContratoUsina.jsx`, `Admin/Cobranca/Show/Page.jsx`, `Admin/Integracao/Page.jsx` | Extrair componentes em `Partials/` |
| Controllers/Services acima de 200 linhas | `ClientReportService`, `ImportAutomaticConcessionaireBillService`, `ClientProposalController`, `ScanUsinaOperationalAlertsService`, `OperationalHealthScanService`, `ClienteEconomiaRelatorioService`, `AdminDashboardMetricsService`, `ExecutiveCockpitService` | Dividir em classes menores |
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
# Testes (php83 = versão de produção)
php83 artisan test
php83 artisan test --filter=NomeDoTeste

# Frontend
npm run dev
npm run build

# Migrations
php83 artisan migrate
php83 artisan migrate:fresh --seed

# Automações financeiras (também agendadas via routes/console.php)
php83 artisan casaverde:expire-payment-slips
php83 artisan casaverde:send-charge-reminders
php83 artisan casaverde:sync-payments
php83 artisan schedule:list

# Faturas
php83 artisan concessionaire-bills:import [--client_profile_id=]
php83 artisan concessionaire-bills:reprocess [--id=]

# Seeders
# DatabaseSeeder → RolesSeeder, UserSeeder, ConcessionariasSeeder, SystemSettingSeeder,
#                  WhatsAppMessageTemplateSeeder, DemoDataSeeder
# Avulsos: PaymentProviderAccountSeeder (lê MERCADOPAGO_* do .env)
# Demonstração: MarketingDemoSeeder (chama MarketingImportHistorySeeder, DemoTariffSeeder
#               e MarkFictitiousDataSeeder) — ver DEMO.md

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
php83 artisan key:generate
php83 artisan migrate --seed
npm run dev
php83 artisan serve
```

Deploy em produção e checklist operacional: `LANCAMENTO.md`. Mercado Pago: `MERCADO_PAGO.md`. Demonstração: `DEMO.md`.

## Mapa da documentação

| Arquivo | Conteúdo | Situação |
|---------|----------|----------|
| `CLAUDE.md` | Referência operacional: convenções, regras de domínio, automações, comandos | Viva |
| `README.md` | Visão geral, arquitetura, fluxos e onboarding de equipe | Viva |
| `MERCADO_PAGO.md` | Credenciais, webhook e regras operacionais de pagamento | Viva |
| `DEMO.md` | Instância de demonstração (`DEMO_MODE`) | Viva |
| `LANCAMENTO.md` | Prontidão para lançamento e checklist de deploy | Viva |
| `GD_SOLAR_ERP_RELATORIO_VENDAS.md` | Material de vendas B2B do produto (GD Solar ERP) | Viva |
| `docs/curso/` | Curso "Empresa de Assinatura de Energia Solar" (vendido à parte): plano, 76 roteiros de aula e backlog do `LAB_MODE` | Viva |
| `landpage-wordpress-briefing.md` | Briefing da landing page B2C de um cliente (outro site) | Referência externa |
| `ANALISE.md`, `RELATORIO_ERROS.md` | Retratos de 2026-05/06 | Históricos — não atualizar |

Ao mudar algo estrutural (model, rota, automação, integração), atualize `CLAUDE.md` e o documento específico no mesmo commit.

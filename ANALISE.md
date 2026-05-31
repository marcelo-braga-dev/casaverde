# Análise Completa — Casa Verde CRM

> Gerado em: 2026-05-31

---

## O que o sistema faz

É um **CRM/ERP de energia solar por compensação/assinatura**. Opera o ciclo completo:

> Proposta comercial → Contrato → Vínculo cliente-usina → Importação de faturas (IMAP) → Geração de cobranças → Pagamento via Cora (gateway)

**4 roles**: Admin · Consultor · Produtor · Cliente

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Backend | PHP 8.2+, Laravel 12, Eloquent |
| Frontend | React 18 + Inertia.js + MUI 6 + Tailwind 3 + Vite 5 |
| Banco | MySQL 8.0 (75 migrations, 40+ tabelas) |
| Pagamentos | Cora API (sandbox/produção) |
| Automação | IMAP para importação de faturas por email |
| PDF | wkhtmltopdf + dompdf |
| Testes | Pest (apenas 11 testes — ~1% coverage) |

---

## Arquitetura do Backend

### Estrutura de Domínios

```
app/
├── Models/
│   ├── Users/          (User, UserData, UserContact, Admin, Produtor, Vendedor, Roles)
│   ├── Cliente/        (ClientProfile, ClienteProposta, ClientContract, ClientUsinaLink, ClientDiscountRule)
│   ├── Produtor/       (ProducerProfile, ProducerLead, ProdutorPropostas, ProdutorContratos)
│   ├── Usina/          (UsinaSolar, UsinaBlock, UsinaGenerationRecord, Concessionaria)
│   ├── Proposta/       (CommercialProposal, ProducerProposal)
│   ├── Energia/        (EnergyBill)
│   ├── Fatura/         (ConcessionaireBill, ConcessionaireBillIssue)
│   ├── Cobranca/       (CustomerCharge, CustomerChargeAdjustment)
│   ├── Pagamento/      (PaymentSlip, PaymentTransaction, PaymentProviderAccount, PaymentWebhookEvent)
│   ├── Alert/          (OperationalAlert)
│   └── Endereco/       (Address, UserAddress, UsinaAddress)
│
├── Http/Controllers/   (241 public functions em ~140 controllers)
│   ├── Admin/
│   ├── Auth/
│   ├── Webhook/
│   └── [Consultor, Cliente, Produtor]
│
├── Services/           (79 serviços de lógica de negócio)
├── Repositories/       (19+ repositories)
├── Http/Requests/      (31 Form Requests)
├── Http/Middleware/    (3 middlewares críticos)
├── Policies/           (2 policies)
├── Enums/              (4 enums)
├── Jobs/               (6 jobs para automações)
├── DTOs/               (7 DTOs — padrão novo)
├── DTO/                (4 DTOs — padrão antigo, duplicação)
└── src/Roles/          (RoleUser.php com constantes de role)
```

### Roles do sistema

```php
// app/src/Roles/RoleUser.php
ADMIN     = 1
CONSULTOR = 2
PRODUTOR  = 3
CLIENTE   = 4
```

### Rotas

62 arquivos PHP em `/routes` com 3 níveis de organização:
- `web.php` — carrega módulos
- `routes/admin/` — operações admin/consultor
- `routes/auth/`, `routes/consultor/`, `routes/cliente/`, `routes/produtor/` — role-specific

### Middlewares Críticos

1. **EnsureUserHasRole** — autorização por role
2. **RedirectUserByRole** — redirecionamento automático pós-login
3. **HandleInertiaRequests** — compartilha dados com frontend

---

## Arquitetura do Frontend

### Estrutura de Páginas (210 páginas JSX)

```
resources/js/Pages/
├── Auth/       (autenticação, cliente, produtor, propostas, usinas, suporte, ferramentas)
├── Admin/      (configuração, dashboard, relatórios, usuários, usinas, faturas, cobrança)
├── Consultor/  (propostas, clientes, produtores, usinas, leads)
├── Cliente/    (dashboard, perfil, contratos, faturas)
├── Produtor/   (dashboard, kanban, propostas, perfil)
├── Fatura/
├── Usina/
├── Proposta/
└── Endereco/
```

### Componentes (81 componentes React)

- **Reutilizáveis**: TextInput, InputLabel, Dropdown, Modal, Buttons
- **Dados**: DataTable com paginação, filtros, sorting
- **Domínio**: UserData/*, Admin/*, PropostasPDF/*, Filters/*

### Hooks Customizados

- `useAuthUser()` — acesso a dados do usuário autenticado
- `useInputMask()` — máscara de entrada (CPF, CNPJ, etc)
- `useCanAccess()` — verificação de permissões no frontend

---

## Regras de Negócio Críticas

1. **`UsinaSolar.user_id`** = produtor proprietário (regra crítica de domínio)
2. Toda usina DEVE ter `producer_profile_id` e `consultor_user_id`
3. `ClientUsinaLink` vincula cliente a usina com alocação de energia (kwh e percentual)
4. Consultor vê apenas seus clientes/produtores (scoping manual nas queries)
5. Campos de energia em `UsinaSolar`: `energia_disponivel_kwh`, `energia_alocada_kwh`, `energia_saldo_kwh`

---

## Problemas — Ordenados por Severidade

### Críticos

**1. `dd()` em produção** — `app/Http/Controllers/.../UsinaSolarController.php`
```php
dd('Erro Interno: ' . $e->getMessage()); // expõe stack trace para o usuário
```
Deve ser substituído por log + response de erro.

**2. Dois diretórios de DTO conflitantes**
- `/app/DTO/` — 4 arquivos
- `/app/DTOs/` — 7 arquivos (parcialmente duplicados)
- Imports mistos no código: `use App\DTO\...` e `use App\DTOs\...`

**3. Zero Dependency Injection — ~80 ocorrências**
```php
// Antipadrão espalhado nos controllers:
(new ConfigService())->getTaxaReducao();
(new AdminRepository())->create($request);
(new ClienteRepository())->getPaginate();
```
Impossibilita testes unitários e aumenta acoplamento.

**4. Autorização insuficiente em FormRequests**
```php
public function authorize(): bool {
    return auth()->check(); // só verifica se está logado!
}
```
Deveria validar a role do usuário.

**5. Apenas 2 Policies** (ClientProfile, CommercialProposal)
O restante usa `if ($user->isAdmin())` manual nos controllers — sem padronização.

---

### Importantes

**6. Controllers e Services gigantes (violam SRP)**

| Arquivo | Linhas |
|---------|--------|
| `StoreProdutorPropostaRequest.php` | 338 (é um FormRequest!) |
| `ClientProposalController.php` | 337 |
| `ClientReportService.php` | 333 |
| `ScanUsinaOperationalAlertsService.php` | 284 |
| `AdminDashboardMetricsService.php` | 247 |
| `ExecutiveReportService.php` | 203 |

**7. Duplicação nos IMAP Services**
- `ImapEnergyBillFetcherService.php` (185 linhas) e `ImapConcessionaireFetcherService.php` (184 linhas) têm ~95% de código idêntico.
- Precisam extrair uma classe base abstrata.

**8. Nomenclatura inconsistente**

| Padrão Português | Padrão Inglês |
|-----------------|---------------|
| `ClienteProposta`, `ProdutorPropostas` | `ProducerProfile`, `ClientProfile` |
| `ProdutorContratos` | `UsinaSolar`, `CommercialProposal` |

**9. Enums faltando**
Apenas 4 enums existem (`OperationalAlertSeverity`, `OperationalAlertStatus`, `ClientUsinaLinkStatus`, `UsinaOperationalStatus`).
Faltam para: status de usuário, proposta, cobrança, payment slip.

**10. Scoping de consultor manual em cada query**
Não há query scope `forConsultant()` automático. Risco de um consultor ver dados de outro.

---

### Observações

**11. N+1 queries potenciais**
Vários services fazem `.get()` sem `.with()` das relações usadas em seguida.

**12. Código comentado crítico** — `UsinaSolarController` linha 65:
```php
// $this->syncProducerProfileWithUsina($usina, $data);
```
Lógica de sincronização comentada pode causar inconsistência de dados.

**13. Testes praticamente inexistentes**
Apenas 11 testes (autenticação/senha/perfil básicos). Nenhum teste para:
- Services críticos de domínio
- Repositories
- Fluxos de proposta
- Integrações de pagamento
- Importação de faturas

---

## Inconsistências de Código

| Aspecto | Padrão 1 | Padrão 2 | Recomendação |
|---------|----------|----------|--------------|
| DTO | `/app/DTO/` | `/app/DTOs/` | Consolidar em `/app/DTOs/` |
| Instanciação | `new Service()` | Nenhuma DI | Usar container/DI |
| Nomenclatura | Português | Inglês | Standardizar (preferir inglês) |
| Queries | Manual where | Scopes | Preferir scopes |
| Validação | FormRequest | Manual | Sempre FormRequest |
| Autorização | Policy | if manual | Sempre Policy |
| Testes | 11 tests | Coverage 1% | Expandir para 50%+ |

---

## Arquivos Mais Críticos para Atenção

### Backend

| Arquivo | Por quê |
|---------|---------|
| `app/Models/Users/User.php` (239 linhas) | Modelo central — mudanças causam cascata |
| `app/Models/Usina/UsinaSolar.php` (133 linhas) | `user_id` = produtor (regra crítica de domínio) |
| `app/src/Roles/RoleUser.php` | Define roles do sistema inteiro |
| `app/Http/Middleware/RedirectUserByRole.php` | Fluxo de autenticação central |
| `app/Http/Requests/Produtor/StoreProdutorPropostaRequest.php` (338 linhas) | Fragmentar urgentemente |
| `app/Services/Pagamento/Providers/Cora/CoraPaymentProvider.php` (131 linhas) | Integração financeira externa |
| `app/Services/Energia/Imap/ImapEnergyBillFetcherService.php` (185 linhas) | Automação crítica de faturas |
| `app/Services/Fatura/ImportAutomaticConcessionaireBillService.php` (168 linhas) | Processamento de faturas |
| `app/Services/Admin/Reports/ClientReportService.php` (333 linhas) | Dividir em múltiplos services |

### Frontend

| Arquivo | Por quê |
|---------|---------|
| `resources/js/Pages/Auth/Produtor/Proposta/Create/Page.jsx` | Fluxo completo com criação inline de produtor |
| `resources/js/Pages/Auth/Produtor/Kanban/ContextKanban.jsx` | Estado complexo, drag-and-drop |
| `resources/js/Pages/Admin/Dashboard/Page.jsx` | Dashboard com múltiplas métricas |

---

## Plano de Ação

### Sprint 1–2 (Curto prazo)
- [ ] Remover `dd()` da `UsinaSolarController` e implementar logging adequado
- [ ] Consolidar `/app/DTO/` → `/app/DTOs/` e atualizar todos os imports
- [ ] Corrigir `authorize()` nos FormRequests para validar role
- [ ] Criar Enums para todos os tipos de status
- [ ] Iniciar migração de `new Service()` → Dependency Injection (começar pelos Services mais usados)

### Sprint 3–4 (Médio prazo)
- [ ] Criar Policies para ProducerProfile, UsinaSolar, CustomerCharge
- [ ] Implementar query scope `forConsultant()` no base Repository
- [ ] Extrair classe base para IMAP services (eliminar duplicação)
- [ ] Fragmentar `ClientReportService` e `StoreProdutorPropostaRequest`
- [ ] Escrever testes para os fluxos críticos (proposta, pagamento, fatura)

### Sprint 5+ (Longo prazo)
- [ ] Eager loading sistemático para eliminar N+1
- [ ] Standardizar nomenclatura (português ou inglês — escolher e seguir)
- [ ] Auditoria de dados (laravel-auditor)
- [ ] Otimização de performance com Redis cache
- [ ] API REST formal com versioning

---

## Resumo Executivo

### Pontos Fortes
- Arquitetura clara por domínio de negócio
- Separação de roles bem definida
- Services/Repositories para lógica complexa
- Frontend moderno com React + MUI + Inertia
- Middleware de autorização centralizado

### Riscos Imediatos
- `dd()` em produção expõe stack trace para usuários
- Falta de scoping automático de consultor pode expor dados entre usuários
- Zero testes em fluxos críticos (pagamento, proposta, fatura)

### Dívida Técnica Principal
- ~80 instanciações diretas de Service/Repository (sem DI)
- Duplicação estrutural nos diretórios de DTO
- Controllers e Services acima de 300 linhas (violação de SRP)
- Apenas 2 Policies para todo o sistema

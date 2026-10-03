# Prontidão para Lançamento — Casa Verde CRM

> Gerado em: 2026-10-03 (commit base `4c19716`)
> Destinado a: equipe de desenvolvimento e operação (ou agente com acesso ao repositório).
> Ao concluir um item, marque o checkbox e anote a data/commit.
> **Atualizado em 2026-10-03:** itens 1, 2, 4 (parte de código), 6, 9, 10, 11 e 17 implementados; 8 já estava coberto; 16 descartado (ver justificativa). Suíte: 561 testes passando. Ao corrigir código, seguir as convenções de `CLAUDE.md`.

---

## Resumo

O sistema está em bom estado técnico. O que falta para o lançamento é sobretudo **operação** (backup, monitoramento, configuração de produção) e **produto** (o cliente pagar e ser avisado pelo portal), não arquitetura.

### O que já está sólido (verificado em 2026-10-03)

| Área | Situação |
|------|----------|
| Testes | 561 testes passando após as correções de 2026-10-03 (539 na análise inicial) |
| Dependências | `composer audit` e `npm audit --omit=dev`: nenhuma vulnerabilidade conhecida |
| Lint | `./vendor/bin/pint --test` passa |
| Autorização | Todos os FormRequests validam role; rotas admin separadas entre `admin` e `admin,consultor`; módulo legado `auth/*` restrito a admin; portal do cliente/produtor sempre filtra por `platform_user_id`; alertas filtrados por `visibleTo()` |
| Pagamentos | Webhook Mercado Pago com assinatura HMAC obrigatória, deduplicação por `event_id`, processamento em fila com retry; geração de boleto com `Cache::lock` + `X-Idempotency-Key` |
| Segredos | `client_secret`, `webhook_secret`, senhas IMAP e senha de PDF com cast `encrypted` e `$hidden` |
| Cabeçalhos | `SecurityHeaders` (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS em HTTPS) |
| Login | Rate limit de 5 tentativas (`LoginRequest`); cadastro público removido |
| Arquivos sensíveis | Faturas de concessionária no disco `local`, servidas por controller autenticado |
| Build frontend | Compila sem erros (9366 módulos) |

### Ordem de execução sugerida

Pendentes para o lançamento: **4** (`.env` do servidor) e **5** (cron + worker). Itens 3, 7, 12, 13, 14 e 15 ficaram fora do escopo do lançamento por decisão de 2026-10-03.

---

## 🔴 Bloqueadores — resolver antes de ir ao ar

### 1. Cliente não consegue pagar pelo portal

- [x] Concluído em 2026-10-03 — cartão "Pagar agora" (`Pages/Cliente/Cobrancas/Show/Partials/PagamentoCard.jsx`) com Pix copia e cola, linha digitável e PDF; rota `cliente.cobrancas.boleto.pdf` (`ClienteBoletoPdfController`, autorizada pela `CustomerChargePolicy`); `PaymentSlip::isPayable()`. A tela deixou de receber o slip completo (payloads e erros do provider vazavam para o cliente). Testes: `tests/Feature/Http/Cliente/ClienteCobrancaPagamentoTest.php`.
- **Problema:** a tela de cobrança do cliente não exibe boleto, Pix, linha digitável nem link do PDF.
- **Evidência:** `app/Http/Controllers/Cliente/Cobranca/ClienteCobrancaController.php:55` já carrega `paymentSlips`, mas `resources/js/Pages/Cliente/Cobrancas/Show/Page.jsx` não usa esse dado (só mostra "Total a pagar").
- **Impacto:** o cliente depende do consultor para receber o boleto; o portal perde a principal utilidade.
- **Ação:**
  - Exibir o boleto ativo (status `pending`) com linha digitável copiável, QR/copia-e-cola Pix e botão de download do PDF.
  - Reaproveitar `resources/js/Components/Admin/CopyField.jsx` e `resources/js/Utils/paymentSlip.js`.
  - Criar rota de download do PDF no grupo `role:cliente`, validando que a cobrança pertence ao `ClientProfile` do usuário (mesmo padrão de `ClienteCobrancaController::show`).
- **Verificação:** teste de feature garantindo que o cliente baixa o próprio boleto e recebe 403/404 no boleto de outro cliente.

### 2. Cliente não recebe nenhuma notificação automática

- [x] Concluído em 2026-10-03 — `ChargePaymentMail` (fila, `afterCommit`) enviado por `ClientChargeNotificationService`: ao gerar boleto/Pix (`GeneratePaymentSlipService`) e no lembrete de 3 dias antes do vencimento (`SendChargeReminderJob`, só se houver boleto pagável). Destinatário via `ClientContactEmailResolver` (nunca o e-mail sintético `@casaverde.local`). Testes: `tests/Feature/Services/Cliente/ClientChargeNotificationServiceTest.php`.
- **Requisito de produção:** SMTP configurado (`MAIL_*`, `MAIL_FROM_ADDRESS` de domínio próprio com SPF/DKIM) e worker da fila ativo — os e-mails saem pela fila.
- **Problema:** o único e-mail enviado pelo sistema é o convite de ativação (`ClientActivationInviteMail`). Lembretes de cobrança viram `OperationalAlert` com link `wa.me` para clique manual do consultor.
- **Evidência:** `app/Mail/` contém só `Cliente/`; único `Mail::to` em `app/Services/Cliente/CreateClientAccessInviteService.php:41`.
- **Impacto:** inadimplência por esquecimento; carga operacional crescente para o consultor conforme a base cresce.
- **Ação (mínimo):**
  - E-mail "boleto disponível" ao gerar `PaymentSlip` (com valor, vencimento, linha digitável e link para o portal).
  - E-mail de lembrete 3 dias antes do vencimento, no `ChargeReminderService` (manter o alerta para o consultor).
  - Enviar via fila (`ShouldQueue`) e registrar envio para não duplicar.
- **Verificação:** testes com `Mail::fake()` para os dois disparos e para a não duplicação.

### 3. Backup do banco de dados

- [ ] ⏸️ Fora do escopo do lançamento (decisão em 2026-10-03)
- **Problema:** não existe rotina de backup.
- **Ação:**
  - Backup diário do MySQL para armazenamento externo ao servidor (S3, Backblaze, Google Drive etc.), com retenção definida. Opção pronta: `spatie/laravel-backup` agendado em `routes/console.php`; alternativa: `mysqldump` via cron.
  - Incluir `storage/app` (PDFs de faturas importadas) no backup.
  - **Guardar o `APP_KEY` de produção em local seguro (cofre de senhas).** Sem ele, os campos `encrypted` (tokens do Mercado Pago, senhas IMAP) ficam ilegíveis mesmo com o backup.
  - Testar uma restauração completa antes do lançamento.

### 4. `.env` de produção

- [ ] Concluído — `.env.example` corrigido em 2026-10-03 (fuso, locale, log diário, `SESSION_SECURE_COOKIE`, nota de produção). **Falta:** configurar o `.env` do servidor.
- **Problema:** `.env.example` traz valores de desenvolvimento que, copiados para produção, causam erros silenciosos:
  - `APP_TIMEZONE=UTC` sobrescreve o padrão `America/Sao_Paulo` de `config/app.php` → os agendamentos rodam 3h adiantados (lembrete das 08:00 sai às 05:00; expiração de boletos às 03:00).
  - `APP_DEBUG=true` expõe stack traces e variáveis de ambiente.
  - `APP_LOCALE=en`, `LOG_STACK=single` (arquivo único que cresce sem limite), `LOG_LEVEL=debug`.
- **Ação:** garantir em produção (contas IMAP são configuradas pelo painel, não pelo `.env`):
  ```dotenv
  APP_ENV=production
  APP_DEBUG=false
  APP_TIMEZONE=America/Sao_Paulo
  APP_LOCALE=pt_BR
  APP_FALLBACK_LOCALE=pt_BR
  APP_FAKER_LOCALE=pt_BR
  LOG_STACK=daily
  LOG_LEVEL=warning
  SESSION_SECURE_COOKIE=true
  ```
  Mais as credenciais de produção do Mercado Pago, incluindo `MERCADOPAGO_WEBHOOK_SECRET` (ver `MERCADO_PAGO.md`, seção 5).
- **Após configurar:** `php artisan config:cache && php artisan route:cache && php artisan view:cache`.

### 5. Processos de infraestrutura

- [ ] Concluído
- **Problema:** o sistema depende de agendador e fila para funcionar.
- **Ação:**
  - Cron do agendador (a cada minuto): `* * * * * cd /caminho && php artisan schedule:run >> /dev/null 2>&1`.
  - Worker da fila permanente via Supervisor/systemd: `php artisan queue:work --tries=3 --max-time=3600`, com reinício automático.
  - Incluir `php artisan queue:restart` no processo de deploy.
- **Impacto se faltar:** sem worker, webhooks de pagamento ficam em `received` e nunca baixam cobranças; sem cron, não há importação de faturas, cobranças mensais, marcação de vencidas nem lembretes.

---

## 🟠 Alta prioridade — robustez e segurança

### 6. Agendamentos sem proteção contra sobreposição

- [x] Concluído em 2026-10-03 — `withoutOverlapping()` em todos os comandos, `inspire` removido, `queue:prune-failed` (30 dias) e limpeza diária de PDFs temporários agendados.
- **Evidência:** nenhum comando em `routes/console.php` usa `withoutOverlapping()`.
- **Risco:** `concessionaire-bills:import` (horário, lê IMAP e PDFs) e `casaverde:sync-payments` (a cada 5 min, chama a API do MP) podem rodar em paralelo quando lentos.
- **Ação:**
  - Adicionar `->withoutOverlapping()` em todos os agendamentos (e `->onOneServer()` se houver mais de um servidor — exige cache compartilhado).
  - Remover o comando de exemplo `inspire` agendado de hora em hora.

### 7. Erros de produção invisíveis

- [ ] ⏸️ Fora do escopo do lançamento (decisão em 2026-10-03)
- **Evidência:** `withExceptions()` vazio em `bootstrap/app.php`; nenhum pacote de rastreamento de erros em `composer.json`.
- **Ação:**
  - Integrar Sentry (`sentry/sentry-laravel`) ou Flare.
  - Monitor externo de disponibilidade (UptimeRobot, Better Stack) apontando para `/up`.

### 8. Jobs sem tratamento de falha

- [x] Já coberto — **correção da análise original:** `AppServiceProvider` já escuta `JobFailed` e `ScheduledTaskFailed` e gera `OperationalAlert` via `SystemFailureAlertService` (testado em `OperationalAlertsTest`). `queue:prune-failed` agendado em 2026-10-03. Pendente opcional: `$tries`/`$backoff` nos jobs que chamam a API do Mercado Pago (`SyncPaymentStatusJob`).
- **Evidência:** apenas `app/Jobs/Pagamento/ProcessPaymentWebhookJob.php` define `$tries`/`$backoff`. Os demais (`GenerateChargeFromApprovedBillJob`, `MarkChargeAsOverdueJob`, `SendChargeReminderJob`, `SyncPaymentStatusJob`) não têm `failed()`.
- **Risco:** job falho vai para `failed_jobs` sem que ninguém veja.
- **Ação:** definir `$tries`/`$backoff` e implementar `failed()` gerando `OperationalAlert` via `SystemFailureAlertService` (já existente). Agendar `queue:prune-failed` para limpeza.

### 9. PDFs de proposta em disco público

- [x] Concluído em 2026-10-03 — `TemporaryPdfStorageService`: PDFs no disco `local` (`storage/app/pdfs-temporarios/`), entregues por link assinado válido por 2h (rota `pdfs.temporarios.show`) e apagados após 1 dia. Testes: `tests/Feature/Http/Auth/TemporaryProposalPdfTest.php`.
- **Ação manual em produção:** apagar os PDFs antigos já publicados: `rm -rf storage/app/public/pdfs/`.
- **Evidência:** `app/Http/Controllers/Auth/Propostas/Produtor/GerarPropostaProdutorController.php` grava em `Storage::disk('public')` (`pdfs/propostas/proposta_<10 chars>.pdf`); `GerarPropostaUsinaController` idem em `pdfs/`.
- **Risco:** qualquer pessoa com a URL acessa dados pessoais do cliente, sem autenticação nem expiração (LGPD).
- **Ação:** gravar no disco `local` e servir por rota autenticada ou `URL::temporarySignedRoute()` com expiração; migrar/remover os arquivos já existentes em `storage/app/public/pdfs/`.

### 10. Política de senha fraca

- [x] Concluído em 2026-10-03 — `Password::defaults()` (8+ caracteres, letras e números; em produção também `uncompromised()`) aplicado em admin, acesso de cliente/produtor, perfil e ativações; textos de ajuda das telas atualizados; `throttle:6,1` em `forgot-password`, `reset-password` e ativações. Pendente: 2FA para admins (decisão).
- **Evidência:** `app/Http/Controllers/Admin/Acesso/AcessoController.php:35,36,71` usa `Password::min(6)`; `app/Http/Requests/Auth/ProdutorActivateAccountRequest.php:19` usa `min:6` (cliente já usa `min:8`).
- **Ação:**
  - Definir `Password::defaults()` em `AppServiceProvider::boot()` (mínimo 8, letras e números; em produção, `->uncompromised()`), e usar `Password::defaults()` em todos os pontos.
  - Avaliar 2FA (TOTP) para admins — controlam financeiro e integrações.
  - Adicionar `throttle` nas rotas `forgot-password` e nas de ativação (`/cliente/ativacao`, `/produtor/ativacao`).

### 11. Convite de produtor sem expiração

- [x] Concluído em 2026-10-03 — sem `expires_at` o convite é inválido. Testes: `tests/Unit/Models/ProducerAccessInviteTest.php`.
- **Evidência:** `app/Models/Produtor/ProducerAccessInvite.php:48` — sem `expires_at`, `canBeUsed()` retorna `true` para sempre.
- **Ação:** tratar ausência de `expires_at` como expirado (ou sempre preencher na criação, como em `ClientAccessInvite`). Observação: o `CLAUDE.md` registra que `ProducerAccessInvite` ainda não é criado em nenhum fluxo — resolver junto com a decisão de concluir/remover esse convite.

### 12. LGPD

- [ ] ⏸️ Fora do escopo do lançamento (decisão em 2026-10-03)
- **Problema:** o sistema armazena CPF, CNPJ, endereço, contatos e faturas de energia, mas não há política de privacidade, termos de uso nem registro de consentimento.
- **Ação (mínimo antes de abrir para clientes):**
  - Página pública de Política de Privacidade e Termos de Uso.
  - Aceite obrigatório no fluxo de ativação (cliente e produtor), gravando data/hora, IP e versão do termo.
  - Canal para o titular solicitar acesso, correção ou exclusão dos dados (pode começar como e-mail/chamado de suporte).
  - Definir responsável (encarregado/DPO) e prazo de retenção de faturas e documentos.

---

## 🟡 Média prioridade — completude e qualidade

### 13. Portal do produtor raso

- [ ] ⏸️ Fora do escopo do lançamento (decisão em 2026-10-03)
- **Situação:** `routes/produtor/index.php` tem apenas dashboard e usinas (index/show).
- **Ação:** extrato mensal de repasses e taxa de administração (regras em `ProducerAdministrationFeeRules`), histórico de geração (`UsinaGenerationRecord`) e contratos.

### 14. Trilha de auditoria

- [ ] ⏸️ Fora do escopo do lançamento (decisão em 2026-10-03)
- **Situação:** só cobranças têm histórico (`CustomerChargeHistory`).
- **Ação:** registrar quem alterou o quê em descontos do cliente, vínculos cliente-usina, contas de pagamento, usuários/roles e configurações. Opção: `spatie/laravel-activitylog`, ou estender o padrão de `CustomerChargeHistory`.

### 15. Tamanho do bundle do frontend

- [ ] ⏸️ Fora do escopo do lançamento (decisão em 2026-10-03)
- **Evidência (build de 2026-10-03):** `PropostaModelo` 1,5 MB; `app.js` 612 KB; `CartesianChart` 356 KB; build total 5,6 MB. Vite alerta chunks acima de 500 KB.
- **Ação:** carregar `@react-pdf/renderer` sob demanda (`import()` dinâmico ao clicar em gerar PDF); revisar dependências pesadas no `app.js` (MUI + recharts + chart.js — avaliar manter só uma biblioteca de gráficos).

### 16. Webhook do Mercado Pago aceita timestamp antigo

- [x] Descartado em 2026-10-03 — o Mercado Pago reenvia notificações falhas horas depois com o `ts` original; uma janela de 5 min descartaria notificações legítimas após uma indisponibilidade. O processamento já é idempotente (dedup por `event_id`), então o risco de replay é só uma consulta extra à API.
- **Evidência:** `app/Services/Pagamento/Providers/MercadoPago/MercadoPagoWebhookSignatureValidator.php` valida a assinatura mas não a idade do `ts`.

### 17. Integração contínua

- [x] Criado em 2026-10-03 — `.github/workflows/ci.yml` (Pint + testes em PHP 8.3; `npm ci` + build em Node 22). Validar no primeiro push.
- **Situação:** não existe `.github/workflows`.
- **Ação:** workflow no GitHub Actions executando `composer install`, `php artisan test`, `./vendor/bin/pint --test` e `npm ci && npm run build` a cada push/PR.

---

## 🔵 Dívida técnica — pode ficar para depois do lançamento

| Item | Evidência | Ação |
|------|-----------|------|
| Instanciação direta de Services/Repositories | 32 ocorrências de `new XService`/`new XRepository` em `app/` (ex.: `Admin/Config/ConfigController.php`, `GetProdutorApiController.php`, `Contratos/Usina/ContratoUsinaController.php`) | Injetar via construtor (convenção do `CLAUDE.md`) |
| Arquivos PHP grandes | `ClientReportService` (342), `ImportAutomaticConcessionaireBillService` (340), `ClientProposalController` (335), `ScanUsinaOperationalAlertsService` (283), `OperationalHealthScanService` (277) | Dividir em classes menores |
| Telas JSX grandes | `Auth/Contratos/Usinas/Contrato/ContratoUsina.jsx` (1120), `Admin/Cobranca/Show/Page.jsx` (1091), `Admin/Integracao/Page.jsx` (1068) | Extrair componentes em `Partials/` |
| Módulo legado `auth/*` | `app/Http/Controllers/Auth/**`, `routes/auth/**` | Migrar telas úteis para os módulos novos e remover o resto |
| Funcionalidades inacabadas | convite de produtor; telas `fatura-import-settings` | Concluir ou remover (ver `CLAUDE.md`) |
| Sem testes de PDF | dompdf/snappy | Criar testes quando o fluxo for revisado |

---

## Checklist de deploy (primeiro lançamento e atualizações)

1. Backup do banco **antes** de qualquer migration.
2. `git pull` no servidor.
3. `composer install --no-dev --optimize-autoloader`
4. `npm ci && npm run build`
5. `php artisan migrate --force`
6. `php artisan config:cache && php artisan route:cache && php artisan view:cache`
7. `php artisan storage:link` (primeiro deploy)
8. `php artisan queue:restart`
9. Primeiro deploy após 2026-10-03: `rm -rf storage/app/public/pdfs/` (PDFs de proposta que ficaram públicos).
10. Conferir: `/up` responde 200, worker ativo, `php artisan schedule:list` com horários em BRT, webhook do MP cadastrado com URL de produção.

### Observação sobre o ambiente local

`public/build/assets` contém arquivos de outro usuário (provavelmente criados pelo container Sail), o que faz `npm run build` falhar com `EACCES` fora do container. Corrigir com `sudo chown -R $USER public/build`.

# Relatório de Erros — Casa Verde CRM

> Gerado em: 2026-06-20
> Fonte: `storage/logs/laravel.log` (período 2026-06-17 13:55 a 2026-06-20 10:47)
> Destinado a: Claude Code (ou outro agente com acesso ao repositório) — corrigir os itens abaixo na ordem de prioridade indicada.

Este documento lista bugs de código confirmados (causa raiz já identificada e reproduzida), com a localização exata e a correção recomendada. Cada item é independente — pode ser corrigido isoladamente. Ao corrigir, seguir as convenções de `CLAUDE.md` (DI nos Services, scoping de consultor, sem comentários óbvios, testes com Pest + SQLite).

---

## Prioridade 1 — Bugs com correção simples e raiz 100% confirmada

### 1.1. Cast `(float)` quebrado por quebra de linha — relatório de cliente quebrado

- **Arquivo:** `app/Services/Admin/Reports/ClientReportService.php`, linha ~108
- **Erro no log:** `Undefined constant "App\Services\Admin\Reports\float"`
- **Causa raiz confirmada:** o cast ficou separado em duas linhas:
  ```php
  'total_consumption_kwh' => round(
      $charges->sum(fn ($charge) => (
          float)($charge->bill?->consumo_kwh ?? 0)
      ),
      2
  ),
  ```
  PHP não reconhece `(float)` como cast quando há quebra de linha entre `(` e o tipo — interpreta `float` como referência a uma constante (inexistente) e o `(...)` seguinte como uma chamada sobre o resultado. Reproduzido isoladamente com:
  ```php
  $x = (
      float
  )("3.5");
  // Fatal error: Uncaught Error: Undefined constant "float"
  ```
- **Correção:** reescrever o cast em uma única linha:
  ```php
  'total_consumption_kwh' => round(
      $charges->sum(fn ($charge) => (float) ($charge->bill?->consumo_kwh ?? 0)),
      2
  ),
  ```
- **Verificação:** acessar a tela/relatório que usa `ClientReportService` (endpoint de relatório de cliente) e confirmar que não há mais erro 500. Se houver teste de feature para este service, rodar `php artisan test --filter=ClientReportService`; se não houver, considerar adicionar um teste cobrindo `total_consumption_kwh`.

---

### 1.2. Coluna `email` inexistente em `client_profiles`

- **Arquivo:** `app/Http/Controllers/Admin/Usina/AdminClientUsinaLinkController.php`
- **Erros no log:**
  - `Column not found: 1054 Unknown column 'email' in 'field list'`
  - `Column not found: 1054 Unknown column 'email' in 'where clause'`
- **Causa raiz confirmada:** `client_profiles` **não possui coluna `email`** (confirmado via `Schema::getColumnListing('client_profiles')`). O email do cliente vive em `User`/`UserContact`, acessível via `ClientProfile->contacts_id` ou pelo usuário vinculado (`platform_user_id`) — nunca direto na tabela.
- **Pontos exatos a corrigir:**
  1. Linha ~33 (método `index`, filtro de busca):
     ```php
     $clientQuery->where('nome', 'like', "%{$search}%")
         ->orWhere('razao_social', 'like', "%{$search}%")
         ->orWhere('nome_fantasia', 'like', "%{$search}%")
         ->orWhere('email', 'like', "%{$search}%")   // <- coluna inexistente
         ->orWhere('client_code', 'like', "%{$search}%");
     ```
  2. Linha ~67 (método `create`, listagem de clientes para o select):
     ```php
     ->get([
         'id', 'client_code', 'tipo_pessoa', 'nome',
         'razao_social', 'nome_fantasia', 'email', 'status',  // <- coluna inexistente
     ]),
     ```
- **Correção recomendada:**
  - Remover `email` da lista de colunas em `get([...])` (linha 67), OU substituir por um eager-load do contato/usuário se o frontend (`Admin/Usina/Links/Create/Page.jsx`) realmente precisar exibir o email do cliente — nesse caso, usar `with('userContact')`/relação equivalente e expor `email` via `append`/transformação no controller, não via coluna direta.
  - No filtro de busca (linha 33), remover a cláusula `orWhere('email', ...)` sobre `ClientProfile`, ou movê-la para dentro de um `orWhereHas` na relação que de fato contém o email (checar qual relação em `ClientProfile` expõe o email — provavelmente via `User`/`UserContact`).
  - **Antes de implementar**, verificar no frontend (`resources/js/Pages/Admin/Usina/Links/Index/Page.jsx` e `Create/Page.jsx`) se a coluna `email` é exibida/usada — se sim, a correção precisa preservar a funcionalidade buscando o email pela relação certa; se não for usada na UI, basta remover.
- **Verificação:** acessar `/admin/usinas/links` (listagem, testar busca por texto) e `/admin/usinas/links/criar` (tela de novo vínculo) — ambas devem carregar sem erro 500.

---

### 1.3. `celular` rejeitando valor formatado (string) em coluna `bigint`

- **Arquivo:** fluxo de atualização de `UserContact` (a partir do log: update em `user_contacts.celular` vindo de uma tela de perfil/dados de acesso — localizar o controller/request responsável por `ClientePerfilController`, `ClienteIdentidadeController` ou similar que atualiza contato)
- **Erro no log:** `Incorrect integer value: '(44) 99741-5982' for column 'celular'`
- **Causa raiz confirmada:** `user_contacts.celular` é `bigint` (confirmado via schema), mas o valor enviado pelo formulário não foi normalizado para apenas dígitos antes do `update()`.
- **Correção recomendada:** seguir o mesmo padrão já usado em `ConsumerUnit.uc_code` (normalizado no evento `saving` do model, ver `CLAUDE.md`) — adicionar normalização (`preg_replace('/\D/', '', $celular)`) no evento `saving` do model `UserContact`, ou no `FormRequest` correspondente antes da validação/persistência. Preferir o model (`saving` event) para garantir que a normalização ocorra em todos os pontos de entrada, não só nesse formulário.
- **Verificação:** salvar um celular formatado (`(44) 99741-5982`) pela tela onde o erro ocorreu e confirmar que é persistido como dígitos (`44997415982`).

---

## Prioridade 2 — Bugs que exigem decisão de negócio antes de corrigir

### 2.1. `valor_total` nulo ao revisar fatura de concessionária

- **Contexto:** 3 ocorrências (`concessionaire_bills` ids #18, #19, #5) de `Column 'valor_total' cannot be null` ao salvar a revisão de uma fatura.
- **Investigar:** o controller/request de revisão de fatura (provável `app/Http/Controllers/Admin/Fatura/...`, action de "aprovar/revisar"). Confirmar se o campo `valor_total` no formulário do frontend pode ser submetido vazio, ou se o parser de PDF não conseguiu extrair o valor e o front não bloqueia o submit nesse caso.
- **Decisão necessária antes de corrigir:** o sistema deve (a) bloquear o submit no frontend se `valor_total` estiver vazio/zerado, (b) usar `nullable` + um valor sentinela (ex: `0`) na coluna, mantendo a regra de negócio de que fatura sem valor extraído fica em status de erro até correção manual? Recomenda-se (a): nunca permitir salvar revisão sem valor numérico válido, mantendo a coluna `NOT NULL`.

### 2.2. `exec()` desabilitado no servidor — quebra parser de PDF de fatura

- **Arquivos:** `app/Services/Fatura/ProtectedPdfResolverService.php:37` (chama `qpdf` para desbloquear PDF com senha) e `app/Services/Fatura/PdfTextExtractorService.php:20` (chama `pdftotext` para extrair texto).
- **Erro no log:** `Call to undefined function App\Services\Fatura\exec()` (3 ocorrências, incluindo etapa "unlock" do `ImportService`).
- **Causa raiz confirmada:** `disable_functions` do PHP web (lsphp83) bloqueia `exec`, `shell_exec`, `system`, `passthru` (hardening do servidor/aaPanel) — **decisão de infraestrutura, não só de código**.
- **Duas vias de correção, ambas válidas:**
  1. **Infra:** pedir liberação de `exec`/`shell_exec` no php.ini do servidor (`/usr/local/lsws/lsphp83/etc/php/8.3/litespeed/php.ini`, e o equivalente em `/www/server/php/83/etc/php.ini`) — fora do escopo de uma correção de código; exige acesso/decisão do administrador do servidor.
  2. **Código:** substituir as chamadas de shell por bibliotecas PHP nativas que não dependam de `exec`:
     - Para desbloquear PDF com senha (`ProtectedPdfResolverService`): usar `setasign/fpdi` + `setasign/fpdf` não resolve descriptografia; considerar `smalot/pdfparser` (que tem suporte limitado a PDFs protegidos) ou manter a dependência de `qpdf` mas documentar a exigência de infraestrutura.
     - Para extração de texto (`PdfTextExtractorService`): substituir `pdftotext` (CLI) por `smalot/pdfparser` (pacote Composer, puro PHP, já comum em projetos Laravel para extrair texto de PDF sem depender de binário externo via `exec`).
  - **Recomendação:** via 2 (trocar por `smalot/pdfparser`) é a correção de código mais robusta porque remove a dependência de `exec` por completo, sem depender de liberação de infraestrutura. Avaliar se `smalot/pdfparser` extrai texto com qualidade equivalente a `pdftotext -layout` para os modelos de fatura usados (testar com PDFs reais de faturas antes de substituir em produção).
- **Verificação:** após corrigir, rodar uma importação real de fatura (com e sem senha) e confirmar que `concessionaire_bills.parser_status` não fica mais em `error` por causa de `exec`.

---

## Já corrigido nesta investigação (não precisa de ação)

- **`imap_open()` indisponível no CLI** — corrigido (instalado `php8.3-imap` via apt). Lado web (lsphp83) ainda pendente de restart do OpenLiteSpeed — ação de infraestrutura, não de código, a cargo do administrador do servidor.
- **`Vite manifest not found`** — era apenas falta de build (`npm run build`); já resolvido por builds feitos durante a sessão anterior.

---

## Ordem de execução recomendada

1. `1.1` (cast `float`) — 5 minutos, zero risco.
2. `1.2` (coluna `email`) — exige checar o frontend antes de decidir a correção exata.
3. `1.3` (normalização de `celular`) — seguir padrão já existente em `ConsumerUnit`.
4. `2.1` e `2.2` — exigem decisão de negócio/infra antes de implementar; não corrigir sem alinhar a abordagem.

Ao final de cada correção, rodar `php artisan test` (ambiente local com SQLite — **não usar o MySQL de produção**, ver nota de ambiente abaixo) e `npm run build` quando houver mudança de frontend.

> **Nota de ambiente:** neste servidor, o `config:cache` estava travado em `APP_ENV=production` / `DB_CONNECTION=mysql`, fazendo `php artisan test` rodar contra o banco de produção real, e a extensão `pdo_sqlite` não está instalada — ou seja, a suíte de testes não roda corretamente em SQLite neste ambiente. Antes de rodar testes, confirmar que o ambiente de execução tem `pdo_sqlite` instalado e que o config cache não está forçando produção.

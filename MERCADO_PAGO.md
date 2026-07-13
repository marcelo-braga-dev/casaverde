# Integração Mercado Pago — Tutorial de configuração

Este guia explica onde conseguir as credenciais do Mercado Pago e como configurá-las no
Casa Verde CRM. A implementação já está pronta no código (veja
`app/Services/Pagamento/Providers/MercadoPago/`); este documento cobre só a parte de
cadastro/chaves no painel do Mercado Pago e o `.env`.

---

## 1. Criar a aplicação no painel de desenvolvedores

1. Acesse https://www.mercadopago.com.br/developers/panel e faça login com a conta
   Mercado Pago da cooperativa (ou crie uma conta caso ainda não exista).
2. No menu lateral, vá em **Suas integrações** → **Criar aplicação**.
3. Dê um nome (ex.: `Casa Verde CRM`) e selecione o produto **Pagamentos online**.
4. Confirme a criação. Você cairá na tela de detalhes da aplicação, onde ficam as chaves.

## 2. Pegar as credenciais (Public Key e Access Token)

Dentro da aplicação criada, vá na aba **Credenciais de teste** (URL no formato
`.../app/{app_id}/credentials/sandbox`) — é de lá que saem as credenciais para testar sem
mover dinheiro real.

| Campo no painel MP     | Onde entra no sistema                          |
|-------------------------|------------------------------------------------|
| **Public Key**          | `PaymentProviderAccount.client_id`             |
| **Access Token**        | `PaymentProviderAccount.client_secret`          |

> O Access Token é a única credencial que a API realmente usa para autenticar as chamadas
> (`MercadoPagoAuthService` simplesmente devolve esse valor como Bearer token — o Mercado
> Pago não usa OAuth client_credentials como a Cora). O Public Key não é usado nas chamadas
> de backend feitas por este sistema, mas fica salvo para referência/futuro uso em
> componentes de checkout no frontend.

> **Atenção ao prefixo:** dependendo de quando sua aplicação foi criada, a credencial de
> teste pode vir no formato antigo `TEST-...` ou no formato novo `APP_USR-...` — o Mercado
> Pago migrou o modelo de sandbox para "usuários de teste", que têm token com a mesma cara
> de produção. **O prefixo não é confiável para saber se é teste ou produção.** O sinal
> real é a aba de onde você copiou (Credenciais de teste vs Credenciais de produção); se
> quiser confirmar por API, um `GET /users/me` com o token retorna um array `tags` contendo
> `"test_user"` quando é realmente uma credencial de sandbox.

## 3. Configurar o webhook (Notification URL + assinatura secreta)

1. Ainda na tela da aplicação, vá em **Webhooks** → **Configurar notificações**.
2. Em **URL de produção** (e/ou teste), informe:
   ```
   https://SEU-DOMINIO/webhooks/payments/mercado-pago
   ```
   Essa rota já existe no sistema (`routes/web.php`, `MercadoPagoWebhookController`).
3. Marque o evento **Pagamentos** (`payment`) — é o único evento que este sistema processa.
4. Salve. O Mercado Pago vai gerar uma **Chave secreta de assinatura** (assinatura webhook /
   `x-signature`). Copie esse valor: ele vai para `PaymentProviderAccount.webhook_secret`.
   - Se você deixar esse campo em branco no sistema, o `MercadoPagoWebhookSignatureValidator`
     aceita qualquer webhook sem validar assinatura (use isso só em ambiente local de
     desenvolvimento, nunca em produção).

### Testando o webhook localmente

O Mercado Pago precisa de uma URL pública para enviar as notificações. Em desenvolvimento
local, use um túnel (ex. `ngrok http 8000`) e cadastre a URL gerada
(`https://xxxx.ngrok.io/webhooks/payments/mercado-pago`) na tela de Webhooks em modo teste.

## 4. Preencher o `.env`

```env
MERCADOPAGO_ENVIRONMENT=sandbox
MERCADOPAGO_BASE_URL=https://api.mercadopago.com
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> `MERCADOPAGO_BASE_URL` é sempre `https://api.mercadopago.com`, tanto em sandbox quanto em
> produção — o que muda entre ambientes é qual Access Token você usa (`TEST-...` vs
> `APP_USR-...`), não a URL base.

Depois de preencher, rode o seeder para criar/atualizar o registro em
`payment_provider_accounts`:

```bash
php artisan db:seed --class=PaymentProviderAccountSeeder
```

Isso cria a conta com `provider=mercado_pago`, `is_active=true`, `is_default=true` — é essa
conta "padrão ativa" que o `PaymentProviderManager::defaultAccount('mercado_pago')` busca ao
gerar um pagamento.

Também dá para cadastrar/editar pela interface, em
**Financeiro → Contas de Pagamento** (`admin.financeiro.payment-provider-accounts.*`),
sem precisar mexer no `.env`/seeder — os mesmos campos (Public Key, Access Token, Webhook
Secret) aparecem no formulário.

## 5. Indo para produção

Quando for trocar de sandbox para produção:

1. Troque `MERCADOPAGO_ENVIRONMENT=production`.
2. Troque `MERCADOPAGO_PUBLIC_KEY` e `MERCADOPAGO_ACCESS_TOKEN` pelas credenciais da aba
   **Credenciais de produção** (prefixo `APP_USR-`).
3. Cadastre a URL de webhook de **produção** (não a de teste) apontando para o domínio real.
4. Gere a chave secreta de assinatura de produção e atualize `MERCADOPAGO_WEBHOOK_SECRET`.
5. Rode o seeder de novo (ou atualize pela tela de Contas de Pagamento).

## 6. Qual API o sistema usa (importante)

A integração usa a **Orders API** (`/v1/orders`), não a Payments API clássica
(`/v1/payments`). Isso não é escolha de design — é exigência do Mercado Pago: contas de
teste criadas a partir de 2025+ (as com tag `test_user`, ver seção 2) são **rejeitadas**
pela Payments API com `401 Unauthorized use of live credentials`, mesmo sendo credenciais
de sandbox legítimas. A Orders API é o único caminho documentado e funcional para testar
Pix/Boleto com esse tipo de credencial — confirmado empiricamente rodando os dois
endpoints lado a lado contra a mesma conta de teste.

Reflexos práticos disso:

- **E-mail do pagador em sandbox precisa terminar em `@testuser.com`** (ex.:
  `test_user_br@testuser.com`). Qualquer outro domínio faz o Mercado Pago rejeitar a
  criação da order em modo teste.
- **Pix**: usar `first_name: "APRO"` no pagador simula aprovação automática — a order
  nasce com `status: action_required` / `status_detail: waiting_transfer` e muda sozinha
  para `status: processed` / `status_detail: accredited` depois de alguns minutos.
- **Boleto exige endereço completo do pagador** (`zip_code`, `street_name`,
  `street_number`, `neighborhood`, `city`, `state`) — sem isso a Orders API recusa a
  criação com `required_properties`. O sistema busca esse endereço em
  `UserAddress` (via `ClientProfile.platform_user_id`) automaticamente; se o cliente não
  tiver endereço cadastrado, a geração do boleto falha com a mensagem de validação do
  próprio Mercado Pago.
- O documento oficial de teste do Mercado Pago também observa que o Boleto em sandbox só
  permite verificar se o fluxo de criação está correto — não é possível simular a
  liquidação/pagamento final do jeito que dá para simular o Pix.
- O ticket/boleto (`ticket_url`, `barcode_content`, `digitable_line`) pode não vir pronto
  na resposta de criação — ele é gerado de forma assíncrona; uma consulta (`sync`) alguns
  segundos depois já traz os campos preenchidos.

## 7. Testando o fluxo completo

1. Abra uma cobrança (`CustomerCharge`) com status `open` ou `waiting_payment`.
2. Clique em **Gerar pagamento** → **Mercado Pago — Pix** (ou **Boleto**).
3. Isso chama `POST /v1/orders` com `transactions.payments[0].payment_method.id = pix`
   (ou `bolbradesco`). O Mercado Pago não permite gerar boleto **e** Pix na mesma order —
   por isso são duas opções separadas no menu, diferente da Cora, que gera as duas formas
   de uma vez.
4. Para simular em sandbox, use um pagador de teste (e-mail `@testuser.com`,
   `first_name: APRO` para aprovação automática de Pix) — ver seção 6.
5. Confirmação de pagamento chega por dois caminhos:
   - **Webhook**: o Mercado Pago envia o evento (`type: order`, `data.id` = id da order)
     assim que o status muda; o sistema então consulta `GET /v1/orders/{id}` para
     confirmar o status real antes de marcar como pago (o payload do webhook não traz o
     status, só o id da order).
   - **Sincronização manual**: botão **Sincronizar** na tela do pagamento
     (`admin.financeiro.pagamentos.sync`), que chama a mesma consulta sob demanda.
6. Acompanhe os eventos recebidos em **Financeiro → Webhooks de Pagamento**.

# Casa Verde CRM

Sistema CRM/ERP desenvolvido em **Laravel 12 + Inertia.js + React + Material UI** para operação comercial, cadastro de clientes, produtores, usinas, propostas comerciais, contratos, importação de faturas de energia e gestão operacional de uma empresa de energia por assinatura/compensação.

> Este README funciona como a **documentação técnica principal do projeto**.  
> Ele foi atualizado para refletir a arquitetura atual, incluindo a migração de várias rotas antes administrativas para o contexto de **consultor**, o novo fluxo de propostas, contratos, endereços da unidade consumidora e ativação de clientes na plataforma.

---

## 1. Visão geral

O **Casa Verde** é uma plataforma de CRM/ERP para operação comercial e administrativa no segmento de energia elétrica compensada/assinada.

O sistema controla:

- usuários internos e externos;
- clientes consumidores finais;
- produtores/proprietários de usinas;
- usinas e grupos/blocos de usinas;
- concessionárias;
- propostas comerciais de clientes;
- propostas e leads de produtores;
- contratos emitidos a partir de propostas;
- endereços de unidades consumidoras;
- dados contratuais dos clientes;
- vínculos entre clientes e usinas;
- regras de desconto;
- configurações de importação de faturas por e-mail;
- faturas importadas manualmente ou por e-mail;
- revisão e validação de faturas;
- dashboards por perfil de usuário.

A aplicação combina:

- CRM comercial;
- ERP operacional;
- portal do cliente;
- portal do produtor;
- módulo de propostas;
- módulo de contratos;
- módulo de faturas/importação;
- gestão de usinas e concessionárias.

---

## 2. Stack técnica

### Backend

- PHP 8.3+
- Laravel 12
- Eloquent ORM
- Form Requests
- Services
- Repositories
- Policies/authorization
- Inertia.js backend adapter

### Frontend

- React
- Inertia.js
- Material UI / MUI
- Tabler Icons
- Ziggy para rotas no frontend

### Banco de dados

- MySQL/MariaDB em ambiente Laravel Sail
- Modelagem relacional orientada a domínio

### Ambiente de desenvolvimento

- Laravel Sail
- Vite
- NPM

---

## 3. Perfis oficiais do sistema

Os perfis oficiais são definidos em:

```txt
app/src/Roles/RoleUser.php
```

Mapeamento atual:

```txt
ADMIN     = 1
CONSULTOR = 2
PRODUTOR  = 3
CLIENTE   = 4
```

### Regras importantes

- `admin` possui visão global.
- `consultor` opera a carteira comercial.
- `cliente` acessa seu próprio ambiente.
- `produtor` é o proprietário da usina.
- Produtor não deve ser tratado como cliente comum, apesar de alguns fluxos comerciais serem parecidos.
- Toda usina precisa estar associada a um produtor.

---

## 4. Observação importante sobre rotas

Durante a evolução recente, várias rotas que antes estavam conceitualmente em `admin` passaram a ser usadas no contexto operacional do **consultor**.

Isso significa que muitas páginas e controllers ainda estão em namespaces como:

```txt
App\Http\Controllers\Admin\...
resources/js/Pages/Admin/...
```

mas suas rotas reais podem estar em:

```txt
routes/consultor/...
```

ou com nomes como:

```txt
consultor.user.cliente.*
consultor.propostas.cliente.*
consultor.cliente.faturas.*
consultor.cliente.contratos.*
consultor.producer.usinas.*
```

### Regra de manutenção

Antes de corrigir um erro de rota, sempre verificar com:

```bash
sail artisan route:list | grep nome-da-rota
```

ou:

```bash
sail artisan route:list --name=consultor
```

Não assumir que uma página em `Pages/Admin/...` usa necessariamente rota `admin.*`.

---

## 5. Arquitetura por domínio

O projeto é organizado por domínios de negócio.

Principais domínios atuais:

```txt
Users
Cliente
Produtor
Usina
Endereco
Proposta
Fatura / Importacao
Financeiro
Settings
```

### Camadas utilizadas

- `Models` para entidades Eloquent;
- `Http/Controllers` para entrada web/Inertia;
- `Http/Requests` para validação;
- `Services` para regras de negócio e transações;
- `Repositories` para listagens/filtros/paginação;
- `resources/js/Pages` para telas Inertia;
- `resources/js/Components` para componentes reutilizáveis;
- `resources/js/Contexts` para providers globais.

---

## 6. Usuários e dados pessoais

### Model principal

```txt
app/Models/Users/User.php
```

Campos principais:

```txt
id
name
email
password
role_id
consultor_id
status
```

### Pontos importantes

O model `User` possui `$fillable` com:

```php
'name',
'email',
'password',
'role_id',
'consultor_id',
'status'
```

Ao criar usuário automaticamente, principalmente no fluxo de contrato, é obrigatório preencher:

```php
'role_id' => RoleUser::$CLIENTE,
'consultor_id' => $clientProfile->consultor_user_id ?? auth()->id(),
'status' => StatusUser::$ATIVO,
```

Se `role_id` ou `status` não forem informados, podem ocorrer erros de banco ou o usuário não terá permissão correta de acesso.

---

## 7. UserData

Model:

```txt
app/Models/Users/UserData.php
```

Tabela:

```txt
user_data
```

Responsabilidade:

Armazenar os dados pessoais/documentais usados principalmente para contrato e identificação do usuário.

Campos principais:

```txt
user_id
address_id
tipo_pessoa
nome
cpf
data_nascimento
rg
genero
estado_civil
profissao
data_fundacao
cnpj
razao_social
nome_fantasia
tipo_empresa
ie
im
ramo_atividade
```

### Regra atual

No fluxo de contrato, todos os campos existentes em `UserData` devem estar disponíveis nas páginas de **Create** e **Edit** do contrato.

Esses dados são usados para:

- emissão contratual;
- exibição no Show do contrato;
- geração futura de PDF;
- formalização do cliente dentro da plataforma.

---

## 8. Clientes

Model principal:

```txt
app/Models/Cliente/ClientProfile.php
```

Controller usado no fluxo consultor:

```txt
app/Http/Controllers/Admin/Usuarios/Cliente/ClienteController.php
```

Páginas principais:

```txt
resources/js/Pages/Consultor/Cliente/Profile/Index/Page.jsx
resources/js/Pages/Consultor/Cliente/Profile/Create/Page.jsx
resources/js/Pages/Consultor/Cliente/Profile/Show/Page.jsx
```

### Rotas usuais

```txt
consultor.user.cliente.index
consultor.user.cliente.create
consultor.user.cliente.store
consultor.user.cliente.show
consultor.user.cliente.edit
consultor.user.cliente.update
```

### Fluxo atualizado de criação de cliente

Ao criar um novo cliente, o sistema pode redirecionar para a página de emissão de proposta comercial já com o cliente selecionado:

```php
return redirect()
    ->route('consultor.propostas.cliente.create', [
        'client_profile_id' => $result['client_profile']->id,
    ]);
```

### Show do cliente

A página Show do cliente foi evoluída para exibir:

- dados principais do cliente;
- ações do cliente;
- propostas emitidas para ele;
- botão de emissão de contrato por proposta;
- vínculo com usina;
- histórico/lista de usinas vinculadas;
- regra de desconto;
- histórico/lista de descontos;
- configuração de importação de fatura por e-mail.

Partial criado/atualizado:

```txt
resources/js/Pages/Consultor/Cliente/Profile/Show/Partials/ClientProposalsList.jsx
```

Esse partial lista todas as propostas do cliente e, para cada proposta:

- mostra código;
- concessionária;
- unidade consumidora;
- status;
- status de contrato;
- botão **Emitir Contrato** quando ainda não houver contrato;
- botão **Ver Contrato** quando já existir contrato.

---

## 9. Propostas comerciais de cliente

Controller:

```txt
app/Http/Controllers/Admin/Proposta/CommercialProposalController.php
```

Rotas principais:

```txt
consultor.propostas.cliente.index
consultor.propostas.cliente.create
consultor.propostas.cliente.store
consultor.propostas.cliente.show
consultor.propostas.cliente.edit
consultor.propostas.cliente.update
consultor.propostas.cliente.pdf
```

Páginas:

```txt
resources/js/Pages/Consultor/Propostas/Cliente/Index/Page.jsx
resources/js/Pages/Consultor/Propostas/Cliente/Create/Page.jsx
resources/js/Pages/Consultor/Propostas/Cliente/Show/Page.jsx
resources/js/Pages/Consultor/Propostas/Cliente/Edit/Page.jsx
```

### Fluxo atualizado da página Create

A página de criar proposta possui dois fluxos:

#### 1. Entrando a partir de cliente recém-criado

- recebe `client_profile_id` na query string;
- carrega o cliente selecionado;
- oculta o select de clientes;
- preenche dados do cliente automaticamente.

#### 2. Entrando pelo menu

- exibe select de clientes;
- se o usuário selecionar um cliente, os inputs de novo cliente ficam ocultos;
- se clicar em **Cadastrar novo cliente**, os inputs de cadastro aparecem;
- se limpar a seleção, o botão de cadastro volta.

### Endereço da unidade consumidora

A proposta possui endereço próprio, pois representa o local da unidade consumidora.

Regra atual:

```txt
commercial_proposals.address_id -> addresses.id
```

Ou seja:

```txt
Cliente
 └── várias propostas
      └── cada proposta pode ter um endereço próprio da unidade consumidora
```

### Campos de endereço usados na proposta

```txt
cep
rua
numero
complemento
bairro
cidade
estado
referencia
latitude
longitude
```

### Componentização do endereço

Foi criado componente reutilizável:

```txt
resources/js/Components/Partials/AddressCard.jsx
```

Responsabilidades:

- exibir inputs completos de endereço;
- permitir busca por CEP via ViaCEP;
- preencher rua, bairro, cidade e UF automaticamente;
- emitir mensagens auxiliares;
- aceitar erros de validação via Inertia.

### ViaCEP

O componente `AddressCard` consulta:

```txt
https://viacep.com.br/ws/{cep}/json/
```

Regras:

- o CEP precisa ter 8 dígitos;
- se ViaCEP retornar `erro: true`, exibe mensagem de CEP não encontrado;
- ao preencher automaticamente, atualiza os campos em lote para evitar perda de estado no React.

---

## 10. Service de criação de proposta

Service:

```txt
app/Services/Proposta/CreateCommercialProposalService.php
```

Responsabilidades:

- criar ou localizar o cliente;
- criar endereço da unidade consumidora quando informado;
- criar proposta comercial;
- salvar `address_id` na proposta;
- retornar proposta, cliente e mensagens de status.

### Regra de endereço

O endereço não pertence diretamente ao cliente no fluxo de proposta.
Ele pertence à proposta:

```php
'address_id' => $address?->id
```

### Atenção

Para o endereço ser salvo corretamente, garantir:

1. `StoreCommercialProposalRequest` valida `address.*`;
2. `CommercialProposal` tem `address_id` no `$fillable`;
3. `CommercialProposal` possui relacionamento `address()`;
4. o service cria o endereço e preenche `address_id`;
5. a página envia `address` como objeto.

---

## 11. Contratos de cliente

Foi criado um novo módulo de contratos baseado em propostas.

### Objetivo

Permitir emitir contrato a partir de uma proposta comercial, ativando o cliente na plataforma e criando login/senha quando necessário.

### Tabela

```txt
client_contracts
```

Campos principais:

```txt
id
contract_code
commercial_proposal_id
client_profile_id
user_id
status
issued_at
signed_at
notes
created_at
updated_at
```

### Model

```txt
app/Models/Cliente/ClientContract.php
```

Relacionamentos:

```php
proposal()
clientProfile()
user()
```

### Relacionamentos adicionais

Em `CommercialProposal`:

```php
public function contract()
{
    return $this->hasOne(ClientContract::class, 'commercial_proposal_id');
}
```

Import correto:

```php
use App\Models\Cliente\ClientContract;
```

Em `ClientProfile`:

```php
public function contracts()
{
    return $this->hasMany(ClientContract::class, 'client_profile_id');
}
```

---

## 12. Rotas de contratos

Arquivo sugerido:

```txt
routes/consultor/contratos.php
```

Rotas:

```php
Route::name('cliente.contratos.')
    ->prefix('cliente/contratos')
    ->group(function () {
        Route::get('/', [ClientContractController::class, 'index'])->name('index');
        Route::get('/create/{proposal}', [ClientContractController::class, 'create'])->name('create');
        Route::post('/', [ClientContractController::class, 'store'])->name('store');
        Route::get('/{contract}', [ClientContractController::class, 'show'])->name('show');
        Route::get('/{contract}/edit', [ClientContractController::class, 'edit'])->name('edit');
        Route::put('/{contract}', [ClientContractController::class, 'update'])->name('update');
    });
```

Com prefixo do grupo consultor, os nomes finais são:

```txt
consultor.cliente.contratos.index
consultor.cliente.contratos.create
consultor.cliente.contratos.store
consultor.cliente.contratos.show
consultor.cliente.contratos.edit
consultor.cliente.contratos.update
```

---

## 13. Controller de contratos

Controller:

```txt
app/Http/Controllers/Admin/Cliente/ClientContractController.php
```

Responsabilidades:

- listar contratos com filtros;
- abrir criação a partir de uma proposta;
- emitir contrato;
- exibir contrato;
- editar contrato;
- atualizar contrato;
- carregar proposta, cliente, usuário, dados contratuais e endereço.

### Métodos principais

```php
index(Request $request, ClientContractRepository $repository)
create(CommercialProposal $proposal)
store(StoreClientContractRequest $request, IssueClientContractService $service)
show(ClientContract $contract)
edit(ClientContract $contract)
update(StoreClientContractRequest $request, ClientContract $contract, IssueClientContractService $service)
```

### Carregamentos importantes

Para create:

```php
$proposal->load([
    'clientProfile',
    'clientProfile.platformUser.userData.address',
    'consultor',
    'concessionaria',
    'address',
    'contract',
]);
```

Para show/edit:

```php
$contract->load([
    'clientProfile',
    'user.userData.address',
    'proposal.concessionaria',
    'proposal.address',
]);
```

---

## 14. Service de emissão de contrato

Service:

```txt
app/Services/Cliente/IssueClientContractService.php
```

Responsabilidades:

- receber proposta e dados contratuais;
- criar ou atualizar endereço da proposta;
- criar usuário do cliente se ainda não existir;
- preencher `role_id`, `consultor_id` e `status` do usuário;
- vincular `platform_user_id` no `ClientProfile`;
- criar ou atualizar `UserData`;
- vincular `UserData.address_id` ao endereço da proposta;
- criar ou atualizar `ClientContract`;
- ativar cliente quando contrato estiver `signed` ou `active`.

### Criação automática de usuário cliente

Quando o cliente ainda não possui usuário de plataforma:

```php
$user = User::create([
    'name' => $clientProfile->display_name,
    'email' => $clientProfile->email ?: 'cliente-' . $clientProfile->id . '@casaverde.local',
    'password' => Hash::make($temporaryPassword),
    'role_id' => RoleUser::$CLIENTE,
    'consultor_id' => $clientProfile->consultor_user_id ?? auth()->id(),
    'status' => StatusUser::$ATIVO,
]);
```

### Ativação do cliente

Quando o contrato estiver assinado ou ativo:

```php
if (in_array($contract->status, ['signed', 'active'], true)) {
    $clientProfile->update([
        'status' => 'contrato_fechado',
        'is_active_client' => true,
        'activated_at' => now(),
    ]);
}
```

---

## 15. Páginas de contratos

Páginas criadas/atualizadas:

```txt
resources/js/Pages/Consultor/Cliente/Contract/Index/Page.jsx
resources/js/Pages/Consultor/Cliente/Contract/Create/Page.jsx
resources/js/Pages/Consultor/Cliente/Contract/Show/Page.jsx
resources/js/Pages/Consultor/Cliente/Contract/Edit/Page.jsx
```

### Index

Lista todos os contratos emitidos.

Filtros mínimos:

- ID;
- código do contrato;
- CPF/CNPJ do cliente.

### Create

Aberta a partir de uma proposta.

Mostra:

- proposta base;
- cliente;
- concessionária;
- unidade consumidora;
- endereço atual da unidade consumidora;
- formulário de dados do contrato;
- formulário completo de `UserData`;
- formulário editável do endereço da proposta via `AddressCard`.

### Edit

Permite editar:

- status do contrato;
- data de emissão;
- data de assinatura;
- observações;
- todos os campos de `UserData`;
- endereço da unidade consumidora/proposta.

### Show

Mostra:

- código do contrato;
- status;
- login do cliente;
- senha temporária em flash quando criada;
- dados da proposta;
- dados contratuais do cliente;
- dados da unidade consumidora;
- endereço completo;
- botão de edição.

---

## 16. Status de contrato

Status usados:

```txt
issued     = Emitido
signed     = Assinado
active     = Ativo
cancelled  = Cancelado
```

### Regra operacional

- `issued`: contrato emitido, mas ainda não necessariamente assinado;
- `signed`: contrato assinado;
- `active`: contrato ativo e cliente ativado;
- `cancelled`: contrato cancelado.

Quando status for `signed` ou `active`, o cliente pode ser marcado como ativo.

---

## 17. Endereços

Model:

```txt
app/Models/Endereco/Address.php
```

Request base:

```txt
app/Http/Requests/Endereco/StoreAddressRequest.php
```

### Mudança estrutural importante

Não há mais necessidade de uma página isolada de cadastro de endereço para fluxos comerciais principais.

Endereços devem ser cadastrados dentro dos próprios formulários.

### Regra atual por fluxo

#### Proposta de cliente

O endereço representa a unidade consumidora:

```txt
commercial_proposals.address_id
```

#### Contrato

O contrato usa o endereço da proposta.

Além disso, `UserData.address_id` é atualizado para apontar para o endereço usado no contrato.

#### Produtor/usina

Endereços de usina/produtor seguem regras próprias do domínio de produtor/usina.

---

## 18. Concessionárias

Controller:

```txt
app/Http/Controllers/Admin/Settings/ConcessionariaController.php
```

Model:

```txt
app/Models/Usina/Concessionaria.php
```

Páginas criadas/atualizadas:

```txt
resources/js/Pages/Admin/Usina/Concessionaria/Index/Page.jsx
resources/js/Pages/Admin/Usina/Concessionaria/Create/Page.jsx
resources/js/Pages/Admin/Usina/Concessionaria/Show/Page.jsx
resources/js/Pages/Admin/Usina/Concessionaria/Edit/Page.jsx
```

Rotas:

```txt
admin.concessionarias.index
admin.concessionarias.create
admin.concessionarias.store
admin.concessionarias.show
admin.concessionarias.edit
admin.concessionarias.update
```

Campos principais:

```txt
nome
tarifa_gd2
estado
status
```

Status:

```txt
ativo
inativo
```

---

## 19. Grupos/blocos de usina

Model:

```txt
app/Models/Usina/UsinaBlock.php
```

Relacionamento:

```php
public function usinas()
{
    return $this->hasMany(UsinaSolar::class, 'usina_block_id');
}
```

Fluxo criado/planejado:

- Index;
- Create;
- Show;
- Edit;
- vínculo de usinas ao bloco.

---

## 20. Vínculo cliente ↔ usina

Model:

```txt
app/Models/Cliente/ClientUsinaLink.php
```

Request:

```txt
app/Http/Requests/Cliente/AttachClientToUsinaRequest.php
```

Controller:

```txt
app/Http/Controllers/Admin/Cliente/ClientUsinaLinkController.php
```

Regra:

- cliente pode ser vinculado a uma usina;
- o vínculo possui início, fim, status e observações;
- vínculos ativos são exibidos no Show do cliente;
- histórico pode ser acessado por rota própria.

---

## 21. Regras de desconto do cliente

Model:

```txt
app/Models/Cliente/ClientDiscountRule.php
```

Request:

```txt
app/Http/Requests/Cliente/StoreClientDiscountRuleRequest.php
```

Controller:

```txt
app/Http/Controllers/Admin/Cliente/ClientDiscountRuleController.php
```

Campos:

```txt
client_profile_id
discount_percent
starts_on
ends_on
is_active
notes
```

No Show do cliente há partial para:

- cadastrar nova regra;
- listar regras existentes;
- acessar histórico.

---

## 22. Configuração de importação de faturas por e-mail

Controller:

```txt
app/Http/Controllers/Admin/Fatura/ClientEmailImportSettingController.php
```

Model:

```txt
app/Models/Importacao/ClientEmailImportSetting.php
```

Tabela:

```txt
client_email_import_settings
```

Campos principais:

```txt
user_id
client_profile_id
concessionaria_id
imap_host
imap_port
imap_encryption
imap_email
imap_password
pdf_password
sender_filter
subject_filter
is_active
last_checked_at
```

### Regra importante

`user_id` não pode ser salvo como `null` quando a coluna for obrigatória.

Usar:

```php
$data['user_id'] = auth()->id();
```

### Create/Update

O controller foi ajustado para:

- criar configuração quando não existir;
- atualizar quando já existir configuração para o cliente;
- não sobrescrever senha quando o campo vier vazio;
- redirecionar de volta com snackbar/flash.

### Partial no Show do cliente

Partial:

```txt
resources/js/Pages/Consultor/Cliente/Profile/Show/Partials/ClientEmailImportSettingForm.jsx
```

Esse partial permite cadastrar/editar a configuração de importação diretamente na página de detalhes do cliente.

---

## 23. Faturas de concessionária

Controller:

```txt
app/Http/Controllers/Admin/Fatura/ConcessionaireBillController.php
```

Páginas principais:

```txt
resources/js/Pages/Consultor/Cliente/Fatura/Index/Page.jsx
resources/js/Pages/Consultor/Cliente/Fatura/Create/Page.jsx
resources/js/Pages/Consultor/Cliente/Fatura/Show/Page.jsx
```

### Show da fatura

A página Show da fatura foi ajustada para carregar:

```php
'clientProfile.emailImportSetting.concessionaria'
```

E enviar:

```php
'emailImportSetting' => $fatura->clientProfile?->emailImportSetting,
'concessionarias' => Concessionaria::query()->where('status', 'ativo')->orderBy('nome')->get(['id', 'nome']),
```

Assim, a tela de fatura consegue exibir/editar a configuração de e-mail relacionada ao cliente.

---

## 24. Sistema global de Snackbar/Alertas

Foram criados/definidos os componentes para exibir mensagens globais de retorno dos controllers e erros de validação.

Arquivos:

```txt
resources/js/Contexts/Alerts/SnackbarProvider.jsx
resources/js/Components/Alerts/GlobalSnackbar.jsx
resources/js/Utils/Alerts/alertUtils.js
```

### Tipos suportados

```txt
success
error
warning
info
validation errors
```

### Uso no Layout

```jsx
const alert = usePage().props.alert;
const errors = usePage().props.errors;

<SnackbarProvider initialAlert={alert} errors={errors}>
    ...
</SnackbarProvider>
```

### Uso nos controllers

```php
return redirect()->back()->with('success', 'Registro salvo com sucesso.');
return redirect()->back()->with('error', 'Não foi possível salvar.');
return redirect()->back()->with('warning', 'Revise os dados antes de continuar.');
return redirect()->back()->with('info', 'Processamento iniciado.');
```

### Inertia shared props

No middleware `HandleInertiaRequests`, garantir compartilhamento:

```php
'alert' => [
    'success' => fn () => $request->session()->get('success'),
    'error' => fn () => $request->session()->get('error'),
    'warning' => fn () => $request->session()->get('warning'),
    'info' => fn () => $request->session()->get('info'),
],
```

---

## 25. Padrão de formulários Inertia

O projeto usa `useForm` do Inertia.

Padrão:

```jsx
const { data, setData, post, put, processing, errors } = useForm({ ... });
```

### POST

```jsx
post(route('nome.da.rota.store'));
```

### PUT

```jsx
put(route('nome.da.rota.update', id));
```

### Atenção com method spoofing

Quando usar Inertia, preferir `put(...)` diretamente para rotas PUT.
Evitar `router.post(..., {_method: 'PUT'})` se a rota já aceita PUT e a página pode usar `put`.

---

## 26. Erros comuns já encontrados

### 26.1 PUT indo para rota `/edit`

Sintoma:

```txt
PUT method is not supported for route .../edit
```

Causas possíveis:

- action/form apontando para rota edit;
- route name errado;
- rota não registrada;
- arquivo de rotas não incluído;
- cache de rota;
- chamada Inertia usando URL errada.

Comandos úteis:

```bash
sail artisan route:list | grep usinas
sail artisan route:list --name=consultor.producer.usinas
sail artisan optimize:clear
```

### 26.2 route:list quebrando por controller inexistente

Sintoma:

```txt
ReflectionException: Class "ClientDiscountHistoryController" does not exist
```

Regra:

Se `route:list` quebra, existe rota apontando para controller inexistente ou import incorreto.
Corrigir antes de diagnosticar outras rotas.

### 26.3 Model procurando namespace errado

Sintoma:

```txt
Class "App\Models\Proposta\ClientContract" not found
```

Correção:

Em `CommercialProposal`, importar:

```php
use App\Models\Cliente\ClientContract;
```

### 26.4 User sem status

Sintoma:

```txt
Field 'status' doesn't have a default value
```

Correção:

Ao criar usuário automaticamente, informar:

```php
'role_id' => RoleUser::$CLIENTE,
'status' => StatusUser::$ATIVO,
```

### 26.5 Endereço não preenchido com ViaCEP

Causa comum:

Chamar `setAddressData` várias vezes seguidas usando estado antigo.

Correção:

Permitir atualização em lote:

```jsx
setAddressData({
    cep,
    rua: result.logradouro ?? '',
    bairro: result.bairro ?? '',
    cidade: result.localidade ?? '',
    estado: result.uf ?? '',
});
```

---

## 27. Produtores

O sistema também possui estrutura para produtores:

- perfil de produtor;
- leads de produtor;
- propostas de produtor;
- usinas vinculadas;
- dashboards próprios;
- integração com consultor.

Arquivos principais:

```txt
app/Models/Produtor/ProducerProfile.php
app/Models/Produtor/ProducerLead.php
app/Http/Controllers/Admin/Produtor/...
resources/js/Pages/Admin/Produtor/Profile/...
resources/js/Pages/Admin/Produtor/Lead/...
```

### Regra principal

Toda usina deve ter produtor proprietário.

```txt
usina_solars.user_id = produtor proprietário
usina_solars.consultor_user_id = consultor responsável
```

---

## 28. Usinas e grupos de usinas

Controllers principais:

```txt
app/Http/Controllers/Admin/Usina/UsinaSolarController.php
app/Http/Controllers/Admin/Usina/UsinaBlockController.php
```

Rotas podem existir em contexto `consultor` e/ou `producer`, dependendo do fluxo.

Exemplos de nomes encontrados durante manutenção:

```txt
consultor.producer.usinas.*
producer.usinas.*
auth.usinas.*
```

Sempre validar com:

```bash
sail artisan route:list | grep usinas
```

---

## 29. Arquivos criados/alterados nesta evolução

### Backend

```txt
app/Models/Cliente/ClientContract.php
app/Repositories/Cliente/ClientContractRepository.php
app/Services/Cliente/IssueClientContractService.php
app/Http/Controllers/Admin/Cliente/ClientContractController.php
app/Http/Requests/Cliente/StoreClientContractRequest.php
app/Http/Controllers/Admin/Proposta/CommercialProposalController.php
app/Services/Proposta/CreateCommercialProposalService.php
app/Http/Requests/Proposta/StoreCommercialProposalRequest.php
app/Http/Controllers/Admin/Fatura/ClientEmailImportSettingController.php
app/Http/Controllers/Admin/Fatura/ConcessionaireBillController.php
app/Http/Controllers/Admin/Usuarios/Cliente/ClienteController.php
app/Models/Proposta/CommercialProposal.php
app/Models/Cliente/ClientProfile.php
app/Models/Users/User.php
app/Models/Users/UserData.php
```

### Frontend

```txt
resources/js/Pages/Consultor/Propostas/Cliente/Create/Page.jsx
resources/js/Pages/Consultor/Propostas/Cliente/Edit/Page.jsx
resources/js/Pages/Consultor/Propostas/Cliente/Show/Page.jsx
resources/js/Pages/Consultor/Cliente/Profile/Show/Page.jsx
resources/js/Pages/Consultor/Cliente/Profile/Show/Partials/ClientProposalsList.jsx
resources/js/Pages/Consultor/Cliente/Profile/Show/Partials/ClientEmailImportSettingForm.jsx
resources/js/Pages/Consultor/Cliente/Contract/Index/Page.jsx
resources/js/Pages/Consultor/Cliente/Contract/Create/Page.jsx
resources/js/Pages/Consultor/Cliente/Contract/Show/Page.jsx
resources/js/Pages/Consultor/Cliente/Contract/Edit/Page.jsx
resources/js/Components/Partials/AddressCard.jsx
resources/js/Contexts/Alerts/SnackbarProvider.jsx
resources/js/Components/Alerts/GlobalSnackbar.jsx
resources/js/Utils/Alerts/alertUtils.js
resources/js/Pages/Admin/Usina/Concessionaria/Index/Page.jsx
resources/js/Pages/Admin/Usina/Concessionaria/Show/Page.jsx
resources/js/Pages/Admin/Usina/Concessionaria/Edit/Page.jsx
```

### Migrations importantes

```txt
create_client_contracts_table
add_address_id_to_commercial_proposals_table
add_role_id_consultor_id_status_to_users_table
```

---

## 30. Como subir o projeto

### Instalação padrão

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
php artisan serve
```

### Com Laravel Sail

```bash
sail up -d
sail composer install
sail npm install
sail artisan key:generate
sail artisan migrate
sail npm run dev
```

### Limpeza de cache após alterações de rota/model/request

```bash
sail artisan optimize:clear
sail artisan route:clear
sail artisan config:clear
sail artisan view:clear
```

---

## 31. Checklist para criar/alterar funcionalidades

Sempre verificar:

```txt
migration
model fillable
relationships
request validation
service transaction
controller load/render
repository/filter/pagination
routes
page jsx
partials
snackbar/flash
route:list
```

Para formulários com relacionamento:

```txt
campo existe no banco?
está no fillable?
está validado no request?
está sendo enviado no frontend?
está sendo salvo no service/controller?
está sendo carregado no show/edit?
```

---

## 32. Próximas recomendações

### Curto prazo

- Padronizar nomes de páginas entre `Admin` e `Consultor`.
- Consolidar arquivos de rota por domínio.
- Criar testes para emissão de proposta e contrato.
- Criar geração de PDF do contrato.
- Enviar login/senha do cliente por e-mail após emissão do contrato.

### Médio prazo

- Criar auditoria de alterações em contrato.
- Criar histórico de status de contrato.
- Criar painel do cliente com contratos e propostas.
- Melhorar permissões por policy.

### Longo prazo

- Automação de cobrança.
- Integração financeira.
- Relatórios por competência.
- Assinatura digital.
- Integração com gateways/documentos.

---

## 33. Resumo executivo para nova equipe

Se você está assumindo este projeto, memorize:

1. O sistema é um CRM/ERP para operação de energia.
2. Roles oficiais: admin, consultor, produtor e cliente.
3. Muitas rotas operacionais foram movidas para `routes/consultor`, mesmo que controllers ainda estejam em namespace `Admin`.
4. Cliente nasce como lead/prospect e pode virar cliente ativo ao emitir/assinar contrato.
5. Proposta comercial de cliente pode criar ou usar cliente existente.
6. Cada proposta pode ter endereço próprio da unidade consumidora.
7. Contrato nasce a partir de uma proposta.
8. Emissão de contrato cria usuário cliente se necessário.
9. `UserData` armazena os dados contratuais usados no contrato.
10. `AddressCard` é o componente reutilizável para endereço com ViaCEP.
11. O backend é a fonte de verdade para autorização e regras de domínio.
12. Sempre validar rotas com `sail artisan route:list` antes de alterar frontend.

---

## 34. Licença e observação final

Projeto interno.

Esta documentação foi atualizada para servir como base de manutenção, onboarding técnico e continuidade do desenvolvimento com humanos ou IAs de programação.

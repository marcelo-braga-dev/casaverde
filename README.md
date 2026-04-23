# Casa Verde CRM

Sistema CRM/ERP desenvolvido em **Laravel + Inertia + React** para operação comercial, cadastro, propostas, usinas, produtores, clientes, importação de faturas de energia e preparação para cobrança em uma empresa de energia por assinatura/compensação.

> Este README foi escrito para servir como **documentação técnica principal do projeto**, com nível profissional, orientado para **novas equipes**, **manutenção evolutiva** e também para **IAs de programação**.
> O objetivo é que qualquer pessoa consiga entender:
> - o propósito do sistema
> - a arquitetura atual
> - as regras de negócio
> - a organização do código
> - como atualizar o projeto sem quebrar fluxos existentes

---

# 1. Visão geral

O **Casa Verde** é uma plataforma de operação comercial e administrativa para uma empresa que atua com geração/compensação de energia elétrica.

O sistema foi desenhado para controlar:

- usuários internos da operação
- clientes consumidores finais
- produtores/proprietários de usinas
- usinas e blocos de usina
- propostas comerciais
- leads e perfis de produtor
- endereços
- importação e leitura de faturas
- vinculação entre clientes e usinas
- preparação futura para cobrança, faturamento e financeiro

A aplicação combina componentes de **CRM**, **ERP operacional** e **portal de acesso** para tipos diferentes de usuário.

---

# 2. Objetivo de negócio

A regra macro de negócio do Casa Verde é:

1. a empresa opera ou intermedeia energia proveniente de usinas
2. consultores realizam prospecção e operação comercial
3. clientes podem aderir à energia compensada/assinada
4. produtores são os proprietários das usinas ofertadas na operação
5. o sistema gerencia propostas, vínculos, perfis, dados operacionais e faturas
6. a plataforma prepara a base para cobrança, relatórios e acompanhamento operacional

A partir da evolução mais recente do projeto, o sistema passou a tratar formalmente quatro tipos principais de usuário:

- **admin**
- **consultor**
- **cliente**
- **produtor**

Isso alterou a arquitetura do domínio e a documentação anterior foi atualizada para refletir o estado atual real do código.

---

# 3. Stack técnica

## Backend
- PHP 8.2+
- Laravel 12
- Eloquent ORM
- Inertia.js (backend adapter)

## Frontend
- React
- Inertia.js
- MUI (Material UI)

## Banco de dados
- banco relacional
- modelagem orientada a entidades de domínio

## Bibliotecas importantes
- barryvdh/laravel-dompdf
- barryvdh/laravel-snappy
- laravel/sanctum
- tightenco/ziggy

---

# 4. Arquitetura por domínio

O projeto está organizado por **domínio de negócio**, e não apenas por camada técnica. Isso é essencial para manter a evolução controlada.

Principais domínios atuais:

- **Users**
- **Cliente**
- **Produtor**
- **Usina**
- **Endereco**
- **Energia / Faturas / Importação**
- **Propostas**
- **Financeiro**

Essa organização melhora:

- clareza de responsabilidade
- manutenção
- desacoplamento
- leitura por novas equipes
- orientação para automações/IA

---

# 5. Perfis de acesso oficiais

Os perfis oficiais do sistema são definidos em `App\src\Roles\RoleUser`.

## Roles oficiais
- `admin`
- `consultor`
- `produtor`
- `cliente`

## Implementação atual
Arquivo central:
- `app/src/Roles/RoleUser.php`

Mapeamento atual:
- `ADMIN = 1`
- `CONSULTOR = 2`
- `PRODUTOR = 3`
- `CLIENTE = 4`

## Observação importante
**Produtor não é mais tratado como apenas entidade paralela/legado.**
Na arquitetura atual, **produtor é role oficial do sistema**, com:

- autenticação própria
- dashboard próprio
- rotas próprias
- vínculo com consultor
- vínculo com propostas
- vínculo com `ProducerProfile`
- vínculo obrigatório com usinas

---

# 6. Regras de negócio consolidadas

## 6.1 Admin
- possui acesso total
- acessa dashboard administrativo
- gerencia usuários, produtores, usinas, perfis, leads, configurações e operação global

## 6.2 Consultor
- atua na operação comercial
- cria e acompanha propostas
- pré-cadastra clientes e produtores
- possui carteira de clientes e produtores vinculados via `consultor_id`
- pode criar e acompanhar usinas sob sua responsabilidade
- não deve ter visão global irrestrita como admin

## 6.3 Cliente
- é o consumidor final da operação
- possui dashboard e portal próprios
- pode ter perfil operacional e faturas vinculadas
- acessa somente os próprios dados

## 6.4 Produtor
- é o proprietário da usina
- tecnicamente participa do fluxo comercial de forma semelhante ao cliente em vários pontos
- possui perfil próprio, propostas, dashboard e vínculo com consultor
- é criado/reaproveitado no fluxo de proposta de produtor
- pode ser integrado formalmente à plataforma

## 6.5 Regra central de usina
**Toda usina precisa estar vinculada a um produtor.**

Na arquitetura atual:
- `UsinaSolar.user_id` representa o **produtor proprietário**
- `UsinaSolar.consultor_user_id` representa o **consultor responsável**

Essa é uma das regras mais importantes de manutenção do projeto.

## 6.6 Regra central de proposta de produtor
Ao gerar uma proposta de produtor:
- o sistema pode selecionar um produtor já existente
- ou criar um novo produtor inline
- o produtor é identificado por CPF ou CNPJ
- se já existir `UserData` com o documento, o usuário é reaproveitado
- se não existir, o sistema cria:
  - `User`
  - `UserData`
  - `UserContact`
  - `ProducerProfile`
- em seguida cria a `ProdutorPropostas`
- e cria também `ProdutorPropostasEnderecos`

## 6.7 ProducerProfile
`ProducerProfile` representa o perfil formal do produtor/proprietário dentro do domínio do sistema.

Esse perfil pode nascer:
- manualmente
- ou automaticamente a partir da proposta de produtor

Depois ele é sincronizado com dados da usina formalizada.

## 6.8 Vínculo consultor ↔ produtor
Todo produtor relevante para a operação deve estar vinculado a um consultor por meio de:
- `users.consultor_id`
- `producer_profiles.created_by_user_id`
- `producer_leads.consultor_user_id`
- `usina_solars.consultor_user_id`

---

# 7. Estado funcional atual

## 7.1 Já implementado
O projeto já possui base funcional para:

- autenticação
- roles oficiais
- redirecionamento por role
- dashboards separados
- usuários internos
- clientes
- produtores
- propostas de produtor
- perfis de produtor
- leads de produtor
- usinas
- blocos de usina
- endereços
- contatos
- importação de faturas
- estrutura de financeiro/configuração

## 7.2 Fluxos já alinhados recentemente
A arquitetura foi atualizada para comportar corretamente:

- `produtor` como role oficial
- middleware de role
- middleware de redirecionamento por role
- dashboards separados por tipo de usuário
- proposta de produtor com criação inline de produtor
- `ProducerProfile` garantido no fluxo
- criação e edição de usina obrigando produtor
- sincronização de `ProducerProfile` com `UsinaSolar`

## 7.3 Próximas evoluções naturais
- refinar dashboards finais no frontend
- refinar menus por role
- consolidar faturamento/cobrança
- relatórios financeiros e operacionais
- trilha histórica por competência
- automações operacionais mais profundas

---

# 8. Estrutura atual de domínio (visão conceitual)

## 8.1 Usuário
Tabela/model principal:
- `users`

Campos principais:
- `id`
- `name`
- `email`
- `password`
- `role_id`
- `consultor_id`
- `status`

Relacionamentos principais:
- `userData()`
- `contatos()`
- `consultor()`
- `clientes()`
- `produtores()`
- `producerProfile()`
- `usinas()`
- `usinasComoConsultor()`

## 8.2 UserData
Dados pessoais/documentais do usuário:
- CPF/CNPJ
- nome/razão social
- tipo de pessoa
- dados cadastrais complementares

Regra importante:
- CPF/CNPJ são usados para identificar duplicidade e reaproveitamento de produtor no fluxo de proposta

## 8.3 UserContact
Tabela/model para contatos do usuário:
- email
- celular
- celular_2
- telefone

## 8.4 ProducerProfile
Perfil estruturado do produtor/proprietário:
- `user_id`
- `created_by_user_id`
- dados administrativos
- dados da usina
- potência, geração, prazo etc.

## 8.5 ProducerLead
Lead comercial do produtor:
- consultor responsável
- perfil de produtor
- status comercial
- observações e dados de negociação

## 8.6 ProdutorPropostas
Entidade de proposta comercial do produtor:
- `produtor_id`
- `consultor_id`
- `potencia`
- `geracao_media`
- `valor_investimento`
- `prazo_locacao`
- `taxa_reducao`

## 8.7 ProdutorPropostasEnderecos
Endereço do local da usina vinculado à proposta do produtor.

## 8.8 UsinaSolar
Entidade formal da usina:
- `user_id` = produtor proprietário
- `consultor_user_id` = consultor responsável
- `concessionaria_id`
- `usina_block_id`
- `address_id`
- `status`
- `uc`
- `media_geracao`
- `prazo_locacao`
- `potencia_usina`
- `taxa_comissao`
- `inversores`
- `modulos`

---

# 9. Regras importantes de manutenção

## 9.1 Nunca tratar produtor como cliente comum no código novo
Embora existam semelhanças de fluxo, **produtor é role própria**.
Não criar lógica nova assumindo que produtor é apenas uma variação informal de cliente.

## 9.2 `UsinaSolar.user_id` significa produtor
Em toda evolução futura, lembrar:
- `user_id` de usina = produtor proprietário
- não usar esse campo para outro tipo de usuário

## 9.3 Não duplicar produtor por CPF/CNPJ
O fluxo correto é:
- buscar em `UserData`
- reutilizar o usuário existente
- garantir `ProducerProfile`
- continuar o fluxo

## 9.4 Sempre validar role no backend
Não confiar apenas no frontend.

Exemplo:
- `StoreUsinaSolarRequest` valida que `user_id` é produtor
- `StoreUsinaSolarRequest` valida que `consultor_user_id` é consultor

## 9.5 Ao criar produtor inline, garantir a cadeia completa
Quando houver criação inline via proposta, garantir:
- `User`
- `UserData`
- `UserContact`
- `ProducerProfile`

## 9.6 Não acoplar regras de menu ao backend
O backend controla acesso por middleware/rotas/request.
O frontend deve exibir menu conforme `auth.user.role_name`, mas isso não substitui autorização backend.

---

# 10. Fluxos principais

## 10.1 Login e redirecionamento
Arquivo-chave:
- `app/Http/Middleware/RedirectUserByRole.php`

Fluxo:
- acesso em `/dashboard`
- middleware detecta `role_id`
- redireciona para:
  - `admin.dashboard`
  - `cliente.dashboard`
  - `produtor.dashboard`

## 10.2 Proposta de produtor
Controller principal:
- `App\Http\Controllers\Auth\Produtor\ProdutorPropostasController`

Request principal:
- `App\Http\Requests\Produtor\StoreProdutorPropostaRequest`

Repository principal:
- `App\Repositories\Produtor\ProdutorPropostaRepository`

Fluxo:
1. consultor abre formulário
2. escolhe produtor existente ou novo
3. informa dados da proposta
4. informa endereço
5. request valida dados
6. repository cria/reaproveita produtor
7. cria proposta
8. cria endereço da proposta
9. garante `ProducerProfile`

## 10.3 Cadastro de usina
Controller principal:
- `App\Http\Controllers\Admin\Usina\UsinaSolarController`

Request principal:
- `App\Http\Requests\Usina\StoreUsinaSolarRequest`

Fluxo:
1. selecionar produtor proprietário
2. selecionar consultor responsável
3. preencher dados operacionais da usina
4. salvar `UsinaSolar`
5. sincronizar `ProducerProfile`

## 10.4 Dashboard administrativo
Controller principal:
- `App\Http\Controllers\Admin\DashboardController`

Regra:
- admin vê visão global
- consultor vê visão restrita à própria carteira

## 10.5 Dashboard do produtor
Controller principal:
- `App\Http\Controllers\Produtor\DashboardController`

Mostra:
- perfil do produtor
- usinas do produtor
- leads relacionados ao produtor

## 10.6 Dashboard do cliente
Controller principal:
- `App\Http\Controllers\Cliente\DashboardController`

Mostra:
- perfil do cliente
- faturas do cliente

---

# 11. Middlewares e permissões

## 11.1 EnsureUserHasRole
Arquivo:
- `app/Http/Middleware/EnsureUserHasRole.php`

Responsabilidade:
- permitir acesso apenas para roles autorizadas em uma rota/grupo

Uso:
- `role:admin,consultor`
- `role:cliente`
- `role:produtor`

## 11.2 RedirectUserByRole
Arquivo:
- `app/Http/Middleware/RedirectUserByRole.php`

Responsabilidade:
- redirecionar o usuário logado do `/dashboard` para o dashboard certo conforme role

## 11.3 HandleInertiaRequests
Arquivo:
- `app/Http/Middleware/HandleInertiaRequests.php`

Responsabilidade:
- compartilhar `auth.user` com o frontend
- fornecer `role_name`, `status`, `consultor_id` etc.

---

# 12. Rotas principais

## 12.1 Rotas web
Arquivo:
- `routes/web.php`

Responsabilidade:
- carregar módulos de rota
- registrar dashboard com redirecionamento por role
- registrar fluxos de ativação

## 12.2 Rotas admin
Arquivo:
- `routes/admin/index.php`

Responsabilidade:
- agrupar todas as rotas administrativas/operacionais com `auth` + `role:admin,consultor`

## 12.3 Rotas cliente
Arquivo:
- `routes/cliente/index.php`

## 12.4 Rotas produtor
Arquivo:
- `routes/produtor/index.php`

---

# 13. Frontend e navegação

## 13.1 Inertia + React
Todas as páginas usam Inertia + React, com `useForm` para formulários e MUI para interface.

## 13.2 Regra de menu
O frontend deve construir o menu conforme:
- `auth.user.role_name`

Padrão recomendado:
- admin/consultor → menu administrativo
- cliente → menu do cliente
- produtor → menu do produtor

## 13.3 Regra de exibição
Mesmo que o menu esconda itens, a segurança real sempre deve estar no backend.

---

# 14. Arquivos-chave do projeto

## Backend
- `app/src/Roles/RoleUser.php`
- `app/Http/Middleware/EnsureUserHasRole.php`
- `app/Http/Middleware/RedirectUserByRole.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Http/Controllers/Admin/DashboardController.php`
- `app/Http/Controllers/Cliente/DashboardController.php`
- `app/Http/Controllers/Produtor/DashboardController.php`
- `app/Http/Controllers/Auth/Produtor/ProdutorPropostasController.php`
- `app/Http/Controllers/Admin/Usina/UsinaSolarController.php`
- `app/Http/Requests/Produtor/StoreProdutorPropostaRequest.php`
- `app/Http/Requests/Usina/StoreUsinaSolarRequest.php`
- `app/Repositories/Produtor/ProdutorPropostaRepository.php`
- `app/Models/Users/User.php`
- `app/Models/Users/UserData.php`
- `app/Models/Users/UserContact.php`
- `app/Models/Produtor/ProducerProfile.php`
- `app/Models/Produtor/ProducerLead.php`
- `app/Models/Produtor/ProdutorPropostas.php`
- `app/Models/Produtor/ProdutorPropostasEnderecos.php`
- `app/Models/Usina/UsinaSolar.php`

## Frontend
- `resources/js/Pages/Auth/Produtor/Proposta/Create/Page.jsx`
- `resources/js/Pages/Auth/Produtor/Proposta/Create/ConsumoDados.jsx`
- `resources/js/Pages/Auth/Produtor/Proposta/Create/PropostaCard.jsx`
- `resources/js/Components/UserData/DadosPessoais.jsx`
- `resources/js/Components/UserData/Contato.jsx`
- `resources/js/Components/UserData/Endereco.jsx`
- `resources/js/Pages/Admin/Usinas/Create/Page.jsx`
- `resources/js/Pages/Admin/Usinas/Edit/Page.jsx`

---

# 15. Como subir o projeto

## Requisitos
- PHP 8.2+
- Composer
- Node.js
- NPM ou PNPM
- banco configurado

## Instalação
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
php artisan serve
```

## Em ambiente Sail
```bash
./vendor/bin/sail up -d
./vendor/bin/sail composer install
./vendor/bin/sail npm install
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
./vendor/bin/sail npm run dev
```

---

# 16. Dependências de PDF

## wkhtmltopdf
Em algumas partes do projeto, pode ser necessário:

### Ubuntu
```bash
sudo apt update -y
sudo apt install -y wkhtmltopdf
```

### Laravel Sail
```bash
sail root-shell
apt update
apt install -y software-properties-common
add-apt-repository ppa:savoirfairelinux/wkhtmltopdf
apt update
apt install -y wkhtmltopdf
which wkhtmltopdf
```

---

# 17. Diretrizes para manutenção

## 17.1 Antes de alterar uma entidade, localizar todos os pontos de impacto
Exemplo: alterar `UsinaSolar` pode impactar:
- request
- controller
- frontend create/edit
- `ProducerProfile`
- dashboards
- filtros por consultor

## 17.2 Manter coerência entre backend e frontend
Toda alteração em campo/formulário deve ser refletida em:
- migration/model
- request
- controller/repository/service
- página React/Inertia correspondente

## 17.3 Não remover regras de domínio silenciosamente
Se um campo estiver aparentemente redundante, primeiro verificar se ele não está sendo usado em:
- dashboard
- PDF
- filtros
- sincronização com perfil
- automações futuras

## 17.4 Preferir centralização de regra de domínio
Exemplos:
- validação em `FormRequest`
- criação composta em `Repository`/`Service`
- autorização em middleware e backend

## 17.5 Para novas equipes
Começar sempre por esta ordem:
1. ler este README por completo
2. revisar `RoleUser`
3. revisar `User`, `ProducerProfile`, `UsinaSolar`
4. revisar middlewares
5. revisar rotas
6. revisar requests
7. revisar controllers e repositories principais
8. só depois alterar frontend

---

# 18. Pontos de atenção históricos

## 18.1 README antigo desatualizado
Versões anteriores desta documentação tratavam `produtor` como legado transitório.
Isso não representa mais o estado atual do código.

## 18.2 Campos com significado implícito
`UsinaSolar.user_id` significa **produtor proprietário**.
Isso deve ser lembrado por qualquer nova equipe.

## 18.3 Fluxos híbridos em evolução
O projeto passou por evolução incremental. Por isso, em algumas áreas pode existir nomenclatura antiga convivendo com a nova.
Ao manter o sistema, priorizar sempre a regra atual documentada aqui.

---

# 19. Próximas recomendações arquiteturais

## Curto prazo
- consolidar menus finais por role no frontend
- revisar dashboards React para cada perfil
- padronizar nomenclatura de campos compartilhados

## Médio prazo
- consolidar faturamento/cobrança
- padronizar services/repositories mais sensíveis
- criar testes automatizados para propostas e usinas

## Longo prazo
- congelamento por competência
- auditoria operacional
- relatórios estratégicos
- integração financeira aprofundada

---

# 20. Resumo executivo para nova equipe

Se você está assumindo este projeto agora, memorize estes pontos:

1. o sistema é um CRM/ERP de operação de energia
2. existem quatro roles oficiais: admin, consultor, cliente e produtor
3. produtor é role oficial e também entidade de domínio
4. toda usina pertence a um produtor
5. consultor é responsável comercial por clientes, produtores e usinas de sua carteira
6. proposta de produtor pode criar o produtor inline
7. `ProducerProfile` é obrigatório para o domínio de produtor ficar consistente
8. o backend é a fonte real de autorização
9. o frontend usa Inertia + React + MUI
10. qualquer mudança relevante deve manter coerência entre model, request, controller, repository e página React correspondente

---

# 21. Licença / observações finais

Projeto interno.
Documentação mantida para facilitar continuidade, manutenção, onboarding técnico e uso com IAs de programação.

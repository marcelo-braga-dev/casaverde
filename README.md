# Casa Verde CRM

Sistema CRM/ERP em Laravel para gestão de clientes, consultores, usinas, propostas comerciais, importação de faturas da concessionária, preparação para cobrança/boleto e portal do cliente.

> Este documento foi escrito para ser entendido por desenvolvedores humanos e por IAs de programação, com ênfase em **clareza de arquitetura**, **regras de negócio**, **evitar redundância**, **evitar quebra de código** e **facilitar manutenção evolutiva**.

---

# 1. Visão geral do projeto

O **Casa Verde** é uma plataforma para uma empresa de assinatura/compartilhamento de energia elétrica.

## Objetivo de negócio

A empresa possui uma ou mais usinas de geração, e clientes que aderem ao modelo de compensação/assinatura de energia. A lógica operacional principal é:

1. o cliente consome energia da concessionária
2. a conta de energia da concessionária é analisada/importada no sistema
3. o cliente é vinculado a uma usina
4. o sistema aplica a lógica comercial definida (desconto, taxa de redução, prazo de locação, etc.)
5. futuramente o sistema gera cobrança/boleto para o cliente
6. a empresa Casa Verde lucra com a diferença entre o custo da energia compensada/gerada e o valor cobrado do cliente

## Papel do sistema

O sistema precisa controlar:

- cadastro e ativação de clientes
- operação comercial via consultores
- emissão de propostas comerciais
- organização de usinas e blocos
- importação e leitura de faturas da concessionária
- vínculo de clientes com usinas
- regras de desconto
- preparação para cobrança e relatórios
- acesso do cliente ao portal

---

# 2. Stack e arquitetura

## Backend
- Laravel
- PHP
- Eloquent ORM
- Inertia.js

## Frontend
- React
- Inertia.js
- MUI (Material UI)

## Banco de dados
- relacional
- modelagem centrada em entidades de domínio

## Organização arquitetural
O projeto foi reorganizado por **domínio de negócio**, e não apenas por camada técnica. Isso é essencial para manter o crescimento saudável.

Os principais domínios são:

- Cliente
- Proposta
- Usina
- Endereço
- Produtor
- Fatura
- Importação
- Usuários

---

# 3. Perfis de acesso oficiais

Ao longo de todo o projeto, os papéis oficiais são:

- `admin`
- `consultor`
- `cliente`

## Regra importante
`produtor` **não deve ser tratado como role principal de autenticação** no domínio novo.  
Produtor é uma **entidade de negócio**, representada por tabelas próprias (`producer_profiles`, `producer_leads`).

## RoleUser
Existe um `RoleUser::$PRODUTOR` legado em parte do projeto por compatibilidade temporária.  
Ele deve ser tratado como **legado transitório**, e não como base para novas regras.

---

# 4. Regras centrais de negócio

## 4.1 Cliente
- Cliente é identificado de forma única por **CPF ou CNPJ**
- Nunca deve haver duplicidade de CPF/CNPJ
- Um cliente pode existir no sistema mesmo antes de se tornar cliente ativo
- O cliente pode existir como:
  - prospect
  - proposta emitida
  - contrato fechado
  - cliente ativo
  - inativo
  - cancelado

## 4.2 Consultor
- Admin cadastra consultores
- Consultor emite propostas
- Consultor pode cadastrar clientes/prospects usando CPF/CNPJ
- Consultor vincula cliente à lógica comercial

## 4.3 Proposta comercial
- Sempre precisa estar vinculada a um cliente identificado
- Se CPF/CNPJ já existir, não pode criar outro cliente
- A proposta é emitida em PDF
- Proposta possui dados mínimos de negócio, como média de consumo, taxa de redução, prazo de locação, valor médio, unidade consumidora e concessionária

## 4.4 Cliente ativo
O cliente só passa a ter acesso à plataforma após:
- conversão do prospect
- definição do email de acesso
- envio de convite por link único/token

## 4.5 Usina
- Usinas podem ser organizadas em blocos
- Cada usina possui dados técnicos, operacionais e comerciais mínimos
- Um cliente pode ser vinculado a uma usina
- O vínculo deve ser histórico, não destrutivo

## 4.6 Desconto por cliente
- O sistema permite regra de desconto por cliente
- A regra deve ter histórico
- A regra ativa vale para o período de vigência
- Não se deve sobrescrever a história comercial do cliente

## 4.7 Fatura da concessionária
- Pode entrar manualmente ou automaticamente
- Pode ser importada por email via IMAP
- O PDF pode ser protegido por senha
- O sistema deve ler sempre a mesma estrutura de fatura da mesma concessionária
- Os campos extraídos são validados e revisáveis manualmente
- Depois da revisão, a fatura pode ser aprovada

---

# 5. Estado funcional consolidado

Este projeto foi evoluído em duas grandes etapas principais:

## Etapa A — Base estrutural/comercial
Entidades e fluxos centrais:
- perfis de acesso
- cadastro base de clientes
- propostas comerciais
- ativação por convite
- concessionárias
- endereços
- usinas
- blocos de usina
- vínculo cliente ↔ usina
- desconto por cliente
- dados contratuais completos
- contatos
- perfis e leads de produtor

## Etapa B — Faturas da concessionária
Fluxos principais:
- upload manual de fatura
- parser da concessionária
- importação automática por email
- IMAP por cliente
- PDFs protegidos por senha
- revisão operacional
- divergências automáticas
- aprovação final de faturas

## Próxima etapa natural
- cobrança
- geração de boleto
- congelamento por competência
- relatórios financeiros
- status de pagamento
- lucro da Casa Verde

---

# 6. Estrutura de pastas recomendada

```text
app/
├── Console/
│   └── Commands/
│       ├── ImportConcessionaireBillsCommand.php
│       └── ImportEnergyBillsCommand.php
│
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   ├── Cliente/
│   │   │   ├── Endereco/
│   │   │   ├── Fatura/
│   │   │   ├── Produtor/
│   │   │   ├── Proposta/
│   │   │   ├── Usina/
│   │   │   └── Usuarios/
│   │   └── Auth/
│   │
│   └── Requests/
│       ├── Cliente/
│       ├── Endereco/
│       ├── Fatura/
│       ├── Produtor/
│       ├── Proposta/
│       └── Usina/
│
├── Mail/
│   └── Cliente/
│
├── Models/
│   ├── Cliente/
│   ├── Endereco/
│   ├── Energia/
│   ├── Fatura/
│   ├── Importacao/
│   ├── Produtor/
│   ├── Proposta/
│   ├── Usina/
│   └── Users/
│
├── Policies/
├── Providers/
├── Repositories/
│   ├── Cliente/
│   ├── Endereco/
│   ├── Fatura/
│   ├── Produtor/
│   ├── Proposta/
│   └── Usina/
│
├── Services/
│   ├── Cliente/
│   ├── Energia/
│   ├── Fatura/
│   │   └── Imap/
│   ├── Proposta/
│   └── Users/
│
├── Support/
│   ├── DocumentNormalizer.php
│   ├── EmailNormalizer.php
│   └── PhoneNormalizer.php
│
└── src/
    ├── Cliente/
    ├── Proposta/
    └── Roles/

------------------------------------------------------------------------

## INSTALL wkhtmltopdf
- `sudo apt update -y`
- `sudo apt install -y wkhtmltopdf`

in SAIL LARAVEL:
- `sail root-shell`
- `apt update`
- `apt install -y software-properties-common`
- `add-apt-repository ppa:savoirfairelinux/wkhtmltopdf`
- `apt update`
- `apt install -y wkhtmltopdf`

- `which wkhtmltopdf`


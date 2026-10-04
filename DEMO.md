# Modo demonstração

Versão aberta da plataforma para interessados em comprar: o visitante informa nome e e-mail ou telefone, entra sem senha, navega por tudo e troca de perfil com um clique. Nada pode ser criado, editado ou excluído.

É o **mesmo código** da plataforma. A diferença é uma instalação separada, com domínio e banco próprios e `DEMO_MODE=true` no `.env`. Com `DEMO_MODE=false` (padrão) nada disso existe.

## Como funciona

| Item | Comportamento |
|---|---|
| Login (`/login`) | Pede nome, e-mail ou telefone, empresa (opcional) e aceite de contato. Sem senha. |
| Primeiro acesso | Entra como administrador (`DEMO_INITIAL_ROLE`). |
| Troca de perfil | Barra fixa no rodapé: Administrador, Consultor, Cliente e Produtor. |
| Somente leitura | O servidor recusa qualquer POST/PUT/PATCH/DELETE e as telas de cadastro/edição (middleware `DemoMode`). A tela esmaece os botões de ação e mostra o aviso "Acesso de teste". |
| Recuperação de senha | Desativada; volta para o acesso de demonstração. |
| Rotinas agendadas | Desativadas (sem importar e-mails, consultar o Mercado Pago, gerar alertas ou lembretes). Só a limpeza de PDFs temporários continua. |
| Visitantes | Gravados em `demo_visitors`: nome, e-mail, telefone, empresa, origem (UTM), visitas, telas vistas, perfis usados, primeiro e último acesso. |

Links com `?utm_source=...&utm_medium=...&utm_campaign=...` registram a origem do visitante (ex.: `https://demo.seudominio.com.br/login?utm_source=linkedin&utm_campaign=lancamento`).

## Dados claramente fictícios

O `MarketingDemoSeeder` termina chamando o `MarkFictitiousDataSeeder`, que pode ser executado sozinho a qualquer momento (não duplica marcações):

| Dado | Exemplo |
|---|---|
| Pessoas e consultores | Carlos Eduardo Silva (fictício) |
| Empresas, usinas e endereços | Padaria Pão de Ouro LTDA (fictícia) |
| CPF / CNPJ | 000.000.012-00 / 00.000.012/0001-00 |
| Telefones | (20) 9 0000-0012 (DDD 20 não existe no Brasil) |
| Pix copia e cola | recebedor "EMPRESA FICTICIA", cidade "DEMONSTRACAO" |
| Faturas | PDF marcado como "documento de demonstração com dados fictícios" |

## Propostas em PDF

Na demonstração, o PDF da proposta usa o modelo novo (`resources/views/pdf/propostas/commercial-proposal-modern.blade.php`): capa, números com comparativo e benefícios/condições, com nome, logotipo e cores da Identidade Visual. Fora da demonstração continua o modelo original.

A proposta de produtor também tem modelo novo (`producer-proposal-modern.blade.php`, gerado em `consultor.propostas.produtor.pdf`): capa com receita mensal e retorno, composição do kWh, projeção de receita por ano e condições. Na demonstração a tela mostra esse PDF; fora dela, a tela segue com o modelo antigo. Os valores dependem da tarifa GD da concessionária — `DemoTariffSeeder` preenche as que estão zeradas.

## Publicar a instância de demonstração

1. Novo domínio/subdomínio (ex.: `demo.seudominio.com.br`) apontando para uma cópia do código.
2. Banco de dados **exclusivo** (nunca o de produção).
3. `.env` da demonstração:
   ```dotenv
   APP_NAME="Nome da Plataforma"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://demo.seudominio.com.br

   DEMO_MODE=true
   DEMO_LEADS_TOKEN=uma-chave-longa-e-secreta

   MAIL_MAILER=log
   ```
   Sem credenciais reais de Mercado Pago, IMAP ou SMTP.
4. Criar e popular o banco:
   ```bash
   php artisan migrate --seed --force
   php artisan db:seed --class=MarketingDemoSeeder --force
   ```
   O `DatabaseSeeder` cria a base inicial (admin, consultores, clientes de demonstração) e o `MarketingDemoSeeder` acrescenta ~18 meses de operação fictícia em vários estados.
5. Identidade visual: como os visitantes não conseguem salvar alterações, configure nome, cores e logotipo **antes** de ligar o `DEMO_MODE` (ou com ele desligado temporariamente), entrando como `admin@teste.com` / `1020`.
6. Não configurar o cron do agendador nem o worker da fila (não há o que processar).

Para renovar os dados (por exemplo, a cada mês, para as datas acompanharem o calendário), repita o passo 4 com `php artisan migrate:fresh --seed --force` seguido do `MarketingDemoSeeder`. Isso apaga também os visitantes: exporte-os antes.

## Visitantes para a equipe de vendas

- **Planilha (CSV):** `https://demo.seudominio.com.br/demo/visitantes.csv?token=DEMO_LEADS_TOKEN` (abre no Excel; sem o token correto responde 404).
- **No servidor:**
  ```bash
  php artisan demo:visitantes                          # tabela na tela
  php artisan demo:visitantes visitantes.csv            # arquivo CSV
  php artisan demo:visitantes --desde=2026-10-01        # só a partir de uma data
  ```

## Perfis usados na demonstração

Cada perfil entra numa conta da base fictícia, configurável no `.env`:

| Perfil | Variável | Padrão |
|---|---|---|
| Administrador | `DEMO_USER_ADMIN` | `admin@teste.com` |
| Consultor | `DEMO_USER_CONSULTOR` | `joao.consultor@demo.com` |
| Cliente | `DEMO_USER_CLIENTE` | `sabor.serra@cliente.demo` |
| Produtor | `DEMO_USER_PRODUTOR` | `sertao.solar@cliente.demo` |

Se a conta não existir, é usado o primeiro usuário do perfil.

## Onde está no código

- `config/demo.php`: chave de ativação, contas por perfil, token e rotas POST de leitura liberadas.
- `app/Http/Middleware/DemoMode.php`: somente leitura no servidor e contagem de telas vistas.
- `app/Services/Demo/DemoAccessService.php`: registro do visitante, entrada e troca de perfil.
- `app/Http/Controllers/Demo/`: acesso, troca de perfil e exportação; `routes/demo.php`.
- `resources/js/Pages/Demo/Access.jsx`, `resources/js/Components/Demo/DemoBar.jsx` e `resources/js/Demo/demoGuard.js`: tela de acesso, barra de perfis e esmaecimento dos botões.
- `tests/Feature/Demo/DemoModeTest.php`.

Ao criar uma rota POST que só **lê** dados (ex.: gerar um PDF para visualizar), inclua o nome dela em `readonly_post_routes` no `config/demo.php`; caso contrário ela será bloqueada na demonstração.

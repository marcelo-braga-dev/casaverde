# 03 — Ambiente de laboratório

O aluno usa a própria plataforma (GD Solar ERP) durante as aulas. Este documento define **como** — e o que precisa ser desenvolvido para isso, porque hoje a plataforma tem dois modos que não servem sozinhos para aula:

| Modo atual | Por que não basta |
|-----------|--------------------|
| Produção (normal) | Uma empresa por instalação; dar acesso de admin a vários alunos mistura os dados de todos |
| Demonstração (`DEMO_MODE`) | Somente leitura — o aluno não consegue cadastrar, gerar cobrança nem aprovar fatura |

## O que o aluno precisa fazer na plataforma

| Ação dos laboratórios | Perfil necessário hoje |
|-----------------------|------------------------|
| Cadastrar clientes, UCs, propostas, contratos, vínculos | Consultor (carteira própria) ou admin |
| Cadastrar produtor, proposta de produtor e usina | Consultor ou admin |
| Upload, revisão e aprovação de fatura | **Só admin** |
| Gerar cobrança, ajustar, emitir Pix/boleto | Consultor (carteira própria) ou admin |
| Registrar geração da usina, quadro de onboarding da usina | **Só admin** |
| Concessionárias e tarifa GD, configurações (desconto padrão, taxa de administração) | **Só admin** |
| Cockpit executivo, alertas de sistema, Identidade Visual, integrações | **Só admin** |
| Ver o portal do cliente e do produtor | Cliente / Produtor |

Conclusão (o consultor cobre cerca de metade dos laboratórios; faturas, geração e configurações são só do admin): o aluno precisa ser **admin da própria empresa** e conseguir **trocar de perfil** (como na demonstração) para ver o portal do cliente e do produtor.

## Acesso do aluno à plataforma (decisão de 2026-10-29)

Cada aluno recebe **1 mês de acesso gratuito (teste)** à plataforma para usar durante o curso; depois disso, o uso continua mediante **assinatura** da plataforma. Implicações para o `LAB_MODE`: expiração automática do ambiente do aluno após 30 dias (backlog item 10), aviso antes de expirar e caminho de conversão para a assinatura (manter os dados do aluno ao assinar). **Não citar nos roteiros das aulas por enquanto.**

## Arquitetura recomendada: `LAB_MODE` com uma empresa por aluno

**Uma instância lógica por aluno**, com banco próprio, criada automaticamente na matrícula:

- endereço `aluno-123.lab.<dominio>` (ou `lab.<dominio>/a/123`);
- **mesmo código** da plataforma; um middleware escolhe a conexão de banco pelo subdomínio (banco por aluno — MySQL ou SQLite);
- **gravável** (ao contrário do `DEMO_MODE`), mas com **barra de troca de perfil** reaproveitada do `DEMO_MODE` (`Components/Demo/DemoBar.jsx`, `DemoAccessService`);
- aluno entra com o próprio e-mail/senha como **Administrador** e alterna para Consultor, Cliente e Produtor da sua empresa.

Por que essa opção:
- os roteiros ficam simples ("entre como Administrador da sua empresa…");
- nenhum aluno vê dado de outro;
- o reset é por aluno (apagar e recriar um banco);
- o modo empresa (in-company) usa a mesma estrutura com a Identidade Visual da empresa cliente.

### Alternativa para a turma piloto (sem desenvolvimento)

Uma instância comum por turma, sem `DEMO_MODE`:
- cada aluno recebe um usuário **Consultor** (o isolamento de carteira já existe e é testado em `tests/Feature/Security/AccessIsolationTest.php`) — cobre os laboratórios de produtor, usina, cliente, proposta, contrato, vínculo e cobrança;
- as partes só de admin (tarifa GD, configurações, geração da usina, faturas de concessionária, Kanban, cockpit, Identidade Visual) são **demonstradas pelo instrutor** nas gravações e no ao vivo;
- reset da instância ao fim da turma.

## Backlog de desenvolvimento do `LAB_MODE`

| # | Item | Prioridade |
|---|------|-----------|
| 1 | `LAB_MODE=true` em `config/lab.php`: desliga agendamentos externos (IMAP, sync real), mantém fila e alertas | Alta |
| 2 | Banco por aluno escolhido pelo subdomínio (middleware + conexão dinâmica) e comando `lab:provisionar {email}` que cria banco, roda migrations e o seeder do curso | Alta |
| 3 | `CourseLabSeeder`: empresa do aluno vazia + dados-padrão do curso (concessionária com tarifa GD, 1 produtor e 1 usina de referência, 3 clientes-exemplo, 6 faturas PDF fictícias do formato suportado pelo parser) — reaproveita `DemoBillPdf`, `DemoPix` e `MarkFictitiousDataSeeder` | Alta |
| 4 | Troca de perfil no laboratório (reaproveitar a barra do `DEMO_MODE`, sem o bloqueio de escrita) | Alta |
| 5 | **Caixa de e-mails do laboratório**: e-mails que o sistema enviaria ao cliente (convite, boleto emitido, lembrete) aparecem numa tela "E-mails enviados" em vez de sair | Média |
| 6 | **Pagamento simulado**: provider `lab` que imita o Mercado Pago (gera Pix copia e cola fictício e boleto PDF, e um botão "simular pagamento" que dispara o mesmo fluxo de webhook) — evita depender de credenciais sandbox do Mercado Pago para cada aluno | Alta |
| 7 | **Avançar o tempo**: comando/botão "avançar N dias" para o laboratório de vencimento e boleto vencido (M8 aula 7) e fechamento do mês (M9) — roda as rotinas de vencida, expiração e lembretes com a data simulada | Média |
| 8 | Botão "reiniciar meu laboratório" (recria o banco do aluno) e "carregar checkpoint do módulo X" (dados prontos até o módulo anterior, para quem chega atrasado) | Média |
| 9 | Banner fixo "Ambiente de aula — dados fictícios" e bloqueio de envio externo (WhatsApp segue como link) | Baixa |
| 10 | Expiração automática do ambiente após o mês gratuito, aviso prévio, conversão para assinatura mantendo os dados, e exportação do projeto final (PDF dos relatórios) | Alta |
| 11 | PDFs de proposta no modelo novo (`commercial-proposal-modern`/`producer-proposal-modern`) também no `LAB_MODE` — hoje o modelo novo de proposta de cliente só é usado com `DEMO_MODE` | Alta |

Itens 6 e 7 são os que mais melhoram a aula: sem eles, pagamento e vencimento ficam só demonstrados.

## Mapa de menus (perfil Administrador)

Referência para os roteiros — os laboratórios citam estes caminhos:

| Grupo | Itens |
|-------|-------|
| Cliente Consumidor | Clientes · Propostas · Contratos · Unidades Consumidoras |
| Produtores Solar | Produtores · Propostas |
| Usinas Solar | Usinas · Blocos de Usinas · Onboarding de Usinas · Gestão de Energia · Geração Mensal |
| Financeiro | Faturas de Concessionárias · Cobranças de Faturas · Gestão de Cobranças · Pagamentos · Bancos |
| Relatórios | Relatório Geral · Alertas Operacionais · Clientes · Financeiro · Cobranças · Pagamentos · Usinas · Executivo |
| Usuários | Consultores Cadastrados · Administradores |
| Whatsapp | Templates de Mensagens · Whatsapp App · Respostas Automáticas |
| Suporte | Todos os Chamados |
| Configurações | Configurações Padrão · Concessionárias · Identidade Visual |
| Integrações | Configurações de Integração · Histórico de Importação |

O Cockpit executivo é o item **Relatórios → Relatório Geral**. O quadro de onboarding de usinas (7 etapas, arrastar e soltar) é **Usinas Solar → Onboarding de Usinas**, só admin.
Portal do cliente: Visão Geral · Minhas Faturas · Minhas Cobranças · Meus Contratos · Relatório de Economia · Meu Perfil · Suporte.

## Dados-padrão do curso (o "caso contínuo")

Todos os alunos começam com a mesma base para que as gravações de tela batam com o que o aluno vê:

| Dado | Valor-padrão |
|------|--------------|
| Concessionária | "Distribuidora Exemplo" (formato de fatura do parser atual), tarifa GD de exemplo R$ 0,80/kWh **[CONFERIR valor de referência ao gravar]** |
| Configurações | desconto padrão ao cliente 20%; taxa de administração do produtor 15% |
| Produtor de referência | "Sítio Sol Nascente (fictício)", PF |
| Usina de referência | "UFV Sol Nascente I", 500 kWp, geração média 60.000 kWh/mês |
| Clientes-exemplo | Padaria (comercial, trifásico, ~2.500 kWh/mês), Clínica (comercial, ~4.000 kWh/mês), Residência (residencial, bifásico, ~450 kWh/mês) |
| Faturas | 2 meses de faturas fictícias por cliente-exemplo, em PDF |

O aluno cria a **própria** empresa por cima disso ao longo do curso (o projeto final pede uma segunda usina e 20+ clientes).

## Mercado Pago no laboratório

Sem o provider simulado (item 6), usar **uma** conta sandbox do curso:
- e-mail do pagador precisa terminar em `@testuser.com` — o seeder do curso cadastra os clientes-exemplo assim;
- Pix com `first_name: APRO` aprova sozinho em alguns minutos; boleto sandbox não liquida (só valida a emissão);
- detalhes em `MERCADO_PAGO.md` (raiz do projeto).

## Suporte ao aluno no laboratório

- FAQ de laboratório na comunidade (erros mais comuns: fatura de outro formato, UC não encontrada, cobrança sem vínculo).
- Monitor com acesso de leitura às instâncias dos alunos (somente no `LAB_MODE`).
- "Checkpoint do módulo" para quem perdeu dados.

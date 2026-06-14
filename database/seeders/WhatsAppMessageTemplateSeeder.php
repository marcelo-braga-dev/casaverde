<?php

namespace Database\Seeders;

use App\Models\WhatsApp\WhatsAppMessageTemplate;
use Illuminate\Database\Seeder;

class WhatsAppMessageTemplateSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->templates() as $template) {
            WhatsAppMessageTemplate::query()->updateOrCreate(
                ['key' => $template['key']],
                $template,
            );
        }
    }

    private function templates(): array
    {
        return [
            [
                'key' => 'falar_consultor',
                'name' => 'Falar com consultor',
                'category' => 'Cliente',
                'message' => 'Olá {{consultor_nome}}, sou {{cliente_nome}} (usina {{usina_nome}}) e gostaria de falar sobre minha fatura de {{mes_referencia}}.',
                'available_variables' => ['consultor_nome', 'cliente_nome', 'usina_nome', 'mes_referencia'],
                'is_active' => true,
            ],
            [
                'key' => 'convite_ativacao',
                'name' => 'Convite de ativação de cadastro',
                'category' => 'Cadastro',
                'message' => "Olá {{nome}}! 👋 Seu acesso à plataforma Casa Verde está pronto.\n\nPara criar sua senha e acessar sua área exclusiva, é só clicar no link abaixo:\n{{link_ativacao}}\n\nQualquer dúvida, estou à disposição!",
                'available_variables' => ['nome', 'link_ativacao'],
                'is_active' => true,
            ],
            [
                'key' => 'compartilhar_proposta',
                'name' => 'Compartilhar proposta comercial',
                'category' => 'Proposta',
                'message' => "Olá {{cliente_nome}}! 📄 Segue sua proposta comercial de energia solar por assinatura.\n\nAcesse o documento completo aqui: {{link_proposta}}\n\nFico à disposição para esclarecer qualquer dúvida e seguirmos com a contratação!",
                'available_variables' => ['cliente_nome', 'link_proposta'],
                'is_active' => true,
            ],
            [
                'key' => 'lembrete_vencimento',
                'name' => 'Lembrete de fatura próxima do vencimento',
                'category' => 'Financeiro',
                'message' => "Olá {{cliente_nome}}! 🔔 Sua fatura referente a {{mes_referencia}} no valor de {{valor_fatura}} vence em {{data_vencimento}}.\n\nPara evitar juros e manter sua economia em dia, garanta o pagamento até a data de vencimento. Qualquer dúvida, é só chamar!",
                'available_variables' => ['cliente_nome', 'mes_referencia', 'valor_fatura', 'data_vencimento'],
                'is_active' => true,
            ],
            [
                'key' => 'fatura_vencida',
                'name' => 'Fatura vencida / atraso de pagamento',
                'category' => 'Financeiro',
                'message' => "Olá {{cliente_nome}}, identificamos que sua fatura de {{mes_referencia}} no valor de {{valor_fatura}} venceu em {{data_vencimento}} e ainda está pendente. ⚠️\n\nPor favor, regularize o pagamento o quanto antes para evitar a suspensão dos benefícios. Se você já efetuou o pagamento, pode desconsiderar esta mensagem.",
                'available_variables' => ['cliente_nome', 'mes_referencia', 'valor_fatura', 'data_vencimento'],
                'is_active' => true,
            ],
            [
                'key' => 'pagamento_confirmado',
                'name' => 'Confirmação de pagamento recebido',
                'category' => 'Financeiro',
                'message' => "Olá {{cliente_nome}}! ✅ Confirmamos o recebimento do pagamento da fatura de {{mes_referencia}}, no valor de {{valor_fatura}}.\n\nObrigado por manter seu pagamento em dia! Você está contribuindo para um futuro mais sustentável. 🌱",
                'available_variables' => ['cliente_nome', 'mes_referencia', 'valor_fatura'],
                'is_active' => true,
            ],
            [
                'key' => 'boas_vindas',
                'name' => 'Boas-vindas / ativação de cadastro',
                'category' => 'Cadastro',
                'message' => "Olá {{nome}}! 🎉 Seja muito bem-vindo(a) à Casa Verde!\n\nSeu cadastro foi realizado com sucesso e agora você já pode acompanhar suas faturas, sua economia e muito mais direto pela plataforma.\n\nQualquer dúvida, conte com {{consultor_nome}} para te ajudar!",
                'available_variables' => ['nome', 'consultor_nome'],
                'is_active' => true,
            ],
            [
                'key' => 'proposta_enviada',
                'name' => 'Proposta comercial enviada',
                'category' => 'Proposta',
                'message' => "Olá {{cliente_nome}}! 📋 Sua proposta comercial já está disponível na plataforma.\n\nAcesse pelo link abaixo para conferir os detalhes e a economia estimada:\n{{link_proposta}}\n\nEstou à disposição para tirar dúvidas e seguirmos com os próximos passos!",
                'available_variables' => ['cliente_nome', 'link_proposta'],
                'is_active' => true,
            ],
            [
                'key' => 'atualizacao_contrato',
                'name' => 'Atualização de status de contrato',
                'category' => 'Contrato',
                'message' => "Olá {{cliente_nome}}! 📑 Seu contrato {{numero_contrato}} teve o status atualizado para: {{status_contrato}}.\n\nQualquer dúvida sobre essa atualização, estou à disposição para te ajudar.",
                'available_variables' => ['cliente_nome', 'numero_contrato', 'status_contrato'],
                'is_active' => true,
            ],
            [
                'key' => 'documentos_pendentes',
                'name' => 'Solicitação de documentos pendentes',
                'category' => 'Cadastro',
                'message' => "Olá {{nome}}! 📎 Para darmos continuidade ao seu cadastro/análise, precisamos que você envie os seguintes documentos pendentes:\n{{lista_documentos}}\n\nVocê pode enviá-los por aqui mesmo ou direto pela plataforma. Assim que recebermos, seguimos com o processo!",
                'available_variables' => ['nome', 'lista_documentos'],
                'is_active' => true,
            ],
        ];
    }
}

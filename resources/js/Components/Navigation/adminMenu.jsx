import React from 'react';
import {
    IconBrandWhatsapp,
    IconChartHistogram,
    IconHeadset,
    IconPlug,
    IconReportMoney,
    IconSettings, IconSolarPanel2, IconUser,
    IconUserBolt,
    IconUserCog,
    IconUserDollar,
    IconUsers,
    IconUserSquare,
} from '@tabler/icons-react';

function safeRoute(routeName, params = undefined) {
    try {
        if (typeof route === 'function' && route().has(routeName)) {
            return route(routeName, params);
        }

        return '#';
    } catch {
        return '#';
    }
}

export const adminMenu = [
    {
        title: 'Cliente Consumidor',
        icon: <IconUsers />,
        id: 'clientes',
        cor: 'orange',
        subItems: [
            {
                id: 'cliente-index',
                title: 'Clientes',
                link: safeRoute('consultor.user.cliente.index'),
            },
            {
                id: 'propostas-cliente-index',
                title: 'Propostas',
                link: safeRoute('consultor.propostas.cliente.index'),
            },
            {
                id: 'clientes-contratos',
                title: 'Contratos',
                link: safeRoute('consultor.cliente.contratos.index'),
            },
            {
                id: 'consumer-units-index',
                title: 'Unidades Consumidoras',
                link: safeRoute('consultor.cliente.consumer-units.index'),
            },
        ],
    },
    {
        title: 'Produtores Solar',
        icon: <IconUserBolt />,
        id: 'produtores',
        cor: 'blue',
        subItems: [
            // {
            //     id: 'producer-leads-index',
            //     title: 'Produtores',
            //     link: safeRoute('consultor.producer.leads.index'),
            // },
            // {
            //     id: 'produtores-solar-cadastrados',
            //     title: 'Produtores',
            //     link: safeRoute('auth.produtor.index'),
            // },
            {
                id: 'produtores-profile',
                title: 'Produtores',
                link: safeRoute('consultor.producer.profiles.index'),
            },
            {
                id: 'produtores-propostas',
                title: 'Propostas',
                link: safeRoute('consultor.propostas.produtor.index'),
            },
            // {
            //     id: 'produtores-propostas',
            //     title: '_Propostas Produtor',
            //     link: safeRoute('auth.produtor.proposta.index'),
            // },
        ],
    },
    {
        title: 'Usinas Solar',
        icon: <IconSolarPanel2/>,
        id: 'usinas-solar',
        cor: 'blue',
        subItems: [
            {
                id: 'usinas-index',
                title: 'Usinas',
                link: safeRoute('consultor.producer.usinas.index'),
            },
            {
                id: 'usinas-block',
                title: 'Blocos de Usinas',
                link: safeRoute('consultor.producer.usina-blocks.index'),
            },
            {id: 'usinas-gestao', title: 'Gestão de Energia', link: safeRoute('admin.usinas.management')},
            // {id: 'usinas-vinculos', title: 'Alocação Cliente/Usina', link: safeRoute('admin.usinas.links.index')},
            {id: 'usinas-geracao', title: 'Geração Mensal', link: safeRoute('admin.usinas.generation.index')},
        ],
    },
    {
        title: 'Financeiro',
        icon: <IconReportMoney />,
        id: 'financeiro',
        subItems: [
            {
                id: 'financeiro-faturas',
                title: 'Faturas de Concessionárias',
                link: safeRoute('admin.relatorios.faturas'),
            },
            {
                id: 'financeiro-cobrancas',
                title: 'Cobranças de Faturas',
                link: safeRoute('admin.financeiro.cobrancas.index'),
            },
            {
                id: 'gestao-cobrancas',
                title: 'Gestão de Cobranças',
                link: safeRoute('admin.financeiro.management.index'),
            },
            {
                id: 'financeiro-pagamentos',
                title: 'Pagamentos',
                link: safeRoute('admin.financeiro.pagamentos.index'),
            },
            {
                id: 'financeiro-bancos',
                title: 'Bancos',
                link: safeRoute('admin.financeiro.payment-provider-accounts.index'),
            },
        ],
    },
    {
        title: 'Relatórios',
        icon: <IconChartHistogram />,
        id: 'relatorios',
        subItems: [
            {
                id: 'admin-cockpit-executive',
                title: 'Relatório Geral',
                link: safeRoute('admin.cockpit.executive'),
            },
            {
                id: 'alertas-operacionais',
                title: 'Alertas Operacionais',
                link: route('admin.operational-alerts.index')},
            {
                id: 'relatorios-clientes',
                title: 'Clientes',
                link: safeRoute('admin.relatorios.clientes'),
            },
            {
                id: 'relatorios-financeiro',
                title: 'Financeiro',
                link: safeRoute('admin.relatorios.financeiro'),
            },
            {
                id: 'relatorios-cobrancas',
                title: 'Cobranças',
                link: safeRoute('admin.relatorios.cobrancas'),
            },
            {
                id: 'relatorios-pagamentos',
                title: 'Pagamentos',
                link: safeRoute('admin.relatorios.pagamentos'),
            },
            {
                id: 'relatorios-usinas',
                title: 'Usinas',
                link: safeRoute('admin.relatorios.usinas'),
            },
            {
                id: 'relatorios-executivo',
                title: 'Executivo',
                link: safeRoute('admin.relatorios.executivo'),
            },
        ],
    },
    {
        title: 'Usuários',
        icon: <IconUser />,
        id: 'usuarios',
        cor: 'green',
        subItems: [
            {
                id: 'consultores-cadastrados',
                title: 'Consultores Cadastrados',
                link: safeRoute('admin.user.consultor.index'),
            },
            {
                id: 'admin-cadastrados',
                title: 'Administradores',
                link: safeRoute('admin.user.admin.index'),
            },
        ],
    },

    {
        title: 'Whatsapp',
        icon: <IconBrandWhatsapp />,
        id: 'whatsapp',
        subItems: [
            {
                id: 'whatsapp-templates',
                title: 'Templates de Mensagens',
                link: safeRoute('admin.whatsapp.templates.index'),
            },
            {
                id: 'whatsapp-chat',
                title: 'Whatsapp App',
                link: safeRoute('auth.ferramentas.whatsapp.chat.index'),
            },
            {
                id: 'whatsapp-chatbot',
                title: 'Respostas Automáticas',
                link: safeRoute('auth.ferramentas.whatsapp.chatbot.index'),
            },
        ],
    },
    {
        title: 'Suporte',
        icon: <IconHeadset />,
        id: 'suporte',
        subItems: [
            {
                id: 'suporte-tickets',
                title: 'Todos os Chamados',
                link: safeRoute('support.tickets.index'),
            },
        ],
    },
    {
        title: 'Configurações',
        icon: <IconSettings />,
        id: 'config',
        subItems: [
            {
                id: 'config-defaults',
                title: 'Configurações Padrão',
                link: safeRoute('admin.settings.index'),
            },
            {
                id: 'config-concessionarias',
                title: 'Concessionárias',
                link: safeRoute('admin.concessionaria.index'),
            },
            {
                id: 'config-brand-identity',
                title: 'Identidade Visual',
                link: safeRoute('admin.brand-identity.index'),
            },
        ],
    },
    {
        title: 'Integrações',
        icon: <IconPlug />,
        id: 'integracoes',
        subItems: [
            {
                id: 'config-integracao',
                title: 'Configurações de Integração',
                link: safeRoute('admin.integracao.index'),
            },
            {
                id: 'config-import-history',
                title: 'Histórico de Importação',
                link: safeRoute('admin.import-history.index'),
            },
        ],
    },
    {
        title: 'Perfil',
        icon: <IconUserSquare />,
        id: 'perfil',
        subItems: [
            {
                id: 'perfil-usuario',
                title: 'Sua Conta',
                link: safeRoute('auth.perfil.usuario.index'),
            },
        ],
    },
];

export default adminMenu;

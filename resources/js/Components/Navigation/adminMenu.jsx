import React from 'react';
import {
    IconBrandWhatsapp,
    IconChartHistogram,
    IconHeadset,
    IconReportMoney,
    IconSettings,
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
                id: 'cliente-faturas',
                title: 'Faturas',
                link: safeRoute('consultor.cliente.faturas.index'),
            },
            {
                id: 'clientes-contratos',
                title: 'Contratos',
                link: safeRoute('consultor.cliente.contratos.index'),
            },
            {
                id: 'clientes-propostas',
                title: '_Propostas Cliente',
                link: safeRoute('auth.cliente.proposta.index'),
            },
        ],
    },
    {
        title: 'Produtores Solar',
        icon: <IconUserBolt />,
        id: 'produtores-solar',
        cor: 'blue',
        subItems: [
            {
                id: 'producer-leads-index',
                title: 'Lead',
                link: safeRoute('consultor.producer.leads.index'),
            },
            {
                id: 'produtores-solar-cadastrados',
                title: 'Produtores',
                link: safeRoute('auth.produtor.index'),
            },
            {
                id: 'producer-profiles-index',
                title: 'Contrato Produtor',
                link: safeRoute('consultor.producer.profiles.index'),
            },
            {
                id: 'usinas-index',
                title: 'Usinas',
                link: safeRoute('consultor.producer.usinas.index'),
            },
            {
                id: 'usinas-block-index',
                title: 'Blocos de Usinas',
                link: safeRoute('consultor.producer.usina-blocks.index'),
            },
            {
                id: 'produtores-propostas',
                title: 'Propostas Produtor',
                link: safeRoute('auth.produtor.proposta.index'),
            },
        ],
    },
    {
        title: 'Consultores',
        icon: <IconUserDollar />,
        id: 'vendedores',
        cor: 'green',
        subItems: [
            {
                id: 'vendedores-cadastrados',
                title: 'Consultores Cadastrados',
                link: safeRoute('admin.user.vendedor.index'),
            },
            {
                id: 'vendedores-cadastrar',
                title: 'Cadastrar Consultor',
                link: safeRoute('admin.user.vendedor.create'),
            },
        ],
    },
    {
        title: 'Administradores',
        icon: <IconUserCog />,
        id: 'admin',
        cor: 'brown',
        subItems: [],
    },
    {
        title: 'Financeiro',
        icon: <IconReportMoney />,
        id: 'financeiro',
        subItems: [
            {
                id: 'financeiro-cobrancas',
                title: 'Cobranças de Faturas',
                link: safeRoute('admin.financeiro.cobrancas.index'),
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
                id: 'relatorios-faturas',
                title: 'Faturas',
                link: safeRoute('admin.relatorios.faturas'),
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
                id: 'relatorios-clientes',
                title: 'Clientes',
                link: safeRoute('admin.relatorios.clientes'),
            },
            {
                id: 'relatorios-executivo',
                title: 'Executivo',
                link: safeRoute('admin.relatorios.executivo'),
            },
        ],
    },
    {
        title: 'Whatsapp',
        icon: <IconBrandWhatsapp />,
        id: 'whatsapp',
        subItems: [
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
                id: 'suporte-produtores',
                title: 'Suporte Geral',
                link: safeRoute('auth.suporte.produtor.index'),
            },
        ],
    },
    {
        title: 'Configurações',
        icon: <IconSettings />,
        id: 'config',
        subItems: [],
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

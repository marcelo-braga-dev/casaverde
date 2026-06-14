import React from 'react';
import {
    IconBrandWhatsapp,
    IconChartBar,
    IconFileText,
    IconHeadset,
    IconLayoutDashboard,
    IconSolarPanel2,
    IconUserBolt,
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

export const consultorMenu = [
    {
        title: 'Dashboard',
        icon: <IconLayoutDashboard />,
        id: 'consultor-dashboard',
        subItems: [
            {
                id: 'consultor-dashboard-home',
                title: 'Visão Geral',
                link: safeRoute('consultor.dashboard'),
            },
        ],
    },
    {
        title: 'Clientes',
        icon: <IconUsers />,
        id: 'clientes',
        subItems: [
            {
                id: 'cliente-index',
                title: 'Carteira de Clientes',
                link: safeRoute('consultor.user.cliente.index'),
            },
            {
                id: 'propostas-cliente-index',
                title: 'Propostas de Cliente',
                link: safeRoute('consultor.propostas.cliente.index'),
            },
            {
                id: 'clientes-contratos',
                title: 'Contratos',
                link: safeRoute('consultor.cliente.contratos.index'),
            },
            {
                id: 'clientes-faturas',
                title: 'Faturas de Concessionária',
                link: safeRoute('admin.relatorios.faturas'),
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
        subItems: [
            {
                id: 'produtores-profile',
                title: 'Produtores Cadastrados',
                link: safeRoute('consultor.producer.profiles.index'),
            },
            {
                id: 'produtores-propostas',
                title: 'Propostas de Produtor',
                link: safeRoute('consultor.propostas.produtor.index'),
            },
            {
                id: 'producer-leads-index',
                title: 'Leads de Produtor',
                link: safeRoute('consultor.producer.leads.index'),
            },
        ],
    },
    {
        title: 'Usinas Solar',
        icon: <IconSolarPanel2 />,
        id: 'usinas-solar',
        subItems: [
            {
                id: 'usinas-index',
                title: 'Usinas da Carteira',
                link: safeRoute('consultor.producer.usinas.index'),
            },
            {
                id: 'usinas-block',
                title: 'Blocos de Usina',
                link: safeRoute('consultor.producer.usina-blocks.index'),
            },
        ],
    },
    {
        title: 'Relatórios',
        icon: <IconChartBar />,
        id: 'relatorios',
        subItems: [
            {
                id: 'relatorios-clientes',
                title: 'Clientes',
                link: safeRoute('admin.relatorios.clientes'),
            },
            {
                id: 'relatorios-usinas',
                title: 'Usinas',
                link: safeRoute('admin.relatorios.usinas'),
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
                id: 'suporte-geral',
                title: 'Suporte Geral',
                link: safeRoute('support.tickets.index'),
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
                title: 'Minha Conta',
                link: safeRoute('auth.perfil.usuario.index'),
            },
        ],
    },
];

export default consultorMenu;

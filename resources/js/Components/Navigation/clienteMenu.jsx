import React from 'react';
import {
    IconBolt,
    IconChartBar,
    IconFileInvoice,
    IconHeadset,
    IconLayoutDashboard,
    IconUserSquare,
    IconWallet,
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

export const clienteMenu = [
    {
        title: 'Dashboard',
        icon: <IconLayoutDashboard />,
        id: 'cliente-dashboard',
        subItems: [
            {
                id: 'cliente-dashboard-home',
                title: 'Visão Geral',
                link: safeRoute('cliente.dashboard'),
            },
        ],
    },
    {
        title: 'Faturas de Energia',
        icon: <IconFileInvoice />,
        id: 'cliente-faturas',
        subItems: [
            {
                id: 'cliente-faturas-index',
                title: 'Minhas Faturas',
                link: safeRoute('cliente.faturas.index'),
            },
        ],
    },
    {
        title: 'Cobranças',
        icon: <IconWallet />,
        id: 'cliente-cobrancas',
        subItems: [
            {
                id: 'cliente-cobrancas-index',
                title: 'Minhas Cobranças',
                link: safeRoute('cliente.cobrancas.index'),
            },
        ],
    },
    {
        title: 'Relatórios',
        icon: <IconChartBar />,
        id: 'cliente-relatorios',
        subItems: [
            {
                id: 'cliente-relatorios-index',
                title: 'Central de Relatórios',
                link: safeRoute('cliente.relatorios.index'),
            },
            {
                id: 'cliente-relatorio-economia',
                title: 'Relatório de Economia',
                link: safeRoute('cliente.relatorios.economia'),
            },
        ],
    },
    {
        title: 'Contratos',
        icon: <IconBolt />,
        id: 'cliente-contratos',
        subItems: [
            {
                id: 'cliente-contratos-index',
                title: 'Meus Contratos',
                link: safeRoute('cliente.contratos.index'),
            },
        ],
    },
    {
        title: 'Suporte',
        icon: <IconHeadset />,
        id: 'cliente-suporte',
        subItems: [
            {
                id: 'cliente-suporte-index',
                title: 'Meus Chamados',
                link: safeRoute('support.tickets.index'),
            },
            {
                id: 'cliente-suporte-create',
                title: 'Abrir Chamado',
                link: safeRoute('support.tickets.create'),
            },
        ],
    },
    {
        title: 'Meu Perfil',
        icon: <IconUserSquare />,
        id: 'cliente-perfil',
        subItems: [
            {
                id: 'cliente-perfil-show',
                title: 'Meu Perfil',
                link: safeRoute('cliente.perfil.show'),
            },
            {
                id: 'cliente-conta',
                title: 'Dados de Acesso',
                link: safeRoute('auth.perfil.usuario.index'),
            },
        ],
    },
];

export default clienteMenu;

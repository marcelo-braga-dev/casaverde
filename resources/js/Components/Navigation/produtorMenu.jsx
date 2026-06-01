import React from 'react';
import {
    IconHeadset,
    IconLayoutDashboard,
    IconSolarPanel2,
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

export const produtorMenu = [
    {
        title: 'Dashboard',
        icon: <IconLayoutDashboard />,
        id: 'produtor-dashboard',
        subItems: [
            {
                id: 'produtor-dashboard-home',
                title: 'Visão Geral',
                link: safeRoute('produtor.dashboard'),
            },
        ],
    },
    {
        title: 'Minhas Usinas',
        icon: <IconSolarPanel2 />,
        id: 'produtor-usinas',
        subItems: [
            {
                id: 'produtor-usinas-index',
                title: 'Usinas Cadastradas',
                link: safeRoute('produtor.usinas.index'),
            },
        ],
    },
    {
        title: 'Suporte',
        icon: <IconHeadset />,
        id: 'produtor-suporte',
        subItems: [
            {
                id: 'produtor-suporte-index',
                title: 'Meus Chamados',
                link: safeRoute('support.tickets.index'),
            },
            {
                id: 'produtor-suporte-create',
                title: 'Abrir Chamado',
                link: safeRoute('support.tickets.create'),
            },
        ],
    },
    {
        title: 'Meu Perfil',
        icon: <IconUserSquare />,
        id: 'produtor-perfil',
        subItems: [
            {
                id: 'produtor-perfil-usuario',
                title: 'Meu Perfil',
                link: safeRoute('auth.perfil.usuario.index'),
            },
        ],
    },
];

export default produtorMenu;

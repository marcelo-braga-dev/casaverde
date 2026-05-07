import {
    IconBuildingBank,
    IconChartBar,
    IconCircleCheck,
    IconClipboardList,
    IconDashboard,
    IconFileInvoice,
    IconFileText,
    IconHomeEco,
    IconMailCog,
    IconPlant2,
    IconReportAnalytics,
    IconReportMoney,
    IconSettings,
    IconSolarPanel,
    IconUserCog,
    IconUsers,
    IconUserStar,
    IconWallet,
} from '@tabler/icons-react';

export const ROLES = {
    ADMIN: 1,
    CONSULTOR: 2,
    PRODUTOR: 3,
    CLIENTE: 4,
};

const adminConsultor = [ROLES.ADMIN, ROLES.CONSULTOR];

const menuItems = [
    {
        title: 'Principal',
        items: [
            {
                title: 'Dashboard',
                routeName: 'dashboard',
                icon: IconDashboard,
                roles: [ROLES.ADMIN, ROLES.CONSULTOR, ROLES.PRODUTOR, ROLES.CLIENTE],
            },
        ],
    },

    {
        title: 'Comercial',
        roles: adminConsultor,
        items: [
            {
                title: 'Clientes',
                routeName: 'consultor.user.cliente.index',
                icon: IconUsers,
                roles: adminConsultor,
            },
            {
                title: 'Propostas',
                routeName: 'consultor.propostas.cliente.index',
                icon: IconFileText,
                roles: adminConsultor,
            },
            {
                title: 'Contratos',
                routeName: 'consultor.cliente.contratos.index',
                icon: IconCircleCheck,
                roles: adminConsultor,
            },
            {
                title: 'Atividades',
                routeName: 'consultor.atividades.index',
                icon: IconClipboardList,
                roles: adminConsultor,
            },
        ],
    },

    {
        title: 'Energia',
        roles: adminConsultor,
        items: [
            {
                title: 'Usinas',
                routeName: 'consultor.producer.usinas.index',
                icon: IconSolarPanel,
                roles: adminConsultor,
            },
            {
                title: 'Produtores',
                routeName: 'consultor.producer.profile.index',
                icon: IconUserStar,
                roles: adminConsultor,
            },
            {
                title: 'Geração',
                routeName: 'consultor.energia.geracao.index',
                icon: IconChartBar,
                roles: adminConsultor,
            },
        ],
    },

    {
        title: 'Operação',
        roles: adminConsultor,
        items: [
            {
                title: 'Faturas',
                routeName: 'consultor.cliente.faturas.index',
                icon: IconFileInvoice,
                roles: adminConsultor,
            },
            {
                title: 'Importação por E-mail',
                routeName: 'consultor.cliente.email-import-settings.index',
                icon: IconMailCog,
                roles: adminConsultor,
            },
            {
                title: 'Financeiro',
                routeName: 'consultor.financeiro.index',
                icon: IconWallet,
                roles: adminConsultor,
            },
            {
                title: 'Relatórios',
                routeName: 'consultor.relatorios.index',
                icon: IconReportAnalytics,
                roles: adminConsultor,
            },
        ],
    },

    {
        title: 'Portal Cliente',
        roles: [ROLES.CLIENTE],
        items: [
            {
                title: 'Minha Energia',
                routeName: 'cliente.dashboard',
                icon: IconHomeEco,
                roles: [ROLES.CLIENTE],
            },
            {
                title: 'Minhas Faturas',
                routeName: 'cliente.faturas.index',
                icon: IconFileInvoice,
                roles: [ROLES.CLIENTE],
            },
            {
                title: 'Meu Contrato',
                routeName: 'cliente.contrato.show',
                icon: IconFileText,
                roles: [ROLES.CLIENTE],
            },
        ],
    },

    {
        title: 'Portal Produtor',
        roles: [ROLES.PRODUTOR],
        items: [
            {
                title: 'Minhas Usinas',
                routeName: 'producer.usinas.index',
                icon: IconPlant2,
                roles: [ROLES.PRODUTOR],
            },
            {
                title: 'Geração',
                routeName: 'producer.geracao.index',
                icon: IconChartBar,
                roles: [ROLES.PRODUTOR],
            },
            {
                title: 'Repasses',
                routeName: 'producer.repasses.index',
                icon: IconReportMoney,
                roles: [ROLES.PRODUTOR],
            },
        ],
    },

    {
        title: 'Administração',
        roles: [ROLES.ADMIN],
        items: [
            {
                title: 'Usuários',
                routeName: 'admin.users.index',
                icon: IconUserCog,
                roles: [ROLES.ADMIN],
            },
            {
                title: 'Concessionárias',
                routeName: 'admin.concessionarias.index',
                icon: IconBuildingBank,
                roles: [ROLES.ADMIN],
            },
            {
                title: 'Configurações',
                routeName: 'admin.settings.index',
                icon: IconSettings,
                roles: [ROLES.ADMIN],
            },
        ],
    },
];

export default menuItems;

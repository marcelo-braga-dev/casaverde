import React from "react";
import {
    IconBolt,
    IconBrandWhatsapp,
    IconHeadset, IconReportMoney, IconSettings,
    IconUserBolt,
    IconUserCog,
    IconUserDollar,
    IconUsers,
    IconUserSquare
} from "@tabler/icons-react";

export const adminMenu = [
    {
        title: 'Cliente Consumidor',
        icon: <IconUsers/>,
        id: 'clientes',
        cor: 'orange',
        subItems: [
            {id: 'cliente-index', title: 'Clientes', link: route('consultor.user.cliente.index')},
            {id: 'propostas-cliente-index', title: 'Propostas', link: route('consultor.propostas.cliente.index')},
            {id: 'cliente-faturas', title: 'Faturas', link: route('consultor.cliente.faturas.index')},

            {id: 'clientes-propostas', title: 'Propostas Cliente', link: route('auth.cliente.proposta.index')},
        ],
    }, {
        title: 'Produtores Solar',
        icon: <IconUserBolt/>,
        id: 'produtores-solar',
        cor: 'blue',
        subItems: [
            {id: 'producer-leads-index', title: 'Lead', link: route('consultor.producer.leads.index')},
            {id: 'produtores-solar-cadastrados', title: 'Produtores', link: route('auth.produtor.index')},
            {id: 'producer-profiles-index', title: 'Contrato Produtor', link: route('consultor.producer.profiles.index')},
            {id: 'usinas-index', title: 'Usinas', link: route('consultor.producer.usinas.index')},
            {id: 'usinas-block-index', title: 'Blocos de Usinas', link: route('consultor.producer.usina-blocks.index')},
            {id: 'produtores-propostas', title: 'Propostas Produtor', link: route('auth.produtor.proposta.index')},
        ],
    },
    {
        title: 'Consultores',
        icon: <IconUserDollar/>,
        id: 'vendedores',
        cor: 'green',
        subItems: [
            {id: 'vendedores-cadastrados', title: 'Consultores Cadastrados', link: route('admin.user.vendedor.index')},
            {id: 'vendedores-cadastrar', title: 'Cadastrar Consultor', link: route('admin.user.vendedor.create')},
        ],
    }, {
        title: 'Administradores',
        icon: <IconUserCog/>,
        id: 'admin',
        cor: 'brown',
        subItems: [
            //{id: 'admin-cadastrados', title: 'Admins Cadastrados', link: route('admin.user.admin.index')},
            //{id: 'admin-cadastrar', title: 'Cadastrar Admins', link: route('admin.user.admin.create')},
        ],
    }, {
        title: 'Financeiro',
        icon: <IconReportMoney/>,
        id: 'financeiro',
        subItems: [
            //{id: 'financeiro-produtor', title: 'Fluxo de Caixa', link: route('admin.financeiro.produtor.index')},
        ],
    }, {
        title: 'Concessionárias Energia',
        icon: <IconBolt/>,
        id: 'concessionarias',
        subItems: [
            //{id: 'concessionarias-todas', title: 'Todas Concessionárias', link: route('admin.concessionaria.index')},
        ],
    },
    // {
    //     title: 'Relatórios',
    //     icon: <IconChartHistogram/>,
    //     id: 'dashboards',
    //     subItems: [
    //         {id: 'dashboards-cadastrados', title: 'Produtores', link: route('admin.produtor.store')},
    //         {id: 'dashboards-cadastrar', title: 'Clientes', link: route('admin.produtor.show', 1)},
    //         {id: 'dashboards-cadastrar', title: 'Usinas', link: route('admin.produtor.show', 1)},
    //         {id: 'dashboards-cadastrar', title: 'Consultores', link: route('admin.produtor.show', 1)},
    //     ],
    // },
    // {
    //     title: 'Contratos',
    //     icon: <IconFileLike/>,
    //     id: 'contratos',
    //     subItems: [
    //         {id: 'contratos-usinas', title: 'Contratos Usinas', link: route('auth.contratos.usina.index')},
    //         {id: 'contratos-clientes', title: 'Contratos Clientes', link: route('auth.contratos.cliente.index')},
    //     ],
    // },
    {
        title: 'Whatsapp',
        icon: <IconBrandWhatsapp/>,
        id: 'whatsapp',
        subItems: [
            {id: 'whatsapp-chat', title: 'Whatsapp App', link: route('auth.ferramentas.whatsapp.chat.index')},
            {id: 'whatsapp-chatbot', title: 'Respostas Automáticas', link: route('auth.ferramentas.whatsapp.chatbot.index')},
        ],
    }, {
        title: 'Suporte',
        icon: <IconHeadset/>,
        id: 'suporte',
        subItems: [
            {id: 'suporte-produtores', title: 'Suporte Geral', link: route('auth.suporte.produtor.index')},
        ],
    },
    {
        title: 'Configurações',
        icon: <IconSettings/>,
        id: 'config',
        subItems: [
            //{id: 'config-geral', title: 'Configurações Gerais', link: route('admin.config.geral.index')},
        ],
    },{
        title: 'Perfil',
        icon: <IconUserSquare/>,
        id: 'perfil',
        subItems: [
            {id: 'perfil-usuario', title: 'Sua Conta', link: route('auth.perfil.usuario.index')},
        ],
    },
];

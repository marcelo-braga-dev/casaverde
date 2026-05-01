import React from 'react';
import SideMenu from "./Drawer/DrawerMenu.jsx";
import {MenuProvider} from "./Drawer/DrawerContext.jsx";
import Navbar from "./Header/Navbar.jsx";
import {Head, usePage} from "@inertiajs/react";
import {useActiveMenu} from "@/Utils/Drawer/activeMenuUtils.jsx";
import {SnackbarProvider} from "@/Contexts/Alerts/SnackbarProvider.jsx";
import Body from "@/Layouts/UserLayout/Body/Body.jsx";
import Box from "@mui/material/Box";

const menuItems = [
    {
        title: "Clientes",
        items: [
            //{ label: "Lista de clientes", href: route("admin.user.cliente.index") },
        ],
    },
    {
        title: "Propostas",
        items: [
            //{ label: "Lista de propostas", href: route("admin.propostas.index") },
            //{ label: "Nova proposta", href: route("admin.propostas.create") },
        ],
    },
    {
        title: "Faturas",
        items: [
            //{ label: "Lista de faturas", href: route("admin.faturas.index") },
            //{ label: "Nova fatura", href: route("admin.faturas.create") },
        ],
    },
    {
        title: "Usinas",
        items: [
            //{ label: "Lista de usinas", href: route("admin.usinas.index") },
            //{ label: "Blocos de usina", href: route("admin.usina-blocks.index") },
            //{ label: "Concessionárias", href: route("admin.concessionarias.index") },
        ],
    },
    {
        title: "Estrutura",
        items: [
            //{ label: "Endereços", href: route("admin.addresses.index") },
            //{ label: "Perfis de produtor", href: route("admin.producer-profiles.index") },
            //{ label: "Leads de produtor", href: route("admin.producer-leads.index") },
        ],
    },
];

const Layout = ({titlePage, menu, subMenu, backPage, children}) => {

    const alert = usePage().props.alert
    const errors = usePage().props.errors

    useActiveMenu(titlePage, menu, subMenu)

    return (
        <MenuProvider menu={menu} subMenu={subMenu}>
            <SnackbarProvider initialAlert={alert} errors={errors}>
                <Head title={titlePage ?? ''}/>
                <Navbar titlePage={titlePage ?? ''} backPage={backPage}/>
                <Box style={{display: 'flex', backgroundColor: '#f5f5f5'}}>
                    <SideMenu/>
                    <Body content={children}/>
                </Box>
            </SnackbarProvider>
        </MenuProvider>
    );
};

export default Layout;

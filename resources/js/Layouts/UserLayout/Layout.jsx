import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { SnackbarProvider } from '@/Contexts/Alerts/SnackbarProvider.jsx';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext.jsx';
import AppShell from '@/Layouts/AppShell/AppShell';

const Layout = ({
                    titlePage,
                    menu,
                    subMenu,
                    children,
                    subtitle,
                    actions,
                    breadcrumbs = [],
                }) => {
    const alert = usePage().props.alert;
    const errors = usePage().props.errors;

    const { setMenuDrawer } = useMenuDrawer();

    useEffect(() => {
        setMenuDrawer(titlePage, menu, subMenu, subtitle);
    }, [titlePage, menu, subMenu, subtitle]);

    return (
        <SnackbarProvider initialAlert={alert} errors={errors}>
            <Head title={titlePage ?? ''} />

            <AppShell
                title={titlePage ?? ''}
                subtitle={subtitle}
                actions={actions}
                breadcrumbs={
                    breadcrumbs.length
                        ? breadcrumbs
                        : [
                            { label: menu || 'Casa Verde' },
                            { label: titlePage || 'Página' },
                        ]
                }
            >
                {children}
            </AppShell>
        </SnackbarProvider>
    );
};

export default Layout;

import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { SnackbarProvider } from '@/Contexts/Alerts/SnackbarProvider.jsx';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext.jsx';
import AppShell from '@/Layouts/AppShell/AppShell';
import useBrandName from '@/Hooks/useBrandName';

const Layout = ({
                    titlePage,
                    menu,
                    subMenu,
                    children,
                    subtitle,
                    actions,
                    breadcrumbs = [],
                }) => {
    const brandName = useBrandName();

    const { setMenuDrawer } = useMenuDrawer();

    const capitalizeWords = (value = '') => {
        return String(value)
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    useEffect(() => {
        setMenuDrawer(titlePage, menu, subMenu, subtitle);
    }, [titlePage, menu, subMenu, subtitle]);

    return (
        <SnackbarProvider>
            <Head title={titlePage ?? ''} />

            <AppShell
                title={titlePage ?? ''}
                subtitle={subtitle}
                actions={actions}
                breadcrumbs={
                    breadcrumbs.length
                        ? breadcrumbs
                        : [
                            { label: capitalizeWords(menu || brandName) },
                            { label: capitalizeWords(titlePage || 'Página') },
                        ]
                }
            >
                {children}
            </AppShell>
        </SnackbarProvider>
    );
};

export default Layout;

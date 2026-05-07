import React, { createContext, useContext, useMemo, useState } from 'react';

const DrawerContext = createContext(null);

export const useMenuDrawer = () => {
    const context = useContext(DrawerContext);

    if (!context) {
        throw new Error('useMenuDrawer deve ser usado dentro de DrawerProvider.');
    }

    return context;
};

export const DrawerProvider = ({ children }) => {
    const [titlePage, setTitlePage] = useState(null);
    const [subtitlePage, setSubtitlePage] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const setMenuDrawer = (
        title,
        menu = null,
        subMenu = null,
        subtitle = null,
    ) => {
        setTitlePage(title);
        setSubtitlePage(subtitle);
        setActiveMenu(menu);
        setActiveSubMenu(subMenu);
    };

    const openMobileDrawer = () => setMobileOpen(true);
    const closeMobileDrawer = () => setMobileOpen(false);
    const toggleMobileDrawer = () => setMobileOpen((current) => !current);
    const toggleCollapsed = () => setCollapsed((current) => !current);

    const value = useMemo(
        () => ({
            titlePage,
            subtitlePage,
            activeMenu,
            activeSubMenu,
            mobileOpen,
            collapsed,
            setTitlePage,
            setSubtitlePage,
            setActiveMenu,
            setActiveSubMenu,
            setMenuDrawer,
            openMobileDrawer,
            closeMobileDrawer,
            toggleMobileDrawer,
            toggleCollapsed,
        }),
        [
            titlePage,
            subtitlePage,
            activeMenu,
            activeSubMenu,
            mobileOpen,
            collapsed,
        ],
    );

    return (
        <DrawerContext.Provider value={value}>
            {children}
        </DrawerContext.Provider>
    );
};

import { Box } from '@mui/material';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import AppMain from './AppMain';
import AppMobileDrawer from './AppMobileDrawer';

const EXPANDED_WIDTH = 304;
const COLLAPSED_WIDTH = 88;

export default function AppShell({
                                     children,
                                     title,
                                     subtitle,
                                     actions,
                                     breadcrumbs = [],
                                     maxWidth = '1680px',
                                 }) {
    const { collapsed } = useMenuDrawer();

    const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                display: 'flex',
                width: '100%',
            }}
        >
            <AppSidebar
                expandedWidth={EXPANDED_WIDTH}
                collapsedWidth={COLLAPSED_WIDTH}
            />

            <AppMobileDrawer />

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    width: {
                        xs: '100%',
                        lg: `calc(100% - ${sidebarWidth}px)`,
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 220ms ease',
                }}
            >
                <AppHeader
                    title={title}
                    subtitle={subtitle}
                    actions={actions}
                    breadcrumbs={breadcrumbs}
                />

                <AppMain maxWidth={maxWidth}>
                    {children}
                </AppMain>
            </Box>
        </Box>
    );
}

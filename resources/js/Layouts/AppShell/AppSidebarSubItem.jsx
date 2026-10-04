import { Box, Stack, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';

export default function AppSidebarSubItem({ item }) {
    const { activeSubMenu } = useMenuDrawer();

    const isActive  = activeSubMenu === item.id;
    const disabled  = !item.link || item.link === '#';

    return (
        <Box
            component={disabled ? 'div' : Link}
            href={disabled ? undefined : item.link}
            sx={{
                display: 'block',
                textDecoration: 'none',
                color: 'var(--cv-sidebar-fg)',
                pointerEvents: disabled ? 'none' : 'auto',
                opacity: disabled ? 0.35 : 1,
                mb: 0.2,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                gap={1}
                sx={{
                    minHeight: 34,
                    px: 1.2,
                    borderRadius: 2,
                    transition: 'all 140ms cubic-bezier(0.4,0,0.2,1)',
                    bgcolor: isActive ? 'var(--cv-sidebar-sub-active-bg)' : 'transparent',
                    borderLeft: isActive
                        ? '2px solid var(--cv-sidebar-sub-active-border)'
                        : '2px solid transparent',
                    '&:hover': {
                        bgcolor: isActive
                            ? 'var(--cv-sidebar-sub-active-hover)'
                            : 'rgba(var(--cv-sidebar-fg-rgb), 0.06)',
                        transform: 'translateX(2px)',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        bgcolor: isActive ? 'var(--cv-sidebar-sub-dot)' : 'rgba(var(--cv-sidebar-fg-rgb), 0.30)',
                        flexShrink: 0,
                        transition: 'background-color 140ms ease',
                    }}
                />

                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.8125rem',
                        color: isActive ? 'var(--cv-sidebar-fg)' : 'rgba(var(--cv-sidebar-fg-rgb), 0.78)',
                        lineHeight: 1.3,
                    }}
                >
                    {item.title}
                </Typography>
            </Stack>
        </Box>
    );
}

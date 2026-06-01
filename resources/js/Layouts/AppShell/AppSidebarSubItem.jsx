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
                color: '#FFFFFF',
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
                    bgcolor: isActive
                        ? 'rgba(74,222,128,0.14)'
                        : 'transparent',
                    borderLeft: isActive
                        ? '2px solid rgba(74,222,128,0.80)'
                        : '2px solid transparent',
                    '&:hover': {
                        bgcolor: isActive
                            ? 'rgba(74,222,128,0.18)'
                            : 'rgba(255,255,255,0.06)',
                        transform: 'translateX(2px)',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        bgcolor: isActive ? '#4ade80' : 'rgba(255,255,255,0.30)',
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
                        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.78)',
                        lineHeight: 1.3,
                    }}
                >
                    {item.title}
                </Typography>
            </Stack>
        </Box>
    );
}

import { Box, Stack, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import { IconPointFilled } from '@tabler/icons-react';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';

export default function AppSidebarSubItem({ item }) {
    const { activeSubMenu } = useMenuDrawer();

    const isActive = activeSubMenu === item.id;
    const disabled = !item.link || item.link === '#';

    return (
        <Box
            component={disabled ? 'div' : Link}
            href={disabled ? undefined : item.link}
            sx={{
                display: 'block',
                textDecoration: 'none',
                color: '#FFFFFF',
                pointerEvents: disabled ? 'none' : 'auto',
                opacity: disabled ? 0.38 : 1,
                mb: 0.25,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                gap={0.9}
                sx={{
                    minHeight: 36,
                    px: 1,
                    borderRadius: 2.4,
                    transition: 'all 150ms ease',
                    bgcolor: isActive
                        ? 'rgba(16,185,129,0.18)'
                        : 'transparent',
                    '&:hover': {
                        bgcolor: isActive
                            ? 'rgba(16,185,129,0.22)'
                            : 'rgba(255,255,255,0.06)',
                        transform: 'translateX(2px)',
                    },
                }}
            >
                <IconPointFilled
                    size={15}
                    color={isActive ? '#10B981' : 'rgba(255,255,255,0.32)'}
                />

                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        fontWeight: isActive ? 850 : 650,
                        fontSize: 13,
                        color: '#FFFFFF',
                    }}
                >
                    {item.title}
                </Typography>
            </Stack>
        </Box>
    );
}

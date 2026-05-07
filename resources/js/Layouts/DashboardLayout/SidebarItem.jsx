import { Box, Stack, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';

function canUseRoute(routeName) {
    try {
        return typeof route === 'function' && route().has(routeName);
    } catch {
        return false;
    }
}

function isActiveRoute(routeName) {
    try {
        return route().current(routeName) || route().current(`${routeName}.*`);
    } catch {
        return false;
    }
}

export default function SidebarItem({ item }) {
    const Icon = item.icon;
    const hasRoute = canUseRoute(item.routeName);
    const href = hasRoute ? route(item.routeName) : '#';
    const active = hasRoute ? isActiveRoute(item.routeName) : false;

    return (
        <Box
            component={hasRoute ? Link : 'div'}
            href={href}
            sx={{
                display: 'block',
                textDecoration: 'none',
                color: '#FFFFFF',
                opacity: hasRoute ? 1 : 0.45,
                pointerEvents: hasRoute ? 'auto' : 'none',
                mb: 0.4,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                gap={1.4}
                sx={{
                    px: 1.4,
                    py: 1.15,
                    borderRadius: 3,
                    position: 'relative',
                    transition: 'all 170ms ease',
                    background: active
                        ? 'linear-gradient(135deg, rgba(22,163,74,0.95), rgba(14,165,233,0.80))'
                        : 'transparent',
                    boxShadow: active
                        ? '0 14px 30px rgba(14, 165, 233, 0.18)'
                        : 'none',
                    '&:hover': {
                        background: active
                            ? 'linear-gradient(135deg, rgba(22,163,74,1), rgba(14,165,233,0.86))'
                            : 'rgba(255,255,255,0.07)',
                        transform: 'translateX(2px)',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: active
                            ? 'rgba(255,255,255,0.16)'
                            : 'rgba(255,255,255,0.07)',
                    }}
                >
                    {Icon && <Icon size={20} />}
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: active ? 850 : 650,
                        color: active ? '#FFFFFF' : 'rgba(255,255,255,0.76)',
                    }}
                >
                    {item.title}
                </Typography>
            </Stack>
        </Box>
    );
}

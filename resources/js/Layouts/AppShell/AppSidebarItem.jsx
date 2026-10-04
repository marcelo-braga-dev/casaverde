import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';

function routeExists(routeName) {
    try {
        return typeof route === 'function' && route().has(routeName);
    } catch {
        return false;
    }
}

function isCurrent(routeName) {
    try {
        return route().current(routeName) || route().current(`${routeName}.*`);
    } catch {
        return false;
    }
}

export default function AppSidebarItem({ item, collapsed }) {
    const Icon = item.icon;
    const exists = routeExists(item.routeName);
    const active = exists && isCurrent(item.routeName);
    const href = exists ? route(item.routeName) : '#';

    const content = (
        <Box
            component={exists ? Link : 'div'}
            href={href}
            sx={{
                display: 'block',
                pointerEvents: exists ? 'auto' : 'none',
                opacity: exists ? 1 : 0.35,
                color: 'var(--cv-sidebar-fg)',
                textDecoration: 'none',
                mb: 0.45,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent={collapsed ? 'center' : 'flex-start'}
                gap={1.35}
                sx={{
                    minHeight: 46,
                    px: collapsed ? 1 : 1.35,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 180ms ease',
                    background: active ? 'var(--cv-sidebar-active-bg)' : 'transparent',
                    boxShadow: active ? 'var(--cv-sidebar-active-shadow)' : 'none',
                    '&:before': active
                        ? {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 9,
                            bottom: 9,
                            width: 3,
                            borderRadius: 999,
                            bgcolor: 'var(--cv-sidebar-active-fg)',
                        }
                        : {},
                    '&:hover': {
                        background: active
                            ? 'var(--cv-sidebar-active-bg-hover)'
                            : 'rgba(var(--cv-sidebar-fg-rgb), 0.07)',
                        transform: collapsed ? 'none' : 'translateX(2px)',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: active ? 'var(--cv-sidebar-active-fg)' : 'rgba(var(--cv-sidebar-fg-rgb), 0.72)',
                        bgcolor: active
                            ? 'rgba(var(--cv-sidebar-fg-rgb), 0.18)'
                            : 'rgba(var(--cv-sidebar-fg-rgb), 0.06)',
                    }}
                >
                    {Icon && <Icon size={20} />}
                </Box>

                {!collapsed && (
                    <Typography
                        variant="body2"
                        noWrap
                        sx={{
                            fontWeight: active ? 900 : 700,
                            color: active ? 'var(--cv-sidebar-active-fg)' : 'rgba(var(--cv-sidebar-fg-rgb), 0.74)',
                        }}
                    >
                        {item.title}
                    </Typography>
                )}
            </Stack>
        </Box>
    );

    if (collapsed) {
        return (
            <Tooltip title={item.title} placement="right">
                {content}
            </Tooltip>
        );
    }

    return content;
}

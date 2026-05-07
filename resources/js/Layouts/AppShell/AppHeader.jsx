import {
    Badge,
    Box,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import {
    IconBell,
    IconMenu2,
    IconRefresh,
    IconSearch,
} from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';
import AppUserMenu from './AppUserMenu';
import AppBreadcrumbs from './AppBreadcrumbs';

export default function AppHeader({
                                      title,
                                      subtitle,
                                      actions,
                                      breadcrumbs = [],
                                  }) {
    const { auth } = usePage().props;
    const { toggleMobileDrawer } = useMenuDrawer();

    return (
        <Box
            component="header"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 120,
                backdropFilter: 'blur(18px)',
                backgroundColor: 'background.header',
                borderBottom: '1px solid',
                borderColor: 'divider',
                boxShadow: 'customShadows.header',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                        lg: 3,
                        xl: 4,
                    },
                    py: 1.5,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1.5}
                        sx={{ minWidth: 0 }}
                    >
                        <IconButton
                            onClick={toggleMobileDrawer}
                            sx={{
                                display: { xs: 'inline-flex', lg: 'none' },
                                bgcolor: 'grey.100',
                            }}
                        >
                            <IconMenu2 size={22} />
                        </IconButton>

                        <Box sx={{ minWidth: 0 }}>
                            {breadcrumbs.length > 0 && (
                                <AppBreadcrumbs items={breadcrumbs} />
                            )}

                            <Typography
                                variant="h5"
                                noWrap
                                sx={{
                                    mt: breadcrumbs.length > 0 ? 0.4 : 0,
                                    fontWeight: 900,
                                    letterSpacing: '-0.045em',
                                }}
                            >
                                {title || 'Casa Verde'}
                            </Typography>

                            {subtitle && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                width: {
                                    md: 280,
                                    xl: 380,
                                },
                                height: 42,
                                px: 1.5,
                                gap: 1,
                                borderRadius: 999,
                                bgcolor: 'grey.100',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <IconSearch size={18} color="#64748B" />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 600 }}
                            >
                                Buscar clientes, faturas, propostas...
                            </Typography>
                        </Box>

                        {actions}

                        <IconButton
                            sx={{
                                width: 42,
                                height: 42,
                                bgcolor: 'grey.100',
                                display: { xs: 'none', sm: 'inline-flex' },
                            }}
                        >
                            <IconRefresh size={20} />
                        </IconButton>

                        <IconButton
                            sx={{
                                width: 42,
                                height: 42,
                                bgcolor: 'grey.100',
                            }}
                        >
                            <Badge color="error" variant="dot">
                                <IconBell size={20} />
                            </Badge>
                        </IconButton>

                        <AppUserMenu user={auth?.user} />
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}

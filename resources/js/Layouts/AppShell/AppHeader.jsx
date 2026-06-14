import { Box, IconButton, Stack, Typography } from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';
import AppUserMenu from './AppUserMenu';
import AppBreadcrumbs from './AppBreadcrumbs';
import AppHeaderShortcuts from './AppHeaderShortcuts';

export default function AppHeader({ title, subtitle, actions, breadcrumbs = [] }) {
    const { auth } = usePage().props;
    const { toggleMobileDrawer } = useMenuDrawer();

    return (
        <Box
            component="header"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 120,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255,255,255,0.90)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
                width: '100%',
            }}
        >
            <Box sx={{ px: { xs: 2, sm: 3, xl: 4 }, py: 1.25 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                >
                    {/* ── Esquerda: menu mobile + título ────────── */}
                    <Stack direction="row" alignItems="center" gap={1.2} sx={{ minWidth: 0 }}>
                        <IconButton
                            onClick={toggleMobileDrawer}
                            size="small"
                            sx={{
                                display: { xs: 'inline-flex', lg: 'none' },
                                bgcolor: 'grey.100',
                                borderRadius: 2,
                                width: 36,
                                height: 36,
                            }}
                        >
                            <IconMenu2 size={20} />
                        </IconButton>

                        <Box sx={{ minWidth: 0 }}>
                            {breadcrumbs.length > 0 && (
                                <AppBreadcrumbs items={breadcrumbs} />
                            )}

                            <Typography
                                variant="h5"
                                noWrap
                                sx={{
                                    mt: breadcrumbs.length > 0 ? 0.2 : 0,
                                    fontWeight: 900,
                                    letterSpacing: '-0.045em',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    lineHeight: 1.25,
                                }}
                            >
                                {title || 'Casa Verde'}
                            </Typography>

                            {subtitle && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap
                                    sx={{ display: 'block', mt: 0.1 }}
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {/* ── Direita: ações + avatar ────────────────── */}
                    <Stack direction="row" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
                        {actions}
                        <AppHeaderShortcuts />
                        <AppUserMenu user={auth?.user} />
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}

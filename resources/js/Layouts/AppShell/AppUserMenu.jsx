import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { Link, router } from '@inertiajs/react';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { useState } from 'react';

function safeRoute(n) { try { return route(n); } catch { return '#'; } }

export default function AppUserMenu({ user }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const initials = user?.name
        ? user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
        : 'CV';

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                gap={1}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    cursor: 'pointer',
                    pl: 0.5,
                    pr: { xs: 0.5, xl: 1.2 },
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: 'grey.100',
                    border: '1.5px solid',
                    borderColor: 'divider',
                    transition: 'var(--cv-transition-fast)',
                    '&:hover': { bgcolor: 'grey.200', borderColor: 'grey.300' },
                    userSelect: 'none',
                }}
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 900,
                        fontSize: 12,
                    }}
                >
                    {initials}
                </Avatar>

                <Box sx={{ display: { xs: 'none', xl: 'block' }, mr: 0.3 }}>
                    <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{ lineHeight: 1.2, maxWidth: 140, fontWeight: 800 }}
                    >
                        {user?.name || 'Usuário'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                        {user?.role_name || 'Casa Verde'}
                    </Typography>
                </Box>
            </Stack>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        width: 220,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'var(--cv-shadow-lg)',
                        overflow: 'hidden',
                    },
                }}
            >
                {/* Info do usuário */}
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }} noWrap>
                        {user?.name || 'Usuário'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                        {user?.email || ''}
                    </Typography>
                </Box>

                <Divider />

                <MenuItem
                    component={Link}
                    href={safeRoute('auth.perfil.usuario.index')}
                    onClick={() => setAnchorEl(null)}
                    sx={{ py: 1.2, fontSize: '0.8125rem' }}
                >
                    <ListItemIcon><IconUser size={16} /></ListItemIcon>
                    Meu perfil
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={() => { setAnchorEl(null); router.post(route('logout')); }}
                    sx={{ py: 1.2, fontSize: '0.8125rem', color: 'error.main' }}
                >
                    <ListItemIcon sx={{ color: 'error.main' }}><IconLogout size={16} /></ListItemIcon>
                    Sair
                </MenuItem>
            </Menu>
        </>
    );
}

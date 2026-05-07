import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function UserMenu({ user }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'CV';

    function handleLogout() {
        router.post(route('logout'));
    }

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                gap={1}
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{
                    cursor: 'pointer',
                    pl: 1,
                    pr: 1.4,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: 'grey.100',
                    transition: 'all 160ms ease',
                    '&:hover': {
                        bgcolor: 'grey.200',
                    },
                }}
            >
                <Avatar
                    sx={{
                        width: 34,
                        height: 34,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 800,
                        fontSize: 13,
                    }}
                >
                    {initials}
                </Avatar>

                <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
                    <Typography variant="subtitle2" sx={{ lineHeight: 1.1 }}>
                        {user?.name || 'Usuário'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Casa Verde
                    </Typography>
                </Box>
            </Stack>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    sx: {
                        mt: 1,
                        width: 220,
                        borderRadius: 3,
                    },
                }}
            >
                <MenuItem>Meu perfil</MenuItem>
                <MenuItem>Configurações</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
        </>
    );
}

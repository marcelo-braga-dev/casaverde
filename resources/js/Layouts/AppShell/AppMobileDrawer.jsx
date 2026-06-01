import { Box, Drawer, Stack, Typography } from '@mui/material';
import { IconLeaf } from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';
import adminMenu from '@/Components/Navigation/adminMenu';
import consultorMenu from '@/Components/Navigation/consultorMenu';
import clienteMenu from '@/Components/Navigation/clienteMenu';
import produtorMenu from '@/Components/Navigation/produtorMenu';
import AppSidebarMenuGroup from './AppSidebarMenuGroup';

export default function AppMobileDrawer() {
    const { mobileOpen, closeMobileDrawer } = useMenuDrawer();
    const { auth } = usePage().props;
    const roleId = auth?.user?.role_id;
    const menuItems =
        roleId === 2 ? consultorMenu :
        roleId === 3 ? produtorMenu  :
        roleId === 4 ? clienteMenu   :
        adminMenu;

    return (
        <Drawer
            open={mobileOpen}
            onClose={closeMobileDrawer}
            sx={{
                display: { xs: 'block', lg: 'none' },
                '& .MuiDrawer-paper': {
                    width: 304,
                    border: 0,
                },
            }}
        >
            <Box
                sx={{
                    height: '100%',
                    color: '#FFFFFF',
                    background:
                        'radial-gradient(circle at 20% 0%, rgba(16,185,129,0.22), transparent 28%), linear-gradient(180deg, #0F172A 0%, #020617 100%)',
                    px: 1.5,
                    py: 2,
                    overflowY: 'auto',
                }}
            >
                <Stack direction="row" alignItems="center" gap={1.4} sx={{ px: 1, mb: 3 }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                                'linear-gradient(135deg, #10B981 0%, #0B7A53 100%)',
                        }}
                    >
                        <IconLeaf size={24} />
                    </Box>

                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 950, lineHeight: 1 }}>
                            Casa Verde
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.58)' }}
                        >
                            CRM / ERP Energia
                        </Typography>
                    </Box>
                </Stack>

                {menuItems.map((item) => (
                    <AppSidebarMenuGroup
                        key={item.id}
                        item={item}
                        collapsed={false}
                    />
                ))}
            </Box>
        </Drawer>
    );
}

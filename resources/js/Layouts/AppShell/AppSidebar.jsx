import {
    Box,
    Drawer,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    IconChevronLeft,
    IconChevronRight,
    IconLeaf,
} from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';
import adminMenu from '@/Components/Navigation/adminMenu';
import consultorMenu from '@/Components/Navigation/consultorMenu';
import clienteMenu from '@/Components/Navigation/clienteMenu';
import produtorMenu from '@/Components/Navigation/produtorMenu';
import AppSidebarMenuGroup from './AppSidebarMenuGroup';

export default function AppSidebar({ expandedWidth, collapsedWidth }) {
    const { collapsed, toggleCollapsed } = useMenuDrawer();
    const { auth, brand } = usePage().props;
    const roleId = auth?.user?.role_id;
    const brandName = brand?.name || 'Casa Verde';
    const brandLogoUrl = brand?.logo_url || '/storage/app/logotipo_casaverde.png';
    const menuItems =
        roleId === 2 ? consultorMenu :
        roleId === 3 ? produtorMenu  :
        roleId === 4 ? clienteMenu   :
        adminMenu;

    const width = collapsed ? collapsedWidth : expandedWidth;

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', lg: 'block' },
                width,
                flexShrink: 0,
                transition: 'width 220ms ease',
                '& .MuiDrawer-paper': {
                    width,
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    border: 0,
                    transition: 'width 220ms ease',
                    boxShadow: 'var(--cv-shadow-sidebar)',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: {
                        xs: 10,
                        lg: 25,
                    },
                    borderBottomRightRadius: {
                        xs: 10,
                        lg: 25,
                    },
                },
            }}
            open
        >
            <Box
                sx={{
                    height: '100vh',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#FFFFFF',
                    background: 'var(--cv-gradient-sidebar)',
                    borderRight: '1px solid rgba(255,255,255,0.10)',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--cv-sidebar-overlay)',
                        pointerEvents: 'none',
                    }}
                />

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent={collapsed ? 'center' : 'space-between'}
                    sx={{
                        px: collapsed ? 1 : 2.5,
                        py: 2.4,
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1.4}
                        sx={{ minWidth: 0 }}
                    >

                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                minWidth: 46,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                background: 'rgba(255,255,255,0.16)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                            }}
                        >
                            <Box
                                component="img"
                                src={brandLogoUrl}
                                alt={brandName}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                            />
                        </Box>

                        {!collapsed && (
                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    sx={{
                                        fontWeight: 950,
                                        lineHeight: 1,
                                        letterSpacing: '-0.04em',
                                    }}
                                >
                                    {brandName}
                                </Typography>
                            </Box>
                        )}
                    </Stack>

                    {!collapsed && (
                        <Tooltip title="Recolher menu">
                            <IconButton
                                onClick={toggleCollapsed}
                                sx={{
                                    color: 'rgba(255,255,255,0.82)',
                                    bgcolor: 'rgba(255,255,255,0.12)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.20)',
                                    },
                                }}
                            >
                                <IconChevronLeft size={18} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>

                {collapsed && (
                    <Box
                        sx={{
                            px: 1.6,
                            pb: 1,
                            flexShrink: 0,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <Tooltip title="Expandir menu" placement="right">
                            <IconButton
                                onClick={toggleCollapsed}
                                sx={{
                                    width: '100%',
                                    color: 'rgba(255,255,255,0.82)',
                                    bgcolor: 'rgba(255,255,255,0.12)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.20)',
                                    },
                                }}
                            >
                                <IconChevronRight size={18} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        px: collapsed ? 1 : 1.5,
                        pb: 2,
                        position: 'relative',
                        zIndex: 1,

                        '&::-webkit-scrollbar': {
                            width: 7,
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255,255,255,0.22)',
                            borderRadius: 999,
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: 'rgba(255,255,255,0.34)',
                        },
                    }}
                >
                    {menuItems.map((item) => (
                        <AppSidebarMenuGroup
                            key={item.id}
                            item={item}
                            collapsed={collapsed}
                        />
                    ))}
                </Box>
            </Box>
        </Drawer>
    );
}

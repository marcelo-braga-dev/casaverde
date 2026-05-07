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
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';
import adminMenu from '@/Components/Navigation/adminMenu';
import AppSidebarMenuGroup from './AppSidebarMenuGroup';

export default function AppSidebar({ expandedWidth, collapsedWidth }) {
    const { collapsed, toggleCollapsed } = useMenuDrawer();

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
                                borderRadius: 3.2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.16)',
                                boxShadow: '0 14px 32px rgba(0,0,0,0.16)',
                                border: '1px solid rgba(255,255,255,0.16)',
                            }}
                        >
                            <IconLeaf size={25} />
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
                                    Casa Verde
                                </Typography>

                                <Typography
                                    variant="caption"
                                    noWrap
                                    sx={{
                                        color: 'rgba(255,255,255,0.72)',
                                        fontWeight: 600,
                                    }}
                                >
                                    CRM / ERP Energia
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
                    {adminMenu.map((item) => (
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

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
                    position: 'relative',
                    transition: 'width 220ms ease',
                    overflowX: 'hidden',
                    border: 0,
                },
            }}
            open
        >
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#FFFFFF',
                    background:
                        'radial-gradient(circle at 20% 0%, rgba(16,185,129,0.22), transparent 28%), radial-gradient(circle at 95% 20%, rgba(2,132,199,0.18), transparent 28%), linear-gradient(180deg, #0F172A 0%, #020617 100%)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    borderTopRightRadius: {
                        xs: 0,
                        lg: 18,
                    },
                    borderBottomRightRadius: {
                        xs: 0,
                        lg: 18,
                    },
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent={collapsed ? 'center' : 'space-between'}
                    sx={{
                        px: collapsed ? 1 : 2.5,
                        py: 2.4,
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
                                borderRadius: 3.2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background:
                                    'linear-gradient(135deg, #10B981 0%, #0B7A53 100%)',
                                boxShadow: '0 18px 40px rgba(16,185,129,0.24)',
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
                                        color: 'rgba(255,255,255,0.55)',
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
                                    color: 'rgba(255,255,255,0.72)',
                                    bgcolor: 'rgba(255,255,255,0.06)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.12)',
                                    },
                                }}
                            >
                                <IconChevronLeft size={18} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>

                {collapsed && (
                    <Box sx={{ px: 1.6, pb: 1 }}>
                        <Tooltip title="Expandir menu" placement="right">
                            <IconButton
                                onClick={toggleCollapsed}
                                sx={{
                                    width: '100%',
                                    color: 'rgba(255,255,255,0.72)',
                                    bgcolor: 'rgba(255,255,255,0.06)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.12)',
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
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        px: collapsed ? 1 : 1.5,
                        pb: 2,
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

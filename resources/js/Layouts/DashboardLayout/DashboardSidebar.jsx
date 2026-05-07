import {
    Box,
    Drawer,
    Stack,
    Typography,
} from '@mui/material';
import { usePage } from '@inertiajs/react';
import menuItems from '@/Components/Navigation/menuItems';
import SidebarSection from './SidebarSection';

export default function DashboardSidebar({ drawerWidth }) {
    const { auth } = usePage().props;
    const roleId = Number(auth?.user?.role_id);

    const filteredSections = menuItems
        .map((section) => {
            const sectionAllowed = !section.roles || section.roles.includes(roleId);

            if (!sectionAllowed) {
                return null;
            }

            const items = section.items.filter((item) => {
                return !item.roles || item.roles.includes(roleId);
            });

            if (!items.length) {
                return null;
            }

            return {
                ...section,
                items,
            };
        })
        .filter(Boolean);

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', lg: 'block' },
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
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
                    background:
                        'radial-gradient(circle at top left, rgba(22,163,74,0.28), transparent 28%), linear-gradient(180deg, #0F172A 0%, #020617 100%)',
                    color: '#FFFFFF',
                }}
            >
                <Box sx={{ px: 3, py: 3 }}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: 3,
                                background:
                                    'linear-gradient(135deg, #0B7A53 0%, #16A34A 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 18px 36px rgba(22, 163, 74, 0.30)',
                                fontWeight: 900,
                                fontSize: 18,
                            }}
                        >
                            CV
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>
                                Casa Verde
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: 'rgba(255,255,255,0.58)' }}
                            >
                                Energia inteligente
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: 1.5,
                        pb: 3,
                    }}
                >
                    {filteredSections.map((section) => (
                        <SidebarSection key={section.title} section={section} />
                    ))}
                </Box>

                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            borderRadius: 4,
                            p: 2,
                            background:
                                'linear-gradient(135deg, rgba(11,122,83,0.24), rgba(14,165,233,0.18))',
                            border: '1px solid rgba(255,255,255,0.10)',
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            Plataforma CRM/ERP
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.60)' }}
                        >
                            Clientes, usinas, propostas, contratos e faturas em um só lugar.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}

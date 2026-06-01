import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconArrowRight,
    IconChartBar,
    IconFileExport,
    IconLeaf,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const REPORTS = [
    {
        id: 'economia',
        title: 'Relatório de Economia',
        description: 'Compare o que você pagaria à concessionária com o que paga na Casa Verde. Veja sua economia mês a mês com gráficos, totais e exportação em PDF/Excel.',
        route: 'cliente.relatorios.economia',
        badge: 'Principal',
        badgeColor: 'success',
        highlight: true,
    },
];

export default function Page({ profile, quickStats = {} }) {
    return (
        <Layout
            titlePage="Central de Relatórios"
            menu="cliente-relatorios"
            subMenu="cliente-relatorios-index"
            subtitle="Análises e exportações dos seus dados de energia."
            breadcrumbs={[{ label: 'Cliente' }, { label: 'Relatórios' }]}
        >
            <Head title="Central de Relatórios" />

            <Stack spacing={3}>
                {/* Hero */}
                <Card sx={{ background: 'linear-gradient(135deg,#064e3b,#065f46)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconChartBar size={26} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                    Central de Relatórios
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, mt: 0.4 }}>
                                    Veja o quanto você economiza, seu histórico de consumo e muito mais.
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Quick stats */}
                        {quickStats.total_savings > 0 && (
                            <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} sx={{ mt: 3 }}>
                                {[
                                    { label: 'Total economizado', value: formatMoney(quickStats.total_savings ?? 0) },
                                    { label: 'Total pago', value: formatMoney(quickStats.total_final ?? 0) },
                                    { label: 'Cobranças totais', value: String(quickStats.total_charges ?? 0) },
                                    { label: 'Faturas aprovadas', value: String(quickStats.total_bills ?? 0) },
                                ].map(item => (
                                    <Box key={item.label} sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{item.label}</Typography>
                                        <Typography sx={{ fontWeight: 950, fontSize: 16, mt: 0.3 }}>{item.value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                {/* Relatórios disponíveis */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 950, mb: 2, letterSpacing: '-0.04em' }}>
                        Relatórios Disponíveis
                    </Typography>

                    <Grid container spacing={2}>
                        {REPORTS.map(rep => (
                            <Grid key={rep.id} size={{ xs: 12, md: 6 }}>
                                <Card sx={{
                                    height: '100%',
                                    borderRadius: 'var(--cv-radius-xl)',
                                    border: rep.highlight ? '2px solid #10b981' : '1px solid var(--cv-border-soft)',
                                    boxShadow: rep.highlight ? '0 4px 20px rgba(16,185,129,0.15)' : 'var(--cv-shadow-md)',
                                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
                                }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1} sx={{ mb: 1.5 }}>
                                            <Box sx={{ width: 42, height: 42, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                                                <IconLeaf size={20} />
                                            </Box>
                                            {rep.badge && <Chip label={rep.badge} color={rep.badgeColor} size="small" />}
                                        </Stack>

                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em', mb: 0.5 }}>
                                            {rep.title}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2 }}>
                                            {rep.description}
                                        </Typography>

                                        <Divider sx={{ mb: 2 }} />

                                        <Stack direction="row" gap={1}>
                                            <Button
                                                component={Link}
                                                href={safeRoute(rep.route)}
                                                variant="contained"
                                                endIcon={<IconArrowRight size={15} />}
                                                sx={{ flex: 1 }}
                                            >
                                                Abrir relatório
                                            </Button>
                                            <Button
                                                component="a"
                                                href={safeRoute('cliente.relatorios.economia.pdf')}
                                                variant="outlined"
                                                startIcon={<IconFileExport size={15} />}
                                                size="small"
                                            >
                                                PDF
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Stack>
        </Layout>
    );
}

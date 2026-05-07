import Layout from '@/Layouts/UserLayout/Layout.jsx';
import ReportMetricCard from '@/Components/Reports/ReportMetricCard';
import ReportChartCard from '@/Components/Reports/ReportChartCard';
import GaugeProgressChart from '@/Components/Reports/charts/GaugeProgressChart';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';

import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconAlertTriangle,
    IconCash,
    IconChartHistogram,
    IconFileInvoice,
    IconReportAnalytics,
    IconSolarPanel,
    IconUsers,
} from '@tabler/icons-react';

function safeRoute(routeName) {
    try {
        if (typeof route === 'function' && route().has(routeName)) {
            return route(routeName);
        }

        return '#';
    } catch {
        return '#';
    }
}

export default function Page({ dashboard }) {
    const summary = dashboard?.summary || {};
    const quickReports = dashboard?.quickReports || [];

    const openAmount = Number(summary.charges_open_amount || 0);
    const overdueAmount = Number(summary.charges_overdue_amount || 0);
    const paidMonth = Number(summary.charges_paid_amount_month || 0);

    const totalFinancial = openAmount + overdueAmount + paidMonth;
    const paidRate = totalFinancial > 0 ? (paidMonth / totalFinancial) * 100 : 0;

    return (
        <Layout
            titlePage="Dashboard Admin"
            menu="dashboard"
            subMenu="admin-dashboard"
            subtitle="Resumo rápido da operação Casa Verde."
            breadcrumbs={[
                { label: 'Admin' },
                { label: 'Dashboard' },
            ]}
        >
            <Head title="Dashboard Admin" />

            <Stack spacing={3}>
                <Card
                    sx={{
                        background: 'var(--cv-gradient-hero)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--cv-radius-xl)',
                    }}
                >
                    <CardContent>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                            gap={2}
                        >
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 950,
                                        letterSpacing: '-0.05em',
                                    }}
                                >
                                    Visão Geral da Casa Verde
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.8,
                                        color: 'rgba(255,255,255,0.72)',
                                        maxWidth: 760,
                                    }}
                                >
                                    Acompanhe os principais indicadores da operação e acesse
                                    rapidamente os relatórios completos.
                                </Typography>
                            </Box>

                            <Button
                                component={Link}
                                href={safeRoute('admin.relatorios.executivo')}
                                variant="contained"
                                startIcon={<IconReportAnalytics size={18} />}
                                sx={{
                                    bgcolor: '#FFFFFF',
                                    color: 'var(--cv-primary-dark)',
                                    '&:hover': {
                                        bgcolor: 'grey.100',
                                    },
                                }}
                            >
                                Ver relatório executivo
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Clientes ativos"
                            value={summary.clients_active || 0}
                            helper={`${summary.clients_total || 0} clientes no total`}
                            icon={IconUsers}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Usinas"
                            value={summary.plants_total || 0}
                            helper="Usinas cadastradas"
                            icon={IconSolarPanel}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Faturas pendentes"
                            value={summary.bills_pending_review || 0}
                            helper="Aguardando revisão"
                            icon={IconFileInvoice}
                            color={summary.bills_pending_review > 0 ? 'warning.main' : 'success.main'}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Pagamentos com falha"
                            value={summary.failed_payments || 0}
                            helper="Exigem atenção"
                            icon={IconAlertTriangle}
                            color={summary.failed_payments > 0 ? 'error.main' : 'success.main'}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Recebido no mês"
                            value={formatMoney(summary.charges_paid_amount_month)}
                            helper="Cobranças pagas neste mês"
                            icon={IconCash}
                            color="success.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Em aberto"
                            value={formatMoney(summary.charges_open_amount)}
                            helper="Aguardando pagamento"
                            icon={IconCash}
                            color="warning.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Em atraso"
                            value={formatMoney(summary.charges_overdue_amount)}
                            helper="Cobranças vencidas"
                            icon={IconAlertTriangle}
                            color="error.main"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <ReportChartCard
                            title="Saúde financeira do mês"
                            subtitle="Percentual recebido sobre recebido + aberto + vencido."
                            height={320}
                        >
                            <GaugeProgressChart
                                value={paidRate}
                                label="Recebimento"
                                helper="Indicador simples para acompanhar o caixa mensal."
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 'var(--cv-radius-xl)',
                                border: '1px solid var(--cv-border-soft)',
                                boxShadow: 'var(--cv-shadow-md)',
                            }}
                        >
                            <CardContent>
                                <Stack
                                    direction={{ xs: 'column', md: 'row' }}
                                    justifyContent="space-between"
                                    alignItems={{ xs: 'flex-start', md: 'center' }}
                                    gap={2}
                                    sx={{ mb: 2 }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 950,
                                                letterSpacing: '-0.04em',
                                            }}
                                        >
                                            Relatórios completos
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Acesse as páginas detalhadas para análise completa.
                                        </Typography>
                                    </Box>

                                    <Button
                                        component={Link}
                                        href={safeRoute('admin.relatorios.executivo')}
                                        variant="outlined"
                                        startIcon={<IconChartHistogram size={18} />}
                                    >
                                        Central de relatórios
                                    </Button>
                                </Stack>

                                <Grid container spacing={1.5}>
                                    {quickReports.map((item) => (
                                        <Grid
                                            key={item.title}
                                            size={{ xs: 12, md: 6 }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 1.8,
                                                    height: '100%',
                                                    borderRadius: 1,
                                                    bgcolor: 'grey.50',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ fontWeight: 900 }}
                                                >
                                                    {item.title}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 0.5,
                                                        minHeight: 42,
                                                    }}
                                                >
                                                    {item.description}
                                                </Typography>

                                                <Button
                                                    component={Link}
                                                    href={safeRoute(item.route)}
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ mt: 1.5 }}
                                                >
                                                    Abrir relatório
                                                </Button>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

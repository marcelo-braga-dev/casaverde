import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, router, useForm } from '@inertiajs/react';
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconCash,
    IconFileInvoice,
    IconFileText,
    IconSolarPanel,
    IconUsers,
} from '@tabler/icons-react';

import ReportMetricCard from '@/Components/Reports/ReportMetricCard';
import ReportChartCard from '@/Components/Reports/ReportChartCard';
import MultiLineChart from '@/Components/Reports/charts/MultiLineChart';
import StatusDonutChart from '@/Components/Reports/charts/StatusDonutChart';
import HorizontalRankingChart from '@/Components/Reports/charts/HorizontalRankingChart';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';

export default function Page({ report, filters = {} }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || report?.range?.start_date || '',
        end_date: filters.end_date || report?.range?.end_date || '',
    });

    const submit = (e) => {
        e.preventDefault();

        get(route('admin.relatorios.executivo'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route('admin.relatorios.executivo'));
    };

    const summary = report?.summary || {};

    return (
        <Layout
            titlePage="Relatório Executivo"
            menu="relatorios"
            subMenu="relatorios-executivo"
            subtitle="Visão geral da operação comercial, financeira, energética e operacional."
            breadcrumbs={[
                { label: 'Relatórios' },
                { label: 'Executivo' },
            ]}
        >
            <Head title="Relatório Executivo" />

            <Stack spacing={3}>
                <Card
                    sx={{
                        background: 'var(--cv-gradient-hero)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--cv-radius-xl)',
                    }}
                >
                    <CardContent>
                        <Typography variant="h4" sx={{ fontWeight: 950 }}>
                            Central de Inteligência Casa Verde
                        </Typography>

                        <Typography sx={{ mt: 0.6, color: 'rgba(255,255,255,0.72)' }}>
                            Período: {report?.range?.label}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <form onSubmit={submit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        type="date"
                                        label="Data inicial"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        type="date"
                                        label="Data final"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Stack direction="row" spacing={2} height="100%" alignItems="center">
                                        <Button type="submit" variant="contained" disabled={processing}>
                                            Filtrar
                                        </Button>

                                        <Button type="button" variant="outlined" onClick={clearFilters}>
                                            Limpar
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
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
                            title="Propostas"
                            value={summary.proposals_total || 0}
                            helper="Emitidas no período"
                            icon={IconFileText}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Faturas"
                            value={summary.bills_total || 0}
                            helper="Importadas ou criadas no período"
                            icon={IconFileInvoice}
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

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Valor cobrado"
                            value={formatMoney(summary.charges_amount)}
                            helper={`${summary.charges_total || 0} cobranças`}
                            icon={IconCash}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Valor recebido"
                            value={formatMoney(summary.paid_amount)}
                            helper="Recebido no período"
                            icon={IconCash}
                            color="success.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Valor vencido"
                            value={formatMoney(summary.overdue_amount)}
                            helper="Cobranças em atraso"
                            icon={IconCash}
                            color="error.main"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <ReportChartCard
                            title="Evolução executiva financeira"
                            subtitle="Cobrado, recebido e vencido por mês."
                            height={370}
                        >
                            <MultiLineChart
                                data={report?.financialEvolution || []}
                                money
                                lines={[
                                    {
                                        dataKey: 'amount',
                                        name: 'Cobrado',
                                        color: '#2F7D18',
                                    },
                                    {
                                        dataKey: 'paid_amount',
                                        name: 'Recebido',
                                        color: '#4F9A2A',
                                    },
                                    {
                                        dataKey: 'overdue_amount',
                                        name: 'Vencido',
                                        color: '#C62828',
                                    },
                                ]}
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <ReportChartCard
                            title="Clientes por status"
                            subtitle="Situação comercial da carteira."
                            height={370}
                        >
                            <StatusDonutChart
                                data={report?.clientsByStatus || []}
                                valueKey="total"
                                statusKey="status"
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ReportChartCard
                            title="Propostas por status"
                            subtitle="Etapas comerciais no período."
                        >
                            <StatusDonutChart
                                data={report?.proposalsByStatus || []}
                                valueKey="total"
                                statusKey="status"
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ReportChartCard
                            title="Contratos por status"
                            subtitle="Situação dos contratos no período."
                        >
                            <StatusDonutChart
                                data={report?.contractsByStatus || []}
                                valueKey="total"
                                statusKey="status"
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ReportChartCard
                            title="Faturas por revisão"
                            subtitle="Status operacional das faturas."
                        >
                            <StatusDonutChart
                                data={report?.billsByReviewStatus || []}
                                valueKey="total"
                                statusKey="status"
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ReportChartCard
                            title="Usinas por status"
                            subtitle="Disponibilidade das usinas cadastradas."
                        >
                            <StatusDonutChart
                                data={report?.plantsByStatus || []}
                                valueKey="total"
                                statusKey="status"
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <ReportChartCard
                            title="Top clientes por valor cobrado"
                            subtitle="Clientes com maior volume financeiro no período."
                            height={420}
                        >
                            <HorizontalRankingChart
                                data={report?.topClientsByCharges || []}
                                labelKey="label"
                                valueKey="value"
                                money
                            />
                        </ReportChartCard>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

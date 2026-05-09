import Layout from '@/Layouts/UserLayout/Layout.jsx';
import ReportMetricCard from '@/Components/Reports/ReportMetricCard';
import ReportChartCard from '@/Components/Reports/ReportChartCard';
import ClientBillEconomyChart from '@/Components/Reports/charts/ClientBillEconomyChart';
import ClientConsumptionChart from '@/Components/Reports/charts/ClientConsumptionChart';
import StatusDonutChart from '@/Components/Reports/charts/StatusDonutChart';
import { formatMoney, formatNumber, formatPercent } from '@/Components/Reports/utils/chartFormatters';
import StatusChip from '@/Components/UI/StatusChip';

import { Head, router, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconBolt,
    IconCash,
    IconChartBar,
    IconDiscount,
    IconFileInvoice,
    IconLeaf,
} from '@tabler/icons-react';

export default function Page({ report, filters = {} }) {
    const { data, setData, get, processing } = useForm({
        client_id: filters.client_id || report?.selectedClient?.id || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const summary = report?.summary || {};
    const selectedClient = report?.selectedClient;
    const clients = report?.clients || [];

    function submit(e) {
        e.preventDefault();

        get(route('admin.relatorios.clientes.gestao'), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function clearFilters() {
        router.get(route('admin.relatorios.clientes.gestao'));
    }

    return (
        <Layout
            titlePage="Relatório de Clientes"
            menu="relatorios"
            subMenu="relatorios-clientes-gestao"
            subtitle="Análise individual de economia, faturas, consumo e valores pagos pelo cliente."
            breadcrumbs={[
                { label: 'Relatórios' },
                { label: 'Clientes' },
                { label: 'Gestão do Cliente' },
            ]}
        >
            <Head title="Relatório de Clientes" />

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
                            Relatório de Gestão do Cliente
                        </Typography>

                        <Typography sx={{ mt: 0.7, color: 'rgba(255,255,255,0.74)' }}>
                            Compare a fatura cheia da concessionária com o valor pago usando Casa Verde.
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <form onSubmit={submit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Cliente</InputLabel>

                                        <Select
                                            label="Cliente"
                                            value={data.client_id}
                                            onChange={(e) => setData('client_id', e.target.value)}
                                        >
                                            {clients.map((client) => (
                                                <MenuItem key={client.id} value={client.id}>
                                                    {client.name} {client.client_code ? `- ${client.client_code}` : ''}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Data inicial"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Data final"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Stack direction="row" spacing={1} height="100%" alignItems="center">
                                        <Button type="submit" variant="contained" disabled={processing}>
                                            Gerar relatório
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

                {selectedClient && (
                    <Card>
                        <CardContent>
                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                justifyContent="space-between"
                                gap={2}
                            >
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950 }}>
                                        {selectedClient.name}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Código: {selectedClient.client_code || '-'} · Documento: {selectedClient.document || '-'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Usina vinculada: {selectedClient.usina || 'Não informada'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Desconto ativo
                                    </Typography>

                                    <Typography variant="h5" sx={{ fontWeight: 950, color: 'primary.main' }}>
                                        {formatPercent(selectedClient.discount_percent || 0)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Fatura cheia"
                            value={formatMoney(summary.original_amount)}
                            helper="Quanto pagaria direto à concessionária"
                            icon={IconFileInvoice}
                            color="text.primary"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Economia Casa Verde"
                            value={formatMoney(summary.net_savings)}
                            helper={`${formatPercent(summary.average_discount_percent)} de economia média`}
                            icon={IconDiscount}
                            color="success.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Valor pago"
                            value={formatMoney(summary.final_amount)}
                            helper="Total cobrado pela Casa Verde"
                            icon={IconCash}
                            color="primary.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Consumo"
                            value={`${formatNumber(summary.total_consumption_kwh)} kWh`}
                            helper={`${summary.bills_count || 0} faturas analisadas`}
                            icon={IconBolt}
                            color="warning.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Valor recebido"
                            value={formatMoney(summary.paid_amount)}
                            helper="Cobranças já pagas"
                            icon={IconCash}
                            color="success.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Valor em aberto"
                            value={formatMoney(summary.open_amount)}
                            helper="Cobranças pendentes"
                            icon={IconCash}
                            color="warning.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ReportMetricCard
                            title="Impacto sustentável"
                            value={formatMoney(summary.net_savings)}
                            helper="Valor preservado pelo uso de energia solar"
                            icon={IconLeaf}
                            color="success.main"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <ReportChartCard
                            title="Fatura cheia x Casa Verde"
                            subtitle="Mostra quanto o cliente pagaria para a concessionária, o valor com Casa Verde e a economia obtida."
                            height={390}
                        >
                            <ClientBillEconomyChart data={report?.billEconomyEvolution || []} />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <ReportChartCard
                            title="Cobranças por status"
                            subtitle="Situação dos pagamentos do cliente."
                            height={390}
                        >
                            <StatusDonutChart
                                data={report?.chargesByStatus || []}
                                valueKey="total"
                                statusKey="status"
                            />
                        </ReportChartCard>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <ReportChartCard
                            title="Consumo de energia"
                            subtitle="Evolução do consumo mensal em kWh."
                            height={340}
                        >
                            <ClientConsumptionChart data={report?.consumptionEvolution || []} />
                        </ReportChartCard>
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 950, mb: 2 }}>
                            Últimas cobranças do cliente
                        </Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Referência</TableCell>
                                    <TableCell>Fatura cheia</TableCell>
                                    <TableCell>Desconto</TableCell>
                                    <TableCell>Valor Casa Verde</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Vencimento</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {(report?.latestCharges || []).map((charge) => (
                                    <TableRow key={charge.id}>
                                        <TableCell>{charge.reference_label || '-'}</TableCell>
                                        <TableCell>{formatMoney(charge.original_amount)}</TableCell>
                                        <TableCell>{formatMoney(charge.discount_amount)}</TableCell>
                                        <TableCell>{formatMoney(charge.final_amount)}</TableCell>
                                        <TableCell>
                                            <StatusChip status={charge.status} />
                                        </TableCell>
                                        <TableCell>{charge.due_date || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

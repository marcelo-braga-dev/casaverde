import Layout from '@/Layouts/UserLayout/Layout.jsx';

import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import SearchableSelect from '@/Components/Form/SearchableSelect.jsx';

import Grid from '@mui/material/Grid2';

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {
    IconBolt,
    IconCash,
    IconChartBar,
    IconDiscount,
    IconFileInvoice,
    IconLeaf,
    IconUsers,
} from '@tabler/icons-react';

import { Head, router, useForm } from '@inertiajs/react';

const money = (value) =>
    Number(value || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

const number = (value) =>
    Number(value || 0).toLocaleString('pt-BR');

export default function Page({ report, filters }) {
    const { data, setData, get, processing } = useForm({
        client_id: filters?.client_id || '',
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

    const general = report?.general;
    const client = report?.client;

    function submit(e) {
        e.preventDefault();

        get(route('admin.relatorios.clientes'));
    }

    function clearFilters() {
        router.get(route('admin.relatorios.clientes'));
    }

    return (
        <Layout
            titlePage="Relatórios de Clientes"
            menu="relatorios"
            subMenu="relatorios-clientes"
        >
            <Head title="Relatórios de Clientes" />

            <Stack spacing={3}>
                <Card
                    sx={{
                        background: 'var(--cv-gradient-primary)',
                        color: '#FFFFFF',
                    }}
                >
                    <CardContent>
                        <Typography variant="h4" fontWeight={900}>
                            Relatório Executivo de Clientes
                        </Typography>

                        <Typography sx={{ opacity: 0.84 }}>
                            Gestão financeira, economia solar,
                            faturamento e performance dos clientes.
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <form onSubmit={submit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <SearchableSelect
                                        fullWidth
                                        label="Cliente"
                                        value={data.client_id}
                                        onChange={(value) => setData('client_id', value)}
                                        options={[
                                            { value: '', label: 'Todos os clientes' },
                                            ...report.clients.map((client) => ({
                                                value: client.id,
                                                label: client.name,
                                            })),
                                        ]}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Inicial"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                'start_date',
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Final"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData(
                                                'end_date',
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                        >
                                            Filtrar
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={clearFilters}
                                        >
                                            Limpar
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <MetricCard
                            title="Clientes"
                            value={general.summary.clients_count}
                            helper="Clientes ativos"
                            icon={<IconUsers />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <MetricCard
                            title="Fatura cheia"
                            value={money(
                                general.summary.original_amount
                            )}
                            helper="Valor concessionária"
                            icon={<IconFileInvoice />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <MetricCard
                            title="Valor Casa Verde"
                            value={money(
                                general.summary.final_amount
                            )}
                            helper="Valor final"
                            icon={<IconCash />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <MetricCard
                            title="Economia"
                            value={money(
                                general.summary.economy_amount
                            )}
                            helper={`${general.summary.economy_percent}%`}
                            icon={<IconDiscount />}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <ChartCard
                            title="Economia Geral"
                            height={380}
                        >
                            <ResponsiveContainer>
                                <BarChart
                                    data={
                                        general.economyEvolution
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis dataKey="label" />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="original_amount"
                                        fill="#111827"
                                        name="Concessionária"
                                    />

                                    <Bar
                                        dataKey="final_amount"
                                        fill="#2F7D18"
                                        name="Casa Verde"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <ChartCard
                            title="Status Cobranças"
                            height={380}
                        >
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={
                                            general.chargesByStatus
                                        }
                                        dataKey="total"
                                        nameKey="status"
                                        outerRadius={110}
                                    >
                                        {general.chargesByStatus.map(
                                            (
                                                entry,
                                                index
                                            ) => (
                                                <Cell
                                                    key={index}
                                                    fill={[
                                                        '#2F7D18',
                                                        '#F59E0B',
                                                        '#DC2626',
                                                        '#2563EB',
                                                    ][
                                                    index % 4
                                                        ]}
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />

                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Grid>
                </Grid>

                {client && (
                    <>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    fontWeight={900}
                                >
                                    {client.client.name}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    Cliente:{' '}
                                    {client.client.client_code}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    Desconto:{' '}
                                    {
                                        client.client
                                            .discount_percent
                                    }
                                    %
                                </Typography>
                            </CardContent>
                        </Card>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <MetricCard
                                    title="Fatura cheia"
                                    value={money(
                                        client.summary
                                            .original_amount
                                    )}
                                    icon={<IconFileInvoice />}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <MetricCard
                                    title="Valor pago"
                                    value={money(
                                        client.summary
                                            .final_amount
                                    )}
                                    icon={<IconCash />}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <MetricCard
                                    title="Economia"
                                    value={money(
                                        client.summary
                                            .economy_amount
                                    )}
                                    helper={`${client.summary.economy_percent}%`}
                                    icon={<IconLeaf />}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <MetricCard
                                    title="Consumo"
                                    value={`${number(
                                        client.summary
                                            .consumption_kwh
                                    )} kWh`}
                                    icon={<IconBolt />}
                                />
                            </Grid>
                        </Grid>

                        <ChartCard
                            title="Fatura Cheia x Casa Verde"
                            height={420}
                        >
                            <ResponsiveContainer>
                                <AreaChart
                                    data={
                                        client.economyEvolution
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis dataKey="label" />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Area
                                        type="monotone"
                                        dataKey="original_amount"
                                        fill="#11182733"
                                        stroke="#111827"
                                        name="Concessionária"
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="final_amount"
                                        fill="#2F7D1833"
                                        stroke="#2F7D18"
                                        name="Casa Verde"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <Card>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    fontWeight={900}
                                    mb={2}
                                >
                                    Últimas Cobranças
                                </Typography>

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Referência
                                            </TableCell>

                                            <TableCell>
                                                Fatura Cheia
                                            </TableCell>

                                            <TableCell>
                                                Valor Final
                                            </TableCell>

                                            <TableCell>
                                                Economia
                                            </TableCell>

                                            <TableCell>
                                                Status
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {client.latestCharges.map(
                                            (charge) => (
                                                <TableRow
                                                    key={charge.id}
                                                >
                                                    <TableCell>
                                                        {
                                                            charge.reference_label
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {money(
                                                            charge.original_amount
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {money(
                                                            charge.final_amount
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {money(
                                                            charge.original_amount -
                                                            charge.final_amount
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            charge.status
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Stack>
        </Layout>
    );
}

function MetricCard({
                        title,
                        value,
                        helper,
                        icon,
                    }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack spacing={1}>
                    <Box color="primary.main">
                        {icon}
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight={900}
                    >
                        {value}
                    </Typography>

                    {helper && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {helper}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

function ChartCard({
                       title,
                       children,
                       height = 320,
                   }) {
    return (
        <Card>
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight={900}
                    mb={2}
                >
                    {title}
                </Typography>

                <Box height={height}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}

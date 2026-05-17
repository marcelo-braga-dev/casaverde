import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import UserLayout from '@/Layouts/UserLayout/Layout.jsx';

function Money({ value }) {
    return Number(value || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function MetricCard({ title, value, subtitle }) {
    return (
        <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>

                <Typography variant="h4" fontWeight={900}>
                    {value}
                </Typography>

                {subtitle && (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
];

function getYearOptions() {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 7 }).map((_, index) => currentYear - 3 + index);
}

export default function BillingManagementPage() {
    const { props } = usePage();
    const { billing, filters } = props;

    const handleFilterChange = (field, value) => {
        router.get(
            route('admin.financeiro.billing-management'),
            {
                ...filters,
                [field]: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <UserLayout
            titlePage="Gestão de Cobranças"
            menu="financeiro"
            subMenu="gestao-cobrancas"
        >
            <Head title="Gestão de Cobranças" />

            <Box sx={{ p: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={900}>
                            Centro de Cobranças e Inadimplência
                        </Typography>

                        <Typography color="text.secondary">
                            Controle financeiro gerencial das cobranças da Casa Verde.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href={route('admin.relatorios.cobrancas')}
                        variant="outlined"
                    >
                        Relatório de Cobranças
                    </Button>
                </Stack>

                <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Mês"
                                    value={filters.month}
                                    onChange={(event) => handleFilterChange('month', event.target.value)}
                                    select
                                    fullWidth
                                >
                                    {months.map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Ano"
                                    value={filters.year}
                                    onChange={(event) => handleFilterChange('year', event.target.value)}
                                    select
                                    fullWidth
                                >
                                    {getYearOptions().map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {billing.summary.overdue_count > 0 && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Existem {billing.summary.overdue_count} cobranças vencidas no período, totalizando{' '}
                        <strong><Money value={billing.summary.overdue_amount} /></strong>.
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Valor total"
                            value={<Money value={billing.summary.total_amount} />}
                            subtitle={`${billing.summary.charges_count} cobranças`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Valor pago"
                            value={<Money value={billing.summary.paid_amount} />}
                            subtitle={`${billing.summary.paid_count} pagas`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Valor em aberto"
                            value={<Money value={billing.summary.open_amount} />}
                            subtitle={`${billing.summary.open_count} em aberto`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Valor vencido"
                            value={<Money value={billing.summary.overdue_amount} />}
                            subtitle={`${billing.summary.default_rate_percentage}% inadimplência`}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={7}>
                        <Card sx={{ borderRadius: 3 }}>
                            <CardHeader title="Cobranças Vencidas" />

                            <CardContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Usina</TableCell>
                                            <TableCell>Vencimento</TableCell>
                                            <TableCell>Valor</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {billing.overdue_charges.map((charge) => (
                                            <TableRow key={charge.id}>
                                                <TableCell>
                                                    <Typography fontWeight={900}>
                                                        {charge.client_name}
                                                    </Typography>

                                                    <Typography variant="caption" color="text.secondary">
                                                        Ref. {charge.reference_label}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    UC {charge.usina_uc || '-'}
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        {charge.producer_name || ''}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {charge.due_date || '-'}
                                                </TableCell>

                                                <TableCell>
                                                    <strong><Money value={charge.final_amount} /></strong>
                                                </TableCell>

                                                <TableCell>
                                                    {charge.status}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {billing.overdue_charges.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                                                        Nenhuma cobrança vencida.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={5}>
                        <Card sx={{ borderRadius: 3, mb: 3 }}>
                            <CardHeader title="Clientes Inadimplentes" />

                            <CardContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Qtd.</TableCell>
                                            <TableCell>Valor</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {billing.overdue_clients.map((client) => (
                                            <TableRow key={client.client_profile_id}>
                                                <TableCell>
                                                    <Typography fontWeight={900}>
                                                        {client.client_name}
                                                    </Typography>

                                                    <Typography variant="caption" color="text.secondary">
                                                        Mais antigo: {client.oldest_due_date || '-'}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {client.charges_count}
                                                </TableCell>

                                                <TableCell>
                                                    <strong><Money value={client.overdue_amount} /></strong>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {billing.overdue_clients.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                                                        Nenhum cliente inadimplente.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 3 }}>
                            <CardHeader title="Clientes com Risco Operacional" />

                            <CardContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Alertas</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {billing.high_risk_clients.map((client) => (
                                            <TableRow key={client.client_profile_id}>
                                                <TableCell>
                                                    <Typography fontWeight={900}>
                                                        {client.client_name}
                                                    </Typography>

                                                    <Typography variant="caption" color="text.secondary">
                                                        {client.email || '-'}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {client.open_alerts_count}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {billing.high_risk_clients.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                                                        Nenhum risco operacional encontrado.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </UserLayout>
    );
}

import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
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
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';

import UserLayout from '@/Layouts/UserLayout/Layout.jsx';
import EnergyMetricCard from '@/Pages/Admin/Usina/Components/EnergyMetricCard';
import AlertSeverityChip from '../Components/AlertSeverityChip';
import AlertStatusChip from '../Components/AlertStatusChip';

function enumValue(value) {
    return typeof value === 'object' && value !== null ? value.value : value;
}

function getClientName(client) {
    if (!client) {
        return '-';
    }

    if (client.tipo_pessoa === 'pj') {
        return client.razao_social || client.nome_fantasia || client.email || `Cliente #${client.id}`;
    }

    return client.nome || client.email || `Cliente #${client.id}`;
}

export default function OperationalAlertIndexPage() {
    const { props } = usePage();
    const {
        alerts,
        summary,
        filters,
        statusOptions,
        severityOptions,
        moduleOptions,
    } = props;

    const handleFilterChange = (field, value) => {
        router.get(
            route('admin.operational-alerts.index'),
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

    const handleScan = () => {
        router.post(
            route('admin.operational-alerts.scan'),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const handleResolve = (alertId) => {
        if (!window.confirm('Deseja marcar este alerta como resolvido?')) {
            return;
        }

        router.put(
            route('admin.operational-alerts.resolve', alertId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const handleIgnore = (alertId) => {
        if (!window.confirm('Deseja ignorar este alerta?')) {
            return;
        }

        router.put(
            route('admin.operational-alerts.ignore', alertId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <UserLayout
            titlePage="Alertas Operacionais"
            menu="relatorios"
            subMenu="alertas-operacionais"
        >
            <Head title="Alertas Operacionais" />

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
                            Alertas Operacionais
                        </Typography>

                        <Typography color="text.secondary">
                            Monitore inconsistências em usinas, faturas, energia e financeiro.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={handleScan}
                    >
                        Escanear Agora
                    </Button>
                </Stack>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={2.4}>
                        <EnergyMetricCard
                            title="Abertos"
                            value={summary.open}
                            subtitle="Aguardando ação"
                        />
                    </Grid>

                    <Grid item xs={12} md={2.4}>
                        <EnergyMetricCard
                            title="Em tratamento"
                            value={summary.in_progress}
                            subtitle="Em acompanhamento"
                        />
                    </Grid>

                    <Grid item xs={12} md={2.4}>
                        <EnergyMetricCard
                            title="Críticos"
                            value={summary.critical}
                            subtitle="Prioridade máxima"
                        />
                    </Grid>

                    <Grid item xs={12} md={2.4}>
                        <EnergyMetricCard
                            title="Erros"
                            value={summary.error}
                            subtitle="Exigem correção"
                        />
                    </Grid>

                    <Grid item xs={12} md={2.4}>
                        <EnergyMetricCard
                            title="Atenção"
                            value={summary.warning}
                            subtitle="Revisar operação"
                        />
                    </Grid>
                </Grid>

                <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Buscar"
                                    value={filters.search || ''}
                                    onChange={(event) => handleFilterChange('search', event.target.value)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Status"
                                    value={filters.status || ''}
                                    onChange={(event) => handleFilterChange('status', event.target.value)}
                                    select
                                    fullWidth
                                >
                                    {statusOptions.map((status) => (
                                        <MenuItem key={status.value} value={status.value}>
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Severidade"
                                    value={filters.severity || ''}
                                    onChange={(event) => handleFilterChange('severity', event.target.value)}
                                    select
                                    fullWidth
                                >
                                    {severityOptions.map((severity) => (
                                        <MenuItem key={severity.value} value={severity.value}>
                                            {severity.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Módulo"
                                    value={filters.module || ''}
                                    onChange={(event) => handleFilterChange('module', event.target.value)}
                                    select
                                    fullWidth
                                >
                                    {moduleOptions.map((module) => (
                                        <MenuItem key={module.value} value={module.value}>
                                            {module.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Alerta</TableCell>
                                    <TableCell>Origem</TableCell>
                                    <TableCell>Referência</TableCell>
                                    <TableCell>Severidade</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Detectado em</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {alerts.data.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell sx={{ maxWidth: 360 }}>
                                            <Typography fontWeight={900}>
                                                {alert.title}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                {alert.message || '-'}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                Tipo: {alert.type}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight={800}>
                                                {alert.usina
                                                    ? `UC ${alert.usina.uc || alert.usina.id}`
                                                    : '-'}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                {alert.usina?.produtor?.name || ''}
                                            </Typography>

                                            {alert.client_profile && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Cliente: {getClientName(alert.client_profile)}
                                                </Typography>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {alert.reference_month && alert.reference_year
                                                ? `${String(alert.reference_month).padStart(2, '0')}/${alert.reference_year}`
                                                : '-'}
                                        </TableCell>

                                        <TableCell>
                                            <AlertSeverityChip severity={alert.severity} />
                                        </TableCell>

                                        <TableCell>
                                            <AlertStatusChip status={alert.status} />
                                        </TableCell>

                                        <TableCell>
                                            {alert.detected_at
                                                ? new Date(alert.detected_at).toLocaleString('pt-BR')
                                                : '-'}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                {alert.usina && (
                                                    <Button
                                                        component={Link}
                                                        href={route('admin.usinas.management.show',)}
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<VisibilityIcon />}
                                                    >
                                                        Usina
                                                    </Button>
                                                )}

                                                {['open', 'in_progress'].includes(enumValue(alert.status)) && (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => handleResolve(alert.id)}
                                                        >
                                                            Resolver
                                                        </Button>

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleIgnore(alert.id)}
                                                        >
                                                            Ignorar
                                                        </Button>
                                                    </>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {alerts.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                                                Nenhum alerta operacional encontrado.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>
        </UserLayout>
    );
}

import { Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import EnergyMetricCard from '../Components/EnergyMetricCard';
import EnergyProgressBar from '../Components/EnergyProgressBar';
import UsinaStatusChip from '../Components/UsinaStatusChip';

export default function AdminUsinaManagementPage() {
    const { props } = usePage();
    const { summary, usinas, filters, operationalStatusOptions } = props;

    const handleFilterChange = (field, value) => {
        router.get(
            route('admin.usinas.management'),
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
        <Layout titlePage="Gestão de Energia" menu="usinas-solar" subMenu="usinas-gestao">
            <Box sx={{ p: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={900}>
                            Gestão Administrativa de Energia
                        </Typography>

                        <Typography color="text.secondary">
                            Controle de usinas, geração, saldo energético e alocação para clientes.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            component={Link}
                            href={route('admin.usinas.links.create')}
                            variant="contained"
                            startIcon={<AddIcon />}
                        >
                            Nova Alocação
                        </Button>

                        <Button
                            component={Link}
                            href={route('admin.usinas.generation.create')}
                            variant="outlined"
                        >
                            Registrar Geração
                        </Button>
                    </Stack>
                </Stack>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <EnergyMetricCard
                            title="Usinas cadastradas"
                            value={summary.total_usinas}
                            subtitle={`${summary.active_usinas} ativas`}
                            icon={<SolarPowerIcon color="success" />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <EnergyMetricCard
                            title="Energia disponível"
                            value={`${Number(summary.total_available_energy_kwh || 0).toLocaleString('pt-BR')} kWh`}
                            subtitle="Energia disponível para alocação"
                            icon={<BoltIcon color="warning" />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <EnergyMetricCard
                            title="Energia alocada"
                            value={`${Number(summary.total_allocated_energy_kwh || 0).toLocaleString('pt-BR')} kWh`}
                            subtitle={`${summary.active_client_links} vínculos ativos`}
                            icon={<GroupIcon color="primary" />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <EnergyMetricCard
                            title="Alertas operacionais"
                            value={summary.maintenance_usinas + summary.blocked_usinas}
                            subtitle={`${summary.maintenance_usinas} manutenção / ${summary.blocked_usinas} bloqueadas`}
                            icon={<WarningAmberIcon color="error" />}
                        />
                    </Grid>
                </Grid>

                <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Buscar por UC, produtor ou consultor"
                                value={filters.search || ''}
                                onChange={(event) => handleFilterChange('search', event.target.value)}
                                fullWidth
                            />

                            <TextField
                                label="Status operacional"
                                value={filters.operational_status || ''}
                                onChange={(event) =>
                                    handleFilterChange('operational_status', event.target.value)
                                }
                                select
                                sx={{ minWidth: 260 }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {operationalStatusOptions.map((status) => (
                                    <MenuItem key={status.value} value={status.value}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    {usinas.data.map((usina) => (
                        <Grid item xs={12} md={6} lg={4} key={usina.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack
                                            direction="row"
                                            alignItems="flex-start"
                                            justifyContent="space-between"
                                            gap={2}
                                        >
                                            <Box>
                                                <Typography variant="h6" fontWeight={900}>
                                                    UC {usina.uc || `#${usina.id}`}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary">
                                                    Produtor: {usina.produtor?.name || 'Não informado'}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary">
                                                    Consultor: {usina.consultor?.name || 'Não informado'}
                                                </Typography>
                                            </Box>

                                            <UsinaStatusChip status={usina.operational_status} />
                                        </Stack>

                                        <EnergyProgressBar
                                            allocated={Number(usina.energia_alocada_kwh || 0)}
                                            available={Number(usina.energia_disponivel_kwh || 0)}
                                        />

                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Potência
                                                </Typography>
                                                <Typography fontWeight={900}>
                                                    {Number(usina.potencia_usina || 0).toLocaleString('pt-BR')} kWp
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Média geração
                                                </Typography>
                                                <Typography fontWeight={900}>
                                                    {Number(usina.media_geracao || 0).toLocaleString('pt-BR')} kWh
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Saldo
                                                </Typography>
                                                <Typography fontWeight={900}>
                                                    {Number(usina.energia_saldo_kwh || 0).toLocaleString('pt-BR')} kWh
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Clientes ativos
                                                </Typography>
                                                <Typography fontWeight={900}>
                                                    {usina.active_client_links_count || 0}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                component={Link}
                                                href={route('admin.usinas.links.index', {
                                                    search: usina.uc || usina.produtor?.name || '',
                                                })}
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                            >
                                                Alocações
                                            </Button>

                                            <Button
                                                component={Link}
                                                href={route('admin.usinas.generation.index', {
                                                    usina_id: usina.id,
                                                })}
                                                size="small"
                                                variant="contained"
                                                fullWidth
                                            >
                                                Geração
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    );
}

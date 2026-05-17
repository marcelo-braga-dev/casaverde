import { Head, Link, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';

import Layout from '@/Layouts/UserLayout/Layout.jsx';

function MetricCard({ title, value, subtitle }) {
    return (
        <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
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

export default function ExecutiveCockpitPage() {
    const { props } = usePage();
    const { cockpit } = props;

    return (
        <Layout
            titlePage="Cockpit Executivo"
            menu="gestao-executiva"
            subMenu="admin-cockpit-executive"
        >
            <Head title="Cockpit Executivo" />

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
                            Cockpit Executivo
                        </Typography>

                        <Typography color="text.secondary">
                            Visão estratégica, operacional e financeira da Casa Verde.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            component={Link}
                            href={route('admin.usinas.management')}
                            variant="outlined"
                        >
                            Gestão de Energia
                        </Button>
                    </Stack>
                </Stack>

                <Alert severity="info" sx={{ mb: 3 }}>
                    Referência: <strong>{cockpit.reference.label}</strong>
                </Alert>

                <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                    Financeiro
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Valor faturado"
                            value={`R$ ${Number(cockpit.financial.total_billed || 0).toLocaleString('pt-BR')}`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Valor médio"
                            value={`R$ ${Number(cockpit.financial.average_bill_value || 0).toLocaleString('pt-BR')}`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Faturas aprovadas"
                            value={cockpit.financial.approved_count}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Pendentes revisão"
                            value={cockpit.financial.pending_review_count}
                        />
                    </Grid>
                </Grid>

                <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                    Energia
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Energia disponível"
                            value={`${Number(cockpit.energy.total_available_kwh || 0).toLocaleString('pt-BR')} kWh`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Energia alocada"
                            value={`${Number(cockpit.energy.total_allocated_kwh || 0).toLocaleString('pt-BR')} kWh`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Saldo energético"
                            value={`${Number(cockpit.energy.total_remaining_kwh || 0).toLocaleString('pt-BR')} kWh`}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Usinas críticas"
                            value={cockpit.energy.critical_usinas_count}
                        />
                    </Grid>
                </Grid>

                <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
                    Operação
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Clientes ativos"
                            value={cockpit.clients.clients_count}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Clientes sem usina"
                            value={cockpit.clients.clients_without_usina_count}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Vínculos ativos"
                            value={cockpit.clients.active_links_count}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="Alertas abertos"
                            value={cockpit.alerts.open_alerts_count}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardHeader title="Ranking de Consultores" />

                            <Divider />

                            <CardContent>
                                <List disablePadding>
                                    {cockpit.consultants.map((item, index) => (
                                        <ListItem key={index} divider>
                                            <ListItemText
                                                primary={item.consultor_name || 'Consultor'}
                                                secondary={`${item.total_clients} clientes`}
                                            />
                                        </ListItem>
                                    ))}

                                    {cockpit.consultants.length === 0 && (
                                        <Typography color="text.secondary">
                                            Nenhum dado encontrado.
                                        </Typography>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardHeader title="Ações Pendentes" />

                            <Divider />

                            <CardContent>
                                <Stack spacing={2}>
                                    {cockpit.pending_actions.map((action, index) => (
                                        <Alert
                                            key={index}
                                            severity={action.severity || 'info'}
                                            action={
                                                <Button
                                                    component={Link}
                                                    href={action.route}
                                                    color="inherit"
                                                    size="small"
                                                >
                                                    Abrir
                                                </Button>
                                            }
                                        >
                                            <Typography fontWeight={900}>
                                                {action.title}
                                            </Typography>

                                            <Typography variant="body2">
                                                {action.description}
                                            </Typography>
                                        </Alert>
                                    ))}

                                    {cockpit.pending_actions.length === 0 && (
                                        <Alert severity="success">
                                            Nenhuma ação pendente crítica encontrada.
                                        </Alert>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}

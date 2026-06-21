import Layout from '@/Layouts/UserLayout/Layout.jsx';
import ReportMetricCard from '@/Components/Reports/ReportMetricCard';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconArrowRight,
    IconBolt,
    IconFileText,
    IconFileX,
    IconLayoutDashboard,
    IconSolarPanel,
    IconUserBolt,
    IconUserCheck,
    IconUserPlus,
    IconUsers,
} from '@tabler/icons-react';

function safeRoute(routeName, params = undefined) {
    try {
        if (typeof route === 'function' && route().has(routeName)) {
            return route(routeName, params);
        }
        return '#';
    } catch {
        return '#';
    }
}

function getClientDisplayName(client) {
    if (!client) return 'Não informado';
    if (client.tipo_pessoa === 'pf') return client.nome || '-';
    return client.razao_social || client.nome_fantasia || '-';
}

function ClientStatusChip({ status }) {
    const map = {
        active:             { label: 'Ativo',              color: 'success' },
        contrato_assinado:  { label: 'Contrato Fechado',   color: 'success' },
        prospect:           { label: 'Prospecto',          color: 'warning' },
        proposta_emitida:   { label: 'Proposta Emitida',   color: 'info' },
        inactive:           { label: 'Inativo',            color: 'default' },
    };
    const cfg = map[status] ?? { label: status ?? 'Sem status', color: 'default' };
    return <Chip label={cfg.label} color={cfg.color} size="small" />;
}

function ProposalStatusChip({ status }) {
    const map = {
        emitida:    { label: 'Emitida',     color: 'info' },
        enviada:    { label: 'Enviada',     color: 'primary' },
        em_analise: { label: 'Em Análise',  color: 'warning' },
        aprovada:   { label: 'Aprovada',    color: 'success' },
        recusada:   { label: 'Recusada',    color: 'error' },
        pendente:   { label: 'Pendente',    color: 'default' },
    };
    const cfg = map[status] ?? { label: status ?? '-', color: 'default' };
    return <Chip label={cfg.label} color={cfg.color} size="small" />;
}

const ACTION_ICONS = {
    users:     IconUsers,
    'file-text': IconFileText,
    bolt:      IconBolt,
    solar:     IconSolarPanel,
};

const ACTION_COLORS = {
    primary: { bg: 'var(--cv-gradient-primary)', border: 'rgba(16,185,129,0.22)' },
    success: { bg: 'linear-gradient(135deg,#10B981,#0B7A53)', border: 'rgba(16,185,129,0.22)' },
    info:    { bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', border: 'rgba(59,130,246,0.22)' },
    warning: { bg: 'linear-gradient(135deg,#F59E0B,#D97706)', border: 'rgba(245,158,11,0.22)' },
};

export default function Page({ dashboard }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name ?? 'Consultor';
    const summary = dashboard?.summary ?? {};
    const recentClients = dashboard?.recentClients ?? [];
    const recentProposals = dashboard?.recentProposals ?? [];
    const quickActions = dashboard?.quickActions ?? [];

    const totalOpenProposals =
        (summary.client_proposals_open ?? 0) + (summary.producer_proposals_open ?? 0);

    return (
        <Layout
            titlePage="Dashboard"
            menu="consultor-dashboard"
            subMenu="consultor-dashboard-home"
            subtitle="Visão geral da sua carteira de negócios."
            breadcrumbs={[
                { label: 'Consultor' },
                { label: 'Dashboard' },
            ]}
        >
            <Head title="Dashboard Consultor" />

            <Stack spacing={3}>

                {/* ── Hero banner ─────────────────────────────────────────── */}
                <Card
                    sx={{
                        background: 'var(--cv-gradient-hero)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--cv-radius-xl)',
                        overflow: 'visible',
                        position: 'relative',
                    }}
                >
                    <CardContent>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                            gap={2}
                        >
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: 'rgba(255,255,255,0.18)',
                                        fontSize: 22,
                                        fontWeight: 900,
                                        border: '2px solid rgba(255,255,255,0.30)',
                                    }}
                                >
                                    {userName.charAt(0).toUpperCase()}
                                </Avatar>

                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                        Olá, {userName.split(' ')[0]}!
                                    </Typography>
                                    <Typography sx={{ mt: 0.4, color: 'rgba(255,255,255,0.72)' }}>
                                        Aqui está o resumo da sua carteira hoje.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
                                <Button
                                    component={Link}
                                    href={safeRoute('consultor.user.cliente.create')}
                                    variant="contained"
                                    startIcon={<IconUserPlus size={17} />}
                                    sx={{
                                        bgcolor: '#FFFFFF',
                                        color: 'var(--cv-primary-dark)',
                                        '&:hover': { bgcolor: 'grey.100' },
                                    }}
                                >
                                    Novo cliente
                                </Button>

                                <Button
                                    component={Link}
                                    href={safeRoute('consultor.propostas.cliente.create')}
                                    variant="outlined"
                                    startIcon={<IconFileText size={17} />}
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.50)',
                                        color: '#FFFFFF',
                                        '&:hover': {
                                            borderColor: '#FFFFFF',
                                            bgcolor: 'rgba(255,255,255,0.10)',
                                        },
                                    }}
                                >
                                    Nova proposta
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── KPI cards ───────────────────────────────────────────── */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Clientes na carteira"
                            value={summary.clients_total ?? 0}
                            helper={`${summary.clients_active ?? 0} ativos · ${summary.clients_this_month ?? 0} novos este mês`}
                            icon={IconUsers}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Produtores cadastrados"
                            value={summary.producers_total ?? 0}
                            helper={`${summary.producers_active ?? 0} produtores ativos`}
                            icon={IconUserBolt}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Usinas na carteira"
                            value={summary.usinas_total ?? 0}
                            helper="Usinas vinculadas a você"
                            icon={IconSolarPanel}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Propostas abertas"
                            value={totalOpenProposals}
                            helper={`${summary.client_proposals_open ?? 0} clientes · ${summary.producer_proposals_open ?? 0} produtores`}
                            icon={IconFileText}
                            color={totalOpenProposals > 0 ? 'warning.main' : 'success.main'}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Clientes ativos"
                            value={summary.clients_active ?? 0}
                            helper="Com contrato ativo ou assinado"
                            icon={IconUserCheck}
                            color="success.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Leads de produtor"
                            value={summary.leads_total ?? 0}
                            helper={`${summary.leads_this_month ?? 0} leads criados este mês`}
                            icon={IconUserBolt}
                            color="info.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Propostas produtor"
                            value={summary.producer_proposals_open ?? 0}
                            helper="Propostas de produtor em aberto"
                            icon={IconFileX}
                            color={(summary.producer_proposals_open ?? 0) > 0 ? 'info.main' : 'success.main'}
                        />
                    </Grid>
                </Grid>

                {/* ── Ações rápidas ────────────────────────────────────────── */}
                <Card
                    sx={{
                        borderRadius: 'var(--cv-radius-xl)',
                        border: '1px solid var(--cv-border-soft)',
                        boxShadow: 'var(--cv-shadow-md)',
                    }}
                >
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={1.2} sx={{ mb: 2 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--cv-gradient-primary)',
                                    color: '#FFFFFF',
                                }}
                            >
                                <IconLayoutDashboard size={18} />
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                    Ações Rápidas
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Acesse as principais operações com um clique.
                                </Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            {quickActions.map((action) => {
                                const IconComponent = ACTION_ICONS[action.icon] ?? IconFileText;
                                const colors = ACTION_COLORS[action.color] ?? ACTION_COLORS.primary;

                                return (
                                    <Grid key={action.title} size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box
                                            component={Link}
                                            href={safeRoute(action.route)}
                                            sx={{
                                                display: 'block',
                                                p: 2.2,
                                                borderRadius: 3,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                bgcolor: 'grey.50',
                                                textDecoration: 'none',
                                                transition: 'all 160ms ease',
                                                '&:hover': {
                                                    borderColor: colors.border,
                                                    bgcolor: 'background.paper',
                                                    boxShadow: 'var(--cv-shadow-md)',
                                                    transform: 'translateY(-2px)',
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: 2.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: colors.bg,
                                                    color: '#FFFFFF',
                                                    mb: 1.5,
                                                    boxShadow: 'var(--cv-shadow-primary)',
                                                }}
                                            >
                                                <IconComponent size={20} />
                                            </Box>

                                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                                                {action.title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 0.5, lineHeight: 1.4 }}
                                            >
                                                {action.description}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </CardContent>
                </Card>

                {/* ── Tabelas: clientes recentes + propostas recentes ──────── */}
                <Grid container spacing={3}>

                    {/* Clientes recentes */}
                    <Grid size={{ xs: 12, lg: 6 }}>
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
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 2 }}
                                >
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            Clientes Recentes
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Últimos cadastros na sua carteira.
                                        </Typography>
                                    </Box>

                                    <Button
                                        component={Link}
                                        href={safeRoute('consultor.user.cliente.index')}
                                        size="small"
                                        variant="outlined"
                                        endIcon={<IconArrowRight size={15} />}
                                    >
                                        Ver todos
                                    </Button>
                                </Stack>

                                <Divider sx={{ mb: 1.5 }} />

                                {recentClients.length === 0 ? (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <IconUsers size={36} style={{ opacity: 0.3 }} />
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            Nenhum cliente cadastrado ainda.
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={safeRoute('consultor.user.cliente.create')}
                                            size="small"
                                            variant="contained"
                                            sx={{ mt: 1.5 }}
                                        >
                                            Cadastrar primeiro cliente
                                        </Button>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nome</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right">Ação</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recentClients.map((client) => (
                                                    <TableRow key={client.id} hover>
                                                        <TableCell>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ fontWeight: 700 }}
                                                            >
                                                                {getClientDisplayName(client)}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {client.tipo_pessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <ClientStatusChip status={client.status} />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                component={Link}
                                                                href={safeRoute('consultor.user.cliente.show', client.id)}
                                                                size="small"
                                                                variant="text"
                                                                endIcon={<IconArrowRight size={14} />}
                                                            >
                                                                Ver
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Propostas recentes */}
                    <Grid size={{ xs: 12, lg: 6 }}>
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
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 2 }}
                                >
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            Propostas Recentes
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Últimas propostas de cliente emitidas.
                                        </Typography>
                                    </Box>

                                    <Button
                                        component={Link}
                                        href={safeRoute('consultor.propostas.cliente.index')}
                                        size="small"
                                        variant="outlined"
                                        endIcon={<IconArrowRight size={15} />}
                                    >
                                        Ver todas
                                    </Button>
                                </Stack>

                                <Divider sx={{ mb: 1.5 }} />

                                {recentProposals.length === 0 ? (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <IconFileText size={36} style={{ opacity: 0.3 }} />
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            Nenhuma proposta emitida ainda.
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={safeRoute('consultor.propostas.cliente.create')}
                                            size="small"
                                            variant="contained"
                                            sx={{ mt: 1.5 }}
                                        >
                                            Criar primeira proposta
                                        </Button>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Cliente</TableCell>
                                                    <TableCell>Código</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right">Ação</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recentProposals.map((proposal) => (
                                                    <TableRow key={proposal.id} hover>
                                                        <TableCell>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ fontWeight: 700 }}
                                                            >
                                                                {getClientDisplayName(proposal.client_profile)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{ fontFamily: 'monospace' }}
                                                            >
                                                                #{proposal.id}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <ProposalStatusChip status={proposal.status} />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Button
                                                                component={Link}
                                                                href={safeRoute('consultor.propostas.cliente.show', proposal.id)}
                                                                size="small"
                                                                variant="text"
                                                                endIcon={<IconArrowRight size={14} />}
                                                            >
                                                                Ver
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </Stack>
        </Layout>
    );
}

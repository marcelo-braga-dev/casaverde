import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
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
    IconLeaf,
    IconSolarPanel,
    IconSun,
    IconUserBolt,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const MONTHS_PT = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function StatusChip({ status }) {
    const map = {
        ativo:       { label: 'Ativo',       color: 'success' },
        prospect:    { label: 'Prospecto',   color: 'warning' },
        lead:        { label: 'Lead',        color: 'info' },
        inativo:     { label: 'Inativo',     color: 'default' },
        em_integracao: { label: 'Em integração', color: 'info' },
    };
    const c = map[status] ?? { label: status ?? '—', color: 'default' };
    return <Chip label={c.label} color={c.color} size="small" />;
}

function InfoRow({ label, value }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.7}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value ?? '—'}</Typography>
        </Stack>
    );
}

export default function Page({ producerProfile, usinas = [], leads = [] }) {
    const { auth } = usePage().props;
    const nome = producerProfile?.nome ?? producerProfile?.razao_social ?? auth?.user?.name ?? 'Produtor';

    const totalKwhDisponivel = usinas.reduce((sum, u) => sum + parseFloat(u.energia_disponivel_kwh ?? 0), 0);
    const totalKwhAlocado    = usinas.reduce((sum, u) => sum + parseFloat(u.energia_alocada_kwh    ?? 0), 0);
    const totalPotencia      = usinas.reduce((sum, u) => sum + parseFloat(u.potencia_usina         ?? 0), 0);

    return (
        <Layout
            titlePage="Meu Painel"
            menu="produtor-dashboard"
            subMenu="produtor-dashboard-home"
            subtitle="Visão geral das suas usinas e operação."
            breadcrumbs={[{ label: 'Produtor' }, { label: 'Dashboard' }]}
        >
            <Head title="Dashboard Produtor" />

            <Stack spacing={3}>

                {/* ── Hero ──────────────────────────────────────────────── */}
                <Card sx={{
                    background: 'linear-gradient(135deg,#064e3b 0%,#065f46 60%,#047857 100%)',
                    color: '#fff',
                    borderRadius: 'var(--cv-radius-xl)',
                }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.3)' }}>
                                    <IconSun size={26} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                        Olá, {nome.split(' ')[0]}!
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, mt: 0.3 }}>
                                        {producerProfile?.producer_code
                                            ? `Código: ${producerProfile.producer_code}`
                                            : 'Bem-vindo ao painel do produtor'}
                                        {usinas.length > 0 && ` · ${usinas.length} usina${usinas.length > 1 ? 's' : ''} cadastrada${usinas.length > 1 ? 's' : ''}`}
                                    </Typography>
                                </Box>
                            </Stack>
                            {producerProfile && <StatusChip status={producerProfile.status} />}
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── KPIs ──────────────────────────────────────────────── */}
                <Grid container spacing={2}>
                    {[
                        {
                            title: 'Usinas cadastradas',
                            value: usinas.length,
                            helper: 'Usinas vinculadas ao seu perfil',
                            icon: IconSolarPanel,
                            color: 'primary.main',
                        },
                        {
                            title: 'Potência total',
                            value: `${totalPotencia.toFixed(1)} kWp`,
                            helper: 'Capacidade instalada total',
                            icon: IconBolt,
                            color: 'success.main',
                        },
                        {
                            title: 'Energia disponível',
                            value: `${totalKwhDisponivel.toFixed(0)} kWh`,
                            helper: 'Capacidade total de geração',
                            icon: IconLeaf,
                            color: 'success.main',
                        },
                        {
                            title: 'Energia alocada',
                            value: `${totalKwhAlocado.toFixed(0)} kWh`,
                            helper: totalKwhDisponivel > 0
                                ? `${((totalKwhAlocado / totalKwhDisponivel) * 100).toFixed(1)}% da capacidade`
                                : '0% da capacidade',
                            icon: IconUserBolt,
                            color: totalKwhAlocado > 0 ? 'info.main' : 'text.secondary',
                        },
                    ].map(card => (
                        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card sx={{ height: '100%', borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)', position: 'relative', overflow: 'hidden',
                                '&:before': { content: '""', position: 'absolute', width: 120, height: 120, right: -50, top: -50, borderRadius: '50%', background: 'rgba(47,125,24,0.07)' } }}>
                                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" gap={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>{card.title}</Typography>
                                            <Typography variant="h5" sx={{ mt: 0.8, fontWeight: 950, letterSpacing: '-0.04em', color: card.color }}>
                                                {card.value}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{card.helper}</Typography>
                                        </Box>
                                        <Box sx={{ width: 46, height: 46, minWidth: 46, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'var(--cv-gradient-primary)', boxShadow: 'var(--cv-shadow-primary)' }}>
                                            <card.icon size={22} />
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Usinas ────────────────────────────────────────────── */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Minhas Usinas</Typography>
                                <Typography variant="body2" color="text.secondary">Usinas vinculadas ao seu perfil de produtor.</Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 1.5 }} />

                        {usinas.length === 0 ? (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <IconSolarPanel size={40} style={{ opacity: 0.2 }} />
                                <Typography color="text.secondary" sx={{ mt: 1 }}>
                                    Nenhuma usina cadastrada ainda.
                                </Typography>
                            </Box>
                        ) : (
                            <Stack spacing={2}>
                                {usinas.map(usina => {
                                    const pct = usina.energia_disponivel_kwh > 0
                                        ? Math.min(100, (usina.energia_alocada_kwh / usina.energia_disponivel_kwh) * 100)
                                        : 0;

                                    return (
                                        <Box key={usina.id} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1.5}>
                                                <Box>
                                                    <Stack direction="row" alignItems="center" gap={1}>
                                                        <IconSolarPanel size={16} style={{ opacity: 0.6 }} />
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                                                            {usina.usina_nome ?? `Usina #${usina.id}`}
                                                        </Typography>
                                                        <Chip
                                                            label={usina.status ?? 'ativo'}
                                                            color={usina.status === 'ativo' ? 'success' : 'default'}
                                                            size="small"
                                                        />
                                                    </Stack>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {usina.concessionaria?.nome ?? '—'} · UC: {usina.uc ?? '—'} · {usina.potencia_usina ?? 0} kWp
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ minWidth: 180 }}>
                                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">Utilização</Typography>
                                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{pct.toFixed(1)}%</Typography>
                                                    </Stack>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={pct}
                                                        sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200',
                                                            '& .MuiLinearProgress-bar': { background: 'var(--cv-gradient-primary)' } }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: 'block' }}>
                                                        {parseFloat(usina.energia_alocada_kwh ?? 0).toFixed(0)} / {parseFloat(usina.energia_disponivel_kwh ?? 0).toFixed(0)} kWh alocados
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                {/* ── Perfil do produtor ────────────────────────────────── */}
                {producerProfile && (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconUserBolt size={18} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>Meu Perfil</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <Stack spacing={0} divider={<Divider />}>
                                        <InfoRow label="Código"       value={producerProfile.producer_code} />
                                        <InfoRow label="Nome"         value={producerProfile.nome ?? producerProfile.razao_social} />
                                        <InfoRow label="Tipo"         value={producerProfile.tipo_pessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'} />
                                        {producerProfile.tipo_pessoa === 'pf'
                                            ? <InfoRow label="CPF" value={producerProfile.cpf} />
                                            : <InfoRow label="CNPJ" value={producerProfile.cnpj} />
                                        }
                                        <InfoRow label="Status"       value={producerProfile.status} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconBolt size={18} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>Contato</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <Stack spacing={0} divider={<Divider />}>
                                        <InfoRow label="E-mail"  value={producerProfile.contacts?.email} />
                                        <InfoRow label="Celular" value={producerProfile.contacts?.celular} />
                                        <InfoRow label="Telefone" value={producerProfile.contacts?.telefone} />
                                    </Stack>

                                    <Button
                                        fullWidth
                                        component={Link}
                                        href={safeRoute('auth.perfil.usuario.index')}
                                        variant="outlined"
                                        size="small"
                                        endIcon={<IconArrowRight size={14} />}
                                        sx={{ mt: 2 }}
                                    >
                                        Ver meu perfil completo
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* ── Leads ─────────────────────────────────────────────── */}
                {leads.length > 0 && (
                    <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em', mb: 2 }}>
                                Leads Comerciais
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Concessionária</TableCell>
                                            <TableCell align="right">Potência</TableCell>
                                            <TableCell align="right">Prazo</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leads.map(lead => (
                                            <TableRow key={lead.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2">{lead.concessionaria?.nome ?? '—'}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">{lead.potencia ? `${lead.potencia} kWp` : '—'}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">{lead.prazo_locacao ? `${lead.prazo_locacao} anos` : '—'}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={lead.status ?? '—'} size="small" color={lead.status === 'ativo' ? 'success' : 'default'} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )}

            </Stack>
        </Layout>
    );
}

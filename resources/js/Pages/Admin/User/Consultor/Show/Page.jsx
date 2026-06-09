import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    IconBolt,
    IconBuildingFactory,
    IconEye,
    IconFileInvoice,
    IconLock,
    IconLockOpen,
    IconMail,
    IconSolarPanel2,
    IconUsers,
    IconUserSquare,
} from "@tabler/icons-react";
import AccessHistoryCard from '@/Components/Acesso/AccessHistoryCard.jsx';
import { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

function initials(name = '') {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

function SectionHeader({ icon, title, gradient = 'var(--cv-gradient-primary)' }) {
    return (
        <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>{title}</Typography>
        </Stack>
    );
}

function StatCard({ title, value, icon, gradient }) {
    return (
        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
            <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{title}</Typography>
                        <Typography variant="h4" fontWeight={950} letterSpacing="-0.04em" mt={0.5}>{value ?? 0}</Typography>
                    </Box>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function DataTable({ title, items = [], columns, routeName, emptyText, icon, gradient }) {
    return (
        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <SectionHeader icon={icon} title={title} gradient={gradient} />
                    <Chip label={items.length} size="small" variant="outlined" />
                </Stack>
                <Divider sx={{ mb: 2 }} />

                {items.length === 0 ? (
                    <Box py={3} textAlign="center">
                        <Typography color="text.secondary">{emptyText}</Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map(c => (
                                        <TableCell key={c.label} sx={{ fontWeight: 800 }}>{c.label}</TableCell>
                                    ))}
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map(item => (
                                    <TableRow key={item.id} hover>
                                        {columns.map(c => (
                                            <TableCell key={c.label}>{c.render(item)}</TableCell>
                                        ))}
                                        <TableCell align="right">
                                            <Button component={Link} href={safeRoute(routeName, item.id)}
                                                variant="outlined" size="small" startIcon={<IconEye size={14} />}>
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
    );
}

export default function Page({ consultor, stats, clients = [], proposals = [], usinas = [], producers = [], accessHistory = [] }) {
    const { flash } = usePage().props;
    const isBlocked = String(consultor?.status) === '0';
    const [loading, setLoading] = useState(false);

    function toggleAccess() {
        setLoading(true);
        const r = isBlocked ? 'admin.acesso.liberar' : 'admin.acesso.bloquear';
        router.post(safeRoute(r, consultor?.id), {}, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }

    return (
        <Layout
            titlePage="Detalhes do Consultor"
            menu="consultores"
            subMenu="consultores-cadastrados"
            breadcrumbs={[
                { label: 'Consultores', href: safeRoute('admin.consultores.index') },
                { label: consultor?.nome ?? 'Detalhe' },
            ]}
        >
            <Head title={consultor?.nome ?? 'Consultor'} />

            <Stack spacing={3}>
                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error">{flash.error}</Alert>}

                {/* ── Hero ─────────────────────────────────────────────── */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(99,102,241,0.2)' }}>
                    <Box sx={{ background: 'linear-gradient(135deg,#312e81,#4338ca,#6366f1)', p: { xs: 2.5, md: 3.5 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap={2}>
                            <Stack direction="row" alignItems="center" gap={2.5}>
                                <Avatar sx={{
                                    width: 64, height: 64, fontSize: 24, fontWeight: 950,
                                    background: 'rgba(255,255,255,0.2)', color: '#fff',
                                    backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)',
                                }}>
                                    {initials(consultor?.nome ?? '')}
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 950, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                                        {consultor?.nome}
                                    </Typography>
                                    <Stack direction="row" gap={1} mt={0.7} flexWrap="wrap" alignItems="center">
                                        <Chip
                                            label={consultor?.role_name ?? 'Consultor'}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700 }}
                                        />
                                        <Chip
                                            label={isBlocked ? 'Bloqueado' : 'Ativo'}
                                            color={isBlocked ? 'error' : 'success'}
                                            size="small"
                                            sx={{ fontWeight: 700 }}
                                        />
                                        {consultor?.email && (
                                            <Stack direction="row" alignItems="center" gap={0.5}>
                                                <IconMail size={13} style={{ color: 'rgba(255,255,255,0.65)' }} />
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                                                    {consultor.email}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                            <Tooltip title={isBlocked ? 'Liberar acesso deste consultor' : 'Bloquear acesso deste consultor'}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={loading
                                        ? <CircularProgress size={13} color="inherit" />
                                        : isBlocked ? <IconLockOpen size={15} /> : <IconLock size={15} />
                                    }
                                    onClick={toggleAccess}
                                    disabled={loading}
                                    sx={{
                                        color: isBlocked ? '#86efac' : '#fca5a5',
                                        borderColor: isBlocked ? 'rgba(134,239,172,0.4)' : 'rgba(252,165,165,0.4)',
                                        '&:hover': { borderColor: isBlocked ? '#86efac' : '#fca5a5' },
                                    }}
                                >
                                    {isBlocked ? 'Liberar acesso' : 'Bloquear acesso'}
                                </Button>
                            </Tooltip>
                        </Stack>
                    </Box>
                </Card>

                {/* ── Stats ─────────────────────────────────────────────── */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard title="Clientes" value={stats?.clients_count} icon={<IconUsers size={22} />} gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard title="Propostas" value={stats?.proposals_count} icon={<IconFileInvoice size={22} />} gradient="linear-gradient(135deg,#10b981,#059669)" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard title="Usinas" value={stats?.usinas_count} icon={<IconBolt size={22} />} gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard title="Produtores" value={stats?.producers_count} icon={<IconBuildingFactory size={22} />} gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)" />
                    </Grid>
                </Grid>

                {/* ── Clientes + Propostas ─────────────────────────────── */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DataTable
                            title="Clientes Recentes"
                            items={clients}
                            emptyText="Nenhum cliente encontrado."
                            icon={<IconUsers size={18} />}
                            gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)"
                            columns={[
                                { label: 'Cliente', render: i => i.nome ?? i.razao_social ?? '—' },
                                { label: 'CPF/CNPJ', render: i => i.cpf ?? i.cnpj ?? '—' },
                                { label: 'Cidade', render: i => i.cidade ?? '—' },
                            ]}
                            routeName="consultor.user.cliente.show"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DataTable
                            title="Propostas Recentes"
                            items={proposals}
                            emptyText="Nenhuma proposta encontrada."
                            icon={<IconFileInvoice size={18} />}
                            gradient="linear-gradient(135deg,#10b981,#059669)"
                            columns={[
                                { label: 'Código', render: i => i.proposal_code ?? '—' },
                                { label: 'Cliente', render: i => i.client_profile?.display_name ?? '—' },
                                { label: 'Valor Médio', render: i => i.valor_medio ? `R$ ${Number(i.valor_medio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—' },
                            ]}
                            routeName="consultor.propostas.cliente.show"
                        />
                    </Grid>
                </Grid>

                {/* ── Usinas + Produtores ──────────────────────────────── */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DataTable
                            title="Usinas Recentes"
                            items={usinas}
                            emptyText="Nenhuma usina encontrada."
                            icon={<IconSolarPanel2 size={18} />}
                            gradient="linear-gradient(135deg,#f59e0b,#d97706)"
                            columns={[
                                { label: 'Nome', render: i => i.nome ?? i.usina_nome ?? '—' },
                                { label: 'UC', render: i => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{i.uc ?? '—'}</Typography> },
                                { label: 'Status', render: i => <Chip label={i.status ?? '—'} size="small" color={i.status === 'ativo' ? 'success' : 'default'} /> },
                            ]}
                            routeName="consultor.producer.usinas.show"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DataTable
                            title="Produtores Recentes"
                            items={producers}
                            emptyText="Nenhum produtor encontrado."
                            icon={<IconBuildingFactory size={18} />}
                            gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
                            columns={[
                                { label: 'Nome', render: i => i.nome ?? '—' },
                                { label: 'E-mail', render: i => i.email ?? '—' },
                                { label: 'Status', render: i => <Chip label={i.status_nome ?? '—'} size="small" /> },
                            ]}
                            routeName="admin.produtores.show"
                        />
                    </Grid>
                </Grid>

                {/* ── Histórico de acesso ──────────────────────────────── */}
                <AccessHistoryCard
                    history={accessHistory}
                    title={`Histórico de Acesso — ${consultor?.nome ?? 'Consultor'}`}
                />
            </Stack>
        </Layout>
    );
}

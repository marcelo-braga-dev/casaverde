import Layout from '@/Layouts/UserLayout/Layout.jsx';
import ReportMetricCard from '@/Components/Reports/ReportMetricCard';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
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
    IconCalendar,
    IconCash,
    IconFileInvoice,
    IconLeaf,
    IconSolarPanel,
    IconWallet,
} from '@tabler/icons-react';

function safeRoute(name, params) {
    try { return typeof route === 'function' && route().has(name) ? route(name, params) : '#'; }
    catch { return '#'; }
}

function ChargeStatusChip({ status }) {
    const map = {
        draft:           { label: 'Rascunho',        color: 'default' },
        open:            { label: 'Em Aberto',        color: 'warning' },
        waiting_payment: { label: 'Ag. Pagamento',    color: 'info' },
        paid:            { label: 'Pago',             color: 'success' },
        overdue:         { label: 'Vencido',          color: 'error' },
        cancelled:       { label: 'Cancelado',        color: 'default' },
    };
    const c = map[status] ?? { label: status ?? '-', color: 'default' };
    return <Chip label={c.label} color={c.color} size="small" />;
}

function BillStatusChip({ status }) {
    const map = {
        approved:       { label: 'Aprovada',   color: 'success' },
        pending_review: { label: 'Em Revisão', color: 'warning' },
        rejected:       { label: 'Rejeitada',  color: 'error' },
    };
    const c = map[status] ?? { label: status ?? '-', color: 'default' };
    return <Chip label={c.label} color={c.color} size="small" />;
}

export default function Page({ dashboard }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name ?? 'Cliente';

    const profile   = dashboard?.profile;
    const summary   = dashboard?.summary ?? {};
    const bills     = dashboard?.recentBills ?? [];
    const charges   = dashboard?.recentCharges ?? [];
    const chart     = dashboard?.energyChart ?? [];

    const usinaLink    = profile?.active_usina_link;
    const discount     = summary.active_discount_percent ?? 0;
    const allocatedKwh = summary.allocated_energy_kwh ?? 0;

    return (
        <Layout
            titlePage="Meu Painel"
            menu="cliente-dashboard"
            subMenu="cliente-dashboard-home"
            subtitle="Acompanhe seu consumo, faturas e economia."
            breadcrumbs={[{ label: 'Cliente' }, { label: 'Painel' }]}
        >
            <Head title="Meu Painel" />

            <Stack spacing={3}>

                {/* ── Hero ─────────────────────────────────────────────── */}
                <Card sx={{
                    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
                    color: '#fff',
                    borderRadius: 'var(--cv-radius-xl)',
                }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.3)' }}>
                                    <IconLeaf size={26} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                        Olá, {userName.split(' ')[0]}!
                                    </Typography>
                                    <Typography sx={{ mt: 0.4, color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>
                                        {profile
                                            ? `Código: ${profile.client_code ?? '—'} · Desconto ativo: ${discount}%`
                                            : 'Bem-vindo ao seu painel de energia solar'}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
                                <Button
                                    component={Link}
                                    href={safeRoute('cliente.faturas.index')}
                                    variant="contained"
                                    startIcon={<IconFileInvoice size={17} />}
                                    sx={{ bgcolor: '#fff', color: '#064e3b', '&:hover': { bgcolor: 'grey.100' } }}
                                >
                                    Ver Faturas
                                </Button>
                                <Button
                                    component={Link}
                                    href={safeRoute('cliente.cobrancas.index')}
                                    variant="outlined"
                                    startIcon={<IconWallet size={17} />}
                                    sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                >
                                    Cobranças
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── KPIs ─────────────────────────────────────────────── */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Cobranças em aberto"
                            value={summary.charges_pending ?? 0}
                            helper={`${formatMoney(summary.charges_pending_amount ?? 0)} a pagar`}
                            icon={IconWallet}
                            color={(summary.charges_pending ?? 0) > 0 ? 'warning.main' : 'success.main'}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Cobranças vencidas"
                            value={summary.charges_overdue ?? 0}
                            helper={`${formatMoney(summary.charges_overdue_amount ?? 0)} em atraso`}
                            icon={IconCash}
                            color={(summary.charges_overdue ?? 0) > 0 ? 'error.main' : 'success.main'}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Pago no ano"
                            value={formatMoney(summary.charges_paid_year ?? 0)}
                            helper={`Total quitado em ${new Date().getFullYear()}`}
                            icon={IconCash}
                            color="success.main"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReportMetricCard
                            title="Total economizado"
                            value={formatMoney(summary.total_saved ?? 0)}
                            helper="Descontos acumulados"
                            icon={IconLeaf}
                            color="primary.main"
                        />
                    </Grid>
                </Grid>

                {/* ── Usina + Consumo ───────────────────────────────────── */}
                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ height: '100%', borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 38, height: 38, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cv-gradient-primary)', color: '#fff' }}>
                                        <IconSolarPanel size={20} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Minha Usina</Typography>
                                        <Typography variant="body2" color="text.secondary">Vínculo ativo</Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />

                                {usinaLink ? (
                                    <Stack spacing={1.5}>
                                        {[
                                            ['Usina', usinaLink.usina?.usina_nome],
                                            ['Concessionária', usinaLink.usina?.concessionaria?.nome],
                                            ['Energia alocada', `${allocatedKwh} kWh`],
                                            ['Desconto', `${discount}%`],
                                            ['Vínculo desde', usinaLink.started_at ? new Date(usinaLink.started_at).toLocaleDateString('pt-BR') : '—'],
                                        ].map(([label, val]) => (
                                            <Stack key={label} direction="row" justifyContent="space-between">
                                                <Typography variant="body2" color="text.secondary">{label}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{val ?? '—'}</Typography>
                                            </Stack>
                                        ))}

                                        <Box sx={{ mt: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">Utilização da usina</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                    {usinaLink.usina?.utilization_percentage ?? 0}%
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(100, usinaLink.usina?.utilization_percentage ?? 0)}
                                                sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { background: 'var(--cv-gradient-primary)' } }}
                                            />
                                        </Box>

                                        <Button fullWidth component={Link} href={safeRoute('cliente.usina.show')} variant="outlined" size="small" endIcon={<IconArrowRight size={14} />} sx={{ mt: 1 }}>
                                            Ver detalhes completos
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 3, textAlign: 'center' }}>
                                        <IconSolarPanel size={40} style={{ opacity: 0.2 }} />
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>Nenhuma usina vinculada.</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ height: '100%', borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Histórico de Consumo</Typography>
                                        <Typography variant="body2" color="text.secondary">kWh por competência</Typography>
                                    </Box>
                                    <Button component={Link} href={safeRoute('cliente.faturas.index')} size="small" variant="outlined" endIcon={<IconArrowRight size={14} />}>
                                        Ver faturas
                                    </Button>
                                </Stack>
                                <Divider sx={{ mb: 1.5 }} />

                                {chart.length === 0 ? (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <IconBolt size={36} style={{ opacity: 0.2 }} />
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>Nenhuma fatura aprovada ainda.</Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ overflowX: 'auto', pb: 1 }}>
                                        <Stack direction="row" gap={1} alignItems="flex-end" sx={{ minWidth: chart.length * 52, height: 120 }}>
                                            {chart.map((item, i) => {
                                                const max = Math.max(...chart.map(c => c.consumo_kwh), 1);
                                                const pct = (item.consumo_kwh / max) * 100;
                                                return (
                                                    <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                                        <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 700, mb: 0.3 }}>{item.consumo_kwh}</Typography>
                                                        <Box sx={{
                                                            width: '100%',
                                                            height: `${Math.max(4, pct)}%`,
                                                            borderRadius: '3px 3px 0 0',
                                                            background: i === chart.length - 1
                                                                ? 'var(--cv-gradient-primary)'
                                                                : 'rgba(16,185,129,0.35)',
                                                        }} />
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 9, mt: 0.3, textAlign: 'center', display: 'block' }}>
                                                            {item.label}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* ── Faturas + Cobranças recentes ─────────────────────── */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Faturas Recentes</Typography>
                                        <Typography variant="body2" color="text.secondary">Últimas faturas de energia</Typography>
                                    </Box>
                                    <Button component={Link} href={safeRoute('cliente.faturas.index')} size="small" variant="outlined" endIcon={<IconArrowRight size={14} />}>
                                        Ver todas
                                    </Button>
                                </Stack>
                                <Divider sx={{ mb: 1.5 }} />
                                {bills.length === 0 ? (
                                    <Box sx={{ py: 3, textAlign: 'center' }}>
                                        <IconFileInvoice size={36} style={{ opacity: 0.2 }} />
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>Nenhuma fatura encontrada.</Typography>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Competência</TableCell>
                                                    <TableCell>kWh</TableCell>
                                                    <TableCell>Valor</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right" />
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {bills.map(b => (
                                                    <TableRow key={b.id} hover>
                                                        <TableCell>
                                                            <Stack direction="row" alignItems="center" gap={0.5}>
                                                                <IconCalendar size={13} style={{ opacity: 0.5 }} />
                                                                <Typography variant="body2">{b.reference_label ?? `${b.reference_month}/${b.reference_year}`}</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell><Typography variant="body2">{b.consumo_kwh ?? '—'}</Typography></TableCell>
                                                        <TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(b.valor_total ?? 0)}</Typography></TableCell>
                                                        <TableCell><BillStatusChip status={b.review_status} /></TableCell>
                                                        <TableCell align="right">
                                                            <Button component={Link} href={safeRoute('cliente.faturas.show', b.id)} size="small" variant="text">Ver</Button>
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

                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Cobranças Recentes</Typography>
                                        <Typography variant="body2" color="text.secondary">Últimas cobranças emitidas</Typography>
                                    </Box>
                                    <Button component={Link} href={safeRoute('cliente.cobrancas.index')} size="small" variant="outlined" endIcon={<IconArrowRight size={14} />}>
                                        Ver todas
                                    </Button>
                                </Stack>
                                <Divider sx={{ mb: 1.5 }} />
                                {charges.length === 0 ? (
                                    <Box sx={{ py: 3, textAlign: 'center' }}>
                                        <IconWallet size={36} style={{ opacity: 0.2 }} />
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>Nenhuma cobrança encontrada.</Typography>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Competência</TableCell>
                                                    <TableCell>Valor</TableCell>
                                                    <TableCell>Economia</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right" />
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {charges.map(c => (
                                                    <TableRow key={c.id} hover>
                                                        <TableCell><Typography variant="body2">{c.reference_label ?? `${c.reference_month}/${c.reference_year}`}</Typography></TableCell>
                                                        <TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(c.final_amount ?? 0)}</Typography></TableCell>
                                                        <TableCell><Typography variant="body2" color="success.main">-{formatMoney(c.discount_amount ?? 0)}</Typography></TableCell>
                                                        <TableCell><ChargeStatusChip status={c.status} /></TableCell>
                                                        <TableCell align="right">
                                                            <Button component={Link} href={safeRoute('cliente.cobrancas.show', c.id)} size="small" variant="text">Ver</Button>
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

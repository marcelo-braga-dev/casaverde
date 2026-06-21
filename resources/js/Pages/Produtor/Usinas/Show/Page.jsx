import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link } from '@inertiajs/react';
import {
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
import { IconArrowLeft, IconBolt, IconSolarPanel } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const MONTHS_PT = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function InfoRow({ label, value }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.8}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value ?? '—'}</Typography>
        </Stack>
    );
}

export default function Page({ usina }) {
    const disponivel = parseFloat(usina?.energia_disponivel_kwh ?? 0);
    const alocado    = parseFloat(usina?.energia_alocada_kwh    ?? 0);
    const saldo      = parseFloat(usina?.energia_saldo_kwh      ?? 0);
    const pct        = disponivel > 0 ? Math.min(100, (alocado / disponivel) * 100) : 0;

    const records = usina?.generation_records ?? usina?.generationRecords ?? [];

    return (
        <Layout
            titlePage={usina?.usina_nome ?? 'Detalhes da Usina'}
            menu="produtor-usinas"
            subMenu="produtor-usinas-index"
            breadcrumbs={[
                { label: 'Produtor' },
                { label: 'Minhas Usinas', href: safeRoute('produtor.usinas.index') },
                { label: usina?.usina_nome ?? 'Detalhes' },
            ]}
        >
            <Head title={usina?.usina_nome ?? 'Usina'} />

            <Stack spacing={3}>

                <Button
                    component={Link}
                    href={safeRoute('produtor.usinas.index')}
                    startIcon={<IconArrowLeft size={16} />}
                    variant="text"
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                >
                    Voltar às usinas
                </Button>

                {/* ── Hero ──────────────────────────────────────────────── */}
                <Card sx={{ background: 'linear-gradient(135deg,#064e3b,#065f46)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconSolarPanel size={26} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                        {usina?.usina_nome ?? `Usina #${usina?.id}`}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>
                                        {usina?.concessionaria?.nome ?? '—'} · UC: {usina?.uc ?? '—'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Chip
                                label={usina?.status ?? 'ativo'}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 800 }}
                            />
                        </Stack>

                        {/* Barra de utilização */}
                        <Box sx={{ mt: 3 }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Capacidade utilizada
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 900 }}>{pct.toFixed(1)}%</Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={pct}
                                sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': { bgcolor: '#fff' } }}
                            />
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                                    {alocado.toFixed(0)} kWh alocados
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                                    {disponivel.toFixed(0)} kWh disponíveis
                                </Typography>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Dados técnicos */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconSolarPanel size={18} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 950 }}>Dados Técnicos</Typography>
                                </Stack>
                                <Divider sx={{ mb: 1.5 }} />
                                <Stack spacing={0} divider={<Divider />}>
                                    <InfoRow label="Potência instalada"   value={usina?.potencia_usina ? `${usina.potencia_usina} kWp` : null} />
                                    <InfoRow label="Geração média"        value={usina?.media_geracao ? `${usina.media_geracao} kWh/mês` : null} />
                                    <InfoRow label="Energia disponível"   value={`${disponivel.toFixed(0)} kWh`} />
                                    <InfoRow label="Energia alocada"      value={`${alocado.toFixed(0)} kWh`} />
                                    <InfoRow label="Saldo disponível"     value={`${saldo.toFixed(0)} kWh`} />
                                    <InfoRow label="Prazo de locação"     value={usina?.prazo_locacao ? `${usina.prazo_locacao} anos` : null} />
                                    <InfoRow label="Inversores"           value={usina?.inversores} />
                                    <InfoRow label="Módulos"              value={usina?.modulos} />
                                    <InfoRow label="Início da operação"   value={usina?.operation_started_at ? new Date(usina.operation_started_at).toLocaleDateString('pt-BR') : null} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Energia e clientes vinculados */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3} sx={{ height: '100%' }}>
                            {/* Métricas de energia */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconBolt size={18} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>Energia</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: 'Disponível', value: `${disponivel.toFixed(0)} kWh`, color: 'success.main' },
                                            { label: 'Alocada',    value: `${alocado.toFixed(0)} kWh`,    color: 'primary.main' },
                                            { label: 'Saldo',      value: `${saldo.toFixed(0)} kWh`,      color: saldo > 0 ? 'success.main' : 'text.secondary' },
                                            { label: 'Utilização', value: `${pct.toFixed(1)}%`,            color: pct > 80 ? 'warning.main' : 'success.main' },
                                        ].map(item => (
                                            <Grid key={item.label} size={{ xs: 6 }}>
                                                <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{item.label}</Typography>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 950, color: item.color }}>{item.value}</Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Histórico de geração */}
                    {records.length > 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em', mb: 2 }}>
                                        Histórico de Geração
                                    </Typography>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Competência</TableCell>
                                                    <TableCell align="right">Gerado (kWh)</TableCell>
                                                    <TableCell align="right">Compensado (kWh)</TableCell>
                                                    <TableCell align="right">Disponível (kWh)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {records.map((r, i) => (
                                                    <TableRow key={i} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                                {MONTHS_PT[r.reference_month ?? 1]}/{r.reference_year}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2">{parseFloat(r.generated_energy_kwh ?? 0).toFixed(1)}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2">{parseFloat(r.compensated_energy_kwh ?? 0).toFixed(1)}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                                                                {parseFloat(r.available_energy_kwh ?? 0).toFixed(1)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Stack>
        </Layout>
    );
}

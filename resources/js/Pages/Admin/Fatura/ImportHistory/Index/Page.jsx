import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconAlertTriangle,
    IconCheck,
    IconClock,
    IconDownload,
    IconHistory,
    IconMail,
    IconPlayerPlay,
    IconRefresh,
    IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    running:   { label: 'Em andamento', color: 'info' },
    completed: { label: 'Concluído',    color: 'success' },
    partial:   { label: 'Parcial',      color: 'warning' },
    failed:    { label: 'Falhou',       color: 'error' },
};

function KpiCard({ label, value, color = 'text.primary', icon: Icon, sub }) {
    return (
        <Card>
            <CardContent sx={{ py: '14px !important' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                            {label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-0.05em', color, mt: 0.3 }}>
                            {value ?? 0}
                        </Typography>
                        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
                    </Box>
                    {Icon && (
                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Icon size={18} />
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

function formatDuration(ms) {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

export default function Page({ runs, filters = {}, stats = {} }) {
    const { flash } = usePage().props;
    const items = runs?.data ?? [];
    const [triggering, setTriggering] = useState(false);

    const { data, setData, processing } = useForm({
        status:       filters.status       ?? '',
        triggered_by: filters.triggered_by ?? '',
        date_from:    filters.date_from    ?? '',
        date_to:      filters.date_to      ?? '',
    });

    function submit() {
        router.get(safeRoute('admin.import-history.index'), {
            status: data.status, triggered_by: data.triggered_by,
            date_from: data.date_from, date_to: data.date_to,
        }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function clear() {
        router.get(safeRoute('admin.import-history.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    function triggerImport() {
        setTriggering(true);
        router.post(safeRoute('admin.import-history.trigger'), {}, {
            onFinish: () => setTriggering(false),
        });
    }

    const lastRunAt   = stats.last_run_at   ? new Date(stats.last_run_at).toLocaleString('pt-BR') : 'Nunca';
    const lastStatus  = stats.last_run_status;

    return (
        <Layout
            titlePage="Histórico de Importação"
            menu="integracoes"
            subMenu="config-import-history"
            subtitle="Monitore todas as execuções de importação automática de faturas."
            breadcrumbs={[{ label: 'Configurações' }, { label: 'Histórico de Importação' }]}
        >
            <Head title="Histórico de Importação" />

            <Stack spacing={3}>
                {flash?.success && <Alert severity="success" icon={<IconCheck size={18} />}>{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error" icon={<IconX size={18} />}>{flash.error}</Alert>}

                {/* ── Status + trigger ──────────────────────────────── */}
                <Card sx={{ background: 'var(--cv-gradient-hero)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950 }}>Importação Automática de Faturas de Concessionárias</Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, mt: 0.3 }}>
                                    Última execução: {lastRunAt}
                                    {lastStatus && (
                                        <Chip label={STATUS_MAP[lastStatus]?.label ?? lastStatus} color={STATUS_MAP[lastStatus]?.color ?? 'default'}
                                            size="small" sx={{ ml: 1, height: 18, fontSize: 10 }} />
                                    )}
                                </Typography>
                            </Box>
                            <Tooltip title="Inicia uma importação manual agora para todos os clientes ativos.">
                                <Button
                                    variant="contained"
                                    startIcon={triggering ? <CircularProgress size={16} color="inherit" /> : <IconPlayerPlay size={18} />}
                                    onClick={triggerImport}
                                    disabled={triggering}
                                    sx={{ bgcolor: '#fff', color: '#064e3b', '&:hover': { bgcolor: 'grey.100' }, minWidth: 180 }}
                                >
                                    {triggering ? 'Importando...' : 'Importar agora'}
                                </Button>
                            </Tooltip>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── KPIs 30 dias ─────────────────────────────────── */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <KpiCard label="Execuções (30d)"  value={stats.runs_total}      icon={IconHistory} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <KpiCard label="Importadas (30d)" value={stats.emails_imported}  color="success.main" icon={IconCheck} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <KpiCard label="Ignoradas (30d)"  value={stats.emails_skipped}   color="info.main" icon={IconRefresh} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <KpiCard label="Falhas (30d)"     value={stats.emails_failed}    color={(stats.emails_failed ?? 0) > 0 ? 'error.main' : 'text.primary'} icon={IconAlertTriangle}
                            sub={(stats.emails_failed ?? 0) > 0 ? 'Requer atenção' : 'Nenhuma falha'} />
                    </Grid>
                </Grid>

                {/* ── Tabela de runs ───────────────────────────────── */}
                <DataTableCard
                    title="Execuções de Importação"
                    icon={IconHistory}
                    filters={
                        <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                            <FilterSelect label="Status" value={data.status} onChange={v => setData('status', v)}
                                options={[
                                    { value: 'running',   label: 'Em andamento' },
                                    { value: 'completed', label: 'Concluído' },
                                    { value: 'partial',   label: 'Parcial' },
                                    { value: 'failed',    label: 'Falhou' },
                                ]}
                            />
                            <FilterSelect label="Acionamento" value={data.triggered_by} onChange={v => setData('triggered_by', v)}
                                options={[
                                    { value: 'scheduler', label: 'Agendador' },
                                    { value: 'manual',    label: 'Manual' },
                                    { value: 'command',   label: 'Comando' },
                                ]}
                            />
                        </FilterBar>
                    }
                    isEmpty={items.length === 0}
                    empty={<DataTableEmpty title="Nenhuma execução encontrada" description="O histórico aparecerá aqui após a primeira importação." icon={IconHistory} />}
                    head={
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Acionamento</TableCell>
                            <TableCell>Início</TableCell>
                            <TableCell align="right">Configs</TableCell>
                            <TableCell align="right">Processados</TableCell>
                            <TableCell align="right">Importadas</TableCell>
                            <TableCell align="right">Ignoradas</TableCell>
                            <TableCell align="right">Falhas</TableCell>
                            <TableCell>Duração</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ação</TableCell>
                        </TableRow>
                    }
                    pagination={<DataTablePagination links={runs?.links} meta={{ from: runs?.from, to: runs?.to, total: runs?.total }} />}
                >
                    {items.map(run => {
                        const st = STATUS_MAP[run.status] ?? { label: run.status, color: 'default' };
                        return (
                            <TableRow key={run.id} hover>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', color: 'primary.main' }}>
                                        {run.run_code}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={run.triggered_by === 'scheduler' ? 'Agendador' : run.triggered_by === 'manual' ? 'Manual' : 'Comando'}
                                        size="small" variant="outlined"
                                    />
                                    {run.triggered_by_user && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                                            {run.triggered_by_user.name}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{run.started_at ? new Date(run.started_at).toLocaleString('pt-BR') : '—'}</Typography>
                                </TableCell>
                                <TableCell align="right"><Typography variant="body2">{run.total_settings}</Typography></TableCell>
                                <TableCell align="right"><Typography variant="body2">{run.total_processed}</Typography></TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: run.total_imported > 0 ? 'success.main' : 'text.primary' }}>
                                        {run.total_imported}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right"><Typography variant="body2" color="text.secondary">{run.total_skipped}</Typography></TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: run.total_failed > 0 ? 700 : 400, color: run.total_failed > 0 ? 'error.main' : 'text.secondary' }}>
                                        {run.total_failed}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        {formatDuration(run.duration_ms)}
                                    </Typography>
                                </TableCell>
                                <TableCell><Chip label={st.label} color={st.color} size="small" /></TableCell>
                                <TableCell align="right">
                                    <Button component={Link} href={safeRoute('admin.import-history.show', run.id)}
                                        size="small" variant="outlined" startIcon={<IconHistory size={14} />}>
                                        Detalhes
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </DataTableCard>
            </Stack>
        </Layout>
    );
}

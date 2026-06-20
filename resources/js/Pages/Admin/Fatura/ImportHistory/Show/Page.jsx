import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import { Head, Link } from '@inertiajs/react';
import {
    Alert,
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
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconAlertTriangle,
    IconArrowLeft,
    IconCheck,
    IconDownload,
    IconEye,
    IconFileInvoice,
    IconHistory,
    IconMail,
    IconX,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_RUN_MAP = {
    running:   { label: 'Em andamento', color: 'info' },
    completed: { label: 'Concluído',    color: 'success' },
    partial:   { label: 'Parcial',      color: 'warning' },
    failed:    { label: 'Falhou',       color: 'error' },
};

const STATUS_EMAIL_MAP = {
    processing: { label: 'Processando', color: 'info' },
    success:    { label: 'Sucesso',     color: 'success' },
    skipped:    { label: 'Ignorado',    color: 'default' },
    failed:     { label: 'Falhou',      color: 'error' },
};

const STEP_LABELS = {
    fetch:    'Busca IMAP',
    unlock:   'Desbloqueio PDF',
    extract:  'Extração texto',
    parse:    'Leitura dados',
    store:    'Armazenamento',
    validate: 'Validação',
};

function InfoRow({ label, value, mono = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" py={0.7} sx={{ borderBottom: '1px solid', borderColor: 'grey.100' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: mono ? 'monospace' : undefined }}>
                {value ?? '—'}
            </Typography>
        </Stack>
    );
}

function formatDuration(ms) {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

export default function Page({ run, emails }) {
    const items  = emails?.data ?? [];
    const runSt  = STATUS_RUN_MAP[run?.status] ?? { label: run?.status, color: 'default' };

    const successCount = items.filter(e => e.status === 'success').length;
    const failedCount  = items.filter(e => e.status === 'failed').length;
    const skippedCount = items.filter(e => e.status === 'skipped').length;

    return (
        <Layout
            titlePage={`Run: ${run?.run_code}`}
            menu="integracoes"
            subMenu="config-import-history"
            breadcrumbs={[
                { label: 'Configurações' },
                { label: 'Histórico', href: safeRoute('admin.import-history.index') },
                { label: run?.run_code ?? 'Detalhes' },
            ]}
        >
            <Head title={`Run ${run?.run_code}`} />

            <Stack spacing={3}>
                <Button component={Link} href={safeRoute('admin.import-history.index')}
                    startIcon={<IconArrowLeft size={16} />} variant="text" size="small" sx={{ alignSelf: 'flex-start' }}>
                    Voltar ao histórico
                </Button>

                {/* ── Cabeçalho do run ────────────────────────────── */}
                <Card sx={{ background: 'var(--cv-gradient-hero)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Execução de importação
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em', mt: 0.3 }}>
                                    {run?.run_code}
                                </Typography>
                                <Stack direction="row" gap={1.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                    <Chip label={runSt.label} color={runSt.color} size="small" />
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Iniciado: {run?.started_at ? new Date(run.started_at).toLocaleString('pt-BR') : '—'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Duração: {formatDuration(run?.duration_ms)}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Métricas inline */}
                        <Stack direction="row" gap={3} sx={{ mt: 2.5, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Processados', value: run?.total_processed ?? 0 },
                                { label: 'Importados',  value: run?.total_imported  ?? 0, color: '#6ee7b7' },
                                { label: 'Ignorados',   value: run?.total_skipped   ?? 0 },
                                { label: 'Falhas',      value: run?.total_failed    ?? 0, color: run?.total_failed > 0 ? '#fca5a5' : undefined },
                            ].map(m => (
                                <Box key={m.label} sx={{ textAlign: 'center' }}>
                                    <Typography sx={{ fontWeight: 950, fontSize: 22, letterSpacing: '-0.04em', color: m.color ?? '#fff' }}>
                                        {m.value}
                                    </Typography>
                                    <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {m.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                {run?.error_message && (
                    <Alert severity="error" icon={<IconAlertTriangle size={18} />}>
                        <strong>Erro fatal:</strong> {run.error_message}
                    </Alert>
                )}

                {/* ── Detalhes do run + Tabela de emails ────────────── */}
                <Grid container spacing={3}>
                    {/* Info do run */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconHistory size={17} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900 }}>Informações do Run</Typography>
                                </Stack>
                                <Divider sx={{ mb: 1.5 }} />
                                <Stack spacing={0}>
                                    <InfoRow label="Código"          value={run?.run_code} mono />
                                    <InfoRow label="Status"          value={runSt.label} />
                                    <InfoRow label="Acionamento"     value={{ scheduler: 'Agendador', manual: 'Manual', command: 'Comando' }[run?.triggered_by] ?? run?.triggered_by} />
                                    {run?.triggered_by_user && <InfoRow label="Usuário" value={run.triggered_by_user.name} />}
                                    <InfoRow label="Início"          value={run?.started_at ? new Date(run.started_at).toLocaleString('pt-BR') : '—'} />
                                    <InfoRow label="Fim"             value={run?.finished_at ? new Date(run.finished_at).toLocaleString('pt-BR') : '—'} />
                                    <InfoRow label="Duração"         value={formatDuration(run?.duration_ms)} mono />
                                    <InfoRow label="Configs"         value={run?.total_settings} />
                                    <InfoRow label="Emails totais"   value={run?.total_processed} />
                                    <InfoRow label="Importados"      value={run?.total_imported} />
                                    <InfoRow label="Ignorados"       value={run?.total_skipped} />
                                    <InfoRow label="Falhas"          value={run?.total_failed} />
                                    {run?.client_profile && <InfoRow label="Cliente" value={run.client_profile.client_code} />}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Emails processados */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                                <Stack direction="row" alignItems="center" gap={1.5}>
                                    <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconMail size={17} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '0.9375rem' }}>
                                        Emails Processados ({emails?.total ?? 0})
                                    </Typography>
                                    <Stack direction="row" gap={0.5} sx={{ ml: 'auto' }}>
                                        {successCount > 0 && <Chip label={`${successCount} ok`} color="success" size="small" />}
                                        {failedCount  > 0 && <Chip label={`${failedCount} falha`} color="error" size="small" />}
                                        {skippedCount > 0 && <Chip label={`${skippedCount} ignorado`} size="small" />}
                                    </Stack>
                                </Stack>
                            </Box>

                            <TableContainer sx={{ overflowX: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Arquivo / Assunto</TableCell>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Email vinculado</TableCell>
                                            <TableCell>Remetente</TableCell>
                                            <TableCell>Recebido</TableCell>
                                            <TableCell>Duração</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Falha em</TableCell>
                                            <TableCell align="right">PDF</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                                    Nenhum email processado neste run.
                                                </TableCell>
                                            </TableRow>
                                        ) : items.map(email => {
                                            const est = STATUS_EMAIL_MAP[email.status] ?? { label: email.status, color: 'default' };
                                            return (
                                                <TableRow key={email.id} hover sx={{ bgcolor: email.status === 'failed' ? 'rgba(220,38,38,0.03)' : undefined }}>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }} noWrap>
                                                            {email.attachment_name ?? '—'}
                                                        </Typography>
                                                        {email.subject && (
                                                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                                                                {email.subject}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                            {email.client_profile?.razao_social || email.client_profile?.nome_fantasia || email.client_profile?.nome || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {email.setting?.email_account?.email ?? '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {email.from_email ?? '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption">
                                                            {email.received_at ? new Date(email.received_at).toLocaleDateString('pt-BR') : '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                                            {formatDuration(email.duration_ms)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" gap={0.5} alignItems="center">
                                                            <Chip label={est.label} color={est.color} size="small" />
                                                            {email.retry_count > 0 && (
                                                                <Tooltip title="Esta importação já foi tentada novamente automaticamente">
                                                                    <Chip label={`${email.retry_count}ª tentativa`} size="small" variant="outlined" />
                                                                </Tooltip>
                                                            )}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        {email.step_failed ? (
                                                            <Tooltip title={email.error_message ?? ''}>
                                                                <Chip
                                                                    label={STEP_LABELS[email.step_failed] ?? email.step_failed}
                                                                    color="error" size="small" variant="outlined"
                                                                    icon={<IconAlertTriangle size={11} />}
                                                                />
                                                            </Tooltip>
                                                        ) : '—'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {email.bill ? (
                                                            <Stack direction="row" gap={0.5} justifyContent="flex-end">
                                                                <Tooltip title="Ver fatura de concessionária">
                                                                    <Button component={Link}
                                                                        href={safeRoute('consultor.cliente.faturas.show', email.bill.id)}
                                                                        size="small" variant="text" sx={{ minWidth: 0, px: 1 }}>
                                                                        <IconEye size={15} />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip title="Baixar PDF">
                                                                    <Button component="a"
                                                                        href={safeRoute('admin.import-history.email.pdf', email.id)}
                                                                        target="_blank" size="small" variant="text" sx={{ minWidth: 0, px: 1 }}>
                                                                        <IconDownload size={15} />
                                                                    </Button>
                                                                </Tooltip>
                                                            </Stack>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">—</Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {emails?.links && (
                                <Box sx={{ px: 2.5, py: 1.25, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'grey.100' }}>
                                    <DataTablePagination links={emails.links} meta={{ from: emails.from, to: emails.to, total: emails.total }} />
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

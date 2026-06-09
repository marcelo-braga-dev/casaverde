import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconAlertTriangle,
    IconArrowLeft,
    IconCheck,
    IconCircleCheck,
    IconDeviceFloppy,
    IconExternalLink,
    IconFileInvoice,
    IconUser,
} from "@tabler/icons-react";

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const REVIEW_STATUS_MAP = {
    pending_review: { label: 'Pendente',  color: 'warning' },
    reviewed:       { label: 'Revisado',  color: 'info' },
    approved:       { label: 'Aprovada',  color: 'success' },
    rejected:       { label: 'Rejeitada', color: 'error' },
};

function InfoRow({ label, value }) {
    return (
        <Stack direction="row" justifyContent="space-between" py={0.8} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value ?? '—'}</Typography>
        </Stack>
    );
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

export default function Page({ bill, suggestedUsinaId, reviewStatuses = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        usina_id:            bill.usina_id ?? suggestedUsinaId ?? "",
        reference_month:     bill.reference_month ?? "",
        reference_year:      bill.reference_year ?? "",
        unidade_consumidora: bill.unidade_consumidora ?? "",
        numero_instalacao:   bill.numero_instalacao ?? "",
        vencimento:          bill.vencimento ?? "",
        valor_total:         bill.valor_total ?? "",
        consumo_kwh:         bill.consumo_kwh ?? "",
        notes:               bill.notes ?? "",
        review_status:       bill.review_status ?? "reviewed",
    });

    const submit = (e) => {
        e.preventDefault();
        put(safeRoute("admin.faturas.update", bill.id));
    };

    const resolveIssue = (issueId) => {
        router.post(safeRoute("admin.faturas.issues.resolve", issueId), {}, { preserveScroll: true });
    };

    const approveBill = () => {
        router.post(safeRoute("admin.faturas.approve", bill.id), {}, { preserveScroll: true });
    };

    const st = REVIEW_STATUS_MAP[bill.review_status] ?? { label: bill.review_status, color: 'default' };
    const openIssues = (bill.issues ?? []).filter(i => !i.is_resolved);

    return (
        <Layout
            titlePage="Revisão de Fatura"
            menu="financeiro"
            breadcrumbs={[
                { label: 'Financeiro' },
                { label: 'Faturas', href: safeRoute('admin.faturas.index') },
                { label: bill.reference_label ?? `#${bill.id}` },
            ]}
        >
            <Head title={`Fatura ${bill.reference_label ?? `#${bill.id}`}`} />

            <Stack spacing={3}>
                <Button href={safeRoute('admin.faturas.index')} variant="text" size="small"
                    startIcon={<IconArrowLeft size={16} />} sx={{ alignSelf: 'flex-start' }}>
                    Voltar
                </Button>

                {/* Hero */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(59,130,246,0.15)' }}>
                    <Box sx={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8,#3b82f6)', p: { xs: 2.5, md: 3 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap={2}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconFileInvoice size={28} style={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950, color: '#fff', letterSpacing: '-0.04em' }}>
                                        {bill.reference_label ?? `Fatura #${bill.id}`}
                                    </Typography>
                                    <Stack direction="row" gap={1} mt={0.5} flexWrap="wrap" alignItems="center">
                                        <Chip label={st.label} color={st.color} size="small"
                                            sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} />
                                        {bill.import_source && (
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Origem: {bill.import_source}
                                            </Typography>
                                        )}
                                        {openIssues.length > 0 && (
                                            <Chip label={`${openIssues.length} pendência${openIssues.length > 1 ? 's' : ''}`}
                                                size="small" color="error" icon={<IconAlertTriangle size={11} />}
                                                sx={{ fontWeight: 700 }} />
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                            <Stack direction="row" gap={1}>
                                {bill.review_status !== 'approved' && (
                                    <Button variant="contained" startIcon={<IconCircleCheck size={16} />} onClick={approveBill}
                                        sx={{ bgcolor: 'rgba(16,185,129,0.9)', color: '#fff', '&:hover': { bgcolor: '#059669' }, fontWeight: 700 }}>
                                        Aprovar
                                    </Button>
                                )}
                                {bill.pdf_link && (
                                    <Button component="a" href={bill.pdf_link} target="_blank" variant="outlined" size="small"
                                        startIcon={<IconExternalLink size={14} />}
                                        sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.35)' }}>
                                        PDF
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Box>
                </Card>

                {/* Main grid */}
                <Grid container spacing={3}>
                    {/* Dados gerais */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconUser size={18} />} title="Cliente e Contexto"
                                    gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" />
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={0}>
                                    <InfoRow label="Cliente" value={bill.client_profile?.display_name ?? bill.client_profile?.nome ?? bill.client_profile?.razao_social} />
                                    <InfoRow label="Documento" value={bill.client_profile?.documento} />
                                    <InfoRow label="Referência" value={bill.reference_label} />
                                    <InfoRow label="Concessionária" value={bill.concessionaria?.nome} />
                                    <InfoRow label="Parser" value={bill.parser_status} />
                                    <InfoRow label="Status revisão" value={st.label} />
                                    <InfoRow label="Criado por" value={bill.created_by?.name} />
                                    <InfoRow label="Revisado por" value={bill.reviewed_by?.name} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Edição + Pendências */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={3}>
                            {/* Pendências */}
                            {openIssues.length > 0 && (
                                <Alert severity="warning" icon={<IconAlertTriangle size={18} />}>
                                    <strong>{openIssues.length} pendência(s) não resolvida(s)</strong> — corrija antes de aprovar.
                                </Alert>
                            )}

                            {(bill.issues ?? []).length > 0 && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader icon={<IconAlertTriangle size={18} />} title="Divergências"
                                            gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack spacing={1.5}>
                                            {bill.issues.map(issue => (
                                                <Box key={issue.id} sx={{
                                                    p: 2, borderRadius: 2,
                                                    bgcolor: issue.is_resolved ? 'grey.50' : (issue.severity === 'error' ? '#fff5f5' : '#fffbeb'),
                                                    border: '1px solid',
                                                    borderColor: issue.is_resolved ? 'divider' : (issue.severity === 'error' ? '#fee2e2' : '#fef3c7'),
                                                }}>
                                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                        <Box>
                                                            <Stack direction="row" gap={1} mb={0.5}>
                                                                <Chip label={`${issue.issue_code} — ${issue.severity}`}
                                                                    size="small"
                                                                    color={issue.is_resolved ? 'default' : (issue.severity === 'error' ? 'error' : 'warning')}
                                                                    variant={issue.is_resolved ? 'outlined' : 'filled'} />
                                                                {issue.is_resolved && <Chip label="Resolvida" size="small" color="success" />}
                                                            </Stack>
                                                            <Typography variant="body2">{issue.message}</Typography>
                                                        </Box>
                                                        {!issue.is_resolved && (
                                                            <Button variant="outlined" size="small" startIcon={<IconCheck size={13} />}
                                                                onClick={() => resolveIssue(issue.id)}>
                                                                Resolver
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Form de edição */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader icon={<IconDeviceFloppy size={18} />} title="Revisar / Corrigir Fatura"
                                        gradient="var(--cv-gradient-primary)" />
                                    <Divider sx={{ mb: 2.5 }} />
                                    <form onSubmit={submit}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 6, md: 3 }}>
                                                <TextField label="Mês" value={data.reference_month}
                                                    onChange={e => setData('reference_month', e.target.value)}
                                                    error={!!errors.reference_month} helperText={errors.reference_month}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={{ xs: 6, md: 3 }}>
                                                <TextField label="Ano" value={data.reference_year}
                                                    onChange={e => setData('reference_year', e.target.value)}
                                                    error={!!errors.reference_year} helperText={errors.reference_year}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField label="Unidade Consumidora" value={data.unidade_consumidora}
                                                    onChange={e => setData('unidade_consumidora', e.target.value)}
                                                    error={!!errors.unidade_consumidora} helperText={errors.unidade_consumidora}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField label="Número da instalação" value={data.numero_instalacao}
                                                    onChange={e => setData('numero_instalacao', e.target.value)}
                                                    error={!!errors.numero_instalacao} helperText={errors.numero_instalacao}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <TextField label="Vencimento" type="date" value={data.vencimento}
                                                    onChange={e => setData('vencimento', e.target.value)}
                                                    slotProps={{ inputLabel: { shrink: true } }}
                                                    error={!!errors.vencimento} helperText={errors.vencimento}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={{ xs: 6, md: 3 }}>
                                                <TextField label="Valor Total (R$)" value={data.valor_total}
                                                    onChange={e => setData('valor_total', e.target.value)}
                                                    error={!!errors.valor_total} helperText={errors.valor_total}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={{ xs: 6, md: 3 }}>
                                                <TextField label="Consumo (kWh)" value={data.consumo_kwh}
                                                    onChange={e => setData('consumo_kwh', e.target.value)}
                                                    error={!!errors.consumo_kwh} helperText={errors.consumo_kwh}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <TextField label="Status da revisão" select value={data.review_status}
                                                    onChange={e => setData('review_status', e.target.value)}
                                                    error={!!errors.review_status} helperText={errors.review_status}
                                                    fullWidth size="small">
                                                    {reviewStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                            <Grid size={12}>
                                                <TextField label="Observações" multiline minRows={3} value={data.notes}
                                                    onChange={e => setData('notes', e.target.value)}
                                                    error={!!errors.notes} helperText={errors.notes}
                                                    fullWidth size="small" />
                                            </Grid>
                                            <Grid size={12}>
                                                <Button type="submit" variant="contained" disabled={processing}
                                                    startIcon={<IconDeviceFloppy size={16} />} sx={{ fontWeight: 700 }}>
                                                    Salvar revisão
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>

                                    {bill.raw_text && (
                                        <>
                                            <Divider sx={{ my: 3 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>
                                                Texto extraído do PDF
                                            </Typography>
                                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', maxHeight: 300, overflowY: 'auto' }}>
                                                <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 11, m: 0 }}>
                                                    {bill.raw_text}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

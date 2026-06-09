import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconArrowLeft,
    IconBolt,
    IconCode,
    IconRefresh,
    IconWebhook,
} from "@tabler/icons-react";

const STATUS_MAP = {
    received:  { label: 'Recebido',   color: 'default' },
    processed: { label: 'Processado', color: 'success' },
    ignored:   { label: 'Ignorado',   color: 'warning' },
    failed:    { label: 'Falhou',     color: 'error' },
};

const PROVIDER_LABELS = { cora: 'Cora' };

function InfoRow({ label, value, mono = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            py={0.8} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: mono ? 'monospace' : undefined }}>
                {value ?? '—'}
            </Typography>
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

function JsonBlock({ value }) {
    if (!value) return <Typography variant="body2" color="text.secondary">Nenhum dado registrado.</Typography>;
    return (
        <TextField
            value={JSON.stringify(value, null, 2)}
            multiline
            minRows={8}
            fullWidth
            slotProps={{
                input: { readOnly: true, sx: { fontFamily: 'monospace', fontSize: 12 } },
            }}
        />
    );
}

function formatDate(v) {
    if (!v) return '—';
    try { return new Date(v).toLocaleString('pt-BR'); } catch { return v; }
}

export default function Page({ event }) {
    const st = STATUS_MAP[event.status] ?? { label: event.status, color: 'default' };
    const canReprocess = ["failed", "ignored", "received"].includes(event.status);

    const reprocess = () => {
        router.post(route("admin.financeiro.payment-webhooks.reprocess", event.id), {}, { preserveScroll: true });
    };

    const charge = event.payment_slip?.charge ?? null;
    const client = charge?.client_profile ?? null;

    return (
        <Layout
            titlePage="Webhook de Pagamento"
            menu="financeiro"
            breadcrumbs={[
                { label: 'Financeiro' },
                { label: 'Webhooks', href: route('admin.financeiro.payment-webhooks.index') },
                { label: `#${event.id}` },
            ]}
        >
            <Head title={`Webhook #${event.id}`} />

            <Stack spacing={3}>
                <Button component={Link} href={route('admin.financeiro.payment-webhooks.index')}
                    startIcon={<IconArrowLeft size={16} />} variant="text" size="small" sx={{ alignSelf: 'flex-start' }}>
                    Voltar
                </Button>

                {/* Hero */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)', overflow: 'hidden' }}>
                    <Box sx={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', p: { xs: 2.5, md: 3 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap={2}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconWebhook size={26} style={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950, color: '#fff', letterSpacing: '-0.04em' }}>
                                        Webhook #{event.id}
                                    </Typography>
                                    <Stack direction="row" gap={1} mt={0.6} flexWrap="wrap" alignItems="center">
                                        <Chip label={st.label} color={st.color} size="small"
                                            sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                                            {PROVIDER_LABELS[event.provider] ?? event.provider}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                                            · {event.event_type ?? '—'}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                            {canReprocess && (
                                <Tooltip title="Reprocessar este webhook">
                                    <Button variant="contained" startIcon={<IconRefresh size={16} />} onClick={reprocess}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, fontWeight: 700 }}>
                                        Reprocessar
                                    </Button>
                                </Tooltip>
                            )}
                        </Stack>
                    </Box>
                </Card>

                {event.error_message && (
                    <Alert severity="error"><strong>Erro:</strong> {event.error_message}</Alert>
                )}

                {/* Main grid */}
                <Grid container spacing={3}>
                    {/* Dados do evento */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconWebhook size={18} />} title="Dados do Evento"
                                    gradient="linear-gradient(135deg,#312e81,#1e1b4b)" />
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={0}>
                                    <InfoRow label="ID interno" value={`#${event.id}`} mono />
                                    <InfoRow label="ID externo" value={event.event_id} mono />
                                    <InfoRow label="Provider" value={PROVIDER_LABELS[event.provider] ?? event.provider} />
                                    <InfoRow label="Tipo do evento" value={event.event_type} />
                                    <InfoRow label="ID pagamento provider" value={event.provider_payment_id} mono />
                                    <InfoRow label="Status" value={st.label} />
                                    <InfoRow label="Tentativas" value={event.attempts ?? 0} />
                                    <InfoRow label="Última tentativa" value={formatDate(event.last_attempt_at)} />
                                    <InfoRow label="Processado em" value={formatDate(event.processed_at)} />
                                    <InfoRow label="Recebido em" value={formatDate(event.created_at)} />
                                </Stack>

                                {event.payment_slip && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Button component={Link} variant="outlined" fullWidth size="small"
                                            href={route("admin.financeiro.pagamentos.show", event.payment_slip.id)}>
                                            Ver pagamento vinculado
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Cliente / Cobrança */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconBolt size={18} />} title="Cobrança Associada"
                                    gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" />
                                <Divider sx={{ mb: 2 }} />
                                {charge ? (
                                    <Stack spacing={0}>
                                        <InfoRow label="Cobrança" value={`#${charge.id}`} mono />
                                        <InfoRow label="Referência" value={charge.reference_label} />
                                        <InfoRow label="Cliente" value={client?.display_name ?? client?.nome ?? client?.razao_social} />
                                        <InfoRow label="Valor" value={charge.final_amount != null ? `R$ ${Number(charge.final_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : null} />
                                        <Divider sx={{ my: 2 }} />
                                        <Button component={Link} variant="outlined" fullWidth size="small"
                                            href={route("admin.cobrancas.show", charge.id)}>
                                            Ver cobrança
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhuma cobrança vinculada a este webhook.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Headers + Payload */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconCode size={18} />} title="Headers"
                                    gradient="linear-gradient(135deg,#64748b,#475569)" />
                                <Divider sx={{ mb: 2 }} />
                                <JsonBlock value={event.headers} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconCode size={18} />} title="Payload"
                                    gradient="linear-gradient(135deg,#64748b,#475569)" />
                                <Divider sx={{ mb: 2 }} />
                                <JsonBlock value={event.payload} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

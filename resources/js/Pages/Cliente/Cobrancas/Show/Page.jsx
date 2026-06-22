import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
import { Head, Link } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconArrowLeft,
    IconCalendar,
    IconCash,
    IconCircleCheck,
    IconClock,
    IconFileInvoice,
    IconLeaf,
    IconWallet,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    draft:           { label: 'Rascunho',         color: 'default',  gradient: 'linear-gradient(135deg,#6b7280,#4b5563)' },
    open:            { label: 'Em Aberto',         color: 'warning',  gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
    waiting_payment: { label: 'Aguardando Pgto.',  color: 'info',     gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
    paid:            { label: 'Pago',              color: 'success',  gradient: 'linear-gradient(135deg,#10b981,#059669)' },
    overdue:         { label: 'Vencido',           color: 'error',    gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
    cancelled:       { label: 'Cancelado',         color: 'default',  gradient: 'linear-gradient(135deg,#6b7280,#4b5563)' },
};

const STATUS_TIMELINE = [
    { key: 'draft',           icon: <IconClock size={14} />,        label: 'Gerada' },
    { key: 'open',            icon: <IconFileInvoice size={14} />,  label: 'Em Aberto' },
    { key: 'waiting_payment', icon: <IconWallet size={14} />,       label: 'Ag. Pagamento' },
    { key: 'paid',            icon: <IconCircleCheck size={14} />,  label: 'Pago' },
];

const STATUS_ORDER = ['draft', 'open', 'waiting_payment', 'paid'];

function SectionHeader({ icon, title, gradient }) {
    return (
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
            <Box sx={{
                width: 36, height: 36, borderRadius: 2,
                background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                flexShrink: 0,
            }}>
                {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.03em' }}>{title}</Typography>
        </Stack>
    );
}

function InfoRow({ label, value, highlight = false, mono = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.8}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{
                fontWeight: highlight ? 900 : 700,
                color: highlight ? 'primary.main' : undefined,
                fontFamily: mono ? 'monospace' : undefined,
            }}>
                {value ?? '—'}
            </Typography>
        </Stack>
    );
}

function StatusTimeline({ status }) {
    const currentIndex = STATUS_ORDER.indexOf(status);
    if (status === 'overdue') {
        return (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
                Esta cobrança está <strong>vencida</strong>. Entre em contato com o suporte se precisar de ajuda.
            </Alert>
        );
    }
    if (status === 'cancelled') {
        return (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                Esta cobrança foi <strong>cancelada</strong>.
            </Alert>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Box sx={{
                position: 'absolute', top: 17, left: 18, right: 18,
                height: 2, bgcolor: 'grey.200', zIndex: 0,
            }} />
            <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                {STATUS_TIMELINE.map((step, i) => {
                    const done = i <= currentIndex;
                    const active = i === currentIndex;
                    return (
                        <Stack key={step.key} alignItems="center" gap={0.8} sx={{ flex: 1 }}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                bgcolor: done ? (active ? 'primary.main' : 'success.main') : 'grey.200',
                                color: done ? '#fff' : 'text.disabled',
                                border: active ? '3px solid' : '2px solid',
                                borderColor: active ? 'primary.light' : (done ? 'success.light' : 'grey.300'),
                                transition: 'all 0.2s',
                            }}>
                                {step.icon}
                            </Box>
                            <Typography variant="caption" sx={{
                                fontWeight: done ? 700 : 400,
                                color: done ? (active ? 'primary.main' : 'success.main') : 'text.disabled',
                                textAlign: 'center', lineHeight: 1.2,
                            }}>
                                {step.label}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
        </Box>
    );
}

export default function Page({ cobranca }) {
    const st = STATUS_MAP[cobranca?.status] ?? { label: cobranca?.status, color: 'default', gradient: 'linear-gradient(135deg,#6b7280,#4b5563)' };

    const original = cobranca?.original_amount ?? 0;
    const desconto = cobranca?.discount_amount ?? 0;
    const manualDesc = cobranca?.manual_discount_amount ?? 0;
    const manualAcr = cobranca?.manual_addition_amount ?? 0;
    const final = cobranca?.final_amount ?? 0;
    const economiaPercent = original > 0 ? ((desconto / original) * 100).toFixed(1) : 0;
    const savingPct = original > 0 ? Math.min(100, (desconto / original) * 100) : 0;

    return (
        <Layout
            titlePage="Detalhe da Cobrança"
            menu="cliente-cobrancas"
            subMenu="cliente-cobrancas-index"
            breadcrumbs={[
                { label: 'Cliente' },
                { label: 'Cobranças', href: safeRoute('cliente.cobrancas.index') },
                { label: cobranca?.reference_label ?? 'Detalhe' },
            ]}
        >
            <Head title="Cobrança" />

            <Stack spacing={3}>
                <Button
                    component={Link}
                    href={safeRoute('cliente.cobrancas.index')}
                    startIcon={<IconArrowLeft size={16} />}
                    variant="text"
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                >
                    Voltar às cobranças
                </Button>

                {/* ── Hero Card ──────────────────────────────────────────── */}
                <Card sx={{
                    background: st.gradient,
                    color: '#fff',
                    borderRadius: 'var(--cv-radius-xl)',
                    boxShadow: 'var(--cv-shadow-md)',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <Box sx={{
                        position: 'absolute', top: -40, right: -40,
                        width: 200, height: 200,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.08)',
                        pointerEvents: 'none',
                    }} />
                    <Box sx={{
                        position: 'absolute', bottom: -60, right: 60,
                        width: 160, height: 160,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        pointerEvents: 'none',
                    }} />
                    <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={3}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.18)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <IconWallet size={28} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>
                                        Cobrança
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.2 }}>
                                        {cobranca?.reference_label ?? '—'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} gap={1}>
                                <Chip
                                    label={st.label}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 800, fontSize: 13 }}
                                />
                                <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-0.05em' }}>
                                    {formatMoney(final)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                                    valor a pagar
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* ── Coluna principal ────────────────────────────────── */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={3}>
                            {/* Linha do tempo de status */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconClock size={18} />}
                                        title="Progresso do Pagamento"
                                        gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)"
                                    />
                                    <Divider sx={{ mb: 3 }} />
                                    <StatusTimeline status={cobranca?.status} />
                                </CardContent>
                            </Card>

                            {/* Cálculo visual */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconWallet size={18} />}
                                        title="Composição do Valor"
                                        gradient="var(--cv-gradient-primary)"
                                    />
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={0}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
                                            <Typography variant="body2" color="text.secondary">Consumo Injetado</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(original)}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
                                            <Stack direction="row" alignItems="center" gap={0.5}>
                                                <Typography variant="body2" color="success.dark">
                                                    Desconto solar
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" color="success.dark" sx={{ fontWeight: 700 }}>
                                                -{formatMoney(desconto)}
                                            </Typography>
                                        </Stack>
                                        {manualDesc > 0 && (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
                                                <Typography variant="body2" color="success.dark">Desconto manual</Typography>
                                                <Typography variant="body2" color="success.dark" sx={{ fontWeight: 700 }}>-{formatMoney(manualDesc)}</Typography>
                                            </Stack>
                                        )}
                                        {manualAcr > 0 && (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
                                                <Typography variant="body2" color="error.main">Acréscimo manual</Typography>
                                                <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>+{formatMoney(manualAcr)}</Typography>
                                            </Stack>
                                        )}
                                    </Stack>

                                    <Box sx={{ bgcolor: 'primary.50', borderRadius: 2, p: 2, mt: 1, border: '1px solid', borderColor: 'primary.100' }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Total a pagar</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 950, color: 'primary.main', letterSpacing: '-0.04em' }}>
                                                {formatMoney(final)}
                                            </Typography>
                                        </Stack>
                                    </Box>

                                    <Stack spacing={1} sx={{ mt: 2 }}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">Desconto aplicado</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>{economiaPercent}%</Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={savingPct}
                                            color="success"
                                            sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            Você paga {formatMoney(final)} em vez de {formatMoney(original)}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Datas */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconCalendar size={18} />}
                                        title="Datas"
                                        gradient="linear-gradient(135deg,#f59e0b,#d97706)"
                                    />
                                    <Divider sx={{ mb: 1 }} />
                                    <Stack spacing={0}>
                                        <InfoRow label="Competência"   value={cobranca?.reference_label} />
                                        <InfoRow label="Vencimento"    value={cobranca?.due_date ? new Date(cobranca.due_date).toLocaleDateString('pt-BR') : null} />
                                        {cobranca?.paid_at && (
                                            <InfoRow label="Pago em" value={new Date(cobranca.paid_at).toLocaleDateString('pt-BR')} highlight />
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* ── Coluna lateral ──────────────────────────────────── */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={3}>
                            {/* Economia em destaque */}
                            <Card sx={{
                                borderRadius: 'var(--cv-radius-xl)',
                                background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
                                border: '1px solid #a7f3d0',
                                boxShadow: 'var(--cv-shadow-md)',
                                overflow: 'hidden',
                                position: 'relative',
                            }}>
                                <Box sx={{
                                    position: 'absolute', top: -20, right: -20,
                                    width: 100, height: 100, borderRadius: '50%',
                                    bgcolor: 'rgba(16,185,129,0.12)',
                                    pointerEvents: 'none',
                                }} />
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Box sx={{
                                        width: 52, height: 52, borderRadius: '50%',
                                        bgcolor: '#d1fae5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mx: 'auto', mb: 2,
                                        border: '2px solid #6ee7b7',
                                    }}>
                                        <IconLeaf size={24} color="#059669" />
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: 10 }}>
                                        Sua economia este mês
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 950, color: '#059669', letterSpacing: '-0.05em', mt: 0.5 }}>
                                        {formatMoney(desconto)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#065f46', mt: 0.5 }}>
                                        {economiaPercent}% de desconto sobre {formatMoney(original)}
                                    </Typography>
                                    {manualDesc > 0 && (
                                        <Chip
                                            label={`+ ${formatMoney(manualDesc)} desconto manual`}
                                            size="small"
                                            sx={{ mt: 1.5, bgcolor: '#a7f3d0', color: '#065f46', fontWeight: 700 }}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Fatura vinculada */}
                            {cobranca?.bill && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent>
                                        <SectionHeader
                                            icon={<IconFileInvoice size={18} />}
                                            title="Fatura de Origem"
                                            gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)"
                                        />
                                        <Divider sx={{ mb: 1 }} />
                                        <Stack spacing={0}>
                                            <InfoRow label="Concessionária" value={cobranca.bill.concessionaria?.nome} />
                                            <InfoRow label="Competência"    value={cobranca.bill.reference_label} />
                                            <InfoRow label="Consumo"        value={cobranca.bill.consumo_kwh ? `${cobranca.bill.consumo_kwh} kWh` : null} />
                                            <InfoRow label="Valor total"    value={formatMoney(cobranca.bill.valor_total ?? 0)} highlight />
                                        </Stack>
                                        <Button
                                            fullWidth
                                            component={Link}
                                            href={safeRoute('cliente.faturas.show', cobranca.bill.id)}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 2, borderRadius: 2 }}
                                            startIcon={<IconFileInvoice size={15} />}
                                        >
                                            Ver fatura completa
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Resumo rápido */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconCash size={18} />}
                                        title="Resumo Rápido"
                                        gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
                                    />
                                    <Divider sx={{ mb: 1 }} />
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: 'Original',  value: formatMoney(original),  color: 'text.primary' },
                                            { label: 'Desconto',  value: `-${formatMoney(desconto)}`, color: 'success.main' },
                                            { label: 'Final',     value: formatMoney(final),     color: 'primary.main' },
                                            { label: 'Economia',  value: `${economiaPercent}%`,  color: 'success.dark' },
                                        ].map(item => (
                                            <Grid key={item.label} size={{ xs: 6 }}>
                                                <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 950, color: item.color }}>{item.value}</Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

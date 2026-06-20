import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
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
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconArrowLeft,
    IconBolt,
    IconBuilding,
    IconCalendar,
    IconDownload,
    IconFileInvoice,
    IconReceipt,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    approved:       { label: 'Aprovada',   color: 'success', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
    pending_review: { label: 'Em Revisão', color: 'warning', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
    reviewed:       { label: 'Revisada',   color: 'info',    gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
    corrected:      { label: 'Corrigida',  color: 'info',    gradient: 'linear-gradient(135deg,#14b8a6,#0d9488)' },
    rejected:       { label: 'Rejeitada',  color: 'error',   gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
};

const CHARGE_STATUS = {
    draft:           { label: 'Rascunho',     color: 'default' },
    open:            { label: 'Em Aberto',    color: 'warning' },
    waiting_payment: { label: 'Ag. Pgto',     color: 'info' },
    paid:            { label: 'Pago',         color: 'success' },
    overdue:         { label: 'Vencido',      color: 'error' },
    cancelled:       { label: 'Cancelado',    color: 'default' },
};

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

function InfoRow({ label, value, highlight = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.8}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{
                fontWeight: highlight ? 900 : 700,
                color: highlight ? 'primary.main' : undefined,
            }}>
                {value ?? '—'}
            </Typography>
        </Stack>
    );
}

function MetricBox({ label, value, unit, color = 'primary.main', bg = 'grey.50' }) {
    return (
        <Box sx={{ bgcolor: bg, borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.3 }}>{label}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 950, color, letterSpacing: '-0.03em' }}>{value}</Typography>
            {unit && <Typography variant="caption" color="text.secondary">{unit}</Typography>}
        </Box>
    );
}

export default function Page({ fatura, charge }) {
    const st = STATUS_MAP[fatura?.review_status] ?? { label: fatura?.review_status, color: 'default', gradient: 'linear-gradient(135deg,#6b7280,#4b5563)' };
    const cs = charge ? (CHARGE_STATUS[charge.status] ?? { label: charge.status, color: 'default' }) : null;

    const consumo = parseFloat(fatura?.consumo_kwh ?? 0);
    const injetado = parseFloat(fatura?.energia_injetada_kwh ?? 0);
    const compensado = parseFloat(fatura?.energia_compensada_kwh ?? 0);
    const saldo = parseFloat(fatura?.saldo_kwh ?? 0);

    return (
        <Layout
            titlePage="Detalhe da Fatura"
            menu="cliente-faturas"
            subMenu="cliente-faturas-index"
            breadcrumbs={[
                { label: 'Cliente' },
                { label: 'Faturas', href: safeRoute('cliente.faturas.index') },
                { label: fatura?.reference_label ?? 'Detalhe' },
            ]}
        >
            <Head title="Fatura de Energia" />

            <Stack spacing={3}>
                {/* Back + download */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button
                        component={Link}
                        href={safeRoute('cliente.faturas.index')}
                        startIcon={<IconArrowLeft size={16} />}
                        variant="text"
                        size="small"
                    >
                        Voltar às faturas
                    </Button>
                    {fatura?.pdf_url && (
                        <Button
                            component="a"
                            href={fatura.pdf_url}
                            target="_blank"
                            variant="contained"
                            size="small"
                            startIcon={<IconDownload size={15} />}
                        >
                            Baixar PDF
                        </Button>
                    )}
                </Stack>

                {/* ── Hero ────────────────────────────────────────────────── */}
                <Card sx={{
                    background: st.gradient,
                    color: '#fff',
                    borderRadius: 'var(--cv-radius-xl)',
                    boxShadow: 'var(--cv-shadow-md)',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <Box sx={{
                        position: 'absolute', top: -50, right: -30,
                        width: 220, height: 220, borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
                    }} />
                    <Box sx={{
                        position: 'absolute', bottom: -70, left: 80,
                        width: 180, height: 180, borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
                    }} />
                    <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={3}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.18)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <IconBolt size={28} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>
                                        Fatura de Energia
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.2 }}>
                                        {fatura?.reference_label ?? '—'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.3 }}>
                                        {fatura?.concessionaria?.nome ?? '—'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} gap={1}>
                                <Chip
                                    label={st.label}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 800, fontSize: 13 }}
                                />
                                <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-0.05em' }}>
                                    {formatMoney(fatura?.valor_total ?? 0)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                                    valor total da concessionária
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Métricas rápidas no hero */}
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            {[
                                { label: 'Consumo', value: `${consumo.toFixed(0)} kWh` },
                                { label: 'Vencimento', value: fatura?.vencimento ? new Date(fatura.vencimento).toLocaleDateString('pt-BR') : '—' },
                                { label: 'UC', value: fatura?.unidade_consumidora ?? '—' },
                                { label: 'Nº Instalação', value: fatura?.numero_instalacao ?? '—' },
                            ].map(item => (
                                <Grid key={item.label} size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.3 }}>{item.label}</Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff' }}>{item.value}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* ── Coluna principal ─────────────────────────────────── */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={3}>
                            {/* Dados da fatura */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconFileInvoice size={18} />}
                                        title="Dados da Fatura"
                                        gradient="var(--cv-gradient-primary)"
                                    />
                                    <Divider sx={{ mb: 1 }} />
                                    <Stack spacing={0}>
                                        <InfoRow label="Concessionária"      value={fatura?.concessionaria?.nome} />
                                        <InfoRow label="Unidade Consumidora" value={fatura?.unidade_consumidora} />
                                        <InfoRow label="Nº Instalação"       value={fatura?.numero_instalacao} />
                                        <InfoRow label="Competência"         value={fatura?.reference_label} />
                                        <InfoRow label="Vencimento"          value={fatura?.vencimento ? new Date(fatura.vencimento).toLocaleDateString('pt-BR') : null} />
                                        <Divider sx={{ my: 1 }} />
                                        <InfoRow label="Valor total"         value={formatMoney(fatura?.valor_total ?? 0)} highlight />
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Energia */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconBolt size={18} />}
                                        title="Dados de Energia"
                                        gradient="linear-gradient(135deg,#f59e0b,#d97706)"
                                    />
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={1.5} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 6 }}>
                                            <MetricBox label="Consumo" value={`${consumo.toFixed(0)}`} unit="kWh" color="primary.main" />
                                        </Grid>
                                        {injetado > 0 && (
                                            <Grid size={{ xs: 6 }}>
                                                <MetricBox label="Injetado" value={`${injetado.toFixed(0)}`} unit="kWh" color="success.main" bg="success.50" />
                                            </Grid>
                                        )}
                                        {compensado > 0 && (
                                            <Grid size={{ xs: 6 }}>
                                                <MetricBox label="Compensado" value={`${compensado.toFixed(0)}`} unit="kWh" color="info.main" bg="info.50" />
                                            </Grid>
                                        )}
                                        {saldo !== 0 && (
                                            <Grid size={{ xs: 6 }}>
                                                <MetricBox
                                                    label="Saldo"
                                                    value={`${saldo.toFixed(0)}`}
                                                    unit="kWh"
                                                    color={saldo > 0 ? 'success.main' : 'error.main'}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                    {consumo > 0 && compensado > 0 && (
                                        <>
                                            <Typography variant="caption" color="text.secondary">
                                                Energia solar compensada: {((compensado / consumo) * 100).toFixed(1)}% do consumo
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(100, (compensado / consumo) * 100)}
                                                color="success"
                                                sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', mt: 0.8 }}
                                            />
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* ── Coluna lateral ────────────────────────────────────── */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={3}>
                            {/* Concessionária */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconBuilding size={18} />}
                                        title="Concessionária"
                                        gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)"
                                    />
                                    <Divider sx={{ mb: 1 }} />
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>
                                            {fatura?.concessionaria?.nome ?? '—'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {fatura?.concessionaria?.sigla ?? ''}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Cobrança vinculada */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconReceipt size={18} />}
                                        title="Cobrança Vinculada"
                                        gradient="linear-gradient(135deg,#10b981,#059669)"
                                    />
                                    <Divider sx={{ mb: 1.5 }} />
                                    {charge ? (
                                        <Stack spacing={0}>
                                            <Box sx={{ mb: 1.5 }}>
                                                <Chip
                                                    label={cs.label}
                                                    color={cs.color}
                                                    size="small"
                                                />
                                            </Box>
                                            <InfoRow label="Valor original" value={formatMoney(charge.original_amount ?? 0)} />
                                            <InfoRow label="Desconto"       value={`-${formatMoney(charge.discount_amount ?? 0)}`} />
                                            <InfoRow label="Valor final"    value={formatMoney(charge.final_amount ?? 0)} highlight />
                                            <InfoRow label="Vencimento"     value={charge.due_date ? new Date(charge.due_date).toLocaleDateString('pt-BR') : null} />
                                            {charge.paid_at && (
                                                <InfoRow label="Pago em" value={new Date(charge.paid_at).toLocaleDateString('pt-BR')} />
                                            )}

                                            {/* Destaque da economia */}
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.100', textAlign: 'center' }}>
                                                <Typography variant="caption" color="success.dark" sx={{ fontWeight: 700 }}>Você economizou</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 950, color: 'success.main', letterSpacing: '-0.04em' }}>
                                                    {formatMoney(charge.discount_amount ?? 0)}
                                                </Typography>
                                            </Box>

                                            <Button
                                                fullWidth
                                                component={Link}
                                                href={safeRoute('cliente.cobrancas.show', charge.id)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mt: 2, borderRadius: 2 }}
                                            >
                                                Ver cobrança completa
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Box sx={{ py: 3, textAlign: 'center' }}>
                                            <Typography color="text.secondary" variant="body2">
                                                Nenhuma cobrança gerada para esta fatura ainda.
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Data */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <SectionHeader
                                        icon={<IconCalendar size={18} />}
                                        title="Vencimento"
                                        gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
                                    />
                                    <Divider sx={{ mb: 1 }} />
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-0.04em', color: 'primary.main' }}>
                                            {fatura?.vencimento ? new Date(fatura.vencimento).toLocaleDateString('pt-BR') : '—'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">data de vencimento da fatura</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

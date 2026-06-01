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
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconArrowLeft, IconCash, IconFileInvoice, IconWallet } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    draft:           { label: 'Rascunho',          color: 'default' },
    open:            { label: 'Em Aberto',          color: 'warning' },
    waiting_payment: { label: 'Aguardando Pgto.',   color: 'info' },
    paid:            { label: 'Pago',               color: 'success' },
    overdue:         { label: 'Vencido',            color: 'error' },
    cancelled:       { label: 'Cancelado',          color: 'default' },
};

function InfoRow({ label, value, highlight = false, mono = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.7}>
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

export default function Page({ cobranca }) {
    const st = STATUS_MAP[cobranca?.status] ?? { label: cobranca?.status, color: 'default' };

    const economiaPercent = cobranca?.original_amount > 0
        ? ((cobranca.discount_amount / cobranca.original_amount) * 100).toFixed(1)
        : 0;

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
                <Button component={Link} href={safeRoute('cliente.cobrancas.index')} startIcon={<IconArrowLeft size={16} />} variant="text" size="small" sx={{ alignSelf: 'flex-start' }}>
                    Voltar às cobranças
                </Button>

                <Grid container spacing={3}>
                    {/* Resumo financeiro */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconWallet size={20} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            Cobrança {cobranca?.reference_label ?? ''}
                                        </Typography>
                                        <Chip label={st.label} color={st.color} size="small" />
                                    </Box>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                {/* Cálculo visual */}
                                <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Valor original (fatura)</Typography>
                                        <Typography variant="body2">{formatMoney(cobranca?.original_amount ?? 0)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography variant="body2" color="success.dark">
                                            Desconto ({cobranca?.discount_percent ?? 0}%)
                                        </Typography>
                                        <Typography variant="body2" color="success.dark" sx={{ fontWeight: 700 }}>
                                            -{formatMoney(cobranca?.discount_amount ?? 0)}
                                        </Typography>
                                    </Stack>
                                    {(cobranca?.manual_discount_amount ?? 0) > 0 && (
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="success.dark">Desconto manual</Typography>
                                            <Typography variant="body2" color="success.dark">-{formatMoney(cobranca.manual_discount_amount)}</Typography>
                                        </Stack>
                                    )}
                                    {(cobranca?.manual_addition_amount ?? 0) > 0 && (
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="error.main">Acréscimo manual</Typography>
                                            <Typography variant="body2" color="error.main">+{formatMoney(cobranca.manual_addition_amount)}</Typography>
                                        </Stack>
                                    )}
                                    <Divider sx={{ my: 1 }} />
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Valor a pagar</Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 950, color: 'primary.main', fontSize: 17 }}>
                                            {formatMoney(cobranca?.final_amount ?? 0)}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Stack spacing={0}>
                                    <InfoRow label="Competência"  value={cobranca?.reference_label} />
                                    <InfoRow label="Vencimento"   value={cobranca?.due_date ? new Date(cobranca.due_date).toLocaleDateString('pt-BR') : null} />
                                    {cobranca?.paid_at && <InfoRow label="Pago em" value={new Date(cobranca.paid_at).toLocaleDateString('pt-BR')} />}
                                    <InfoRow label="Economia"     value={`${formatMoney(cobranca?.discount_amount ?? 0)} (${economiaPercent}% do valor original)`} highlight />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Fatura vinculada */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={2}>
                            {cobranca?.bill && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                                <IconFileInvoice size={18} />
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Fatura de Origem</Typography>
                                        </Stack>
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
                                            sx={{ mt: 2 }}
                                        >
                                            Ver fatura completa
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#10b981,#047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconCash size={18} />
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Sua Economia</Typography>
                                    </Stack>
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 950, color: 'success.main', letterSpacing: '-0.05em' }}>
                                            {formatMoney(cobranca?.discount_amount ?? 0)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            economizados com o desconto de {cobranca?.discount_percent ?? 0}%
                                        </Typography>
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

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
import {
    IconArrowLeft,
    IconDownload,
    IconFileInvoice,
    IconSolarPanel,
    IconBolt,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    approved:       { label: 'Aprovada',   color: 'success' },
    pending_review: { label: 'Em Revisão', color: 'warning' },
    rejected:       { label: 'Rejeitada',  color: 'error' },
};

const CHARGE_STATUS = {
    draft:           { label: 'Rascunho',     color: 'default' },
    open:            { label: 'Em Aberto',    color: 'warning' },
    waiting_payment: { label: 'Ag. Pgto',     color: 'info' },
    paid:            { label: 'Pago',         color: 'success' },
    overdue:         { label: 'Vencido',      color: 'error' },
    cancelled:       { label: 'Cancelado',    color: 'default' },
};

function InfoRow({ label, value, highlight = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.6}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: highlight ? 900 : 700, color: highlight ? 'primary.main' : undefined }}>
                {value ?? '—'}
            </Typography>
        </Stack>
    );
}

export default function Page({ fatura, charge }) {
    const st = STATUS_MAP[fatura?.review_status] ?? { label: fatura?.review_status, color: 'default' };
    const cs = charge ? (CHARGE_STATUS[charge.status] ?? { label: charge.status, color: 'default' }) : null;

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
                {/* Back + actions */}
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
                            startIcon={<IconDownload size={16} />}
                        >
                            Baixar PDF
                        </Button>
                    )}
                </Stack>

                <Grid container spacing={3}>
                    {/* Main info */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconFileInvoice size={20} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            Fatura {fatura?.reference_label ?? ''}
                                        </Typography>
                                        <Chip label={st.label} color={st.color} size="small" />
                                    </Box>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={0}>
                                    <InfoRow label="Concessionária"     value={fatura?.concessionaria?.nome} />
                                    <InfoRow label="Unidade Consumidora" value={fatura?.unidade_consumidora} />
                                    <InfoRow label="Nº Instalação"      value={fatura?.numero_instalacao} />
                                    <InfoRow label="Competência"        value={fatura?.reference_label} />
                                    <InfoRow label="Vencimento"         value={fatura?.vencimento ? new Date(fatura.vencimento).toLocaleDateString('pt-BR') : null} />
                                    <Divider sx={{ my: 1.5 }} />
                                    <InfoRow label="Consumo"            value={fatura?.consumo_kwh ? `${fatura.consumo_kwh} kWh` : null} />
                                    <InfoRow label="Valor total"        value={formatMoney(fatura?.valor_total ?? 0)} highlight />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Cobrança vinculada */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconZap size={20} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Cobrança</Typography>
                                        <Typography variant="body2" color="text.secondary">Vinculada a esta fatura</Typography>
                                    </Box>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                {charge ? (
                                    <Stack spacing={0}>
                                        <Chip label={cs.label} color={cs.color} size="small" sx={{ alignSelf: 'flex-start', mb: 1.5 }} />
                                        <InfoRow label="Valor original"  value={formatMoney(charge.original_amount ?? 0)} />
                                        <InfoRow label="Desconto"        value={`-${formatMoney(charge.discount_amount ?? 0)} (${charge.discount_percent ?? 0}%)`} />
                                        <InfoRow label="Valor final"     value={formatMoney(charge.final_amount ?? 0)} highlight />
                                        <InfoRow label="Vencimento"      value={charge.due_date ? new Date(charge.due_date).toLocaleDateString('pt-BR') : null} />
                                        {charge.paid_at && <InfoRow label="Pago em" value={new Date(charge.paid_at).toLocaleDateString('pt-BR')} />}
                                        <Button
                                            fullWidth
                                            component={Link}
                                            href={safeRoute('cliente.cobrancas.show', charge.id)}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 2 }}
                                        >
                                            Ver cobrança completa
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 2, textAlign: 'center' }}>
                                        <Typography color="text.secondary" variant="body2">
                                            Nenhuma cobrança gerada para esta fatura.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Usina */}
                        {fatura?.usina && (
                            <Card sx={{ mt: 2, borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconSolarPanel size={18} />
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Usina Solar</Typography>
                                    </Stack>
                                    <InfoRow label="Nome"     value={fatura.usina.usina_nome} />
                                    <InfoRow label="Status"   value={fatura.usina.status} />
                                    <InfoRow label="Potência" value={fatura.usina.potencia_usina ? `${fatura.usina.potencia_usina} kWp` : null} />
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

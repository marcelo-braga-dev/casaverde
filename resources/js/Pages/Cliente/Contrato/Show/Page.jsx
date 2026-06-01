import Layout from '@/Layouts/UserLayout/Layout.jsx';
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
import { IconArrowLeft, IconBolt, IconFileText } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    emitido:          { label: 'Emitido',        color: 'info' },
    aguardando_assina: { label: 'Ag. Assinatura', color: 'warning' },
    assinado:         { label: 'Assinado',       color: 'success' },
    cancelado:        { label: 'Cancelado',      color: 'default' },
};

function InfoRow({ label, value, highlight = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.7}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: highlight ? 900 : 700, color: highlight ? 'primary.main' : undefined }}>
                {value ?? '—'}
            </Typography>
        </Stack>
    );
}

export default function Page({ contrato, profile }) {
    const st = STATUS_MAP[contrato?.status] ?? { label: contrato?.status ?? '-', color: 'default' };

    return (
        <Layout
            titlePage="Detalhe do Contrato"
            menu="cliente-contratos"
            subMenu="cliente-contratos-index"
            breadcrumbs={[
                { label: 'Cliente' },
                { label: 'Contratos', href: safeRoute('cliente.contratos.index') },
                { label: contrato?.contract_code ?? 'Detalhe' },
            ]}
        >
            <Head title="Contrato" />

            <Stack spacing={3}>
                <Button component={Link} href={safeRoute('cliente.contratos.index')} startIcon={<IconArrowLeft size={16} />} variant="text" size="small" sx={{ alignSelf: 'flex-start' }}>
                    Voltar aos contratos
                </Button>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconBolt size={20} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            {contrato?.contract_code ?? `Contrato #${contrato?.id}`}
                                        </Typography>
                                        <Chip label={st.label} color={st.color} size="small" />
                                    </Box>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={0}>
                                    <InfoRow label="Código"        value={contrato?.contract_code} />
                                    <InfoRow label="Emitido em"    value={contrato?.issued_at ? new Date(contrato.issued_at).toLocaleDateString('pt-BR') : null} />
                                    <InfoRow label="Assinado em"   value={contrato?.signed_at ? new Date(contrato.signed_at).toLocaleDateString('pt-BR') : null} />
                                    <InfoRow label="Status"        value={st.label} />
                                    {contrato?.notes && (
                                        <>
                                            <Divider sx={{ my: 1.5 }} />
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Observações</Typography>
                                            <Typography variant="body2">{contrato.notes}</Typography>
                                        </>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        {contrato?.proposal && (
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconFileText size={18} />
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Proposta Comercial</Typography>
                                    </Stack>
                                    <Stack spacing={0}>
                                        <InfoRow label="Código"          value={contrato.proposal.proposal_code} />
                                        <InfoRow label="Concessionária"  value={contrato.proposal.concessionaria?.nome} />
                                        <InfoRow label="Consumo médio"   value={contrato.proposal.media_consumo ? `${contrato.proposal.media_consumo} kWh` : null} />
                                        <InfoRow label="Desconto"        value={`${contrato.proposal.discount_percent ?? 0}%`} highlight />
                                        <InfoRow label="Prazo"           value={contrato.proposal.prazo_locacao ? `${contrato.proposal.prazo_locacao} meses` : null} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

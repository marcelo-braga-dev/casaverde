import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head } from "@inertiajs/react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconBolt,
    IconBuildingFactory,
    IconCalendar,
    IconFileText,
    IconMapPin,
    IconSolarPanel2,
} from "@tabler/icons-react";
import PropostaProdutor from "@/Pages/Auth/Produtor/Proposta/Show/PropostaProdutor.jsx";

const STATUS_MAP = {
    pending:  { label: 'Pendente',  color: 'warning' },
    approved: { label: 'Aprovada',  color: 'success' },
    rejected: { label: 'Rejeitada', color: 'error' },
    expired:  { label: 'Expirada',  color: 'default' },
};

function InfoRow({ label, children }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            py={0.8} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>{children ?? '—'}</Typography>
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

const fmtMoney = v => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
const fmtDate  = v => { if (!v) return '—'; try { return String(v).substring(0, 10).split('-').reverse().join('/'); } catch { return v; } };

const Page = ({ proposal }) => {
    const producer = proposal?.producer_profile;
    const st = STATUS_MAP[proposal?.status] ?? { label: proposal?.status ?? '—', color: 'default' };

    const producerName = producer?.nome_fantasia ?? producer?.razao_social ?? producer?.nome ?? 'Não informado';
    const producerDoc  = producer?.cpf ?? producer?.cnpj ?? '—';

    return (
        <Layout
            titlePage="Proposta de Produtor"
            menu="produtores"
            subMenu="produtores-propostas"
            breadcrumbs={[
                { label: 'Produtores' },
                { label: 'Propostas' },
                { label: proposal?.proposal_code ?? `#${proposal?.id}` },
            ]}
            backPage
        >
            <Head title={`Proposta ${proposal?.proposal_code ?? `#${proposal?.id}`}`} />

            <Stack spacing={3}>

                {/* ── Hero ───────────────────────────────────────────── */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(16,185,129,0.15)' }}>
                    <Box sx={{ background: 'linear-gradient(135deg,#064e3b,#065f46,#047857)', p: { xs: 2.5, md: 3.5 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap={2}>
                            <Stack direction="row" alignItems="center" gap={2.5}>
                                <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconFileText size={28} style={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 950, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                                        {proposal?.proposal_code ?? `Proposta #${proposal?.id}`}
                                    </Typography>
                                    <Stack direction="row" gap={1} mt={0.7} flexWrap="wrap" alignItems="center">
                                        <Chip label={st.label} color={st.color} size="small"
                                            sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            {producerName}
                                        </Typography>
                                        {proposal?.concessionaria?.nome && (
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                · {proposal.concessionaria.nome}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>

                            {/* Stats inline no hero */}
                            <Stack direction="row" gap={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                {[
                                    { label: 'Potência', value: proposal?.potencia_usina ? `${proposal.potencia_usina} kWp` : '—' },
                                    { label: 'Geração', value: proposal?.media_geracao ? `${proposal.media_geracao} kWh` : '—' },
                                    { label: 'Investimento', value: fmtMoney(proposal?.valor_investimento) },
                                ].map(s => (
                                    <Box key={s.label} sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ fontWeight: 950, fontSize: 18, color: '#fff', letterSpacing: '-0.03em' }}>{s.value}</Typography>
                                        <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Box>
                </Card>

                {/* ── Stats Row (mobile) ──────────────────────────────── */}
                <Grid container spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
                    {[
                        { label: 'Potência', value: proposal?.potencia_usina ? `${proposal.potencia_usina} kWp` : '—', gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
                        { label: 'Geração Média', value: proposal?.media_geracao ? `${proposal.media_geracao} kWh` : '—', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
                        { label: 'Investimento', value: fmtMoney(proposal?.valor_investimento), gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
                        { label: 'Desconto', value: proposal?.fill_percent ? `${proposal.fill_percent}%` : '—', gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
                    ].map(s => (
                        <Grid key={s.label} size={{ xs: 6 }}>
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                                    <Typography variant="subtitle1" fontWeight={950} letterSpacing="-0.02em" mt={0.3}>{s.value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Conteúdo Principal ──────────────────────────────── */}
                <Grid container spacing={3}>
                    {/* LEFT */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={3}>
                            {/* Dados do Produtor */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader icon={<IconBuildingFactory size={18} />} title="Produtor"
                                        gradient="linear-gradient(135deg,#10b981,#059669)" />
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={0}>
                                        <InfoRow label="Nome">{producerName}</InfoRow>
                                        <InfoRow label="CPF / CNPJ">{producerDoc}</InfoRow>
                                        <InfoRow label="Consultor">{proposal?.consultor?.name}</InfoRow>
                                        <InfoRow label="Concessionária">{proposal?.concessionaria?.nome}</InfoRow>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Dados técnicos */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader icon={<IconSolarPanel2 size={18} />} title="Dados Técnicos"
                                        gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" />
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={0}>
                                        <InfoRow label="Potência da Usina">{proposal?.potencia_usina ? `${proposal.potencia_usina} kWp` : null}</InfoRow>
                                        <InfoRow label="Média de Geração">{proposal?.media_geracao ? `${proposal.media_geracao} kWh/mês` : null}</InfoRow>
                                        <InfoRow label="Prazo do Contrato">{proposal?.prazo_contrato ? `${proposal.prazo_contrato} meses` : null}</InfoRow>
                                        <InfoRow label="Valor do Investimento">{fmtMoney(proposal?.valor_investimento)}</InfoRow>
                                        <InfoRow label="Margem de Desconto">{proposal?.fill_percent ? `${proposal.fill_percent}%` : null}</InfoRow>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Endereço */}
                            {proposal?.address && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader icon={<IconMapPin size={18} />} title="Endereço da Usina"
                                            gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', mb: 1 }}>
                                            <Typography variant="body2" fontWeight={700}>
                                                {proposal.address.full_address ?? '—'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>

                    {/* RIGHT */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        {/* Info da proposta */}
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconCalendar size={18} />} title="Informações da Proposta"
                                    gradient="var(--cv-gradient-primary)" />
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={0}>
                                    <InfoRow label="Código">
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                            {proposal?.proposal_code ?? `#${proposal?.id}`}
                                        </Typography>
                                    </InfoRow>
                                    <InfoRow label="Status">
                                        <Chip label={st.label} color={st.color} size="small" sx={{ fontWeight: 700 }} />
                                    </InfoRow>
                                    <InfoRow label="Emitida em">{fmtDate(proposal?.created_at)}</InfoRow>
                                    <InfoRow label="Válida até">{fmtDate(proposal?.valid_until)}</InfoRow>
                                </Stack>

                                {proposal?.notes && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                                            <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                                                <IconBolt size={13} style={{ opacity: 0.5 }} />
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                                    Observações
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {proposal.notes}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* ── PDF / Ações ──────────────────────────────────────── */}
                <PropostaProdutor proposal={proposal} idProposta={proposal.id} />

            </Stack>
        </Layout>
    );
};

export default Page;

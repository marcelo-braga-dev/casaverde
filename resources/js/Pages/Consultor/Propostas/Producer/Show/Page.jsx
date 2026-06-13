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
    IconCoins,
    IconCurrencyReal,
    IconFileText,
    IconMapPin,
    IconUser,
} from "@tabler/icons-react";
import PropostaProdutor from "@/Pages/Auth/Produtor/Proposta/Show/PropostaProdutor.jsx";

const cardSx = {
    borderRadius: "var(--cv-radius-xl)",
    border: "1px solid var(--cv-border-soft)",
    boxShadow: "var(--cv-shadow-md)",
};

const STATUS_MAP = {
    rascunho:   { label: 'Rascunho',   color: 'default' },
    emitida:    { label: 'Emitida',    color: 'info' },
    aprovada:   { label: 'Aprovada',   color: 'success' },
    recusada:   { label: 'Recusada',   color: 'error' },
    expirada:   { label: 'Expirada',   color: 'default' },
    convertida: { label: 'Convertida', color: 'success' },
};

function SectionHeader({ icon, title }) {
    return (
        <>
            <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        background: "var(--cv-gradient-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: "-0.03em" }}>
                    {title}
                </Typography>
            </Stack>
            <Divider sx={{ mb: 2.5 }} />
        </>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={0.8}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
        >
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{ fontWeight: highlight ? 800 : 700, color: highlight ? "primary.main" : "inherit" }}
            >
                {value ?? "—"}
            </Typography>
        </Stack>
    );
}

const fmtMoney = v => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
const fmtMoneyPrecise = v => v != null ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—';
const fmtPercent = v => v != null ? `${Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%` : '—';
const fmtKwh = v => v != null ? `${Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWh` : '—';

const Page = ({ proposal, investmentSummary }) => {
    const producer = proposal?.producer_profile;
    const adminFeePercent = investmentSummary?.admin_fee_percent ?? proposal?.fill_percent;

    const producerName = producer?.nome_fantasia ?? producer?.razao_social ?? producer?.nome ?? "Produtor não informado";
    const producerDoc = producer?.cpf ?? producer?.cnpj ?? "Não informado";

    const dateLabel = (value) => {
        if (!value) return "Não informado";
        return String(value).substring(0, 10);
    };

    const statusKey = proposal?.status;
    const statusCfg = STATUS_MAP[statusKey] || { label: proposal?.status ?? "Sem status", color: "default" };

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
                {/* Hero Card */}
                <Card sx={cardSx}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            gap={2}
                        >
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3,
                                        background: "var(--cv-gradient-primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        flexShrink: 0,
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    <IconFileText size={26} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2 }}
                                    >
                                        {proposal?.proposal_code ?? `Proposta #${proposal?.id}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                        {producerName}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Chip
                                label={statusCfg.label}
                                color={statusCfg.color}
                                sx={{ fontWeight: 800, fontSize: "0.8rem", px: 1 }}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    {/* Dados principais */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ ...cardSx, height: "100%" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconUser size={18} />} title="Dados da Proposta" />
                                <Stack>
                                    <InfoRow label="Produtor" value={producerName} />
                                    <InfoRow label="CPF / CNPJ" value={producerDoc} />
                                    <InfoRow label="Consultor" value={proposal?.consultor?.name ?? "Não informado"} />
                                    <InfoRow label="Concessionária" value={proposal?.concessionaria?.nome ?? "Não informado"} />
                                    <InfoRow label="Emitida em" value={dateLabel(proposal?.issued_at ?? proposal?.created_at)} />
                                    <InfoRow label="Válida até" value={dateLabel(proposal?.valid_until)} />
                                </Stack>

                                {proposal?.notes && (
                                    <Box
                                        sx={{
                                            mt: 2.5,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: "action.hover",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Observações
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {proposal.notes}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Métricas */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={2} height="100%">
                            <Card sx={cardSx}>
                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                    <SectionHeader icon={<IconBolt size={18} />} title="Dados Técnicos" />
                                    <Stack>
                                        <InfoRow
                                            label="Potência da Usina"
                                            value={proposal?.potencia_usina ? `${proposal.potencia_usina} kWp` : "Não informado"}
                                        />
                                        <InfoRow
                                            label="Média de Geração"
                                            value={proposal?.media_geracao ? `${proposal.media_geracao} kWh/mês` : "Não informado"}
                                        />
                                        <InfoRow
                                            label="Prazo do Contrato"
                                            value={proposal?.prazo_contrato ? `${proposal.prazo_contrato} meses` : "Não informado"}
                                        />
                                        <InfoRow
                                            label="Taxa de Administração"
                                            value={fmtPercent(adminFeePercent)}
                                            highlight
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card
                                sx={{
                                    ...cardSx,
                                    background: "var(--cv-gradient-primary)",
                                    color: "#fff",
                                    flex: 1,
                                }}
                            >
                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                    <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
                                        <IconCurrencyReal size={20} />
                                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.85 }}>
                                            Valor do Investimento
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
                                        {fmtMoney(proposal?.valor_investimento)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.75, mt: 0.5, display: "block" }}>
                                        Valor total do investimento na usina
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Resumo do Investimento */}
                    <Grid size={12}>
                        <Card sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconCoins size={18} />} title="Resumo do Investimento" />
                                <Grid container spacing={{ xs: 0, md: 4 }}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Stack>
                                            <InfoRow label="Tarifa Consumidor Grupo B" value={`${fmtMoneyPrecise(investmentSummary?.tarifa_grupo_b)} /kWh`} />
                                            <InfoRow label="Redução de Consumo" value={`${fmtMoneyPrecise(investmentSummary?.consumer_discount_value)} /kWh (${fmtPercent(investmentSummary?.consumer_discount_percent)})`} />
                                            <InfoRow label="Dedução Operacionalização" value={`${fmtPercent(investmentSummary?.admin_fee_percent)} (${fmtMoney(investmentSummary?.admin_fee_value)}/ano)`} />
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Stack>
                                            <InfoRow label="Produção Média Anual" value={`${fmtKwh(investmentSummary?.producao_anual_kwh)}/ano`} />
                                            <InfoRow label="Pagamento Anual Bruto" value={fmtMoney(investmentSummary?.pagamento_anual_bruto)} />
                                            <InfoRow label="Pagamento Anual Líquido" value={fmtMoney(investmentSummary?.pagamento_anual_liquido)} highlight />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Endereço */}
                    {proposal?.address && (
                        <Grid size={12}>
                            <Card sx={cardSx}>
                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                    <SectionHeader icon={<IconMapPin size={18} />} title="Endereço da Usina" />
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: "action.hover",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {proposal.address.full_address ?? "Endereço não informado"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                {/* PDF / Ações */}
                <PropostaProdutor proposal={proposal} investmentSummary={investmentSummary} idProposta={proposal.id} />
            </Stack>
        </Layout>
    );
};

export default Page;

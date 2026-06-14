import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, usePage } from "@inertiajs/react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconBrandWhatsapp,
    IconCalendar,
    IconClockHour4,
    IconCurrencyReal,
    IconFileText,
    IconMapPin,
    IconPercentage,
    IconUser,
    IconBolt,
} from "@tabler/icons-react";
import PropostaBaixar from "@/Pages/Auth/Cliente/Proposta/Show/Propostas.jsx";
import WhatsAppButton from "@/Components/WhatsApp/WhatsAppButton";
import formatCurrency from "@/Utils/formatCurrency.js";

const cardSx = {
    borderRadius: "var(--cv-radius-xl)",
    border: "1px solid var(--cv-border-soft)",
    boxShadow: "var(--cv-shadow-md)",
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

const statusConfig = {
    emitida: { label: "Emitida", color: "success" },
    pendente: { label: "Pendente", color: "warning" },
    cancelada: { label: "Cancelada", color: "error" },
    aprovada: { label: "Aprovada", color: "info" },
};

const Page = ({ proposal }) => {
    const { flash } = usePage().props;
    const client = proposal?.client_profile;

    const getClientName = () =>
        client?.nome || client?.razao_social || client?.nome_fantasia || "Cliente não informado";

    const dateLabel = (value) => {
        if (!value) return "Não informado";
        return String(value).substring(0, 10);
    };

    const statusKey = proposal?.status;
    const statusCfg = statusConfig[statusKey] || { label: proposal?.status ?? "Sem status", color: "default" };

    return (
        <Layout
            titlePage="Detalhes da Proposta"
            menu="clientes"
            subMenu="propostas-cliente-index"
            backPage
        >
            <Head title="Detalhes da Proposta" />

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
                                        {getClientName()}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" alignItems="center" gap={1.5}>
                                <Chip
                                    label={statusCfg.label}
                                    color={statusCfg.color}
                                    sx={{ fontWeight: 800, fontSize: "0.8rem", px: 1 }}
                                />

                                <WhatsAppButton
                                    templateKey="compartilhar_proposta"
                                    phone={client?.contacts?.celular}
                                    variables={{
                                        cliente_nome: getClientName(),
                                        link_proposta: route("consultor.propostas.cliente.pdf", proposal.id),
                                    }}
                                    label="Enviar Proposta"
                                    variant="contained"
                                    startIcon={<IconBrandWhatsapp size={17} />}
                                    sx={{ bgcolor: "#25D366", color: "#fff", "&:hover": { bgcolor: "#1ebe5b" } }}
                                />
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {flash?.success && (
                    <Alert
                        severity="success"
                        action={
                            <WhatsAppButton
                                templateKey="proposta_enviada"
                                phone={client?.contacts?.celular}
                                variables={{
                                    cliente_nome: getClientName(),
                                    link_proposta: route("consultor.propostas.cliente.pdf", proposal.id),
                                }}
                                label="Avisar Cliente por WhatsApp"
                                variant="outlined"
                                color="success"
                                size="small"
                                startIcon={<IconBrandWhatsapp size={16} />}
                            />
                        }
                    >
                        {flash.success}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Dados principais */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ ...cardSx, height: "100%" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconUser size={18} />} title="Dados da Proposta" />
                                <Stack>
                                    <InfoRow label="Cliente" value={getClientName()} />
                                    <InfoRow label="Consultor" value={proposal?.consultor?.name ?? "Não informado"} />
                                    <InfoRow label="Concessionária" value={proposal?.concessionaria?.nome ?? "Não informado"} />
                                    <InfoRow label="Unidade Consumidora" value={proposal?.unidade_consumidora ?? "Não informado"} />
                                    <InfoRow label="Emitida em" value={dateLabel(proposal?.created_at)} />
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
                                    <SectionHeader icon={<IconBolt size={18} />} title="Consumo e Condições" />
                                    <Stack>
                                        <InfoRow
                                            label="Média de Consumo"
                                            value={proposal?.media_consumo ? `${proposal.media_consumo} kWh` : "Não informado"}
                                        />
                                        <InfoRow
                                            label="Taxa de Redução"
                                            value={proposal?.discount_percent ? `${proposal.discount_percent}%` : "Não informado"}
                                            highlight
                                        />
                                        <InfoRow
                                            label="Prazo de Locação"
                                            value={proposal?.prazo_locacao ? `${proposal.prazo_locacao} meses` : "Não informado"}
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
                                            Valor Médio Estimado
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.04em" }}>
                                        {proposal?.valor_medio != null ? formatCurrency(proposal.valor_medio) : "—"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.75, mt: 0.5, display: "block" }}>
                                        Estimativa mensal após desconto
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Endereço */}
                    <Grid size={12}>
                        <Card sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconMapPin size={18} />} title="Endereço da Unidade Consumidora" />
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
                                        {proposal?.address?.full_address ?? "Endereço não informado"}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <PropostaBaixar idProposta={proposal.id} dadosProposta={proposal} />
            </Stack>
        </Layout>
    );
};

export default Page;

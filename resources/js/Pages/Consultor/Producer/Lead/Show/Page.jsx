import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
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
    IconBolt,
    IconBuildingFactory2,
    IconCalendarTime,
    IconEdit,
    IconPercentage,
    IconUser,
} from "@tabler/icons-react";

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

function StatCard({ icon, label, value, color = "primary.main" }) {
    return (
        <Card sx={{ ...cardSx, flex: 1 }}>
            <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: `${color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color,
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            {label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                            {value ?? "—"}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

const statusConfig = {
    aprovado: { label: "Aprovado", color: "success" },
    pendente: { label: "Pendente", color: "warning" },
    reprovado: { label: "Reprovado", color: "error" },
    em_analise: { label: "Em análise", color: "info" },
};

const Page = ({ lead }) => {
    const getProducerName = () =>
        lead?.producer_profile?.usina_nome ||
        lead?.producer_profile?.admin_nome ||
        lead?.producer_profile?.user?.name ||
        "Não informado";

    const statusKey = lead?.status;
    const statusCfg = statusConfig[statusKey] || { label: lead?.status ?? "Sem status", color: "default" };

    return (
        <Layout
            titlePage="Detalhes do Lead de Produtor"
            menu="produtores-solar"
            subMenu="producer-leads-index"
            backPage
        >
            <Head title="Detalhes do Lead de Produtor" />

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
                                    <IconBuildingFactory2 size={26} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2 }}
                                    >
                                        {getProducerName()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                        {lead?.consultor?.name
                                            ? `Consultor: ${lead.consultor.name}`
                                            : "Consultor não informado"}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                                <Chip
                                    label={statusCfg.label}
                                    color={statusCfg.color}
                                    sx={{ fontWeight: 800, fontSize: "0.8rem", px: 1 }}
                                />
                                <Button
                                    component={Link}
                                    href={route("consultor.producer.leads.edit", lead.id)}
                                    startIcon={<IconEdit size={16} />}
                                    variant="contained"
                                    size="small"
                                >
                                    Editar
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Stat Cards */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <StatCard
                        icon={<IconPercentage size={20} />}
                        label="Taxa de Redução"
                        value={lead?.taxa_reducao ? `${lead.taxa_reducao}%` : "—"}
                        color="#7c3aed"
                    />
                    <StatCard
                        icon={<IconCalendarTime size={20} />}
                        label="Prazo de Locação"
                        value={lead?.prazo_locacao ? `${lead.prazo_locacao} meses` : "—"}
                        color="#0ea5e9"
                    />
                    <StatCard
                        icon={<IconBolt size={20} />}
                        label="Potência"
                        value={lead?.potencia ? `${lead.potencia} kW` : "—"}
                        color="#f59e0b"
                    />
                </Stack>

                <Grid container spacing={3}>
                    {/* Dados do lead */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ ...cardSx, height: "100%" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconUser size={18} />} title="Informações do Lead" />
                                <Stack>
                                    <InfoRow label="Produtor" value={getProducerName()} />
                                    <InfoRow
                                        label="Usuário vinculado"
                                        value={lead?.producer_profile?.user?.name ?? "Não vinculado"}
                                    />
                                    <InfoRow label="Consultor" value={lead?.consultor?.name ?? "Não informado"} />
                                    <InfoRow label="Concessionária" value={lead?.concessionaria?.nome ?? "Não informado"} />
                                    <InfoRow
                                        label="Taxa de Redução"
                                        value={lead?.taxa_reducao ? `${lead.taxa_reducao}%` : "Não informado"}
                                        highlight
                                    />
                                    <InfoRow
                                        label="Prazo de Locação"
                                        value={lead?.prazo_locacao ? `${lead.prazo_locacao} meses` : "Não informado"}
                                    />
                                    <InfoRow
                                        label="Potência"
                                        value={lead?.potencia ? `${lead.potencia} kW` : "Não informado"}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Observações */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ ...cardSx, height: "100%" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 }, display: "flex", flexDirection: "column", height: "100%" }}>
                                <SectionHeader icon={<IconBuildingFactory2 size={18} />} title="Observações" />
                                <Box
                                    sx={{
                                        flex: 1,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: "action.hover",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        minHeight: 120,
                                    }}
                                >
                                    <Typography variant="body2" color={lead?.notes ? "text.primary" : "text.secondary"}>
                                        {lead?.notes ?? "Nenhuma observação registrada."}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
};

export default Page;

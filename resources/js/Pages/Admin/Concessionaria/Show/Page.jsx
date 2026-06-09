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
    IconArrowLeft,
    IconCalendar,
    IconEdit,
    IconMapPin,
    IconBolt,
    IconSettings,
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

function MetricCard({ icon, label, value, color = "#7c3aed" }) {
    return (
        <Card sx={{ ...cardSx, flex: 1 }}>
            <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            bgcolor: `${color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color,
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

export default function Page({ concessionaria }) {
    const isAtivo = concessionaria?.status === "ativo";

    const formatDate = (val) =>
        val ? new Date(val).toLocaleString("pt-BR") : "Não informado";

    return (
        <Layout
            titlePage="Detalhes da Concessionária"
            menu="concessionarias"
            subMenu="concessionarias-index"
            backPage
        >
            <Head title="Detalhes da Concessionária" />

            <Stack spacing={3}>
                {/* Hero */}
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
                                    <IconSettings size={26} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2 }}
                                    >
                                        {concessionaria?.nome ?? "Concessionária"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                        ID #{concessionaria?.id}
                                        {concessionaria?.estado ? ` · ${concessionaria.estado}` : ""}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                                <Chip
                                    label={isAtivo ? "Ativa" : (concessionaria?.status ?? "Sem status")}
                                    color={isAtivo ? "success" : "default"}
                                    sx={{ fontWeight: 800, px: 1 }}
                                />
                                <Button
                                    component={Link}
                                    href={route("admin.concessionaria.index")}
                                    startIcon={<IconArrowLeft size={16} />}
                                    variant="text"
                                    size="small"
                                >
                                    Voltar
                                </Button>
                                <Button
                                    component={Link}
                                    href={route("admin.concessionaria.edit", concessionaria.id)}
                                    startIcon={<IconEdit size={16} />}
                                    variant="contained"
                                    size="small"
                                    color="warning"
                                >
                                    Editar
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Metric Cards */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <MetricCard
                        icon={<IconMapPin size={22} />}
                        label="Estado"
                        value={concessionaria?.estado ?? "—"}
                        color="#0ea5e9"
                    />
                    <MetricCard
                        icon={<IconBolt size={22} />}
                        label="Tarifa GD2"
                        value={concessionaria?.tarifa_gd2 ? `R$ ${concessionaria.tarifa_gd2}` : "—"}
                        color="#f59e0b"
                    />
                </Stack>

                <Grid container spacing={3}>
                    {/* Dados gerais */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconSettings size={18} />} title="Dados da Concessionária" />
                                <Stack>
                                    <InfoRow label="ID" value={`#${concessionaria?.id}`} />
                                    <InfoRow label="Nome" value={concessionaria?.nome} />
                                    <InfoRow label="Estado" value={concessionaria?.estado} />
                                    <InfoRow
                                        label="Tarifa GD2"
                                        value={concessionaria?.tarifa_gd2 ? `R$ ${concessionaria.tarifa_gd2}` : null}
                                        highlight
                                    />
                                    <InfoRow label="Status" value={isAtivo ? "Ativa" : "Inativa"} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Datas */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ ...cardSx, height: "100%" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconCalendar size={18} />} title="Registro" />
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                            Criada em
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.4 }}>
                                            {formatDate(concessionaria?.created_at)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                            Atualizada em
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.4 }}>
                                            {formatDate(concessionaria?.updated_at)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

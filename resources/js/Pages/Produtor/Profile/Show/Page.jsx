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
    IconBuildingFactory,
    IconCalendar,
    IconEdit,
    IconFileText,
    IconMapPin,
    IconSolarPanel,
    IconBolt,
} from "@tabler/icons-react";
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

function InfoRow({ label, value }) {
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
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {value || "—"}
            </Typography>
        </Stack>
    );
}

function StatCard({ label, value, unit, color = "#7c3aed" }) {
    return (
        <Card sx={{ ...cardSx, flex: 1, background: `linear-gradient(135deg, ${color}10, ${color}05)`, border: `1px solid ${color}30` }}>
            <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {label}
                </Typography>
                <Stack direction="row" alignItems="baseline" gap={0.5} mt={0.5}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color, letterSpacing: "-0.03em" }}>
                        {value || "—"}
                    </Typography>
                    {unit && value && (
                        <Typography variant="caption" sx={{ fontWeight: 700, color }}>
                            {unit}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

const statusConfig = {
    ativo: { label: "Ativo", color: "success" },
    inativo: { label: "Inativo", color: "error" },
    pendente: { label: "Pendente", color: "warning" },
    em_analise: { label: "Em análise", color: "info" },
};

export default function Page({ producer }) {
    const displayName = producer.usina_nome || producer.admin_nome || `Produtor #${producer.id}`;
    const statusKey = producer.status;
    const statusCfg = statusConfig[statusKey] || { label: producer.status, color: "default" };

    return (
        <Layout titlePage="Perfil de Produtor" menu="produtores">
            <Head title="Perfil de Produtor" />

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
                                        width: 64,
                                        height: 64,
                                        borderRadius: 3,
                                        background: "var(--cv-gradient-primary)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        flexShrink: 0,
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                                    }}
                                >
                                    <IconSolarPanel size={30} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1 }}
                                    >
                                        {displayName}
                                    </Typography>
                                    {producer.usina_cnpj && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            CNPJ: {producer.usina_cnpj}
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                            <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
                                <Chip
                                    label={statusCfg.label}
                                    color={statusCfg.color}
                                    sx={{ fontWeight: 800, fontSize: "0.8rem", px: 1 }}
                                />
                                <Button
                                    component={Link}
                                    href={route("admin.producer-profiles.edit", producer.id)}
                                    startIcon={<IconEdit size={16} />}
                                    variant="contained"
                                    color="warning"
                                >
                                    Editar Perfil
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Stat row */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <StatCard label="Potência kW" value={producer.potencia_kw} unit="kW" color="#0ea5e9" />
                    <StatCard label="Potência kWp" value={producer.potencia_kwp} unit="kWp" color="#7c3aed" />
                    <StatCard label="Geração Anual" value={producer.geracao_anual} unit="kWh" color="#10b981" />
                </Stack>

                <Grid container spacing={3}>
                    {/* Dados Administrativos */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconBuildingFactory size={18} />} title="Dados Administrativos" />
                                <Stack>
                                    <InfoRow label="Administrador" value={producer.admin_nome} />
                                    <InfoRow label="Qualificação" value={producer.admin_qualificacao} />
                                    <InfoRow label="Nome da usina" value={producer.usina_nome} />
                                    <InfoRow label="CNPJ da usina" value={producer.usina_cnpj} />
                                    <InfoRow label="Unidade Consumidora" value={producer.unidade_consumidora} />
                                    <InfoRow label="Status" value={statusCfg.label} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dados Técnicos */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconBolt size={18} />} title="Dados Técnicos" />
                                <Stack>
                                    <InfoRow label="Potência kW" value={producer.potencia_kw ? `${producer.potencia_kw} kW` : null} />
                                    <InfoRow label="Potência kWp" value={producer.potencia_kwp ? `${producer.potencia_kwp} kWp` : null} />
                                    <InfoRow label="Geração anual" value={producer.geracao_anual ? `${producer.geracao_anual} kWh` : null} />
                                    <InfoRow label="Módulos" value={producer.modulos} />
                                    <InfoRow label="Inversores" value={producer.inversores} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dados do Imóvel */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconMapPin size={18} />} title="Dados do Imóvel" />
                                <Stack>
                                    <InfoRow label="Área da usina" value={producer.usina_area ? `${producer.usina_area} m²` : null} />
                                    <InfoRow label="Área do imóvel" value={producer.imovel_area ? `${producer.imovel_area} m²` : null} />
                                    <InfoRow label="Matrícula" value={producer.imovel_matricula} />
                                    <InfoRow label="Tipo de área" value={producer.tipo_area} />
                                    <InfoRow label="Classificação" value={producer.classificacao} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Contrato */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={cardSx}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <SectionHeader icon={<IconCalendar size={18} />} title="Contrato e Financeiro" />
                                <Stack>
                                    <InfoRow label="Prazo de locação" value={producer.prazo_locacao ? `${producer.prazo_locacao} meses` : null} />
                                    <InfoRow label="Parcela fixa" value={producer.parcela_fixa != null ? formatCurrency(producer.parcela_fixa) : null} />
                                    <InfoRow label="Taxa de administração" value={producer.taxa_administracao ? `${producer.taxa_administracao}%` : null} />
                                    <InfoRow label="Data do contrato" value={producer.contrato_data} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Descrição */}
                    {producer.descricao && (
                        <Grid size={12}>
                            <Card sx={cardSx}>
                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                    <SectionHeader icon={<IconFileText size={18} />} title="Descrição" />
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: "action.hover",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Typography variant="body2">{producer.descricao}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Stack>
        </Layout>
    );
}

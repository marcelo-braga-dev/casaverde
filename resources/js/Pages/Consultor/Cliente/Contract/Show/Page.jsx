import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, usePage } from "@inertiajs/react";
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
    IconBuilding,
    IconCalendar,
    IconEdit,
    IconFileCertificate,
    IconFileText,
    IconHome,
    IconId,
    IconMapPin,
    IconUser,
} from "@tabler/icons-react";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const show = (v) => v || "Não informado";

const formatStatus = (status) => {
    const cfg = {
        issued:    { label: "Emitido",   color: "info" },
        signed:    { label: "Assinado",  color: "primary" },
        active:    { label: "Ativo",     color: "success" },
        cancelled: { label: "Cancelado", color: "error" },
    };
    return cfg[status] ?? { label: status ?? "Sem status", color: "default" };
};

const formatDate = (v) => {
    if (!v) return "Não informado";
    if (String(v).includes("/")) return v;
    return String(v).substring(0, 10);
};

const formatAddress = (address) => {
    if (!address) return "Não informado";
    const parts = [address?.rua, address?.numero, address?.bairro, address?.cidade, address?.estado].filter(Boolean);
    return parts.length ? parts.join(", ") : "Não informado";
};

/* ─── sub-components ──────────────────────────────────────────────────── */
const SectionHeader = ({ icon, label, gradient }) => (
    <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
        <Box sx={{ width: 36, height: 36, borderRadius: 1.5, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icon}
        </Box>
        <Typography variant="h6" fontWeight={950} letterSpacing="-0.02em">{label}</Typography>
        <Divider sx={{ flex: 1 }} />
    </Stack>
);

const InfoRow = ({ label, children }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.9} sx={{ borderBottom: "1px solid", borderColor: "divider", "&:last-child": { border: 0 } }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Box sx={{ textAlign: "right" }}>
            {typeof children === "string" ? <Typography variant="body2" fontWeight={700}>{children}</Typography> : children}
        </Box>
    </Stack>
);

/* ─── Page ────────────────────────────────────────────────────────────── */
const Page = ({ contract }) => {
    const flashPassword = usePage().props?.flash?.temporary_password;

    const client = contract?.client_profile ?? contract?.clientProfile ?? null;
    const proposal = contract?.proposal ?? null;
    const user = contract?.user ?? null;
    const userData = user?.user_data ?? user?.userData ?? null;
    const proposalAddress = proposal?.address ?? null;
    const contractAddress = userData?.address ?? proposalAddress ?? null;
    const isPessoaFisica = userData?.tipo_pessoa === "pf";

    const statusMeta = formatStatus(contract?.status);

    return (
        <Layout titlePage="Contrato Emitido" menu="clientes" subMenu="clientes-contratos" backPage>
            <Head title="Contrato Emitido" />

            {/* ── Flash: Senha temporária ────────────────────────── */}
            {flashPassword && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}>
                    Senha temporária do cliente: <strong>{flashPassword}</strong>
                </Alert>
            )}

            {/* ── Hero Card ──────────────────────────────────────── */}
            <Card sx={{ mb: 3, borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)", overflow: "hidden" }}>
                <Box sx={{ background: "linear-gradient(135deg,#3b82f622,#1d4ed822)", p: { xs: 2.5, md: 3 } }}>
                    <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ width: 52, height: 52, borderRadius: 2, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <IconFileCertificate size={26} color="#fff" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={900} letterSpacing="-0.03em">
                                    {contract?.contract_code ?? `Contrato #${contract?.id}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {show(client?.display_name ?? client?.nome ?? client?.razao_social)} · Proposta {show(proposal?.proposal_code ?? `#${proposal?.id}`)}
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={statusMeta.label} color={statusMeta.color} sx={{ fontWeight: 700 }} />
                            <Link href={route("consultor.cliente.contratos.edit", contract.id)}>
                                <Button variant="contained" size="small" startIcon={<IconEdit size={16} />} color="warning" sx={{ fontWeight: 700 }}>
                                    Editar
                                </Button>
                            </Link>
                        </Stack>
                    </Stack>
                </Box>
            </Card>

            {/* ── Stats Row ─────────────────────────────────────── */}
            <Grid container spacing={2} mb={3}>
                {[
                    { label: "Emitido em", value: formatDate(contract?.issued_at), icon: <IconCalendar size={18} color="#3b82f6" /> },
                    { label: "Assinado em", value: formatDate(contract?.signed_at), icon: <IconFileCertificate size={18} color="#10b981" /> },
                    { label: "Prazo de Locação", value: proposal?.prazo_locacao ? `${proposal.prazo_locacao}` : "—", icon: <IconCalendar size={18} color="#f59e0b" /> },
                    { label: "Taxa de Redução", value: proposal?.discount_percent ? `${proposal.discount_percent}%` : "—", icon: <IconId size={18} color="#8b5cf6" /> },
                ].map((s) => (
                    <Grid key={s.label} size={{ xs: 6, md: 3 }}>
                        <Card sx={{ borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)", p: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>{s.icon}<Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography></Stack>
                            <Typography variant="h6" fontWeight={900} letterSpacing="-0.02em">{s.value}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ── Main Grid ─────────────────────────────────────── */}
            <Grid container spacing={3}>
                {/* LEFT */}
                <Grid size={{ xs: 12, md: 7 }}>
                    {/* Dados do contrato */}
                    <Card sx={{ mb: 3, borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <SectionHeader icon={<IconFileCertificate size={18} color="#fff" />} label="Dados do Contrato" gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" />
                            <Stack spacing={0}>
                                <InfoRow label="Código do contrato">{show(contract?.contract_code)}</InfoRow>
                                <InfoRow label="Cliente">{show(client?.display_name ?? client?.nome ?? client?.razao_social)}</InfoRow>
                                <InfoRow label="Documento">{show(client?.documento ?? userData?.cpf ?? userData?.cnpj)}</InfoRow>
                                <InfoRow label="Login (e-mail)">{show(user?.email)}</InfoRow>
                                <InfoRow label="Proposta de origem">{show(proposal?.proposal_code ?? `#${proposal?.id}`)}</InfoRow>
                            </Stack>
                            {contract?.notes && (
                                <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Observações</Typography>
                                    <Typography variant="body2" sx={{ mt: 0.25 }}>{contract.notes}</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Dados da proposta */}
                    <Card sx={{ mb: 3, borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <SectionHeader icon={<IconFileText size={18} color="#fff" />} label="Informações da Proposta" gradient="linear-gradient(135deg,#10b981,#059669)" />
                            <Stack spacing={0}>
                                <InfoRow label="Concessionária">{show(proposal?.concessionaria?.nome)}</InfoRow>
                                <InfoRow label="Unidade Consumidora">{show(proposal?.unidade_consumidora)}</InfoRow>
                                <InfoRow label="Média de Consumo">{show(proposal?.media_consumo)}</InfoRow>
                                <InfoRow label="Taxa de Redução">{proposal?.discount_percent ? `${proposal.discount_percent}%` : "Não informado"}</InfoRow>
                                <InfoRow label="Prazo de Locação">{show(proposal?.prazo_locacao ? `${proposal?.prazo_locacao} meses`: null)}</InfoRow>
                                <InfoRow label="Valor Médio">{show(proposal?.valor_medio)}</InfoRow>
                                <InfoRow label="Validade da Proposta">{formatDate(proposal?.valid_until)}</InfoRow>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Endereço */}
                    <Card sx={{ borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <SectionHeader icon={<IconMapPin size={18} color="#fff" />} label="Endereço da Unidade Consumidora" gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                            <Box sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: "action.hover" }}>
                                <Typography variant="body2" fontWeight={700}>{formatAddress(contractAddress)}</Typography>
                            </Box>
                            <Stack spacing={0}>
                                <InfoRow label="CEP">{show(contractAddress?.cep)}</InfoRow>
                                <InfoRow label="Complemento">{show(contractAddress?.complemento)}</InfoRow>
                                <InfoRow label="Referência">{show(contractAddress?.referencia)}</InfoRow>
                                <InfoRow label="Coordenadas">
                                    {contractAddress?.latitude && contractAddress?.longitude ? `${contractAddress.latitude}, ${contractAddress.longitude}` : "Não informado"}
                                </InfoRow>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* RIGHT */}
                <Grid size={{ xs: 12, md: 5 }}>
                    {/* Dados do cliente */}
                    <Card sx={{ borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <SectionHeader icon={<IconUser size={18} color="#fff" />} label="Dados do Cliente" gradient="var(--cv-gradient-primary)" />

                            <Box sx={{ mb: 1.5 }}>
                                <Chip label={isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica"} size="small" variant="outlined" icon={isPessoaFisica ? <IconUser size={14} /> : <IconBuilding size={14} />} />
                            </Box>

                            <Stack spacing={0}>
                                {isPessoaFisica ? (
                                    <>
                                        <InfoRow label="Nome Completo">{show(userData?.nome)}</InfoRow>
                                        <InfoRow label="CPF">{show(userData?.cpf)}</InfoRow>
                                        <InfoRow label="Data de Nascimento">{show(userData?.data_nascimento)}</InfoRow>
                                        <InfoRow label="RG">{show(userData?.rg)}</InfoRow>
                                        {userData?.genero && <InfoRow label="GêneroX">{show(userData?.genero)}</InfoRow>}
                                        <InfoRow label="Estado Civil">{show(userData?.estado_civil)}</InfoRow>
                                        <InfoRow label="Profissão">{show(userData?.profissao)}</InfoRow>
                                    </>
                                ) : (
                                    <>
                                        <InfoRow label="Razão Social">{show(userData?.razao_social)}</InfoRow>
                                        <InfoRow label="CNPJ">{show(userData?.cnpj)}</InfoRow>
                                        <InfoRow label="Nome Fantasia">{show(userData?.nome_fantasia)}</InfoRow>
                                        <InfoRow label="Data de Fundação">{show(userData?.data_fundacao)}</InfoRow>
                                        <InfoRow label="Tipo de Empresa">{show(userData?.tipo_empresa)}</InfoRow>
                                        <InfoRow label="Ramo de Atividade">{show(userData?.ramo_atividade)}</InfoRow>
                                        <InfoRow label="Inscrição Estadual">{show(userData?.ie)}</InfoRow>
                                        <InfoRow label="Inscrição Municipal">{show(userData?.im)}</InfoRow>
                                    </>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Address card for mobile (home icon) */}
                    <Card sx={{ mt: 3, borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <SectionHeader icon={<IconHome size={18} color="#fff" />} label="Ações" gradient="linear-gradient(135deg,#64748b,#475569)" />
                            <Stack spacing={1.5}>
                                <Link href={route("consultor.cliente.contratos.edit", contract.id)} style={{ textDecoration: "none" }}>
                                    <Button fullWidth variant="contained" color="warning" startIcon={<IconEdit size={18} />} sx={{ fontWeight: 700, py: 1.2 }}>
                                        Editar Contrato
                                    </Button>
                                </Link>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Page;

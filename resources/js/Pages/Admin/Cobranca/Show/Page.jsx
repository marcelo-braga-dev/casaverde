import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import DateText from "@/Components/Admin/DateText.jsx";
import ConfirmActionButton from "@/Components/Admin/ConfirmActionButton.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import WhatsAppButton from "@/Components/WhatsApp/WhatsAppButton";
import formatCurrency from "@/Utils/formatCurrency.js";
import useAuthUser from "@/Hooks/useAuthUser.js";
import { isAdmin } from "@/Utils/permissions.js";
import {
    IconAdjustments,
    IconBolt,
    IconBrandWhatsapp,
    IconBuildingBank,
    IconCalendar,
    IconCheck,
    IconCreditCard,
    IconFileInvoice,
    IconReceipt,
    IconReceiptRefund,
    IconUser,
    IconX,
} from "@tabler/icons-react";

function formatDateBR(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("pt-BR");
}

function getClientName(charge) {
    return (
        charge.client_profile?.display_name ||
        charge.client_profile?.nome ||
        charge.client_profile?.razao_social ||
        `Cliente #${charge.client_profile_id}`
    );
}

function SectionHeader({ icon, title, gradient = "linear-gradient(135deg,#3b82f6,#1d4ed8)" }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Typography variant="h6" fontWeight={950} letterSpacing="-0.03em">
                {title}
            </Typography>
        </Stack>
    );
}

function InfoRow({ label, value, highlight = false }) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={0.8}
            sx={{ borderBottom: "1px solid var(--cv-border-soft)" }}
        >
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography
                variant="body2"
                fontWeight={highlight ? 900 : 700}
                fontSize={highlight ? 15 : undefined}
                color={highlight ? "primary.main" : undefined}
            >
                {value}
            </Typography>
        </Stack>
    );
}

const STATUS_CONFIG = {
    draft:           { label: "Rascunho",      color: "#64748b", bg: "#f1f5f9" },
    open:            { label: "Aberta",         color: "#3b82f6", bg: "#eff6ff" },
    waiting_payment: { label: "Aguard. Pag.",   color: "#f59e0b", bg: "#fffbeb" },
    paid:            { label: "Paga",           color: "#10b981", bg: "#f0fdf4" },
    overdue:         { label: "Atrasada",       color: "#ef4444", bg: "#fef2f2" },
    cancelled:       { label: "Cancelada",      color: "#6b7280", bg: "#f9fafb" },
};

export default function Page({ charge }) {
    const admin = isAdmin(useAuthUser());
    const hasActivePayment = charge.payment_slips?.some((payment) =>
        ["pending", "generated"].includes(payment.status)
    );

    const adjustmentForm = useForm({
        type: "discount",
        amount: "",
        description: "",
    });

    const cancelForm = useForm({
        reason: "",
    });

    const paidForm = useForm({
        note: "",
    });

    const submitAdjustment = (e) => {
        e.preventDefault();
        adjustmentForm.post(route("admin.financeiro.cobrancas.adjustments.store", charge.id), {
            preserveScroll: true,
            onSuccess: () => {
                adjustmentForm.reset("amount", "description");
                adjustmentForm.setData("type", "discount");
            },
        });
    };

    const approveCharge = () => {
        router.post(route("admin.financeiro.cobrancas.approve", charge.id), {}, { preserveScroll: true });
    };

    const generatePayment = () => {
        router.post(route("admin.financeiro.pagamentos.generate-from-charge", charge.id), {}, { preserveScroll: true });
    };

    const cancelCharge = () => {
        cancelForm.post(route("admin.financeiro.cobrancas.cancel", charge.id), { preserveScroll: true });
    };

    const markPaid = () => {
        paidForm.post(route("admin.financeiro.cobrancas.mark-paid", charge.id), { preserveScroll: true });
    };

    const markOverdue = () => {
        router.post(route("admin.financeiro.cobrancas.mark-overdue", charge.id), {}, { preserveScroll: true });
    };

    const clientName = getClientName(charge);
    const statusCfg = STATUS_CONFIG[charge.status] ?? { label: charge.status, color: "#64748b", bg: "#f1f5f9" };

    const clientPhone = charge.client_profile?.contacts?.celular;
    const mesReferencia = charge.reference_label || `${charge.reference_month}/${charge.reference_year}`;
    const valorFatura = formatCurrency(charge.final_amount);
    const dataVencimento = formatDateBR(charge.due_date);

    const whatsappActionSx = { borderColor: "rgba(255,255,255,0.4)", color: "#fff" };

    const discountPercent = charge.discount_percent || 0;
    const originalAmt = Number(charge.original_amount || 0);
    const finalAmt = Number(charge.final_amount || 0);
    const savingsAmt = originalAmt - finalAmt;
    const savingsPct = originalAmt > 0 ? ((savingsAmt / originalAmt) * 100).toFixed(1) : 0;

    return (
        <Layout titlePage="Detalhes da Cobrança" menu="financeiro">
            <Head title={`Cobrança #${charge.id}`} />

            <Stack spacing={3}>

                {/* ── Hero Card ─────────────────────────────────────── */}
                <Card
                    sx={{
                        background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1e40af 100%)",
                        borderRadius: "var(--cv-radius-xl)",
                        overflow: "visible",
                        position: "relative",
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            alignItems={{ xs: "flex-start", md: "center" }}
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Avatar
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        background: "rgba(255,255,255,0.12)",
                                        border: "2px solid rgba(255,255,255,0.2)",
                                        fontSize: 28,
                                        fontWeight: 900,
                                        color: "#fff",
                                    }}
                                >
                                    <IconReceipt size={32} />
                                </Avatar>

                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px" }}
                                    >
                                        Cobrança
                                    </Typography>
                                    <Typography variant="h4" fontWeight={950} color="#fff" letterSpacing="-0.04em">
                                        #{charge.id}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
                                        {clientName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
                                        Ref: {charge.reference_label || `${charge.reference_month}/${charge.reference_year}`}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction={{ xs: "row", md: "column" }} spacing={1.5} alignItems={{ xs: "center", md: "flex-end" }}>
                                <Chip
                                    label={statusCfg.label}
                                    size="medium"
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.15)",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: 13,
                                        border: "1px solid rgba(255,255,255,0.25)",
                                    }}
                                />

                                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                                    {["open", "waiting_payment"].includes(charge.status) && (
                                        <WhatsAppButton
                                            templateKey="lembrete_vencimento"
                                            phone={clientPhone}
                                            variables={{
                                                cliente_nome: clientName,
                                                mes_referencia: mesReferencia,
                                                valor_fatura: valorFatura,
                                                data_vencimento: dataVencimento,
                                            }}
                                            label="Enviar Lembrete"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<IconBrandWhatsapp size={15} />}
                                            sx={whatsappActionSx}
                                        />
                                    )}

                                    {charge.status === "overdue" && (
                                        <WhatsAppButton
                                            templateKey="fatura_vencida"
                                            phone={clientPhone}
                                            variables={{
                                                cliente_nome: clientName,
                                                mes_referencia: mesReferencia,
                                                valor_fatura: valorFatura,
                                                data_vencimento: dataVencimento,
                                            }}
                                            label="Cobrar via WhatsApp"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<IconBrandWhatsapp size={15} />}
                                            sx={whatsappActionSx}
                                        />
                                    )}

                                    {charge.status === "paid" && (
                                        <WhatsAppButton
                                            templateKey="pagamento_confirmado"
                                            phone={clientPhone}
                                            variables={{
                                                cliente_nome: clientName,
                                                mes_referencia: mesReferencia,
                                                valor_fatura: valorFatura,
                                            }}
                                            label="Confirmar Pagamento"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<IconBrandWhatsapp size={15} />}
                                            sx={whatsappActionSx}
                                        />
                                    )}

                                    {charge.status === "draft" && (
                                        <Tooltip title="Abrir esta cobrança para pagamento">
                                            <span>
                                                <ConfirmActionButton
                                                    color="success"
                                                    size="small"
                                                    message="Deseja abrir esta cobrança?"
                                                    onConfirm={approveCharge}
                                                    startIcon={<IconCheck size={15} />}
                                                >
                                                    Abrir cobrança
                                                </ConfirmActionButton>
                                            </span>
                                        </Tooltip>
                                    )}

                                    {["open", "waiting_payment"].includes(charge.status) && !hasActivePayment && (
                                        <Tooltip title="Gerar boleto ou Pix para esta cobrança">
                                            <span>
                                                <ConfirmActionButton
                                                    color="primary"
                                                    size="small"
                                                    message="Deseja gerar boleto/Pix para esta cobrança?"
                                                    onConfirm={generatePayment}
                                                    startIcon={<IconCreditCard size={15} />}
                                                >
                                                    Gerar boleto/Pix
                                                </ConfirmActionButton>
                                            </span>
                                        </Tooltip>
                                    )}

                                    {["open", "waiting_payment"].includes(charge.status) && (
                                        <Tooltip title="Marcar como atrasada">
                                            <span>
                                                <ConfirmActionButton
                                                    color="error"
                                                    variant="outlined"
                                                    size="small"
                                                    message="Deseja marcar esta cobrança como atrasada?"
                                                    onConfirm={markOverdue}
                                                    startIcon={<IconX size={15} />}
                                                    sx={{ borderColor: "rgba(255,255,255,0.4)", color: "#fca5a5" }}
                                                >
                                                    Marcar atrasada
                                                </ConfirmActionButton>
                                            </span>
                                        </Tooltip>
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── Stats Row ──────────────────────────────────────── */}
                <Grid container spacing={2}>
                    {[
                        {
                            label: "Consumo Injetado",
                            value: <MoneyText value={charge.original_amount} />,
                            gradient: "linear-gradient(135deg,#64748b,#475569)",
                            icon: <IconReceipt size={20} />,
                        },
                        {
                            label: "Desconto Contratual",
                            value: <MoneyText value={charge.discount_amount} />,
                            gradient: "linear-gradient(135deg,#10b981,#059669)",
                            icon: <IconReceiptRefund size={20} />,
                            sub: `${discountPercent}%`,
                        },
                        {
                            label: "Valor Final",
                            value: <MoneyText value={charge.final_amount} bold />,
                            gradient: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                            icon: <IconCreditCard size={20} />,
                            highlight: true,
                        },
                        {
                            label: "Economia Total",
                            value: <MoneyText value={savingsAmt} />,
                            gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
                            icon: <IconCheck size={20} />,
                            sub: `${savingsPct}% de desconto`,
                        },
                    ].map((stat) => (
                        <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: "1px solid var(--cv-border-soft)",
                                    boxShadow: "var(--cv-shadow-md)",
                                    outline: stat.highlight ? "2px solid #3b82f6" : undefined,
                                }}
                            >
                                <CardContent sx={{ p: 2.5 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                {stat.label}
                                            </Typography>
                                            <Typography variant="h6" fontWeight={900} letterSpacing="-0.03em" mt={0.5}>
                                                {stat.value}
                                            </Typography>
                                            {stat.sub && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {stat.sub}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 2,
                                                background: stat.gradient,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Main Content ─────────────────────────────────── */}
                <Grid container spacing={3}>

                    {/* Left: Resumo financeiro */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card
                            sx={{
                                borderRadius: "var(--cv-radius-xl)",
                                border: "1px solid var(--cv-border-soft)",
                                boxShadow: "var(--cv-shadow-md)",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader
                                    icon={<IconReceiptRefund size={18} />}
                                    title="Resumo Financeiro"
                                    gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)"
                                />
                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={0}>
                                    <InfoRow label="Consumo Injetado" value={<MoneyText value={charge.original_amount} />} />
                                    <InfoRow
                                        label={`Desconto contratual (${discountPercent}%)`}
                                        value={<Box component="span" sx={{ color: "#10b981" }}>− <MoneyText value={charge.discount_amount} /></Box>}
                                    />
                                    <InfoRow
                                        label="Desconto manual"
                                        value={<Box component="span" sx={{ color: "#10b981" }}>− <MoneyText value={charge.manual_discount_amount} /></Box>}
                                    />
                                    <InfoRow
                                        label="Acréscimo manual"
                                        value={<Box component="span" sx={{ color: "#ef4444" }}>+ <MoneyText value={charge.manual_addition_amount} /></Box>}
                                    />
                                </Stack>

                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                                        border: "1px solid #bfdbfe",
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body1" fontWeight={700} color="primary.main">
                                            Valor Final
                                        </Typography>
                                        <Typography variant="h5" fontWeight={950} color="primary.main" letterSpacing="-0.04em">
                                            <MoneyText value={charge.final_amount} bold />
                                        </Typography>
                                    </Stack>

                                    {originalAmt > 0 && (
                                        <Box mt={1.5}>
                                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Progresso de desconto
                                                </Typography>
                                                <Typography variant="caption" fontWeight={700} color="success.main">
                                                    {savingsPct}% off
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Number(savingsPct)}
                                                color="success"
                                                sx={{ borderRadius: 4, height: 6 }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right: Dados da cobrança */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2.5} height="100%">
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: "1px solid var(--cv-border-soft)",
                                    boxShadow: "var(--cv-shadow-md)",
                                    flex: 1,
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader
                                        icon={<IconCalendar size={18} />}
                                        title="Dados da Cobrança"
                                        gradient="linear-gradient(135deg,#f59e0b,#d97706)"
                                    />
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={0}>
                                        <InfoRow
                                            label="Vencimento"
                                            value={<DateText value={charge.due_date} />}
                                        />
                                        <InfoRow
                                            label="Paga em"
                                            value={charge.paid_at ? <DateText value={charge.paid_at} /> : "—"}
                                        />
                                        <InfoRow
                                            label="Aprovada em"
                                            value={charge.approved_at ? <DateText value={charge.approved_at} /> : "—"}
                                        />
                                        <InfoRow
                                            label="Usina (UC)"
                                            value={charge.usina?.uc || "—"}
                                        />
                                        <InfoRow
                                            label="Concessionária"
                                            value={charge.concessionaria?.nome || "—"}
                                        />
                                        <InfoRow
                                            label="Gerada por"
                                            value={charge.generated_by?.name || "—"}
                                        />
                                        <InfoRow
                                            label="Aprovada por"
                                            value={charge.approved_by?.name || "—"}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            {admin && charge.bill && (
                                <Link href={route("consultor.cliente.faturas.show", charge.bill.id)}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<IconFileInvoice size={17} />}
                                        sx={{
                                            borderRadius: "var(--cv-radius-xl)",
                                            py: 1.5,
                                            fontWeight: 700,
                                            borderColor: "var(--cv-border-soft)",
                                        }}
                                    >
                                        Ver fatura origem
                                    </Button>
                                </Link>
                            )}
                        </Stack>
                    </Grid>
                </Grid>

                {/* ── Ajuste Manual (apenas draft) ─────────────────── */}
                {charge.status === "draft" && (
                    <Card
                        sx={{
                            borderRadius: "var(--cv-radius-xl)",
                            border: "1px solid var(--cv-border-soft)",
                            boxShadow: "var(--cv-shadow-md)",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader
                                icon={<IconAdjustments size={18} />}
                                title="Adicionar Ajuste Manual"
                                gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
                            />
                            <Divider sx={{ mb: 2.5 }} />

                            <form onSubmit={submitAdjustment}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            select
                                            label="Tipo de ajuste"
                                            value={adjustmentForm.data.type}
                                            onChange={(e) => adjustmentForm.setData("type", e.target.value)}
                                            error={!!adjustmentForm.errors.type}
                                            helperText={adjustmentForm.errors.type}
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="discount">Desconto</MenuItem>
                                            <MenuItem value="addition">Acréscimo</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="Valor (R$)"
                                            value={adjustmentForm.data.amount}
                                            onChange={(e) => adjustmentForm.setData("amount", e.target.value)}
                                            error={!!adjustmentForm.errors.amount}
                                            helperText={adjustmentForm.errors.amount}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Descrição do ajuste"
                                            value={adjustmentForm.data.description}
                                            onChange={(e) => adjustmentForm.setData("description", e.target.value)}
                                            error={!!adjustmentForm.errors.description}
                                            helperText={adjustmentForm.errors.description}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 2 }} display="flex" alignItems="flex-start">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={adjustmentForm.processing}
                                            sx={{ fontWeight: 700, py: 1 }}
                                        >
                                            Adicionar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* ── Pagamentos gerados ────────────────────────────── */}
                <Card
                    sx={{
                        borderRadius: "var(--cv-radius-xl)",
                        border: "1px solid var(--cv-border-soft)",
                        boxShadow: "var(--cv-shadow-md)",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                            <SectionHeader
                                icon={<IconCreditCard size={18} />}
                                title="Pagamentos Gerados"
                                gradient="linear-gradient(135deg,#10b981,#059669)"
                            />
                            {charge.payment_slips?.length > 0 && (
                                <Chip
                                    label={`${charge.payment_slips.length} boleto${charge.payment_slips.length !== 1 ? "s" : ""}`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                        <Divider sx={{ mb: 2 }} />

                        {charge.payment_slips?.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Provider</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Valor</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Vencimento</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {charge.payment_slips.map((payment) => (
                                            <TableRow key={payment.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700}>
                                                        #{payment.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={payment.provider}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700, textTransform: "capitalize" }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700}>
                                                        <MoneyText value={payment.amount} />
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusChip status={payment.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <DateText value={payment.due_date} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Ver detalhes do pagamento">
                                                        <span>
                                                            <Link href={route("admin.financeiro.pagamentos.show", payment.id)}>
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{ fontWeight: 700 }}
                                                                >
                                                                    Ver pagamento
                                                                </Button>
                                                            </Link>
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <EmptyState title="Nenhum pagamento gerado para esta cobrança." />
                        )}
                    </CardContent>
                </Card>

                {/* ── Histórico de ajustes ──────────────────────────── */}
                <Card
                    sx={{
                        borderRadius: "var(--cv-radius-xl)",
                        border: "1px solid var(--cv-border-soft)",
                        boxShadow: "var(--cv-shadow-md)",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                            <SectionHeader
                                icon={<IconAdjustments size={18} />}
                                title="Histórico de Ajustes"
                                gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)"
                            />
                            {charge.adjustments?.length > 0 && (
                                <Chip
                                    label={`${charge.adjustments.length} ajuste${charge.adjustments.length !== 1 ? "s" : ""}`}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                        <Divider sx={{ mb: 2 }} />

                        {charge.adjustments?.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Tipo</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Valor</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Descrição</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Criado por</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Data</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {charge.adjustments.map((adjustment) => (
                                            <TableRow key={adjustment.id} hover>
                                                <TableCell>
                                                    <Chip
                                                        label={adjustment.type === "discount" ? "Desconto" : "Acréscimo"}
                                                        size="small"
                                                        color={adjustment.type === "discount" ? "success" : "error"}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                        color={adjustment.type === "discount" ? "success.main" : "error.main"}
                                                    >
                                                        {adjustment.type === "discount" ? "−" : "+"} <MoneyText value={adjustment.amount} />
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {adjustment.description || "—"}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {adjustment.created_by?.name || "—"}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <DateText value={adjustment.created_at} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <EmptyState title="Nenhum ajuste lançado." />
                        )}
                    </CardContent>
                </Card>

                {/* ── Ações finais (Pagar manualmente / Cancelar) ───── */}
                {!["paid", "cancelled"].includes(charge.status) && (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: "1px solid #d1fae5",
                                    boxShadow: "var(--cv-shadow-md)",
                                    background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader
                                        icon={<IconCheck size={18} />}
                                        title="Marcar como Paga Manualmente"
                                        gradient="linear-gradient(135deg,#10b981,#059669)"
                                    />
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={2}>
                                        <TextField
                                            label="Observação (opcional)"
                                            value={paidForm.data.note}
                                            onChange={(e) => paidForm.setData("note", e.target.value)}
                                            error={!!paidForm.errors.note}
                                            helperText={paidForm.errors.note}
                                            multiline
                                            minRows={3}
                                            fullWidth
                                            size="small"
                                        />

                                        <ConfirmActionButton
                                            color="success"
                                            message="Deseja marcar esta cobrança como paga manualmente?"
                                            onConfirm={markPaid}
                                            disabled={paidForm.processing}
                                            startIcon={<IconCheck size={16} />}
                                            fullWidth
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Marcar como paga
                                        </ConfirmActionButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: "1px solid #fee2e2",
                                    boxShadow: "var(--cv-shadow-md)",
                                    background: "linear-gradient(135deg,#fff5f5,#fee2e2)",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader
                                        icon={<IconX size={18} />}
                                        title="Cancelar Cobrança"
                                        gradient="linear-gradient(135deg,#ef4444,#dc2626)"
                                    />
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={2}>
                                        <TextField
                                            label="Motivo do cancelamento"
                                            value={cancelForm.data.reason}
                                            onChange={(e) => cancelForm.setData("reason", e.target.value)}
                                            error={!!cancelForm.errors.reason}
                                            helperText={cancelForm.errors.reason}
                                            multiline
                                            minRows={3}
                                            fullWidth
                                            size="small"
                                        />

                                        <ConfirmActionButton
                                            color="error"
                                            message="Deseja realmente cancelar esta cobrança? Esta ação não pode ser desfeita."
                                            onConfirm={cancelCharge}
                                            disabled={cancelForm.processing}
                                            startIcon={<IconX size={16} />}
                                            fullWidth
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Cancelar cobrança
                                        </ConfirmActionButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Stack>
        </Layout>
    );
}

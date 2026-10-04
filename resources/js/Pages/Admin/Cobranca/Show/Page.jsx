import { useState } from "react";
import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
import EditDueDateDialog from "./Partials/EditDueDateDialog.jsx";
import PaymentSlipDialog from "./Partials/PaymentSlipDialog.jsx";
import AdjustmentsDialog from "./Partials/AdjustmentsDialog.jsx";
import AddAdjustmentDialog from "./Partials/AddAdjustmentDialog.jsx";
import ChangeHistoryDialog from "./Partials/ChangeHistoryDialog.jsx";
import MarkPaidDialog from "./Partials/MarkPaidDialog.jsx";
import CancelChargeDialog from "./Partials/CancelChargeDialog.jsx";
import formatCurrency from "@/Utils/formatCurrency.js";
import useAuthUser from "@/Hooks/useAuthUser.js";
import { buildPaymentData, formatDueDate, isSlipExpired, isSlipPayable } from "@/Utils/paymentSlip.js";
import { isAdmin } from "@/Utils/permissions.js";
import {
    IconAdjustments,
    IconBarcode,
    IconBolt,
    IconBrandWhatsapp,
    IconCalendar,
    IconCheck,
    IconCreditCard,
    IconFileInvoice,
    IconFileText,
    IconHistory,
    IconPencil,
    IconPlus,
    IconReceipt,
    IconReceiptRefund,
    IconX,
} from "@tabler/icons-react";

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

const PAYMENT_METHOD_LABELS = {
    boleto: "Boleto",
    pix: "Pix",
};

const PROVIDER_LABELS = {
    mercado_pago: "Mercado Pago",
};

export default function Page({ charge, aguardandoNovoBoleto = false }) {
    const admin = isAdmin(useAuthUser());
    const hasActivePayment = charge.payment_slips?.some((payment) =>
        ["pending", "generated"].includes(payment.status)
    );
    const canEditDueDate = !["paid", "cancelled"].includes(charge.status);
    const canFinalizeCharge = !["paid", "cancelled"].includes(charge.status);

    const [editDueDateOpen, setEditDueDateOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [adjustmentsDialogOpen, setAdjustmentsDialogOpen] = useState(false);
    const [addAdjustmentOpen, setAddAdjustmentOpen] = useState(false);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [markPaidOpen, setMarkPaidOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [paymentMenuAnchor, setPaymentMenuAnchor] = useState(null);

    const approveCharge = () => {
        router.post(route("admin.financeiro.cobrancas.approve", charge.id), {}, { preserveScroll: true });
    };

    const generatePayment = (provider, paymentMethod) => {
        setPaymentMenuAnchor(null);
        router.post(
            route("admin.financeiro.pagamentos.generate-from-charge", charge.id),
            { provider, payment_method: paymentMethod },
            { preserveScroll: true }
        );
    };

    const markOverdue = () => {
        router.post(route("admin.financeiro.cobrancas.mark-overdue", charge.id), {}, { preserveScroll: true });
    };

    const clientName = getClientName(charge);
    const statusCfg = STATUS_CONFIG[charge.status] ?? { label: charge.status, color: "#64748b", bg: "#f1f5f9" };

    const clientPhone = charge.client_profile?.contacts?.celular;
    const mesReferencia = charge.reference_label || `${charge.reference_month}/${charge.reference_year}`;
    const valorFatura = formatCurrency(charge.final_amount);
    // due_date já chega como d/m/Y (cast do model); new Date() leria como mês/dia.
    const dataVencimento = charge.due_date ?? "";

    const discountPercent = charge.discount_percent || 0;
    const originalAmt = Number(charge.original_amount || 0);
    const finalAmt = Number(charge.final_amount || 0);
    const savingsAmt = originalAmt - finalAmt;
    const savingsPct = originalAmt > 0 ? ((savingsAmt / originalAmt) * 100).toFixed(1) : 0;

    const activePayment = charge.payment_slips?.find((payment) => ["pending", "generated"].includes(payment.status));
    const latestPayment = activePayment || charge.payment_slips?.[charge.payment_slips.length - 1];
    const expiredPayment = [...(charge.payment_slips || [])].reverse().find((payment) => payment.status === "expired");
    const canGeneratePayment = ["open", "waiting_payment", "overdue"].includes(charge.status) && !hasActivePayment;
    const whatsappContext = {
        phone: clientPhone,
        variables: {
            cliente_nome: clientName,
            mes_referencia: mesReferencia,
            valor_fatura: valorFatura,
        },
    };

    const adjustmentsCount = charge.adjustments?.length || 0;
    const adjustmentsNet = (charge.adjustments || []).reduce(
        (sum, adjustment) => sum + (adjustment.type === "discount" ? -Number(adjustment.amount) : Number(adjustment.amount)),
        0
    );
    const historyCount = charge.histories?.length || 0;

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
                                        Ref: {mesReferencia}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
                                {aguardandoNovoBoleto && (
                                    <Chip
                                        label="Boleto vencido"
                                        size="medium"
                                        color="error"
                                        sx={{ fontWeight: 800, fontSize: 13 }}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {aguardandoNovoBoleto && (
                    <Alert
                        severity="error"
                        variant="filled"
                        sx={{ borderRadius: "var(--cv-radius-xl)", alignItems: "center", "& .MuiAlert-message": { width: "100%" } }}
                        action={
                            canGeneratePayment && (
                                <Button
                                    color="inherit"
                                    variant="outlined"
                                    startIcon={<IconCreditCard size={17} />}
                                    onClick={(e) => setPaymentMenuAnchor(e.currentTarget)}
                                    sx={{ fontWeight: 800, whiteSpace: "nowrap", borderColor: "rgba(255,255,255,0.7)" }}
                                >
                                    Gerar novo boleto
                                </Button>
                            )
                        }
                    >
                        <AlertTitle sx={{ fontWeight: 900, fontSize: 17 }}>
                            Pagamento atrasado — o boleto venceu e é preciso enviar outro
                        </AlertTitle>
                        <Typography variant="body2">
                            {expiredPayment
                                ? `O boleto #${expiredPayment.id} venceu em ${formatDueDate(expiredPayment)} sem pagamento e o banco não aceita mais.`
                                : "O último boleto venceu sem pagamento e o banco não aceita mais."}{" "}
                            O cliente não tem como pagar até receber um novo boleto: gere um novo e envie pelo WhatsApp.
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", mt: 0.75, opacity: 0.9 }}>
                            Se o cliente pagou no próprio dia do vencimento, a compensação pode levar até 3 dias úteis. O sistema continua conferindo
                            e, se esse pagamento cair, cancela o boleto novo automaticamente.
                        </Typography>
                    </Alert>
                )}

                {/* ── Motivo do Cancelamento ────────────────────────── */}
                {charge.status === "cancelled" && (
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
                                title="Motivo do Cancelamento"
                                gradient="linear-gradient(135deg,#ef4444,#dc2626)"
                            />
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1.5}>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                    {charge.notes || "Nenhum motivo informado."}
                                </Typography>

                                {charge.cancelled_at && (
                                    <Typography variant="caption" color="text.secondary">
                                        Cancelada em <DateText value={charge.cancelled_at} />
                                    </Typography>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                {/* ── Ações Disponíveis ─────────────────────────────── */}
                <Card
                    sx={{
                        borderRadius: "var(--cv-radius-xl)",
                        border: "2px solid #3b82f6",
                        boxShadow: "0 8px 30px rgba(59,130,246,0.18)",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <SectionHeader
                            icon={<IconBolt size={18} />}
                            title="Ações Disponíveis"
                            gradient="var(--cv-gradient-primary)"
                        />
                        <Divider sx={{ mb: 2.5 }} />

                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                            {latestPayment && !aguardandoNovoBoleto && (
                                <Button
                                    variant="contained"
                                    size="medium"
                                    startIcon={<IconBarcode size={17} />}
                                    onClick={() => setSelectedPayment(latestPayment)}
                                    sx={{ fontWeight: 700 }}
                                >
                                    Ver boleto/Pix
                                </Button>
                            )}

                            {activePayment && isSlipPayable(activePayment) && (
                                <WhatsAppButton
                                    templateKey="enviar_boleto"
                                    phone={clientPhone}
                                    variables={{
                                        ...whatsappContext.variables,
                                        data_vencimento: formatDueDate(activePayment),
                                        dados_pagamento: buildPaymentData(activePayment, { replacesExpired: Boolean(expiredPayment) }),
                                    }}
                                    label="Enviar boleto ao cliente"
                                    variant="contained"
                                    size="medium"
                                    startIcon={<IconBrandWhatsapp size={17} />}
                                    sx={{ fontWeight: 700 }}
                                />
                            )}

                            {["open", "waiting_payment"].includes(charge.status) && !aguardandoNovoBoleto && (
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
                                    variant="contained"
                                    size="medium"
                                    startIcon={<IconBrandWhatsapp size={17} />}
                                    sx={{ fontWeight: 700 }}
                                />
                            )}

                            {charge.status === "overdue" && !aguardandoNovoBoleto && (
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
                                    variant="contained"
                                    size="medium"
                                    startIcon={<IconBrandWhatsapp size={17} />}
                                    sx={{ fontWeight: 700 }}
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
                                    variant="contained"
                                    size="medium"
                                    startIcon={<IconBrandWhatsapp size={17} />}
                                    sx={{ fontWeight: 700 }}
                                />
                            )}

                            {charge.status === "draft" && (
                                <Tooltip title="Abrir esta cobrança para pagamento">
                                    <span>
                                        <ConfirmActionButton
                                            color="success"
                                            size="medium"
                                            message="Deseja abrir esta cobrança?"
                                            onConfirm={approveCharge}
                                            startIcon={<IconCheck size={17} />}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Abrir cobrança
                                        </ConfirmActionButton>
                                    </span>
                                </Tooltip>
                            )}

                            {charge.status === "draft" && (
                                <Button
                                    color="secondary"
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<IconAdjustments size={17} />}
                                    onClick={() => setAddAdjustmentOpen(true)}
                                    sx={{ fontWeight: 700 }}
                                >
                                    Adicionar ajuste
                                </Button>
                            )}

                            {canGeneratePayment && (
                                <>
                                    <Tooltip title={aguardandoNovoBoleto ? "O boleto anterior venceu: gere um novo e envie ao cliente" : "Gerar boleto ou Pix para esta cobrança"}>
                                        <span>
                                            <Button
                                                color={aguardandoNovoBoleto ? "error" : "primary"}
                                                variant="contained"
                                                size="medium"
                                                startIcon={<IconCreditCard size={17} />}
                                                onClick={(e) => setPaymentMenuAnchor(e.currentTarget)}
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {aguardandoNovoBoleto ? "Gerar novo boleto" : "Gerar pagamento"}
                                            </Button>
                                        </span>
                                    </Tooltip>

                                    <Menu
                                        anchorEl={paymentMenuAnchor}
                                        open={Boolean(paymentMenuAnchor)}
                                        onClose={() => setPaymentMenuAnchor(null)}
                                    >
                                        <MenuItem onClick={() => generatePayment("mercado_pago", "pix")}>
                                            Mercado Pago — Pix
                                        </MenuItem>
                                        <MenuItem onClick={() => generatePayment("mercado_pago", "boleto")}>
                                            Mercado Pago — Boleto
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}

                        </Stack>

                        {(["open", "waiting_payment"].includes(charge.status) || canFinalizeCharge) && (
                            <>
                                <Divider sx={{ my: 2.5 }} />

                                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                    {canEditDueDate && (
                                        <Tooltip title="Editar a data de vencimento desta cobrança">
                                            <span>
                                                <Button
                                                    color="secondary"
                                                    variant="outlined"
                                                    size="medium"
                                                    startIcon={<IconPencil size={17} />}
                                                    onClick={() => setEditDueDateOpen(true)}
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    Editar vencimento
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    )}

                                    {["open", "waiting_payment"].includes(charge.status) && (
                                        <Tooltip title="Marcar como atrasada">
                                            <span>
                                                <ConfirmActionButton
                                                    color="error"
                                                    variant="outlined"
                                                    size="medium"
                                                    message="Deseja marcar esta cobrança como atrasada?"
                                                    onConfirm={markOverdue}
                                                    startIcon={<IconX size={17} />}
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    Marcar atrasada
                                                </ConfirmActionButton>
                                            </span>
                                        </Tooltip>
                                    )}

                                    {canFinalizeCharge && (
                                        <Button
                                            color="success"
                                            variant="outlined"
                                            size="medium"
                                            startIcon={<IconCheck size={17} />}
                                            onClick={() => setMarkPaidOpen(true)}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Marcar como paga
                                        </Button>
                                    )}

                                    {canFinalizeCharge && (
                                        <Button
                                            color="error"
                                            variant="outlined"
                                            size="medium"
                                            startIcon={<IconX size={17} />}
                                            onClick={() => setCancelDialogOpen(true)}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Cancelar cobrança
                                        </Button>
                                    )}
                                </Stack>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* ── Stats Row ──────────────────────────────────────── */}
                <Grid container spacing={2}>
                    {[
                        {
                            label: "Consumo Injetado",
                            value: <MoneyText value={charge.original_amount} />,
                            gradient: "var(--cv-gradient-primary)",
                            icon: <IconReceipt size={20} />,
                        },
                        {
                            label: "Desconto Contratual",
                            value: <MoneyText value={charge.discount_amount} />,
                            gradient: "var(--cv-gradient-primary)",
                            icon: <IconReceiptRefund size={20} />,
                            sub: `${discountPercent}%`,
                        },
                        {
                            label: "Valor Final",
                            value: <MoneyText value={charge.final_amount} bold />,
                            gradient: "var(--cv-gradient-primary)",
                            icon: <IconCreditCard size={20} />,
                            highlight: true,
                        },
                        {
                            label: "Economia Total",
                            value: <MoneyText value={savingsAmt} />,
                            gradient: "var(--cv-gradient-primary)",
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
                <Grid container spacing={3} alignItems="stretch">

                    {/* Resumo financeiro */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            sx={{
                                borderRadius: "var(--cv-radius-xl)",
                                border: "1px solid var(--cv-border-soft)",
                                boxShadow: "var(--cv-shadow-md)",
                                height: "100%",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader
                                    icon={<IconReceiptRefund size={18} />}
                                    title="Resumo Financeiro"
                                    gradient="var(--cv-gradient-primary)"
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
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dados da cobrança */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            sx={{
                                borderRadius: "var(--cv-radius-xl)",
                                border: "1px solid var(--cv-border-soft)",
                                boxShadow: "var(--cv-shadow-md)",
                                height: "100%",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader
                                    icon={<IconCalendar size={18} />}
                                    title="Dados da Cobrança"
                                    gradient="var(--cv-gradient-primary)"
                                />
                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={0}>
                                    <InfoRow
                                        label="Vencimento"
                                        value={
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <DateText value={charge.due_date} />
                                                {canEditDueDate && (
                                                    <Tooltip title="Editar vencimento">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setEditDueDateOpen(true)}
                                                        >
                                                            <IconPencil size={14} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        }
                                    />
                                    <InfoRow
                                        label="Paga em"
                                        value={charge.paid_at ? <DateText value={charge.paid_at} /> : "—"}
                                    />
                                    <InfoRow
                                        label="Usina (UC)"
                                        value={charge.usina?.uc || "—"}
                                    />
                                    <InfoRow
                                        label="Concessionária"
                                        value={charge.concessionaria?.nome || "—"}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Fatura de concessionária */}
                    {charge.bill && (
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: "1px solid var(--cv-border-soft)",
                                    boxShadow: "var(--cv-shadow-md)",
                                    height: "100%",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader
                                        icon={<IconFileInvoice size={18} />}
                                        title="Fatura de Concessionária"
                                        gradient="var(--cv-gradient-primary)"
                                    />
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={0}>
                                        <InfoRow label="Referência" value={charge.bill.reference_label || "—"} />
                                        <InfoRow label="Titular" value={charge.bill.nome || "—"} />
                                        <InfoRow label="UC" value={charge.bill.unidade_consumidora || "—"} />
                                        <InfoRow
                                            label="Vencimento"
                                            value={charge.bill.vencimento ? <DateText value={charge.bill.vencimento} /> : "—"}
                                        />
                                        <InfoRow
                                            label="Valor Total"
                                            value={<MoneyText value={charge.bill.valor_total} />}
                                        />
                                        <InfoRow
                                            label="Consumo kWh"
                                            value={charge.bill.consumo_kwh ? `${charge.bill.consumo_kwh} kWh` : "—"}
                                        />
                                    </Stack>

                                    <Stack direction="row" spacing={1.5} mt={2.5}>
                                        {charge.bill.pdf_link && (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                component="a"
                                                href={charge.bill.pdf_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<IconFileText size={17} />}
                                                sx={{ borderRadius: "var(--cv-radius-xl)", py: 1.5, fontWeight: 700 }}
                                            >
                                                Baixar PDF da fatura
                                            </Button>
                                        )}

                                        {admin && (
                                            <Tooltip title="Ver dados técnicos e status de importação da fatura">
                                                <span>
                                                    <Link href={route("consultor.cliente.faturas.show", charge.bill.id)}>
                                                        <IconButton
                                                            sx={{
                                                                border: "1px solid var(--cv-border-soft)",
                                                                borderRadius: "var(--cv-radius-xl)",
                                                            }}
                                                        >
                                                            <IconFileInvoice size={18} />
                                                        </IconButton>
                                                    </Link>
                                                </span>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>

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
                                gradient="var(--cv-gradient-primary)"
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
                                            <TableCell sx={{ fontWeight: 800 }}>Método</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Valor</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Vencimento</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {charge.payment_slips.map((payment) => (
                                            <TableRow
                                                key={payment.id}
                                                hover
                                                sx={isSlipExpired(payment) ? { bgcolor: "#fef2f2" } : undefined}
                                            >
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={700}>
                                                        {PROVIDER_LABELS[payment.provider] || payment.provider}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {PAYMENT_METHOD_LABELS[payment.payment_method] || payment.payment_method}
                                                    </Typography>
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
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={isSlipExpired(payment) ? 800 : 400}
                                                        color={isSlipExpired(payment) ? "error.main" : "text.primary"}
                                                    >
                                                        {formatDueDate(payment)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<IconBarcode size={15} />}
                                                        onClick={() => setSelectedPayment(payment)}
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        Ver boleto/Pix
                                                    </Button>
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

                {/* ── Ajustes e Histórico (resumo compacto) ─────────── */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            sx={{
                                borderRadius: "var(--cv-radius-xl)",
                                border: "1px solid var(--cv-border-soft)",
                                boxShadow: "var(--cv-shadow-md)",
                                height: "100%",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <SectionHeader
                                        icon={<IconAdjustments size={18} />}
                                        title="Ajustes"
                                        gradient="var(--cv-gradient-primary)"
                                    />
                                </Stack>

                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {adjustmentsCount > 0
                                        ? `${adjustmentsCount} ajuste${adjustmentsCount !== 1 ? "s" : ""} lançado${adjustmentsCount !== 1 ? "s" : ""}, líquido de `
                                        : "Nenhum ajuste lançado nesta cobrança."}
                                    {adjustmentsCount > 0 && (
                                        <Box component="span" fontWeight={800} color={adjustmentsNet <= 0 ? "success.main" : "error.main"}>
                                            {adjustmentsNet <= 0 ? "− " : "+ "}
                                            {formatCurrency(Math.abs(adjustmentsNet))}
                                        </Box>
                                    )}
                                </Typography>

                                <Stack direction="row" spacing={1.5}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<IconAdjustments size={15} />}
                                        onClick={() => setAdjustmentsDialogOpen(true)}
                                        disabled={adjustmentsCount === 0}
                                        sx={{ fontWeight: 700 }}
                                    >
                                        Ver histórico
                                    </Button>
                                    {charge.status === "draft" && (
                                        <Button
                                            variant="text"
                                            size="small"
                                            startIcon={<IconPlus size={15} />}
                                            onClick={() => setAddAdjustmentOpen(true)}
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Adicionar
                                        </Button>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card
                            sx={{
                                borderRadius: "var(--cv-radius-xl)",
                                border: "1px solid var(--cv-border-soft)",
                                boxShadow: "var(--cv-shadow-md)",
                                height: "100%",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader
                                    icon={<IconHistory size={18} />}
                                    title="Histórico de Alterações"
                                    gradient="var(--cv-gradient-primary)"
                                />

                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {historyCount > 0
                                        ? `${historyCount} alteraç${historyCount !== 1 ? "ões" : "ão"} registrada${historyCount !== 1 ? "s" : ""}.`
                                        : "Nenhuma alteração registrada ainda."}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<IconHistory size={15} />}
                                    onClick={() => setHistoryDialogOpen(true)}
                                    disabled={historyCount === 0}
                                    sx={{ fontWeight: 700 }}
                                >
                                    Ver histórico completo
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>

            <EditDueDateDialog
                open={editDueDateOpen}
                charge={charge}
                hasActivePayment={hasActivePayment}
                onClose={() => setEditDueDateOpen(false)}
            />

            <PaymentSlipDialog
                open={Boolean(selectedPayment)}
                payment={selectedPayment}
                onClose={() => setSelectedPayment(null)}
                whatsapp={{ ...whatsappContext, replacesExpired: Boolean(expiredPayment) }}
            />

            <AdjustmentsDialog
                open={adjustmentsDialogOpen}
                adjustments={charge.adjustments}
                onClose={() => setAdjustmentsDialogOpen(false)}
            />

            <AddAdjustmentDialog
                open={addAdjustmentOpen}
                charge={charge}
                onClose={() => setAddAdjustmentOpen(false)}
            />

            <ChangeHistoryDialog
                open={historyDialogOpen}
                histories={charge.histories}
                onClose={() => setHistoryDialogOpen(false)}
            />

            <MarkPaidDialog
                open={markPaidOpen}
                charge={charge}
                onClose={() => setMarkPaidOpen(false)}
            />

            <CancelChargeDialog
                open={cancelDialogOpen}
                charge={charge}
                onClose={() => setCancelDialogOpen(false)}
            />
        </Layout>
    );
}

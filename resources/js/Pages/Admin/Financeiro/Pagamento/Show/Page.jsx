import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
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
import {
    IconArrowRight,
    IconBarcode,
    IconBolt,
    IconBrandStripe,
    IconCheck,
    IconChevronDown,
    IconClipboard,
    IconCode,
    IconCreditCard,
    IconExternalLink,
    IconFileText,
    IconQrcode,
    IconRefresh,
    IconX,
} from "@tabler/icons-react";

const statusConfig = {
    pending:   { label: "Pendente",   color: "warning",  bg: "#fffbeb", border: "#fde68a" },
    generated: { label: "Gerado",     color: "info",     bg: "#eff6ff", border: "#bfdbfe" },
    paid:      { label: "Pago",       color: "success",  bg: "#f0fdf4", border: "#bbf7d0" },
    cancelled: { label: "Cancelado",  color: "default",  bg: "#f9fafb", border: "#e5e7eb" },
    failed:    { label: "Falhou",     color: "error",    bg: "#fef2f2", border: "#fecaca" },
    expired:   { label: "Expirado",   color: "warning",  bg: "#fffbeb", border: "#fde68a" },
};

const providerLabels = {
    cora:         "Cora",
    mercado_pago: "Mercado Pago",
    asaas:        "Asaas",
};

const paymentMethodLabels = {
    boleto:     "Boleto",
    pix:        "Pix",
    boleto_pix: "Boleto + Pix",
};

const transactionStatusConfig = {
    paid:      { label: "Pago",      color: "success" },
    pending:   { label: "Pendente",  color: "warning" },
    failed:    { label: "Falhou",    color: "error"   },
    cancelled: { label: "Cancelado", color: "default" },
};

function money(value) {
    return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getClientName(payment) {
    return (
        payment.charge?.client_profile?.display_name ||
        payment.charge?.client_profile?.nome ||
        payment.charge?.client_profile?.razao_social ||
        `Cliente #${payment.charge?.client_profile_id || "—"}`
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

function InfoRow({ label, value, mono = false }) {
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
            <Typography variant="body2" fontWeight={700} sx={{ fontFamily: mono ? "monospace" : undefined }}>
                {value ?? "—"}
            </Typography>
        </Stack>
    );
}

function CopyField({ label, value, icon, multiline = false }) {
    if (!value) return null;

    const handleCopy = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(value);
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                {icon && <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>}
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {label}
                </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                    value={value}
                    multiline={multiline}
                    minRows={multiline ? 3 : undefined}
                    fullWidth
                    size="small"
                    InputProps={{
                        readOnly: true,
                        sx: { fontFamily: "monospace", fontSize: 12 },
                    }}
                    sx={{ flex: 1 }}
                />
                <Tooltip title="Copiar">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCopy}
                        sx={{ minWidth: 36, px: 1, mt: 0.2, height: 40 }}
                    >
                        <IconClipboard size={16} />
                    </Button>
                </Tooltip>
            </Stack>
        </Box>
    );
}

function JsonBlock({ value, title }) {
    if (!value) {
        return (
            <Typography variant="body2" color="text.secondary" py={2} textAlign="center">
                Nenhum dado registrado.
            </Typography>
        );
    }

    return (
        <TextField
            value={JSON.stringify(value, null, 2)}
            multiline
            minRows={6}
            fullWidth
            size="small"
            InputProps={{
                readOnly: true,
                sx: { fontFamily: "monospace", fontSize: 12 },
            }}
        />
    );
}

export default function Page({ payment }) {
    const stCfg = statusConfig[payment.status] ?? { label: payment.status, color: "default", bg: "#f9fafb", border: "#e5e7eb" };
    const clientName = getClientName(payment);
    const methodLabel = paymentMethodLabels[payment.payment_method] || payment.payment_method || "—";
    const providerLabel = providerLabels[payment.provider] || payment.provider || "—";

    const methodIcon = payment.payment_method === "pix"
        ? <IconQrcode size={32} />
        : payment.payment_method === "boleto"
        ? <IconBarcode size={32} />
        : <IconCreditCard size={32} />;

    return (
        <Layout titlePage="Detalhes do Pagamento" menu="financeiro" subMenu="clientes-pagamentos">
            <Head title={`Pagamento #${payment.id}`} />

            <Stack spacing={3}>

                {/* ── Hero Card ─────────────────────────────────────── */}
                <Card
                    sx={{
                        background: "linear-gradient(135deg,#064e3b 0%,#065f46 50%,#047857 100%)",
                        borderRadius: "var(--cv-radius-xl)",
                        overflow: "hidden",
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
                                        color: "#fff",
                                    }}
                                >
                                    {methodIcon}
                                </Avatar>

                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px" }}
                                    >
                                        {providerLabel} · {methodLabel}
                                    </Typography>
                                    <Typography variant="h4" fontWeight={950} color="#fff" letterSpacing="-0.04em">
                                        #{payment.id}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
                                        {clientName}
                                    </Typography>
                                    <Typography variant="h5" fontWeight={900} color="#6ee7b7" mt={1}>
                                        {money(payment.amount)}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                <Chip
                                    label={stCfg.label}
                                    size="medium"
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.15)",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: 13,
                                        border: "1px solid rgba(255,255,255,0.25)",
                                    }}
                                />

                                {payment.status !== "paid" && (
                                    <Tooltip title="Sincronizar status com o provider">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<IconRefresh size={15} />}
                                            onClick={() => router.post(route("admin.pagamentos.sync", payment.id))}
                                            sx={{
                                                borderColor: "rgba(255,255,255,0.4)",
                                                color: "#fff",
                                                fontWeight: 700,
                                                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                                            }}
                                        >
                                            Sincronizar
                                        </Button>
                                    </Tooltip>
                                )}

                                {!["paid", "cancelled", "expired"].includes(payment.status) && (
                                    <Tooltip title="Cancelar este pagamento no provider">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            startIcon={<IconX size={15} />}
                                            onClick={() => {
                                                if (confirm("Deseja realmente cancelar este pagamento?")) {
                                                    router.post(route("admin.pagamentos.cancel", payment.id));
                                                }
                                            }}
                                            sx={{
                                                borderColor: "#fca5a5",
                                                color: "#fca5a5",
                                                fontWeight: 700,
                                                "&:hover": { bgcolor: "rgba(239,68,68,0.15)" },
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── Main Content ─────────────────────────────────── */}
                <Grid container spacing={3}>

                    {/* Left: Dados do pagamento */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={3}>
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: "1px solid var(--cv-border-soft)",
                                    boxShadow: "var(--cv-shadow-md)",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader
                                        icon={<IconCreditCard size={18} />}
                                        title="Dados do Pagamento"
                                        gradient="linear-gradient(135deg,#10b981,#059669)"
                                    />
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={0}>
                                        <InfoRow label="Valor" value={<strong>{money(payment.amount)}</strong>} />
                                        <InfoRow label="Método de pagamento" value={methodLabel} />
                                        <InfoRow label="Provider" value={providerLabel} />
                                        <InfoRow label="ID no provider" value={payment.provider_payment_id} mono />
                                        <InfoRow label="Status no provider" value={payment.provider_status} />
                                        <InfoRow
                                            label="Vencimento"
                                            value={payment.due_date
                                                ? new Date(payment.due_date).toLocaleDateString("pt-BR")
                                                : "—"}
                                        />
                                        <InfoRow
                                            label="Gerado em"
                                            value={payment.generated_at
                                                ? new Date(payment.generated_at).toLocaleString("pt-BR")
                                                : "—"}
                                        />
                                        <InfoRow
                                            label="Pago em"
                                            value={payment.paid_at
                                                ? new Date(payment.paid_at).toLocaleString("pt-BR")
                                                : "—"}
                                        />
                                    </Stack>

                                    {/* Action buttons */}
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mt={3}>
                                        {payment.charge && (
                                            <Link href={route("admin.financeiro.cobrancas.show", payment.charge.id)}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<IconArrowRight size={16} />}
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    Ver cobrança
                                                </Button>
                                            </Link>
                                        )}

                                        {payment.checkout_url && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                component="a"
                                                href={payment.checkout_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<IconExternalLink size={16} />}
                                                sx={{ fontWeight: 700 }}
                                            >
                                                Abrir checkout
                                            </Button>
                                        )}

                                        {payment.pdf_url && (
                                            <Button
                                                variant="outlined"
                                                component="a"
                                                href={payment.pdf_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                startIcon={<IconFileText size={16} />}
                                                sx={{ fontWeight: 700 }}
                                            >
                                                Boleto PDF
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Transações */}
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
                                            icon={<IconBolt size={18} />}
                                            title="Transações"
                                            gradient="linear-gradient(135deg,#f59e0b,#d97706)"
                                        />
                                        {payment.transactions?.length > 0 && (
                                            <Chip
                                                label={`${payment.transactions.length} transaç${payment.transactions.length !== 1 ? "ões" : "ão"}`}
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />

                                    {payment.transactions?.length > 0 ? (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
                                                        <TableCell sx={{ fontWeight: 800 }}>Provider</TableCell>
                                                        <TableCell sx={{ fontWeight: 800 }}>ID Transação</TableCell>
                                                        <TableCell sx={{ fontWeight: 800 }}>Valor</TableCell>
                                                        <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                                        <TableCell sx={{ fontWeight: 800 }}>Pago em</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {payment.transactions.map((transaction) => {
                                                        const tSt = transactionStatusConfig[transaction.status] ?? { label: transaction.status, color: "default" };
                                                        return (
                                                            <TableRow key={transaction.id} hover>
                                                                <TableCell>
                                                                    <Typography variant="body2" fontWeight={700}>
                                                                        #{transaction.id}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip label={transaction.provider} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                                                                        {transaction.provider_transaction_id || "—"}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2" fontWeight={700}>
                                                                        {money(transaction.amount)}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip label={tSt.label} color={tSt.color} size="small" sx={{ fontWeight: 700 }} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {transaction.paid_at
                                                                            ? new Date(transaction.paid_at).toLocaleString("pt-BR")
                                                                            : "—"}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Box py={4} textAlign="center">
                                            <Typography color="text.secondary" variant="body2">
                                                Nenhuma transação registrada.
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right: Informações de pagamento */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2.5}>
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: "1px solid var(--cv-border-soft)",
                                    boxShadow: "var(--cv-shadow-md)",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader
                                        icon={<IconBarcode size={18} />}
                                        title="Dados de Pagamento"
                                        gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)"
                                    />
                                    <Divider sx={{ mb: 2.5 }} />

                                    <Stack spacing={2}>
                                        <CopyField
                                            label="Linha digitável"
                                            value={payment.digitable_line}
                                            icon={<IconBarcode size={14} />}
                                        />

                                        <CopyField
                                            label="Código de barras"
                                            value={payment.barcode}
                                            icon={<IconBarcode size={14} />}
                                        />

                                        <CopyField
                                            label="Pix copia e cola"
                                            value={payment.pix_copy_paste}
                                            icon={<IconQrcode size={14} />}
                                            multiline
                                        />

                                        {!payment.digitable_line && !payment.barcode && !payment.pix_copy_paste && (
                                            <Box py={3} textAlign="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    Nenhuma chave de pagamento disponível.
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Status visual */}
                            <Card
                                sx={{
                                    borderRadius: "var(--cv-radius-xl)",
                                    border: `1px solid ${stCfg.border}`,
                                    background: stCfg.bg,
                                    boxShadow: "var(--cv-shadow-md)",
                                }}
                            >
                                <CardContent sx={{ p: 2.5 }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: stCfg.border,
                                            }}
                                        >
                                            {payment.status === "paid" ? (
                                                <IconCheck size={22} color="#065f46" />
                                            ) : payment.status === "failed" || payment.status === "cancelled" ? (
                                                <IconX size={22} color="#991b1b" />
                                            ) : (
                                                <IconRefresh size={22} color="#92400e" />
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={800}>
                                                {stCfg.label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Status atual do pagamento
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>

                {/* ── Payloads técnicos (colapsável) ───────────────── */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Accordion
                            sx={{
                                borderRadius: "var(--cv-radius-xl) !important",
                                border: "1px solid var(--cv-border-soft)",
                                boxShadow: "var(--cv-shadow-md)",
                                "&:before": { display: "none" },
                            }}
                        >
                            <AccordionSummary expandIcon={<IconChevronDown size={18} />} sx={{ px: 3, py: 1.5 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 1.5,
                                            background: "linear-gradient(135deg,#64748b,#475569)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#fff",
                                        }}
                                    >
                                        <IconCode size={16} />
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={800}>
                                        Payload Enviado
                                    </Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <JsonBlock value={payment.request_payload} />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Accordion
                            sx={{
                                borderRadius: "var(--cv-radius-xl) !important",
                                border: "1px solid var(--cv-border-soft)",
                                boxShadow: "var(--cv-shadow-md)",
                                "&:before": { display: "none" },
                            }}
                        >
                            <AccordionSummary expandIcon={<IconChevronDown size={18} />} sx={{ px: 3, py: 1.5 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 1.5,
                                            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#fff",
                                        }}
                                    >
                                        <IconBrandStripe size={16} />
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={800}>
                                        Resposta do Provider
                                    </Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <JsonBlock value={payment.response_payload} />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

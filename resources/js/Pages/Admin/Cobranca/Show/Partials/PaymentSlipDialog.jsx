import { Link } from "@inertiajs/react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import DateText from "@/Components/Admin/DateText.jsx";
import CopyField from "@/Components/Admin/CopyField.jsx";
import {
    IconBarcode,
    IconExternalLink,
    IconFileText,
    IconQrcode,
    IconX,
} from "@tabler/icons-react";

const providerLabels = {
    cora: "Cora",
    mercado_pago: "Mercado Pago",
    asaas: "Asaas",
};

const paymentMethodLabels = {
    boleto: "Boleto",
    pix: "Pix",
    boleto_pix: "Boleto + Pix",
};

export default function PaymentSlipDialog({ open, payment, onClose }) {
    if (!payment) return null;

    const providerLabel = providerLabels[payment.provider] || payment.provider || "—";
    const methodLabel = paymentMethodLabels[payment.payment_method] || payment.payment_method || "—";
    const hasCasaVerdePdf = payment.provider === "mercado_pago" && payment.barcode && payment.digitable_line;
    const hasAnyKey = payment.digitable_line || payment.barcode || payment.pix_copy_paste;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
                Boleto / Pix #{payment.id}
                <Typography variant="caption" display="block" color="text.secondary" fontWeight={500}>
                    {providerLabel} · {methodLabel}
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 12, top: 12 }}
                    size="small"
                >
                    <IconX size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Valor
                            </Typography>
                            <Typography variant="h5" fontWeight={900} letterSpacing="-0.03em">
                                <MoneyText value={payment.amount} bold />
                            </Typography>
                        </Box>
                        <Stack spacing={0.5} alignItems="flex-end">
                            <StatusChip status={payment.status} />
                            <Typography variant="caption" color="text.secondary">
                                Vencimento: <DateText value={payment.due_date} />
                            </Typography>
                        </Stack>
                    </Stack>

                    <Divider />

                    {hasAnyKey ? (
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
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                            Nenhuma chave de pagamento disponível para este boleto/Pix.
                        </Typography>
                    )}

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
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

                        {hasCasaVerdePdf && (
                            <Button
                                variant="contained"
                                component="a"
                                href={route("admin.financeiro.pagamentos.boleto-pdf", payment.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<IconFileText size={16} />}
                                sx={{ fontWeight: 700, bgcolor: "#064E3B", "&:hover": { bgcolor: "#053e2f" } }}
                            >
                                Baixar boleto (PDF Casa Verde)
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
                                Boleto PDF ({providerLabel})
                            </Button>
                        )}
                    </Stack>

                    {payment.transactions?.length > 0 && (
                        <>
                            <Divider />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={800} mb={1}>
                                    Transações
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 800 }}>Valor</TableCell>
                                                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 800 }}>Pago em</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payment.transactions.map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell>
                                                        <MoneyText value={transaction.amount} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusChip status={transaction.status} />
                                                    </TableCell>
                                                    <TableCell>
                                                        {transaction.paid_at ? <DateText value={transaction.paid_at} /> : "—"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </>
                    )}

                    <Link href={route("admin.financeiro.pagamentos.show", payment.id)}>
                        <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "underline" }}>
                            Ver detalhes técnicos deste pagamento
                        </Typography>
                    </Link>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

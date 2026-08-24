import {
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import DateText from "@/Components/Admin/DateText.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import { IconX } from "@tabler/icons-react";

export default function AdjustmentsDialog({ open, adjustments, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
                Histórico de Ajustes
                <IconButton onClick={onClose} sx={{ position: "absolute", right: 12, top: 12 }} size="small">
                    <IconX size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {adjustments?.length > 0 ? (
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
                                {adjustments.map((adjustment) => (
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
            </DialogContent>
        </Dialog>
    );
}

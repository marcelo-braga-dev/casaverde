import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { IconCalendar, IconDeviceFloppy } from "@tabler/icons-react";

function toInputDate(brDate) {
    if (!brDate) return "";
    const [day, month, year] = String(brDate).split("/");
    if (!day || !month || !year) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export default function EditDueDateDialog({ open, charge, hasActivePayment, onClose }) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        due_date: "",
    });

    useEffect(() => {
        if (open) {
            setData("due_date", toInputDate(charge.due_date));
            clearErrors();
        }
    }, [open]);

    const submit = (event) => {
        event.preventDefault();
        put(route("admin.financeiro.cobrancas.update-due-date", charge.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Editar vencimento</DialogTitle>
            <Box component="form" onSubmit={submit}>
                <DialogContent>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Nova data de vencimento"
                            type="date"
                            value={data.due_date}
                            onChange={(event) => setData("due_date", event.target.value)}
                            error={Boolean(errors.due_date)}
                            helperText={errors.due_date}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            autoFocus
                        />

                        {hasActivePayment && (
                            <Alert severity="warning" icon={<IconCalendar size={18} />}>
                                <Typography variant="body2">
                                    Esta cobrança já tem um boleto/pix ativo emitido. Alterar a data aqui
                                    <strong> não atualiza</strong> o vencimento no boleto já gerado no provedor de
                                    pagamento — apenas na cobrança. Cancele e reemita o pagamento se precisar
                                    refletir a nova data no boleto.
                                </Typography>
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose} disabled={processing}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing || !data.due_date}
                        startIcon={<IconDeviceFloppy size={18} />}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

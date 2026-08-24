import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { IconPlus } from "@tabler/icons-react";

export default function AddAdjustmentDialog({ open, charge, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        type: "discount",
        amount: "",
        description: "",
    });

    useEffect(() => {
        if (open) {
            clearErrors();
        }
    }, [open]);

    const submit = (event) => {
        event.preventDefault();
        post(route("admin.financeiro.cobrancas.adjustments.store", charge.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Adicionar Ajuste Manual</DialogTitle>
            <Box component="form" onSubmit={submit}>
                <DialogContent>
                    <Stack spacing={2.5}>
                        <TextField
                            select
                            label="Tipo de ajuste"
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            error={!!errors.type}
                            helperText={errors.type}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="discount">Desconto</MenuItem>
                            <MenuItem value="addition">Acréscimo</MenuItem>
                        </TextField>

                        <TextField
                            label="Valor (R$)"
                            value={data.amount}
                            onChange={(e) => setData("amount", e.target.value)}
                            error={!!errors.amount}
                            helperText={errors.amount}
                            fullWidth
                            size="small"
                            autoFocus
                        />

                        <TextField
                            label="Descrição do ajuste"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                            fullWidth
                            size="small"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose} disabled={processing}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        startIcon={<IconPlus size={18} />}
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

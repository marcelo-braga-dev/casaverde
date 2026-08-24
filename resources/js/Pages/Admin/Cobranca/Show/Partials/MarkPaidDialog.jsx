import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { IconCheck } from "@tabler/icons-react";

export default function MarkPaidDialog({ open, charge, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        note: "",
    });

    useEffect(() => {
        if (open) {
            clearErrors();
        }
    }, [open]);

    const submit = (event) => {
        event.preventDefault();

        if (!window.confirm("Deseja marcar esta cobrança como paga manualmente?")) {
            return;
        }

        post(route("admin.financeiro.cobrancas.mark-paid", charge.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Marcar como Paga Manualmente</DialogTitle>
            <Box component="form" onSubmit={submit}>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Observação (opcional)"
                            value={data.note}
                            onChange={(e) => setData("note", e.target.value)}
                            error={!!errors.note}
                            helperText={errors.note}
                            multiline
                            minRows={3}
                            fullWidth
                            size="small"
                            autoFocus
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
                        color="success"
                        disabled={processing}
                        startIcon={<IconCheck size={18} />}
                    >
                        Marcar como paga
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

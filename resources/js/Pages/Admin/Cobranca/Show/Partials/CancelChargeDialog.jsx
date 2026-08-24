import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { IconX } from "@tabler/icons-react";

export default function CancelChargeDialog({ open, charge, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        reason: "",
    });

    useEffect(() => {
        if (open) {
            clearErrors();
        }
    }, [open]);

    const submit = (event) => {
        event.preventDefault();

        if (!window.confirm("Deseja realmente cancelar esta cobrança? Esta ação não pode ser desfeita.")) {
            return;
        }

        post(route("admin.financeiro.cobrancas.cancel", charge.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Cancelar Cobrança</DialogTitle>
            <Box component="form" onSubmit={submit}>
                <DialogContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Motivo do cancelamento"
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            error={!!errors.reason}
                            helperText={errors.reason}
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
                        Voltar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        disabled={processing}
                        startIcon={<IconX size={18} />}
                    >
                        Cancelar cobrança
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

import { useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    MenuItem,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconPlugConnected } from "@tabler/icons-react";

const AttachUsinaForm = ({ profile, usinas = [] }) => {
    const form = useForm({
        usina_id: "",
        started_at: "",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();

        form.post(route("consultor.user.cliente.usina.store", profile.id), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset("usina_id", "started_at", "notes");
            },
        });
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Vincular Cliente à Usina" avatar={<IconPlugConnected />} />

            <CardContent>
                <form onSubmit={submit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Usina"
                                value={form.data.usina_id}
                                onChange={(e) => form.setData("usina_id", e.target.value)}
                                error={!!form.errors.usina_id}
                                helperText={form.errors.usina_id}
                                select
                                required
                                fullWidth
                            >
                                {usinas.map((usina) => (
                                    <MenuItem key={usina.id} value={usina.id}>
                                        {usina.uc || usina.nome || `Usina #${usina.id}`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Data de Início"
                                value={form.data.started_at}
                                onChange={(e) => form.setData("started_at", e.target.value)}
                                error={!!form.errors.started_at}
                                helperText={form.errors.started_at}
                                type="datetime-local"
                                slotProps={{ inputLabel: { shrink: true } }}
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Observações"
                                value={form.data.notes}
                                onChange={(e) => form.setData("notes", e.target.value)}
                                error={!!form.errors.notes}
                                helperText={form.errors.notes}
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={12}>
                            <Button type="submit" color="success" disabled={form.processing}>
                                Vincular Usina
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default AttachUsinaForm;

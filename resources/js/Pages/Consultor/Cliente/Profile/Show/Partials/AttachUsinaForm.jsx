import { useForm } from "@inertiajs/react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconLink, IconPlugConnected } from "@tabler/icons-react";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";

const AttachUsinaForm = ({ profile, usinas = [] }) => {
    const consumerUnits = profile?.consumer_units ?? profile?.consumerUnits ?? [];
    const activeUnits = consumerUnits.filter(uc => uc.status === 'active');

    const form = useForm({
        consumer_unit_id: "",
        usina_id: "",
        started_at: "",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route("consultor.user.cliente.usina.store", profile.id), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset("consumer_unit_id", "usina_id", "started_at", "notes");
            },
        });
    };

    if (activeUnits.length === 0) {
        return (
            <Alert severity="info" sx={{ mb: 3 }}>
                Cadastre ao menos uma <strong>Unidade Consumidora (UC)</strong> ativa na aba "UCs" antes de vincular uma usina.
            </Alert>
        );
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        background: 'linear-gradient(135deg,#10b981,#059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    }}>
                        <IconLink size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 950 }}>
                        Vincular UC à Usina
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                <form onSubmit={submit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <SearchableSelect
                                label="Unidade Consumidora (UC)"
                                value={form.data.consumer_unit_id}
                                onChange={(value) => form.setData("consumer_unit_id", value)}
                                options={[
                                    { value: "", label: "Selecione a UC..." },
                                    ...activeUnits.map((uc) => ({
                                        value: uc.id,
                                        label: `${uc.uc_code}${uc.label ? ` — ${uc.label}` : ''}`,
                                    })),
                                ]}
                                error={!!form.errors.consumer_unit_id}
                                helperText={form.errors.consumer_unit_id}
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <SearchableSelect
                                label="Usina Solar"
                                value={form.data.usina_id}
                                onChange={(value) => form.setData("usina_id", value)}
                                options={[
                                    { value: "", label: "Selecione a usina..." },
                                    ...usinas.map((usina) => ({
                                        value: usina.id,
                                        label: `${usina.usina_nome}${
                                            usina.produtor?.nome_fantasia
                                                ? ` — ${usina.produtor.nome_fantasia}`
                                                : usina.produtor?.nome
                                                    ? ` — ${usina.produtor.nome}`
                                                    : ''
                                        }`,
                                    })),
                                ]}
                                error={!!form.errors.usina_id}
                                helperText={form.errors.usina_id}
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
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
                                rows={2}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                startIcon={<IconPlugConnected size={16} />}
                                disabled={form.processing}
                            >
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

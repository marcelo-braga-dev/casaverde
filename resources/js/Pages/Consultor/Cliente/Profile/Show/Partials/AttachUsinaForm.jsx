import { useForm } from "@inertiajs/react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconLink, IconPlugConnected } from "@tabler/icons-react";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";
import { useMemo } from "react";

const AttachUsinaForm = ({ profile, usinas = [] }) => {
    const consumerUnits = profile?.consumer_units ?? profile?.consumerUnits ?? [];
    const activeUnits = consumerUnits.filter(uc => uc.status === 'active');

    const form = useForm({
        consumer_unit_id: "",
        usina_id: "",
        started_at: "",
        notes: "",
        consumption_percentage: 100,
    });

    const selectedUc = useMemo(
        () => activeUnits.find(uc => String(uc.id) === String(form.data.consumer_unit_id)) ?? null,
        [activeUnits, form.data.consumer_unit_id]
    );

    const activeLinks = selectedUc?.active_usina_links ?? selectedUc?.activeUsinaLinks ?? [];

    // Alocações da UC em usinas diferentes da que está selecionada no formulário
    // (o vínculo ativo com a MESMA usina, se existir, será substituído por este envio).
    const otherLinks = activeLinks.filter(
        link => String(link.usina_id) !== String(form.data.usina_id)
    );

    const allocatedElsewhere = otherLinks.reduce(
        (sum, link) => sum + Number(link.consumption_percentage ?? 0),
        0
    );

    const remainingPercentage = Math.max(0, Math.round((100 - allocatedElsewhere) * 100) / 100);

    const exceedsAvailable = Number(form.data.consumption_percentage) > remainingPercentage + 0.001;

    const submit = (e) => {
        e.preventDefault();

        if (exceedsAvailable) {
            return;
        }

        form.post(route("consultor.user.cliente.usina.store", profile.id), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset("consumer_unit_id", "usina_id", "started_at", "notes", "consumption_percentage");
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
                                label="% do Consumo Previsto"
                                value={form.data.consumption_percentage}
                                onChange={(e) => form.setData("consumption_percentage", e.target.value)}
                                error={!!form.errors.consumption_percentage || exceedsAvailable}
                                helperText={
                                    form.errors.consumption_percentage
                                    ?? `Disponível para esta UC: ${remainingPercentage}%`
                                }
                                type="number"
                                inputProps={{ min: 0.01, max: 100, step: '0.01' }}
                                required
                                fullWidth
                            />
                        </Grid>

                        {selectedUc && activeLinks.length > 0 && (
                            <Grid size={12}>
                                <Alert severity="info" icon={<IconPlugConnected size={18} />}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        Alocação atual do Consumo Previsto desta UC:
                                    </Typography>
                                    <Stack direction="row" gap={1} flexWrap="wrap">
                                        {activeLinks.map((link) => (
                                            <Chip
                                                key={link.id}
                                                size="small"
                                                label={`${link.usina?.usina_nome ?? `Usina #${link.usina_id}`}: ${Number(link.consumption_percentage ?? 0)}%`}
                                                color={String(link.usina_id) === String(form.data.usina_id) ? 'warning' : 'default'}
                                            />
                                        ))}
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                        {otherLinks.length !== activeLinks.length
                                            ? `O vínculo destacado será substituído por este novo envio. Restam ${remainingPercentage}% para esta e outra(s) usina(s).`
                                            : `Restam ${remainingPercentage}% do Consumo Previsto para alocar em outra(s) usina(s).`}
                                    </Typography>
                                </Alert>
                            </Grid>
                        )}

                        {exceedsAvailable && (
                            <Grid size={12}>
                                <Alert severity="error">
                                    A soma das alocações desta UC não pode exceder 100% do Consumo Previsto.
                                    Disponível: {remainingPercentage}%.
                                </Alert>
                            </Grid>
                        )}

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

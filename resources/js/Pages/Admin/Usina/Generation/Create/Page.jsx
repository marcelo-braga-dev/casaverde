import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from "@/Layouts/UserLayout/Layout.jsx";

export default function CreateUsinaGenerationRecordPage() {
    const { props } = usePage();
    const { usinas } = props;

    const currentDate = new Date();

    const { data, setData, post, processing, errors } = useForm({
        usina_id: '',
        reference_year: currentDate.getFullYear(),
        reference_month: currentDate.getMonth() + 1,
        generated_energy_kwh: '',
        injected_energy_kwh: '',
        compensated_energy_kwh: '',
        available_energy_kwh: '',
        notes: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        post(route('admin.usinas.generation.store'), {
            preserveScroll: true,
        });
    };

    return (
        <Layout titlePage="Geração Mensal" menu="usinas-solar" subMenu="usinas-geracao" backPage>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Button
                        component={Link}
                        href={route('admin.usinas.generation.index')}
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                    >
                        Voltar
                    </Button>

                    <Box>
                        <Typography variant="h4" fontWeight={900}>
                            Registrar Geração Mensal
                        </Typography>

                        <Typography color="text.secondary">
                            Atualize a geração e o saldo disponível da usina.
                        </Typography>
                    </Box>
                </Stack>

                <Card sx={{ borderRadius: 3, maxWidth: 980 }}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Usina"
                                        value={data.usina_id}
                                        onChange={(event) => setData('usina_id', event.target.value)}
                                        error={Boolean(errors.usina_id)}
                                        helperText={errors.usina_id}
                                        select
                                        fullWidth
                                    >
                                        {usinas.map((usina) => (
                                            <MenuItem key={usina.id} value={usina.id}>
                                                UC {usina.uc || usina.id} - {usina.produtor?.name || 'Produtor não informado'}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Ano"
                                        value={data.reference_year}
                                        onChange={(event) => setData('reference_year', event.target.value)}
                                        error={Boolean(errors.reference_year)}
                                        helperText={errors.reference_year}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Mês"
                                        value={data.reference_month}
                                        onChange={(event) => setData('reference_month', event.target.value)}
                                        error={Boolean(errors.reference_month)}
                                        helperText={errors.reference_month}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Energia gerada"
                                        value={data.generated_energy_kwh}
                                        onChange={(event) => setData('generated_energy_kwh', event.target.value)}
                                        error={Boolean(errors.generated_energy_kwh)}
                                        helperText={errors.generated_energy_kwh || 'Valor em kWh'}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Energia disponível para alocação"
                                        value={data.available_energy_kwh}
                                        onChange={(event) => setData('available_energy_kwh', event.target.value)}
                                        error={Boolean(errors.available_energy_kwh)}
                                        helperText={errors.available_energy_kwh || 'Valor em kWh'}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Energia injetada"
                                        value={data.injected_energy_kwh}
                                        onChange={(event) => setData('injected_energy_kwh', event.target.value)}
                                        error={Boolean(errors.injected_energy_kwh)}
                                        helperText={errors.injected_energy_kwh || 'Opcional'}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Energia compensada"
                                        value={data.compensated_energy_kwh}
                                        onChange={(event) => setData('compensated_energy_kwh', event.target.value)}
                                        error={Boolean(errors.compensated_energy_kwh)}
                                        helperText={errors.compensated_energy_kwh || 'Opcional'}
                                        type="number"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Observações"
                                        value={data.notes}
                                        onChange={(event) => setData('notes', event.target.value)}
                                        error={Boolean(errors.notes)}
                                        helperText={errors.notes}
                                        multiline
                                        minRows={4}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                        <Button
                                            component={Link}
                                            href={route('admin.usinas.generation.index')}
                                            variant="outlined"
                                        >
                                            Cancelar
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                        >
                                            Salvar Geração
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}

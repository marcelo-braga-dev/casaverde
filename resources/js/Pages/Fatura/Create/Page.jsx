import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({
    concessionarias = [],
    usinas = [],
    clients = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        client_profile_id: "",
        usina_id: "",
        concessionaria_id: "",
        reference_month: "",
        reference_year: "",
        unidade_consumidora: "",
        numero_instalacao: "",
        vencimento: "",
        valor_total: "",
        consumo_kwh: "",
        notes: "",
        pdf: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.faturas.store"), {
            forceFormData: true,
        });
    };

    return (
        <Layout titlePage="Nova Fatura" menu="financeiro">
            <Head title="Nova Fatura" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Cadastrar fatura da concessionária
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Cliente"
                                    value={data.client_profile_id}
                                    onChange={(e) => setData("client_profile_id", e.target.value)}
                                    error={!!errors.client_profile_id}
                                    helperText={errors.client_profile_id}
                                    fullWidth
                                >
                                    {clients.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.display_name} - {item.documento}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Concessionária"
                                    value={data.concessionaria_id}
                                    onChange={(e) => setData("concessionaria_id", e.target.value)}
                                    error={!!errors.concessionaria_id}
                                    helperText={errors.concessionaria_id}
                                    fullWidth
                                >
                                    {concessionarias.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Usina"
                                    value={data.usina_id}
                                    onChange={(e) => setData("usina_id", e.target.value)}
                                    error={!!errors.usina_id}
                                    helperText={errors.usina_id}
                                    fullWidth
                                >
                                    <MenuItem value="">Nenhuma</MenuItem>
                                    {usinas.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.uc || `Usina #${item.id}`}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Mês referência"
                                    value={data.reference_month}
                                    onChange={(e) => setData("reference_month", e.target.value)}
                                    error={!!errors.reference_month}
                                    helperText={errors.reference_month}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Ano referência"
                                    value={data.reference_year}
                                    onChange={(e) => setData("reference_year", e.target.value)}
                                    error={!!errors.reference_year}
                                    helperText={errors.reference_year}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Unidade consumidora"
                                    value={data.unidade_consumidora}
                                    onChange={(e) => setData("unidade_consumidora", e.target.value)}
                                    error={!!errors.unidade_consumidora}
                                    helperText={errors.unidade_consumidora}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Número da instalação"
                                    value={data.numero_instalacao}
                                    onChange={(e) => setData("numero_instalacao", e.target.value)}
                                    error={!!errors.numero_instalacao}
                                    helperText={errors.numero_instalacao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Vencimento"
                                    type="date"
                                    value={data.vencimento}
                                    onChange={(e) => setData("vencimento", e.target.value)}
                                    error={!!errors.vencimento}
                                    helperText={errors.vencimento}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Valor total"
                                    value={data.valor_total}
                                    onChange={(e) => setData("valor_total", e.target.value)}
                                    error={!!errors.valor_total}
                                    helperText={errors.valor_total}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Consumo kWh"
                                    value={data.consumo_kwh}
                                    onChange={(e) => setData("consumo_kwh", e.target.value)}
                                    error={!!errors.consumo_kwh}
                                    helperText={errors.consumo_kwh}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField
                                    type="file"
                                    onChange={(e) => setData("pdf", e.target.files[0])}
                                    error={!!errors.pdf}
                                    helperText={errors.pdf}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Observações"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    error={!!errors.notes}
                                    helperText={errors.notes}
                                    multiline
                                    minRows={4}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Salvar fatura
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
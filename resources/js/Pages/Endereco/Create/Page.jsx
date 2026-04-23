import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        referencia: "",
        latitude: "",
        longitude: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.addresses.store"));
    };

    return (
        <Layout titlePage="Novo Endereço" menu="config">
            <Head title="Novo Endereço" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Cadastrar endereço
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="CEP" value={data.cep} onChange={(e) => setData("cep", e.target.value)} error={!!errors.cep} helperText={errors.cep} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField label="Rua" value={data.rua} onChange={(e) => setData("rua", e.target.value)} error={!!errors.rua} helperText={errors.rua} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField label="Número" value={data.numero} onChange={(e) => setData("numero", e.target.value)} error={!!errors.numero} helperText={errors.numero} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField label="Estado" value={data.estado} onChange={(e) => setData("estado", e.target.value)} error={!!errors.estado} helperText={errors.estado} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Complemento" value={data.complemento} onChange={(e) => setData("complemento", e.target.value)} error={!!errors.complemento} helperText={errors.complemento} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Bairro" value={data.bairro} onChange={(e) => setData("bairro", e.target.value)} error={!!errors.bairro} helperText={errors.bairro} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Cidade" value={data.cidade} onChange={(e) => setData("cidade", e.target.value)} error={!!errors.cidade} helperText={errors.cidade} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Referência" value={data.referencia} onChange={(e) => setData("referencia", e.target.value)} error={!!errors.referencia} helperText={errors.referencia} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Latitude" value={data.latitude} onChange={(e) => setData("latitude", e.target.value)} error={!!errors.latitude} helperText={errors.latitude} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Longitude" value={data.longitude} onChange={(e) => setData("longitude", e.target.value)} error={!!errors.longitude} helperText={errors.longitude} fullWidth />
                            </Grid>

                            <Grid size={12}>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Salvar endereço
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        nome: "",
        tarifa_gd2: "",
        estado: "",
        status: "ativo",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.concessionarias.store"));
    };

    return (
        <Layout titlePage="Nova Concessionária" menu="config">
            <Head title="Nova Concessionária" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Cadastrar concessionária
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Nome"
                                    value={data.nome}
                                    onChange={(e) => setData("nome", e.target.value)}
                                    error={!!errors.nome}
                                    helperText={errors.nome}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Tarifa GD2"
                                    value={data.tarifa_gd2}
                                    onChange={(e) => setData("tarifa_gd2", e.target.value)}
                                    error={!!errors.tarifa_gd2}
                                    helperText={errors.tarifa_gd2}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    label="Estado"
                                    value={data.estado}
                                    onChange={(e) => setData("estado", e.target.value)}
                                    error={!!errors.estado}
                                    helperText={errors.estado}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    select
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    error={!!errors.status}
                                    helperText={errors.status}
                                    fullWidth
                                >
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Salvar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
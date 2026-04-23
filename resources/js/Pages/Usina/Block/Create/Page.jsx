import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        nome: "",
        descricao: "",
        status: "ativo",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.usina-blocks.store"));
    };

    return (
        <Layout titlePage="Novo Bloco de Usina" menu="config">
            <Head title="Novo Bloco de Usina" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Cadastrar bloco
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
                                    label="Descrição"
                                    value={data.descricao}
                                    onChange={(e) => setData("descricao", e.target.value)}
                                    error={!!errors.descricao}
                                    helperText={errors.descricao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
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
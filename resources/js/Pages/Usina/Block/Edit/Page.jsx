import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({ block }) {
    const { data, setData, put, processing, errors } = useForm({
        nome: block.nome || "",
        descricao: block.descricao || "",
        status: block.status || "ativo",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.usina-blocks.update", block.id));
    };

    return (
        <Layout titlePage="Editar Bloco" menu="config">
            <Head title="Editar Bloco" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Editar bloco de usina
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Nome" value={data.nome} onChange={(e) => setData("nome", e.target.value)} error={!!errors.nome} helperText={errors.nome} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Descrição" value={data.descricao} onChange={(e) => setData("descricao", e.target.value)} error={!!errors.descricao} helperText={errors.descricao} fullWidth />
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
                                    Salvar alterações
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
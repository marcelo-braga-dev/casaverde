import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        tipo_pessoa: "pf",
        cpf: "",
        cnpj: "",
        nome: "",
        razao_social: "",
        nome_fantasia: "",
        cidade: "",
        email: "",
        telefone: "",
        status: "prospect",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.user.cliente.store"));
    };

    return (
        <Layout titlePage="Novo Cliente" menu="clientes">
            <Head title="Novo Cliente" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Cadastro base do cliente
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    select
                                    label="Tipo de pessoa"
                                    value={data.tipo_pessoa}
                                    onChange={(e) => setData("tipo_pessoa", e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="pf">Pessoa Física</MenuItem>
                                    <MenuItem value="pj">Pessoa Jurídica</MenuItem>
                                </TextField>
                            </Grid>

                            {data.tipo_pessoa === "pf" ? (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CPF"
                                            value={data.cpf}
                                            onChange={(e) => setData("cpf", e.target.value)}
                                            error={!!errors.cpf}
                                            helperText={errors.cpf}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <TextField
                                            label="Nome"
                                            value={data.nome}
                                            onChange={(e) => setData("nome", e.target.value)}
                                            error={!!errors.nome}
                                            helperText={errors.nome}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CNPJ"
                                            value={data.cnpj}
                                            onChange={(e) => setData("cnpj", e.target.value)}
                                            error={!!errors.cnpj}
                                            helperText={errors.cnpj}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Razão social"
                                            value={data.razao_social}
                                            onChange={(e) => setData("razao_social", e.target.value)}
                                            error={!!errors.razao_social}
                                            helperText={errors.razao_social}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Nome fantasia"
                                            value={data.nome_fantasia}
                                            onChange={(e) => setData("nome_fantasia", e.target.value)}
                                            error={!!errors.nome_fantasia}
                                            helperText={errors.nome_fantasia}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Cidade"
                                    value={data.cidade}
                                    onChange={(e) => setData("cidade", e.target.value)}
                                    error={!!errors.cidade}
                                    helperText={errors.cidade}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Telefone"
                                    value={data.telefone}
                                    onChange={(e) => setData("telefone", e.target.value)}
                                    error={!!errors.telefone}
                                    helperText={errors.telefone}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Salvar cliente
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
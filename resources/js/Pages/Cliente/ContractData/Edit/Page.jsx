import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({ user }) {
    const userData = user.user_data || {};

    const { data, setData, put, processing, errors } = useForm({
        user_id: user.id,
        address_id: userData.address_id || "",
        tipo_pessoa: userData.tipo_pessoa || "pf",
        nome: userData.nome || "",
        cpf: userData.cpf || "",
        data_nascimento: userData.data_nascimento || "",
        rg: userData.rg || "",
        genero: userData.genero || "",
        estado_civil: userData.estado_civil || "",
        profissao: userData.profissao || "",
        data_fundacao: userData.data_fundacao || "",
        cnpj: userData.cnpj || "",
        razao_social: userData.razao_social || "",
        nome_fantasia: userData.nome_fantasia || "",
        tipo_empresa: userData.tipo_empresa || "",
        ie: userData.ie || "",
        im: userData.im || "",
        ramo_atividade: userData.ramo_atividade || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.user.cliente.contract-data.update", user.id));
    };

    return (
        <Layout titlePage="Dados Contratuais do Cliente" menu="clientes">
            <Head title="Dados Contratuais do Cliente" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Dados completos para contrato
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

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Nome" value={data.nome} onChange={(e) => setData("nome", e.target.value)} error={!!errors.nome} helperText={errors.nome} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField label="CPF" value={data.cpf} onChange={(e) => setData("cpf", e.target.value)} error={!!errors.cpf} helperText={errors.cpf} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Data de nascimento" type="date" value={data.data_nascimento} onChange={(e) => setData("data_nascimento", e.target.value)} error={!!errors.data_nascimento} helperText={errors.data_nascimento} InputLabelProps={{ shrink: true }} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="RG" value={data.rg} onChange={(e) => setData("rg", e.target.value)} error={!!errors.rg} helperText={errors.rg} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Gênero" value={data.genero} onChange={(e) => setData("genero", e.target.value)} error={!!errors.genero} helperText={errors.genero} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Estado civil" value={data.estado_civil} onChange={(e) => setData("estado_civil", e.target.value)} error={!!errors.estado_civil} helperText={errors.estado_civil} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Profissão" value={data.profissao} onChange={(e) => setData("profissao", e.target.value)} error={!!errors.profissao} helperText={errors.profissao} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Data de fundação" type="date" value={data.data_fundacao} onChange={(e) => setData("data_fundacao", e.target.value)} error={!!errors.data_fundacao} helperText={errors.data_fundacao} InputLabelProps={{ shrink: true }} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="CNPJ" value={data.cnpj} onChange={(e) => setData("cnpj", e.target.value)} error={!!errors.cnpj} helperText={errors.cnpj} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Razão social" value={data.razao_social} onChange={(e) => setData("razao_social", e.target.value)} error={!!errors.razao_social} helperText={errors.razao_social} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Nome fantasia" value={data.nome_fantasia} onChange={(e) => setData("nome_fantasia", e.target.value)} error={!!errors.nome_fantasia} helperText={errors.nome_fantasia} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Tipo de empresa" value={data.tipo_empresa} onChange={(e) => setData("tipo_empresa", e.target.value)} error={!!errors.tipo_empresa} helperText={errors.tipo_empresa} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Inscrição estadual" value={data.ie} onChange={(e) => setData("ie", e.target.value)} error={!!errors.ie} helperText={errors.ie} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Inscrição municipal" value={data.im} onChange={(e) => setData("im", e.target.value)} error={!!errors.im} helperText={errors.im} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Ramo de atividade" value={data.ramo_atividade} onChange={(e) => setData("ramo_atividade", e.target.value)} error={!!errors.ramo_atividade} helperText={errors.ramo_atividade} fullWidth />
                            </Grid>

                            <Grid size={12}>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Salvar dados contratuais
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
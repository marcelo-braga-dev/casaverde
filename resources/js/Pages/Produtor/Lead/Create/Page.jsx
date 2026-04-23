import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({
    consultores = [],
    producerProfiles = [],
    concessionarias = [],
}) {
    const { data, setData, post, processing, errors } = useForm({
        consultor_user_id: "",
        producer_profile_id: "",
        concessionaria_id: "",
        taxa_reducao: "",
        prazo_locacao: "",
        potencia: "",
        status: "lead",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.producer-leads.store"));
    };

    return (
        <Layout titlePage="Novo Lead de Produtor" menu="produtores">
            <Head title="Novo Lead de Produtor" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Cadastrar lead de produtor
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Consultor"
                                    value={data.consultor_user_id}
                                    onChange={(e) => setData("consultor_user_id", e.target.value)}
                                    error={!!errors.consultor_user_id}
                                    helperText={errors.consultor_user_id}
                                    fullWidth
                                >
                                    {consultores.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Perfil do produtor"
                                    value={data.producer_profile_id}
                                    onChange={(e) => setData("producer_profile_id", e.target.value)}
                                    error={!!errors.producer_profile_id}
                                    helperText={errors.producer_profile_id}
                                    fullWidth
                                >
                                    <MenuItem value="">Nenhum</MenuItem>
                                    {producerProfiles.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.usina_nome || item.admin_nome || `Perfil #${item.id}`}
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
                                    <MenuItem value="">Nenhuma</MenuItem>
                                    {concessionarias.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Taxa de redução"
                                    value={data.taxa_reducao}
                                    onChange={(e) => setData("taxa_reducao", e.target.value)}
                                    error={!!errors.taxa_reducao}
                                    helperText={errors.taxa_reducao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Prazo de locação"
                                    value={data.prazo_locacao}
                                    onChange={(e) => setData("prazo_locacao", e.target.value)}
                                    error={!!errors.prazo_locacao}
                                    helperText={errors.prazo_locacao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Potência"
                                    value={data.potencia}
                                    onChange={(e) => setData("potencia", e.target.value)}
                                    error={!!errors.potencia}
                                    helperText={errors.potencia}
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
                                    <MenuItem value="lead">Lead</MenuItem>
                                    <MenuItem value="proposta_emitida">Proposta emitida</MenuItem>
                                    <MenuItem value="convertido">Convertido</MenuItem>
                                </TextField>
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
                                    Salvar lead
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
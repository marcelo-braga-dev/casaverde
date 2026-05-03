import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, useForm} from "@inertiajs/react";
import {Button, Card, CardContent, CardHeader, MenuItem, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconDeviceFloppy, IconUserEdit} from "@tabler/icons-react";

const Page = ({ lead, consultores = [], producerProfiles = [], concessionarias = [] }) => {
    const { data, setData, put, processing, errors } = useForm({
        consultor_user_id: lead?.consultor_user_id ?? "",
        producer_profile_id: lead?.producer_profile_id ?? "",
        concessionaria_id: lead?.concessionaria_id ?? "",
        taxa_reducao: lead?.taxa_reducao ?? "",
        prazo_locacao: lead?.prazo_locacao ?? "",
        potencia: lead?.potencia ?? "",
        status: lead?.status ?? "novo",
        notes: lead?.notes ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.producer-leads.update", lead.id));
    };

    const getProducerLabel = (producer) => {
        return producer?.usina_nome ||
            producer?.admin_nome ||
            producer?.user?.name ||
            `Produtor #${producer.id}`;
    };

    return (
        <Layout titlePage="Editar Lead de Produtor" menu="produtores-solar" subMenu="producer-leads-index" backPage>
            <Head title="Editar Lead de Produtor" />

            <form onSubmit={submit}>
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados do Lead" avatar={<IconUserEdit />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Consultor"
                                    value={data.consultor_user_id}
                                    onChange={(e) => setData("consultor_user_id", e.target.value)}
                                    error={!!errors.consultor_user_id}
                                    helperText={errors.consultor_user_id}
                                    select
                                    required
                                    fullWidth
                                >
                                    {consultores.map((consultor) => (
                                        <MenuItem key={consultor.id} value={consultor.id}>
                                            {consultor.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Perfil do Produtor"
                                    value={data.producer_profile_id}
                                    onChange={(e) => setData("producer_profile_id", e.target.value)}
                                    error={!!errors.producer_profile_id}
                                    helperText={errors.producer_profile_id}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Não vincular agora</MenuItem>
                                    {producerProfiles.map((producer) => (
                                        <MenuItem key={producer.id} value={producer.id}>
                                            {getProducerLabel(producer)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Concessionária"
                                    value={data.concessionaria_id}
                                    onChange={(e) => setData("concessionaria_id", e.target.value)}
                                    error={!!errors.concessionaria_id}
                                    helperText={errors.concessionaria_id}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Não informar</MenuItem>
                                    {concessionarias.map((concessionaria) => (
                                        <MenuItem key={concessionaria.id} value={concessionaria.id}>
                                            {concessionaria.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Taxa de Redução (%)"
                                    value={data.taxa_reducao}
                                    onChange={(e) => setData("taxa_reducao", e.target.value)}
                                    error={!!errors.taxa_reducao}
                                    helperText={errors.taxa_reducao}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Prazo de Locação"
                                    value={data.prazo_locacao}
                                    onChange={(e) => setData("prazo_locacao", e.target.value)}
                                    error={!!errors.prazo_locacao}
                                    helperText={errors.prazo_locacao}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Potência"
                                    value={data.potencia}
                                    onChange={(e) => setData("potencia", e.target.value)}
                                    error={!!errors.potencia}
                                    helperText={errors.potencia}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    error={!!errors.status}
                                    helperText={errors.status}
                                    select
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="novo">Novo</MenuItem>
                                    <MenuItem value="em_atendimento">Em atendimento</MenuItem>
                                    <MenuItem value="proposta">Proposta</MenuItem>
                                    <MenuItem value="aprovado">Aprovado</MenuItem>
                                    <MenuItem value="reprovado">Reprovado</MenuItem>
                                    <MenuItem value="perdido">Perdido</MenuItem>
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
                                    rows={4}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button
                        type="submit"
                        color="success"
                        startIcon={<IconDeviceFloppy />}
                        disabled={processing}
                    >
                        Atualizar Lead
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;

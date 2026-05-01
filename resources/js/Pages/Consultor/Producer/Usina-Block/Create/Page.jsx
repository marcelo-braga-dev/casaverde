import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconDeviceFloppy, IconFolderPlus } from "@tabler/icons-react";

const Page = () => {
    const { data, setData, post, processing, errors } = useForm({
        nome: "",
        descricao: "",
        status: "ativo",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("consultor.producer.usina-blocks.store"));
    };

    return (
        <Layout titlePage="Cadastrar Grupo de Usinas" menu="produtores-solar" subMenu="usinas-block-index" backPage>
            <Head title="Cadastrar Grupo de Usinas" />

            <form onSubmit={submit}>
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados do Grupo" avatar={<IconFolderPlus />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField
                                    label="Nome do Grupo"
                                    value={data.nome}
                                    onChange={(e) => setData("nome", e.target.value)}
                                    error={!!errors.nome}
                                    helperText={errors.nome}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
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
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Descrição"
                                    value={data.descricao}
                                    onChange={(e) => setData("descricao", e.target.value)}
                                    error={!!errors.descricao}
                                    helperText={errors.descricao}
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
                        Cadastrar Grupo
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;

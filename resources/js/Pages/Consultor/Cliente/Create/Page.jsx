import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    MenuItem,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconUserPlus } from "@tabler/icons-react";

const Page = () => {
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
        consultor_user_id: "",
        status: "prospect",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.user.cliente.store"));
    };

    return (
        <Layout titlePage="Cadastrar Cliente" menu="clientes" subMenu="clientes-cadastrar" backPage>
            <Head title="Cadastrar Cliente" />

            <form onSubmit={submit}>
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados do Cliente" avatar={<IconUserPlus />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Tipo de Pessoa"
                                    value={data.tipo_pessoa}
                                    onChange={(e) => setData("tipo_pessoa", e.target.value)}
                                    error={!!errors.tipo_pessoa}
                                    helperText={errors.tipo_pessoa}
                                    select
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="pf">Pessoa Física</MenuItem>
                                    <MenuItem value="pj">Pessoa Jurídica</MenuItem>
                                </TextField>
                            </Grid>

                            {data.tipo_pessoa === "pf" && (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CPF"
                                            value={data.cpf}
                                            onChange={(e) => setData("cpf", e.target.value)}
                                            error={!!errors.cpf}
                                            helperText={errors.cpf}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <TextField
                                            label="Nome Completo"
                                            value={data.nome}
                                            onChange={(e) => setData("nome", e.target.value)}
                                            error={!!errors.nome}
                                            helperText={errors.nome}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}

                            {data.tipo_pessoa === "pj" && (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CNPJ"
                                            value={data.cnpj}
                                            onChange={(e) => setData("cnpj", e.target.value)}
                                            error={!!errors.cnpj}
                                            helperText={errors.cnpj}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <TextField
                                            label="Razão Social"
                                            value={data.razao_social}
                                            onChange={(e) => setData("razao_social", e.target.value)}
                                            error={!!errors.razao_social}
                                            helperText={errors.razao_social}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            label="Nome Fantasia"
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
                                    required
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
                                    type="email"
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

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    error={!!errors.status}
                                    helperText={errors.status}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="prospect">Prospect</MenuItem>
                                    <MenuItem value="active">Ativo</MenuItem>
                                    <MenuItem value="inactive">Inativo</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button
                        type="submit"
                        color="success"
                        startIcon={<IconUserPlus />}
                        disabled={processing}
                    >
                        Cadastrar Cliente
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;

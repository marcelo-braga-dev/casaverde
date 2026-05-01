import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconArrowLeft,
    IconBuilding,
    IconId,
    IconMail,
    IconPhone,
    IconUser,
} from "@tabler/icons-react";

const Page = ({ client }) => {
    const isPessoaFisica = client?.tipo_pessoa === "pf";

    return (
        <Layout titlePage="Detalhes do Cliente" menu="clientes" subMenu="clientes-listar" backPage>
            <Head title="Detalhes do Cliente" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={isPessoaFisica ? client?.nome : client?.razao_social}
                    subheader={isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica"}
                    avatar={isPessoaFisica ? <IconUser /> : <IconBuilding />}
                    action={
                        <Chip
                            label={client?.status ?? "Sem status"}
                            color={client?.status === "active" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Código do Cliente</Typography>
                            <Typography>{client?.client_code ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">
                                {isPessoaFisica ? "CPF" : "CNPJ"}
                            </Typography>
                            <Typography>
                                {isPessoaFisica
                                    ? client?.cpf ?? "Não informado"
                                    : client?.cnpj ?? "Não informado"}
                            </Typography>
                        </Grid>

                        {!isPessoaFisica && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2">Nome Fantasia</Typography>
                                <Typography>{client?.nome_fantasia ?? "Não informado"}</Typography>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Cidade</Typography>
                            <Typography>{client?.cidade ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">
                                <IconMail size={16} /> Email
                            </Typography>
                            <Typography>{client?.email ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">
                                <IconPhone size={16} /> Telefone
                            </Typography>
                            <Typography>{client?.telefone ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">
                                <IconId size={16} /> Consultor
                            </Typography>
                            <Typography>{client?.consultor?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Usuário da Plataforma</Typography>
                            <Typography>{client?.platform_user?.name ?? "Não vinculado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Link href={route("consultor.user.cliente.index")}>
                <Button startIcon={<IconArrowLeft />} variant="outlined">
                    Voltar para Clientes
                </Button>
            </Link>
        </Layout>
    );
};

export default Page;

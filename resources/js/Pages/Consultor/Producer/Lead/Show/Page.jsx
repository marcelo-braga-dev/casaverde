import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconArrowLeft, IconEdit, IconUser } from "@tabler/icons-react";

const Page = ({ lead }) => {
    const getProducerName = () => {
        return (
            lead?.producer_profile?.usina_nome ||
            lead?.producer_profile?.admin_nome ||
            lead?.producer_profile?.user?.name ||
            "Não informado"
        );
    };

    return (
        <Layout titlePage="Detalhes do Lead de Produtor" menu="produtores" subMenu="produtor-leads" backPage>
            <Head title="Detalhes do Lead de Produtor" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={getProducerName()}
                    subheader={lead?.consultor?.name ? `Consultor: ${lead.consultor.name}` : "Consultor não informado"}
                    avatar={<IconUser />}
                    action={
                        <Chip
                            label={lead?.status ?? "Sem status"}
                            color={lead?.status === "aprovado" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Produtor</Typography>
                            <Typography>{getProducerName()}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Usuário do Produtor</Typography>
                            <Typography>{lead?.producer_profile?.user?.name ?? "Não vinculado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Consultor</Typography>
                            <Typography>{lead?.consultor?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Concessionária</Typography>
                            <Typography>{lead?.concessionaria?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Taxa de Redução</Typography>
                            <Typography>{lead?.taxa_reducao ? `${lead.taxa_reducao}%` : "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Prazo de Locação</Typography>
                            <Typography>{lead?.prazo_locacao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Potência</Typography>
                            <Typography>{lead?.potencia ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Observações</Typography>
                            <Typography>{lead?.notes ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Link href={route("consultor.producer.leads.index")}>
                    <Button startIcon={<IconArrowLeft />} variant="outlined">
                        Voltar
                    </Button>
                </Link>

                <Link href={route("consultor.producer.leads.edit", lead.id)}>
                    <Button startIcon={<IconEdit />} color="warning" variant="outlined">
                        Editar
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default Page;

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconArrowLeft, IconEdit, IconSolarElectricity } from "@tabler/icons-react";

const Page = ({ usina }) => {
    const addressLabel = (address) => {
        if (!address) return "Não informado";

        return `${address?.rua ?? ""}, ${address?.numero ?? ""} - ${address?.bairro ?? ""}, ${address?.cidade ?? ""}/${address?.estado ?? ""}`;
    };

    return (
        <Layout titlePage="Detalhes da Usina" menu="produtores-solar" subMenu="usinas-index" backPage>
            <Head title="Detalhes da Usina" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={usina?.uc ? `UC ${usina.uc}` : `Usina #${usina?.id}`}
                    subheader={usina?.produtor?.name ?? "Produtor não informado"}
                    avatar={<IconSolarElectricity />}
                    action={
                        <Chip
                            label={usina?.status ?? "Sem status"}
                            color={usina?.status === "ativo" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Produtor</Typography>
                            <Typography>{usina?.produtor?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Consultor</Typography>
                            <Typography>{usina?.consultor?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Concessionária</Typography>
                            <Typography>{usina?.concessionaria?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Grupo de Usina</Typography>
                            <Typography>{usina?.block?.nome ?? "Sem grupo"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Endereço</Typography>
                            <Typography>{addressLabel(usina?.address)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">UC</Typography>
                            <Typography>{usina?.uc ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Média de Geração</Typography>
                            <Typography>{usina?.media_geracao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Potência da Usina</Typography>
                            <Typography>{usina?.potencia_usina ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Prazo de Locação</Typography>
                            <Typography>{usina?.prazo_locacao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Taxa de Comissão</Typography>
                            <Typography>{usina?.taxa_comissao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Inversores</Typography>
                            <Typography>{usina?.inversores ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Módulos</Typography>
                            <Typography>{usina?.modulos ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Link href={route("consultor.producer.usinas.index")}>
                    <Button startIcon={<IconArrowLeft />} variant="outlined">
                        Voltar
                    </Button>
                </Link>

                <Link href={route("consultor.producer.usinas.edit", usina.id)}>
                    <Button startIcon={<IconEdit />} color="warning" variant="outlined">
                        Editar
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default Page;

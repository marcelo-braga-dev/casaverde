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
import { IconArrowLeft, IconEdit, IconSettingsBolt } from "@tabler/icons-react";

export default function Page({ concessionaria }) {
    return (
        <Layout titlePage="Detalhes da Concessionária" menu="concessionarias" subMenu="concessionarias-index" backPage>
            <Head title="Detalhes da Concessionária" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={concessionaria?.nome ?? "Concessionária"}
                    avatar={<IconSettingsBolt />}
                    action={
                        <Chip
                            label={concessionaria?.status ?? "Sem status"}
                            color={concessionaria?.status === "ativo" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">ID</Typography>
                            <Typography>{concessionaria?.id ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <Typography variant="subtitle2">Nome</Typography>
                            <Typography>{concessionaria?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }}>
                            <Typography variant="subtitle2">Estado</Typography>
                            <Typography>{concessionaria?.estado ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Tarifa GD2</Typography>
                            <Typography>{concessionaria?.tarifa_gd2 ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Criada em</Typography>
                            <Typography>
                                {concessionaria?.created_at
                                    ? new Date(concessionaria.created_at).toLocaleString("pt-BR")
                                    : "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Atualizada em</Typography>
                            <Typography>
                                {concessionaria?.updated_at
                                    ? new Date(concessionaria.updated_at).toLocaleString("pt-BR")
                                    : "Não informado"}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Link href={route("admin.concessionaria.index")}>
                    <Button startIcon={<IconArrowLeft />} variant="outlined">
                        Voltar
                    </Button>
                </Link>

                <Link href={route("admin.concessionaria.edit", concessionaria.id)}>
                    <Button startIcon={<IconEdit />} color="warning" variant="outlined">
                        Editar
                    </Button>
                </Link>
            </div>
        </Layout>
    );
}

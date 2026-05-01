import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconArrowLeft, IconBolt, IconEdit } from "@tabler/icons-react";

const Page = ({ producer }) => {
    const addressLabel = (address) => {
        if (!address) return "Não informado";

        return `${address?.rua ?? ""}, ${address?.numero ?? ""} - ${address?.bairro ?? ""}, ${address?.cidade ?? ""}/${address?.estado ?? ""}`;
    };

    const dateLabel = (value) => {
        if (!value) return "Não informado";

        return String(value).substring(0, 10);
    };

    return (
        <Layout titlePage="Detalhes do Produtor" menu="produtores" subMenu="produtores-listar" backPage>
            <Head title="Detalhes do Produtor" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={producer?.usina_nome ?? "Produtor"}
                    subheader={producer?.user?.name ?? "Usuário não vinculado"}
                    avatar={<IconBolt />}
                    action={
                        <Chip
                            label={producer?.status ?? "Sem status"}
                            color={producer?.status === "ativo" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Usuário Produtor</Typography>
                            <Typography>{producer?.user?.name ?? "Não vinculado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Criado por</Typography>
                            <Typography>{producer?.created_by?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Administrador</Typography>
                            <Typography>{producer?.admin_nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Qualificação</Typography>
                            <Typography>{producer?.admin_qualificacao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Endereço do Administrador</Typography>
                            <Typography>{addressLabel(producer?.admin_address)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Nome da Usina</Typography>
                            <Typography>{producer?.usina_nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">CNPJ da Usina</Typography>
                            <Typography>{producer?.usina_cnpj ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Endereço da Usina</Typography>
                            <Typography>{addressLabel(producer?.usina_address)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Potência kW</Typography>
                            <Typography>{producer?.potencia_kw ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Potência kWp</Typography>
                            <Typography>{producer?.potencia_kwp ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Geração Anual</Typography>
                            <Typography>{producer?.geracao_anual ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Unidade Consumidora</Typography>
                            <Typography>{producer?.unidade_consumidora ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Área da Usina</Typography>
                            <Typography>{producer?.usina_area ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Área do Imóvel</Typography>
                            <Typography>{producer?.imovel_area ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Matrícula do Imóvel</Typography>
                            <Typography>{producer?.imovel_matricula ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Tipo de Área</Typography>
                            <Typography>{producer?.tipo_area ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Classificação</Typography>
                            <Typography>{producer?.classificacao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Prazo de Locação</Typography>
                            <Typography>{producer?.prazo_locacao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Parcela Fixa</Typography>
                            <Typography>{producer?.parcela_fixa ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Taxa de Administração</Typography>
                            <Typography>{producer?.taxa_administracao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Data do Contrato</Typography>
                            <Typography>{dateLabel(producer?.contrato_data)}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Módulos</Typography>
                            <Typography>{producer?.modulos ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Inversores</Typography>
                            <Typography>{producer?.inversores ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Descrição</Typography>
                            <Typography>{producer?.descricao ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Link href={route("consultor.producer.profiles.index")}>
                    <Button startIcon={<IconArrowLeft />} variant="outlined">
                        Voltar
                    </Button>
                </Link>

                <Link href={route("consultor.producer.profiles.edit", producer.id)}>
                    <Button startIcon={<IconEdit />} color="warning" variant="outlined">
                        Editar
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default Page;

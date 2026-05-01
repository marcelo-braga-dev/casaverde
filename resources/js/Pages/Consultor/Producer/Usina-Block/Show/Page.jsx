import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconArrowLeft, IconEdit, IconFolder } from "@tabler/icons-react";

const Page = ({ block }) => {
    const usinas = block?.usinas ?? [];

    return (
        <Layout titlePage="Detalhes do Grupo de Usinas" menu="produtores-solar" subMenu="usinas-block-index" backPage>
            <Head title="Detalhes do Grupo de Usinas" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={block?.nome ?? "Grupo de Usinas"}
                    avatar={<IconFolder />}
                    action={
                        <Chip
                            label={block?.status ?? "Sem status"}
                            color={block?.status === "ativo" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Nome</Typography>
                            <Typography>{block?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Status</Typography>
                            <Typography>{block?.status ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Descrição</Typography>
                            <Typography>{block?.descricao ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Usinas Vinculadas" />

                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>UC</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Potência</TableCell>
                                    <TableCell>Média Geração</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {usinas.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5}>Nenhuma usina vinculada.</TableCell>
                                    </TableRow>
                                )}

                                {usinas.map((usina) => (
                                    <TableRow key={usina.id}>
                                        <TableCell>{usina.id}</TableCell>
                                        <TableCell>{usina.uc ?? "Não informado"}</TableCell>
                                        <TableCell>{usina.status ?? "Não informado"}</TableCell>
                                        <TableCell>{usina.potencia_usina ?? "Não informado"}</TableCell>
                                        <TableCell>{usina.media_geracao ?? "Não informado"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Link href={route("consultor.producer.usina-blocks.index")}>
                    <Button startIcon={<IconArrowLeft />} variant="outlined">
                        Voltar
                    </Button>
                </Link>

                <Link href={route("consultor.producer.usina-blocks.edit", block.id)}>
                    <Button startIcon={<IconEdit />} color="warning" variant="outlined">
                        Editar
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default Page;

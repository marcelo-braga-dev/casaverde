import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { IconEye, IconPlus, IconUsers } from "@tabler/icons-react";

const Page = ({ producers }) => {
    const items = producers?.data ?? [];

    return (
        <Layout titlePage="Produtores" menu="produtores-solar" subMenu="producer-profiles-index">
            <Head title="Produtores" />

            <Card>
                <CardHeader
                    title="Lista de Produtores"
                    avatar={<IconUsers />}
                    action={
                        <Link href={route("consultor.producer.profiles.create")}>
                            <Button startIcon={<IconPlus />} color="success">
                                Cadastrar Produtor
                            </Button>
                        </Link>
                    }
                />

                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Usuário</TableCell>
                                    <TableCell>Administrador</TableCell>
                                    <TableCell>Usina</TableCell>
                                    <TableCell>Potência kWp</TableCell>
                                    <TableCell>Geração Anual</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((producer) => (
                                    <TableRow key={producer.id}>
                                        <TableCell>{producer.id}</TableCell>
                                        <TableCell>{producer?.user?.name ?? "Não vinculado"}</TableCell>
                                        <TableCell>{producer?.admin_nome ?? "Não informado"}</TableCell>
                                        <TableCell>{producer?.usina_nome ?? "Não informado"}</TableCell>
                                        <TableCell>{producer?.potencia_kwp ?? "Não informado"}</TableCell>
                                        <TableCell>{producer?.geracao_anual ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={producer?.status ?? "Sem status"}
                                                color={producer?.status === "ativo" ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.producer.profiles.show", producer.id)}>
                                                <Button size="small" variant="outlined" startIcon={<IconEye />}>
                                                    Ver
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex justify-center gap-2">
                        {producers?.links?.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? "#"}
                                preserveScroll
                                className={`px-3 py-2 rounded border ${
                                    link.active ? "bg-green-600 text-white" : "bg-white text-gray-700"
                                } ${!link.url ? "opacity-50 pointer-events-none" : ""}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Page;

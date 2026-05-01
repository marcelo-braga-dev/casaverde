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
import { IconEye, IconFolderPlus, IconPlus } from "@tabler/icons-react";

const Page = ({ blocks }) => {
    const items = blocks?.data ?? [];

    return (
        <Layout titlePage="Grupos de Usinas" menu="produtores-solar" subMenu="usinas-block-index">
            <Head title="Grupos de Usinas" />

            <Card>
                <CardHeader
                    title="Lista de Grupos de Usinas"
                    avatar={<IconFolderPlus />}
                    action={
                        <Link href={route("consultor.producer.usina-blocks.create")}>
                            <Button color="success" startIcon={<IconPlus />}>
                                Cadastrar Grupo
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
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((block) => (
                                    <TableRow key={block.id}>
                                        <TableCell>{block.id}</TableCell>
                                        <TableCell>{block.nome}</TableCell>
                                        <TableCell>{block.descricao ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={block.status ?? "Sem status"}
                                                color={block.status === "ativo" ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.producer.usina-blocks.show", block.id)}>
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
                        {blocks?.links?.map((link, index) => (
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

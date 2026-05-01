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

const Page = ({ clients }) => {
    const items = clients?.data ?? [];

    return (
        <Layout titlePage="Clientes" menu="clientes" subMenu="cliente-index">
            <Head title="Clientes" />

            <Card>
                <CardHeader
                    title="Lista de Clientes"
                    avatar={<IconUsers />}
                    action={
                        <Link href={route("consultor.user.cliente.create")}>
                            <Button startIcon={<IconPlus />} color="success">
                                Cadastrar Cliente
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
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Documento</TableCell>
                                    <TableCell>Cidade</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telefone</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((client) => {
                                    const nome =
                                        client?.tipo_pessoa === "pf"
                                            ? client?.nome
                                            : client?.razao_social;

                                    const documento =
                                        client?.tipo_pessoa === "pf"
                                            ? client?.cpf
                                            : client?.cnpj;

                                    return (
                                        <TableRow key={client.id}>
                                            <TableCell>{client.id}</TableCell>
                                            <TableCell>{nome ?? "Não informado"}</TableCell>
                                            <TableCell>{documento ?? "Não informado"}</TableCell>
                                            <TableCell>{client?.cidade ?? "Não informado"}</TableCell>
                                            <TableCell>{client?.email ?? "Não informado"}</TableCell>
                                            <TableCell>{client?.telefone ?? "Não informado"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={client?.status ?? "Sem status"}
                                                    color={client?.status === "active" ? "success" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link href={route("consultor.user.cliente.show", client.id)}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<IconEye />}
                                                    >
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex justify-center gap-2">
                        {clients?.links?.map((link, index) => (
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

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
import { IconEye, IconPlus, IconSolarElectricity } from "@tabler/icons-react";

const Page = ({ usinas }) => {
    const items = usinas?.data ?? [];

    return (
        <Layout titlePage="Usinas" menu="produtores-solar" subMenu="usinas-index">
            <Head title="Usinas" />

            <Card>
                <CardHeader
                    title="Lista de Usinas"
                    avatar={<IconSolarElectricity />}
                    action={
                        <Link href={route("consultor.producer.usinas.create")}>
                            <Button color="success" startIcon={<IconPlus />}>
                                Cadastrar Usina
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
                                    <TableCell>Produtor</TableCell>
                                    <TableCell>Consultor</TableCell>
                                    <TableCell>Grupo</TableCell>
                                    <TableCell>Concessionária</TableCell>
                                    <TableCell>UC</TableCell>
                                    <TableCell>Potência</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((usina) => (
                                    <TableRow key={usina.id}>
                                        <TableCell>{usina.id}</TableCell>
                                        <TableCell>{usina?.produtor?.name ?? "Não informado"}</TableCell>
                                        <TableCell>{usina?.consultor?.name ?? "Não informado"}</TableCell>
                                        <TableCell>{usina?.block?.nome ?? "Sem grupo"}</TableCell>
                                        <TableCell>{usina?.concessionaria?.nome ?? "Não informado"}</TableCell>
                                        <TableCell>{usina?.uc ?? "Não informado"}</TableCell>
                                        <TableCell>{usina?.potencia_usina ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={usina?.status ?? "Sem status"}
                                                color={usina?.status === "ativo" ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.producer.usinas.show", usina.id)}>
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
                        {usinas?.links?.map((link, index) => (
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

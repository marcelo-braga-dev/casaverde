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
import { IconEye, IconSettingsBolt } from "@tabler/icons-react";

export default function Page({ concessionarias }) {
    const items = concessionarias?.data ?? [];

    return (
        <Layout titlePage="Concessionárias" menu="concessionarias" subMenu="concessionarias-index">
            <Head title="Concessionárias" />

            <Card>
                <CardHeader
                    title="Lista de Concessionárias"
                    avatar={<IconSettingsBolt />}
                    // action={
                    //     <Link href={route("admin.concessionaria.create")}>
                    //         <Button color="success" startIcon={<IconPlus />}>
                    //             Nova Concessionária
                    //         </Button>
                    //     </Link>
                    // }
                />

                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Tarifa GD2</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>Nenhuma concessionária encontrada.</TableCell>
                                    </TableRow>
                                )}

                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.nome}</TableCell>
                                        <TableCell>{item.tarifa_gd2 ?? "Não informado"}</TableCell>
                                        <TableCell>{item.estado ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.status ?? "Sem status"}
                                                color={item.status === "ativo" ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("admin.concessionaria.show", item.id)}>
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
                        {concessionarias?.links?.map((link, index) => (
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
}

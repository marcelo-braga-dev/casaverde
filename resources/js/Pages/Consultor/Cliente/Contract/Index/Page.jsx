import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconEye, IconFileCertificate, IconSearch } from "@tabler/icons-react";

const Page = ({ contracts, filters = {} }) => {
    const { data, setData } = useForm({
        id: filters?.id ?? "",
        code: filters?.code ?? "",
        document: filters?.document ?? "",
    });

    const submitFilter = (e) => {
        e.preventDefault();

        router.get(route("consultor.cliente.contratos.index"), data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const items = contracts?.data ?? [];

    return (
        <Layout titlePage="Contratos Emitidos" menu="clientes" subMenu="contratos-index">
            <Head title="Contratos Emitidos" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Filtros" avatar={<IconSearch />} />

                <CardContent>
                    <form onSubmit={submitFilter}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="ID"
                                    value={data.id}
                                    onChange={(e) => setData("id", e.target.value)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Código do Contrato"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="CPF/CNPJ do Cliente"
                                    value={data.document}
                                    onChange={(e) => setData("document", e.target.value)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 1 }}>
                                <Button type="submit" variant="contained" fullWidth sx={{ height: "100%" }}>
                                    Filtrar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Lista de Contratos" avatar={<IconFileCertificate />} />

                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Documento</TableCell>
                                    <TableCell>Proposta</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7}>Nenhum contrato encontrado.</TableCell>
                                    </TableRow>
                                )}

                                {items.map((contract) => (
                                    <TableRow key={contract.id}>
                                        <TableCell>{contract.id}</TableCell>
                                        <TableCell>{contract.contract_code}</TableCell>
                                        <TableCell>{contract?.client_profile?.display_name ?? "Não informado"}</TableCell>
                                        <TableCell>{contract?.client_profile?.documento ?? "Não informado"}</TableCell>
                                        <TableCell>{contract?.proposal?.proposal_code ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            <Chip label={contract.status} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.cliente.contratos.show", contract.id)}>
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
                        {contracts?.links?.map((link, index) => (
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

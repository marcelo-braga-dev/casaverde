import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconBolt, IconEye, IconPlus, IconSearch } from "@tabler/icons-react";

const STATUS_MAP = {
    active: { label: "Ativa", color: "success" },
    inactive: { label: "Inativa", color: "warning" },
    cancelled: { label: "Cancelada", color: "error" },
};

const Page = ({ consumerUnits, filters = {} }) => {
    const { data, setData } = useForm({
        search: filters?.search ?? "",
        status: filters?.status ?? "",
    });

    const submitFilter = (e) => {
        e.preventDefault();

        router.get(route("consultor.cliente.consumer-units.index"), data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const items = consumerUnits?.data ?? [];

    return (
        <Layout titlePage="Unidades Consumidoras" menu="clientes" subMenu="consumer-units-index">
            <Head title="Unidades Consumidoras" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Filtros" avatar={<IconSearch />} />

                <CardContent>
                    <form onSubmit={submitFilter}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    label="Buscar por UC, rótulo ou cliente"
                                    value={data.search}
                                    onChange={(e) => setData("search", e.target.value)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="active">Ativa</MenuItem>
                                    <MenuItem value="inactive">Inativa</MenuItem>
                                    <MenuItem value="cancelled">Cancelada</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <Button type="submit" variant="contained" fullWidth sx={{ height: "100%" }}>
                                    Filtrar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    title="Lista de Unidades Consumidoras"
                    avatar={<IconBolt />}
                    action={
                        <Link href={route("consultor.cliente.consumer-units.create")}>
                            <Button color="success" startIcon={<IconPlus />}>
                                Nova UC
                            </Button>
                        </Link>
                    }
                />

                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código UC</TableCell>
                                    <TableCell>Rótulo</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Concessionária</TableCell>
                                    <TableCell>Consumo Previsto</TableCell>
                                    <TableCell>Usina Alocada</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8}>Nenhuma Unidade Consumidora encontrada.</TableCell>
                                    </TableRow>
                                )}

                                {items.map((uc) => {
                                    const statusInfo = STATUS_MAP[uc.status] ?? { label: uc.status, color: "default" };
                                    const usina = uc.active_usina_link?.usina ?? null;

                                    return (
                                        <TableRow key={uc.id} hover>
                                            <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                                                {uc.uc_code}
                                            </TableCell>
                                            <TableCell>{uc.label ?? "—"}</TableCell>
                                            <TableCell>{uc.client_profile?.display_name ?? "—"}</TableCell>
                                            <TableCell>{uc.concessionaria?.nome ?? "—"}</TableCell>
                                            <TableCell>
                                                {uc.consumo_previsto_kwh_mes != null
                                                    ? `${Number(uc.consumo_previsto_kwh_mes).toLocaleString("pt-BR")} kWh/mês`
                                                    : "—"}
                                            </TableCell>
                                            <TableCell>
                                                {usina ? (
                                                    usina.usina_nome
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Sem vínculo
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={statusInfo.label} color={statusInfo.color} size="small" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link href={route("consultor.cliente.consumer-units.show", uc.id)}>
                                                    <Button size="small" variant="outlined" startIcon={<IconEye />}>
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
                        {consumerUnits?.links?.map((link, index) => (
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

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function MetricCard({ title, value, money = false }) {
    return (
        <Card sx={{ height: "100%" }}>
            <CardContent>
                <Typography color="text.secondary">{title}</Typography>
                {money ? (
                    <MoneyText value={value} bold variant="h5" component="div" />
                ) : (
                    <Typography variant="h5" fontWeight={700}>{value || 0}</Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default function Page({ report, filters = {} }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || report?.range?.start_date || "",
        end_date: filters.end_date || report?.range?.end_date || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.relatorios.clientes"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.relatorios.clientes"));
    };

    const summary = report?.summary || {};

    return (
        <Layout titlePage="Relatório por Cliente" menu="relatorios" subMenu="relatorios-clientes">
            <Head title="Relatório por Cliente" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" fontWeight={700}>
                            Relatório por Cliente
                        </Typography>
                        <Typography color="text.secondary">
                            Período: {report?.range?.label}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <form onSubmit={submit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        type="date"
                                        label="Data inicial"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        type="date"
                                        label="Data final"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Stack direction="row" spacing={2} height="100%" alignItems="center">
                                        <Button type="submit" variant="contained" disabled={processing}>
                                            Filtrar
                                        </Button>
                                        <Button type="button" variant="outlined" onClick={clearFilters}>
                                            Limpar
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Clientes" value={summary.clients_count} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Clientes ativos" value={summary.active_clients_count} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Recebido" value={summary.paid_amount} money />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Em atraso" value={summary.overdue_amount} money />
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        {report?.items?.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>Documento</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Usina</TableCell>
                                        <TableCell align="right">Desconto</TableCell>
                                        <TableCell align="right">Cobranças</TableCell>
                                        <TableCell align="right">Recebido</TableCell>
                                        <TableCell align="right">Atrasado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {report.items.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell>{client.name}</TableCell>
                                            <TableCell>{client.document || "-"}</TableCell>
                                            <TableCell><StatusChip status={client.is_active_client ? "active" : "inactive"} /></TableCell>
                                            <TableCell>{client.usina || "-"}</TableCell>
                                            <TableCell align="right">{client.discount_percent}%</TableCell>
                                            <TableCell align="right">{client.charges_count}</TableCell>
                                            <TableCell align="right"><MoneyText value={client.paid_amount} /></TableCell>
                                            <TableCell align="right"><MoneyText value={client.overdue_amount} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState title="Nenhum cliente encontrado." />
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

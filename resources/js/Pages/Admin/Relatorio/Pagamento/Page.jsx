import Layout from "@/Layouts/UserLayout/Layout.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    MenuItem,
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
import {IconFileExcel, IconFileTypePdf} from "@tabler/icons-react";

export default function Page({ report, filters = {}, statuses = [], providers = [] }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || report?.range?.start_date || "",
        end_date: filters.end_date || report?.range?.end_date || "",
        status: filters.status || "",
        provider: filters.provider || "",
    });

    const submit = (e) => {
        e.preventDefault();

        get(route("admin.relatorios.pagamentos"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.relatorios.pagamentos"));
    };

    const summary = report?.summary || {};

    return (
        <Layout titlePage="Relatório de Pagamentos" menu="relatorios" subMenu="relatorios-pagamentos">
            <Head title="Relatório de Pagamentos" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                        >
                            <Grid size="grow">
                                <Typography variant="h5" fontWeight={700}>
                                    Relatório de Pagamentos
                                </Typography>

                                <Typography color="text.secondary">
                                    Período: {report?.range?.label}
                                </Typography>
                            </Grid>
                            <Grid size="auto">
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                                    <Button
                                        color="error"
                                        component="a"
                                        startIcon={<IconFileTypePdf />}
                                        href={route("admin.relatorios.pagamentos.export-pdf", data)}
                                    >
                                        Exportar PDF
                                    </Button>

                                    <Button
                                        color="success"
                                        component="a"
                                        startIcon={<IconFileExcel />}
                                        href={route("admin.relatorios.pagamentos.export", data)}
                                    >
                                        Exportar Excel
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <form onSubmit={submit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        type="date"
                                        label="Data inicial"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        type="date"
                                        label="Data final"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        select
                                        label="Status"
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {statuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        select
                                        label="Provider"
                                        value={data.provider}
                                        onChange={(e) => setData("provider", e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {providers.map((provider) => (
                                            <MenuItem key={provider} value={provider}>
                                                {provider}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={12}>
                                    <Stack direction="row" spacing={2}>
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
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Pagamentos</Typography>
                                <Typography variant="h5" fontWeight={700}>{summary.total || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Valor total</Typography>
                                <MoneyText value={summary.amount} bold variant="h5" component="div" />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Pagos</Typography>
                                <MoneyText value={summary.paid_amount} bold variant="h5" component="div" color="success.main" />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Falhas</Typography>
                                <Typography variant="h5" fontWeight={700} color={summary.failed_total > 0 ? "error.main" : undefined}>
                                    {summary.failed_total || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        {report?.items?.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>Provider</TableCell>
                                        <TableCell>Método</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Valor</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {report.items.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>#{payment.id}</TableCell>
                                            <TableCell>{payment.client_name}</TableCell>
                                            <TableCell>{payment.provider}</TableCell>
                                            <TableCell>{payment.payment_method}</TableCell>
                                            <TableCell><StatusChip status={payment.status} /></TableCell>
                                            <TableCell align="right"><MoneyText value={payment.amount} /></TableCell>
                                            <TableCell align="right">
                                                <Link href={route("admin.financeiro.pagamentos.show", payment.id)}>
                                                    <Button variant="outlined" size="small">
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState title="Nenhum pagamento encontrado no período." />
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

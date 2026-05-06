import Layout from "@/Layouts/UserLayout/Layout.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import {Head, Link, router, useForm} from "@inertiajs/react";
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

export default function Page({report, filters = {}, statuses = []}) {
    const {data, setData, get, processing} = useForm({
        start_date: filters.start_date || report?.range?.start_date || "",
        end_date: filters.end_date || report?.range?.end_date || "",
        status: filters.status || "",
        reference_month: filters.reference_month || "",
        reference_year: filters.reference_year || "",
    });

    const submit = (e) => {
        e.preventDefault();

        get(route("admin.relatorios.cobrancas"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.relatorios.cobrancas"));
    };

    const summary = report?.summary || {};

    return (
        <Layout titlePage="Relatório de Cobranças" menu="relatorios" subMenu="relatorios-cobrancas">
            <Head title="Relatório de Cobranças"/>

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
                                    Relatório de Cobranças
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
                                        href={route("admin.relatorios.cobrancas.export-pdf", data)}
                                    >
                                        Exportar PDF
                                    </Button>

                                    <Button
                                        color="success"
                                        component="a"
                                        startIcon={<IconFileExcel />}
                                        href={route("admin.relatorios.cobrancas.export", data)}
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
                                <Grid size={{xs: 12, md: 3}}>
                                    <TextField
                                        type="date"
                                        label="Data inicial"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{shrink: true}}
                                    />
                                </Grid>

                                <Grid size={{xs: 12, md: 3}}>
                                    <TextField
                                        type="date"
                                        label="Data final"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{shrink: true}}
                                    />
                                </Grid>

                                <Grid size={{xs: 12, md: 2}}>
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

                                <Grid size={{xs: 12, md: 2}}>
                                    <TextField
                                        label="Mês ref."
                                        value={data.reference_month}
                                        onChange={(e) => setData("reference_month", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{xs: 12, md: 2}}>
                                    <TextField
                                        label="Ano ref."
                                        value={data.reference_year}
                                        onChange={(e) => setData("reference_year", e.target.value)}
                                        fullWidth
                                    />
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
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Total</Typography>
                                <Typography variant="h5" fontWeight={700}>{summary.total || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Valor original</Typography>
                                <MoneyText value={summary.original_amount} bold variant="h5" component="div"/>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Descontos</Typography>
                                <MoneyText value={(summary.discount_amount || 0) + (summary.manual_discount_amount || 0)} bold variant="h5" component="div"/>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">Valor final</Typography>
                                <MoneyText value={summary.final_amount} bold variant="h5" component="div" color="primary.main"/>
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
                                        <TableCell>Referência</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Vencimento</TableCell>
                                        <TableCell align="right">Final</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {report.items.map((charge) => (
                                        <TableRow key={charge.id}>
                                            <TableCell>{charge.id}</TableCell>
                                            <TableCell>{charge.client_name}</TableCell>
                                            <TableCell>{charge.reference_label || "-"}</TableCell>
                                            <TableCell><StatusChip status={charge.status}/></TableCell>
                                            <TableCell>{charge.due_date || "-"}</TableCell>
                                            <TableCell align="right"><MoneyText value={charge.final_amount}/></TableCell>
                                            <TableCell align="right">
                                                <Link href={route("admin.financeiro.cobrancas.show", charge.id)}>
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
                            <EmptyState title="Nenhuma cobrança encontrada no período."/>
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

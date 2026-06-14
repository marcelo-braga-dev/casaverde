import Layout from "@/Layouts/UserLayout/Layout.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import { getStatusLabel } from "@/Utils/statusLabels.js";
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
import { IconEye, IconFileExcel, IconFileTypePdf, IconPlus } from "@tabler/icons-react";

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

export default function Page({
                                 report,
                                 filters = {},
                                 reviewStatuses = [],
                                 parserStatuses = [],
                             }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || report?.range?.start_date || "",
        end_date: filters.end_date || report?.range?.end_date || "",
        review_status: filters.review_status || "",
        parser_status: filters.parser_status || "",
        reference_month: filters.reference_month || "",
        reference_year: filters.reference_year || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.relatorios.faturas"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.relatorios.faturas"));
    };

    const summary = report?.summary || {};

    return (
        <Layout titlePage="Faturas de Concessionárias" menu="financeiro" subMenu="financeiro-faturas">
            <Head title="Faturas de Concessionárias" />

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
                                    Faturas de Concessionárias
                                </Typography>

                                <Typography color="text.secondary">
                                    Período: {report?.range?.label}
                                </Typography>
                            </Grid>
                            <Grid size="auto">
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                                    <Button
                                        color="success"
                                        component={Link}
                                        startIcon={<IconPlus />}
                                        href={route("consultor.cliente.faturas.create")}
                                    >
                                        Cadastrar Fatura de Concessionária
                                    </Button>

                                    <Button
                                        color="error"
                                        component="a"
                                        startIcon={<IconFileTypePdf />}
                                        href={route("admin.relatorios.faturas.export-pdf", data)}
                                    >
                                        Exportar PDF
                                    </Button>

                                    <Button
                                        color="success"
                                        component="a"
                                        startIcon={<IconFileExcel />}
                                        href={route("admin.relatorios.faturas.export", data)}
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
                                        label="Revisão"
                                        value={data.review_status}
                                        onChange={(e) => setData("review_status", e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {reviewStatuses.map((status) => (
                                            <MenuItem key={status} value={status}>{getStatusLabel(status)}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        select
                                        label="Parser"
                                        value={data.parser_status}
                                        onChange={(e) => setData("parser_status", e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {parserStatuses.map((status) => (
                                            <MenuItem key={status} value={status}>{getStatusLabel(status)}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Mês ref."
                                        value={data.reference_month}
                                        onChange={(e) => setData("reference_month", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Faturas de Concessionárias" value={summary.total} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Aprovadas" value={summary.approved} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Pendentes" value={summary.pending_review} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Valor total" value={summary.total_amount} money />
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        {report?.items?.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>UC</TableCell>
                                        <TableCell>Referência</TableCell>
                                        <TableCell>Revisão</TableCell>
                                        <TableCell>Parser</TableCell>
                                        <TableCell>Consumo</TableCell>
                                        <TableCell align="right">Valor</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {report.items.map((bill) => (
                                        <TableRow key={bill.id}>
                                            <TableCell>{bill.client_name}</TableCell>
                                            <TableCell>{bill.unidade_consumidora || "-"}</TableCell>
                                            <TableCell>{bill.reference_label || "-"}</TableCell>
                                            <TableCell><StatusChip status={bill.review_status} /></TableCell>
                                            <TableCell><StatusChip status={bill.parser_status} /></TableCell>
                                            <TableCell>{bill.consumo_kwh || 0} kWh</TableCell>
                                            <TableCell align="right"><MoneyText value={bill.valor_total} /></TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    component={Link}
                                                    href={route("consultor.cliente.faturas.show", bill.id)}
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<IconEye size={15} />}
                                                >
                                                    Ver
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState title="Nenhuma fatura de concessionária encontrada." />
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

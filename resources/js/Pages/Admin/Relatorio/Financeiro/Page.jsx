import Layout from "@/Layouts/UserLayout/Layout.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    LinearProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function MetricCard({ title, value, money = false, color }) {
    return (
        <Card sx={{ height: "100%" }}>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>

                {money ? (
                    <MoneyText value={value} bold variant="h5" component="div" color={color} />
                ) : (
                    <Typography variant="h5" fontWeight={700} color={color}>
                        {value ?? 0}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

function StatusSummary({ rows = [], showAmount = false }) {
    if (!rows.length) {
        return <EmptyState title="Nenhum dado no período." />;
    }

    const max = Math.max(...rows.map((row) => Number(row.total || 0)), 1);

    return (
        <Stack spacing={2}>
            {rows.map((row) => (
                <Stack key={row.status} spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <StatusChip status={row.status} />
                        <Stack direction="row" spacing={2}>
                            <Typography variant="body2">{row.total} registro(s)</Typography>
                            {showAmount && <MoneyText value={row.amount} bold />}
                        </Stack>
                    </Stack>

                    <LinearProgress
                        variant="determinate"
                        value={(Number(row.total || 0) / max) * 100}
                    />
                </Stack>
            ))}
        </Stack>
    );
}

export default function Page({ report, filters = {} }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || report?.range?.start_date || "",
        end_date: filters.end_date || report?.range?.end_date || "",
    });

    const submit = (e) => {
        e.preventDefault();

        get(route("admin.relatorios.financeiro"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.relatorios.financeiro"));
    };

    const summary = report?.summary || {};

    return (
        <Layout titlePage="Relatório Financeiro" menu="relatorios" subMenu="relatorios-financeiro">
            <Head title="Relatório Financeiro" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" fontWeight={700}>
                            Relatório Financeiro
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
                        <MetricCard title="Cobranças" value={summary.charges_count} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Valor bruto" value={summary.gross_amount} money />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Valor final" value={summary.final_amount} money color="primary.main" />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Recebido" value={summary.paid_amount} money color="success.main" />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Em aberto" value={summary.open_amount} money color="warning.main" />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Em atraso" value={summary.overdue_amount} money color="error.main" />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Descontos" value={(summary.contract_discount_amount || 0) + (summary.manual_discount_amount || 0)} money />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Pagamentos com falha" value={summary.failed_payments} color={summary.failed_payments > 0 ? "error.main" : undefined} />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Cobranças por status
                                </Typography>

                                <StatusSummary rows={report?.chargesByStatus || []} showAmount />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Pagamentos por status
                                </Typography>

                                <StatusSummary rows={report?.paymentsByStatus || []} showAmount />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

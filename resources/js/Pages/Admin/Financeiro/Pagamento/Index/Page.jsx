import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Chip,
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

const statusLabels = {
    pending: "Pendente",
    generated: "Gerado",
    paid: "Pago",
    cancelled: "Cancelado",
    failed: "Falhou",
    expired: "Expirado",
};

const statusColors = {
    pending: "default",
    generated: "primary",
    paid: "success",
    cancelled: "default",
    failed: "error",
    expired: "warning",
};

const providerLabels = {
    cora: "Cora",
    mercado_pago: "Mercado Pago",
    asaas: "Asaas",
};

const paymentMethodLabels = {
    boleto: "Boleto",
    pix: "Pix",
    boleto_pix: "Boleto + Pix",
};

function money(value) {
    const number = Number(value || 0);

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function getClientName(payment) {
    return (
        payment.charge?.client_profile?.display_name ||
        payment.charge?.client_profile?.nome ||
        payment.charge?.client_profile?.razao_social ||
        `Cliente #${payment.charge?.client_profile_id || "-"}`
    );
}

function paginationLabel(label) {
    if (!label) {
        return "";
    }

    return label
        .replace("&laquo;", "«")
        .replace("&raquo;", "»")
        .replace(/<[^>]*>/g, "");
}

export default function Page({
                                  payments,
                                  filters = {},
                                  statuses = [],
                                  providers = [],
                                  paymentMethods = [],
                              }) {
    const { data, setData, get, processing } = useForm({
        status: filters.status || "",
        provider: filters.provider || "",
        payment_method: filters.payment_method || "",
        client_name: filters.client_name || "",
        due_date_start: filters.due_date_start || "",
        due_date_end: filters.due_date_end || "",
    });

    const submitFilter = (e) => {
        e.preventDefault();

        get(route("admin.financeiro.pagamentos.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.financeiro.pagamentos.index"));
    };

    return (
        <Layout titlePage="Pagamentos" menu="financeiro" subMenu="financeiro-pagamentos">
            <Head title="Pagamentos" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", md: "center" }}
                            spacing={2}
                        >
                            <Stack spacing={0.5}>
                                <Typography variant="h5">
                                    Pagamentos
                                </Typography>

                                <Typography color="text.secondary">
                                    Boletos, Pix e cobranças geradas pelos provedores de pagamento.
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Link href={route("admin.financeiro.payment-provider-accounts.index")}>
                                    <Button variant="outlined">
                                        Contas de pagamento
                                    </Button>
                                </Link>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Filtros
                        </Typography>

                        <form onSubmit={submitFilter}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Nome do cliente"
                                        value={data.client_name}
                                        onChange={(e) => setData("client_name", e.target.value)}
                                        fullWidth
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
                                                {statusLabels[status] || status}
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
                                                {providerLabels[provider] || provider}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        select
                                        label="Método"
                                        value={data.payment_method}
                                        onChange={(e) => setData("payment_method", e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Todos</MenuItem>

                                        {paymentMethods.map((method) => (
                                            <MenuItem key={method} value={method}>
                                                {paymentMethodLabels[method] || method}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        type="date"
                                        label="Vencimento de"
                                        value={data.due_date_start}
                                        onChange={(e) => setData("due_date_start", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        type="date"
                                        label="Vencimento até"
                                        value={data.due_date_end}
                                        onChange={(e) => setData("due_date_end", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={12}>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                        >
                                            Filtrar
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={clearFilters}
                                        >
                                            Limpar
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Método</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Vencimento</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Gerado em</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {payments?.data?.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>#{payment.id}</TableCell>

                                            <TableCell>
                                                {getClientName(payment)}
                                            </TableCell>

                                            <TableCell>
                                                {providerLabels[payment.provider] || payment.provider}
                                            </TableCell>

                                            <TableCell>
                                                {paymentMethodLabels[payment.payment_method] || payment.payment_method}
                                            </TableCell>

                                            <TableCell>
                                                <strong>{money(payment.amount)}</strong>
                                            </TableCell>

                                            <TableCell>
                                                {payment.due_date || "-"}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={statusLabels[payment.status] || payment.status}
                                                    color={statusColors[payment.status] || "default"}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                {payment.generated_at || "-"}
                                            </TableCell>

                                            <TableCell align="right">
                                                <Link href={route("admin.financeiro.pagamentos.show", payment.id)}>
                                                    <Button variant="outlined" size="small">
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9}>
                                            <Typography textAlign="center" color="text.secondary">
                                                Nenhum pagamento encontrado.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {payments?.links?.length > 0 && (
                            <Stack direction="row" spacing={1} marginTop={3} flexWrap="wrap">
                                {payments.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        size="small"
                                        variant={link.active ? "contained" : "outlined"}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                    >
                                        {paginationLabel(link.label)}
                                    </Button>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

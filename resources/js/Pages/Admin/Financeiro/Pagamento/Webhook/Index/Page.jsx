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
    received: "Recebido",
    processed: "Processado",
    ignored: "Ignorado",
    failed: "Falhou",
};

const statusColors = {
    received: "default",
    processed: "success",
    ignored: "warning",
    failed: "error",
};

const providerLabels = {
    cora: "Cora",
};

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
                                 events,
                                 filters = {},
                                 statuses = [],
                                 providers = [],
                             }) {
    const { data, setData, get, processing } = useForm({
        provider: filters.provider || "",
        status: filters.status || "",
        event_type: filters.event_type || "",
        provider_payment_id: filters.provider_payment_id || "",
    });

    const submit = (e) => {
        e.preventDefault();

        get(route("admin.financeiro.payment-webhooks.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.financeiro.payment-webhooks.index"));
    };

    return (
        <Layout titlePage="Webhooks de Pagamento" menu="financeiro">
            <Head title="Webhooks de Pagamento" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            Webhooks de pagamento
                        </Typography>

                        <Typography color="text.secondary">
                            Auditoria dos eventos recebidos dos provedores de pagamento.
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Filtros
                        </Typography>

                        <form onSubmit={submit}>
                            <Grid container spacing={2}>
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
                                        label="Tipo do evento"
                                        value={data.event_type}
                                        onChange={(e) => setData("event_type", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="ID pagamento provider"
                                        value={data.provider_payment_id}
                                        onChange={(e) => setData("provider_payment_id", e.target.value)}
                                        fullWidth
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
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Evento</TableCell>
                                    <TableCell>ID pagamento</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Tentativas</TableCell>
                                    <TableCell>Recebido em</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {events?.data?.length > 0 ? (
                                    events.data.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell>{event.id}</TableCell>
                                            <TableCell>{providerLabels[event.provider] || event.provider}</TableCell>
                                            <TableCell>{event.event_type || "-"}</TableCell>
                                            <TableCell>{event.provider_payment_id || "-"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={statusLabels[event.status] || event.status}
                                                    color={statusColors[event.status] || "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{event.attempts || 0}</TableCell>
                                            <TableCell>{event.created_at || "-"}</TableCell>
                                            <TableCell align="right">
                                                <Link href={route("admin.financeiro.payment-webhooks.show", event.id)}>
                                                    <Button variant="outlined" size="small">
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            <Typography textAlign="center" color="text.secondary">
                                                Nenhum webhook encontrado.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {events?.links?.length > 0 && (
                            <Stack direction="row" spacing={1} marginTop={3} flexWrap="wrap">
                                {events.links.map((link, index) => (
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

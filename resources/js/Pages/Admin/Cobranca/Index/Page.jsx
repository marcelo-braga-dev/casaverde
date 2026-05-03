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
    draft: "Rascunho",
    open: "Aberta",
    waiting_payment: "Aguardando pagamento",
    paid: "Paga",
    overdue: "Atrasada",
    cancelled: "Cancelada",
};

const statusColors = {
    draft: "default",
    open: "primary",
    waiting_payment: "warning",
    paid: "success",
    overdue: "error",
    cancelled: "default",
};

function money(value) {
    const number = Number(value || 0);

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function getClientName(charge) {
    return (
        charge.client_profile?.display_name ||
        charge.client_profile?.nome ||
        charge.client_profile?.razao_social ||
        `Cliente #${charge.client_profile_id}`
    );
}

export default function Page({
                                 charges,
                                 filters = {},
                                 statuses = [],
                             }) {
    const { data, setData, get, processing } = useForm({
        status: filters.status || "",
        client_profile_id: filters.client_profile_id || "",
        reference_month: filters.reference_month || "",
        reference_year: filters.reference_year || "",
    });

    const submit = (e) => {
        e.preventDefault();

        get(route("admin.financeiro.cobrancas.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.financeiro.cobrancas.index"));
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

    return (
        <Layout titlePage="Cobranças" menu="financeiro" subMenu="clientes-cobrancas">
            <Head title="Cobranças" />

            <Stack spacing={3}>
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
                                        label="ID do cliente"
                                        value={data.client_profile_id}
                                        onChange={(e) => setData("client_profile_id", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Mês"
                                        value={data.reference_month}
                                        onChange={(e) => setData("reference_month", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Ano"
                                        value={data.reference_year}
                                        onChange={(e) => setData("reference_year", e.target.value)}
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
                        <Typography variant="h6" marginBottom={2}>
                            Lista de cobranças
                        </Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Referência</TableCell>
                                    <TableCell>Vencimento</TableCell>
                                    <TableCell>Valor original</TableCell>
                                    <TableCell>Desconto</TableCell>
                                    <TableCell>Valor final</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {charges?.data?.length > 0 ? (
                                    charges.data.map((charge) => (
                                        <TableRow key={charge.id}>
                                            <TableCell>{charge.id}</TableCell>

                                            <TableCell>{getClientName(charge)}</TableCell>

                                            <TableCell>
                                                {charge.reference_label ||
                                                    `${charge.reference_month}/${charge.reference_year}`}
                                            </TableCell>

                                            <TableCell>
                                                {charge.due_date || "-"}
                                            </TableCell>

                                            <TableCell>
                                                {money(charge.original_amount)}
                                            </TableCell>

                                            <TableCell>
                                                {money(charge.discount_amount)}
                                            </TableCell>

                                            <TableCell>
                                                <strong>{money(charge.final_amount)}</strong>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={statusLabels[charge.status] || charge.status}
                                                    color={statusColors[charge.status] || "default"}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell align="right">
                                                <Link href={route("admin.financeiro.cobrancas.show", charge.id)}>
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
                                                Nenhuma cobrança encontrada.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {charges?.links?.length > 0 && (
                            <Stack direction="row" spacing={1} marginTop={3} flexWrap="wrap">
                                {charges.links.map((link, index) => (
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

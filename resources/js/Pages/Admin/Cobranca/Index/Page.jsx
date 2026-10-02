import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Stack,
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
                                 aguardandoNovoBoletoCount = 0,
                             }) {
    const { data, setData, get, processing } = useForm({
        status: filters.status || "",
        client_profile_id: filters.client_profile_id || "",
        client_name: filters.client_name || "",
        reference_month: filters.reference_month || "",
        reference_year: filters.reference_year || "",
        aguardando_novo_boleto: filters.aguardando_novo_boleto || "",
    });

    const filteringAwaitingSlip = Boolean(filters.aguardando_novo_boleto);

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
        <Layout titlePage="Cobranças" menu="financeiro" subMenu="financeiro-cobrancas">
            <Head title="Cobranças" />

            <Stack spacing={3}>
                {(aguardandoNovoBoletoCount > 0 || filteringAwaitingSlip) && (
                    <Alert
                        severity={aguardandoNovoBoletoCount > 0 ? "error" : "success"}
                        variant={aguardandoNovoBoletoCount > 0 ? "filled" : "standard"}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                sx={{ fontWeight: 800, whiteSpace: "nowrap" }}
                                onClick={() => router.get(
                                    route("admin.financeiro.cobrancas.index"),
                                    filteringAwaitingSlip ? {} : { aguardando_novo_boleto: 1 }
                                )}
                            >
                                {filteringAwaitingSlip ? "Ver todas" : "Ver cobranças"}
                            </Button>
                        }
                    >
                        {aguardandoNovoBoletoCount > 0
                            ? `${aguardandoNovoBoletoCount} cobrança${aguardandoNovoBoletoCount !== 1 ? "s" : ""} com pagamento atrasado e boleto vencido — o cliente precisa receber um novo boleto.`
                            : "Nenhuma cobrança aguardando novo boleto."}
                    </Alert>
                )}

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
                                        label="Nome do cliente"
                                        value={data.client_name}
                                        onChange={(e) => setData("client_name", e.target.value)}
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

                        <TableContainer sx={{ overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Referência</TableCell>
                                    <TableCell>Fatura</TableCell>
                                    <TableCell>Vencimento</TableCell>
                                    <TableCell>Valor final</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {charges?.data?.length > 0 ? (
                                    charges.data.map((charge) => (
                                        <TableRow key={charge.id}>
                                            <TableCell>#{charge.id}</TableCell>

                                            <TableCell>{getClientName(charge)}</TableCell>

                                            <TableCell>
                                                {charge.reference_label ||
                                                    `${charge.reference_month}/${charge.reference_year}`}
                                            </TableCell>

                                            <TableCell>
                                                {charge.bill ? (
                                                    <Link href={route("consultor.cliente.faturas.show", charge.bill.id)}>
                                                        #{charge.bill.id}
                                                    </Link>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {charge.due_date || "-"}
                                            </TableCell>

                                            <TableCell>
                                                <strong>{money(charge.final_amount)}</strong>
                                            </TableCell>

                                            <TableCell>
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                    <Chip
                                                        label={statusLabels[charge.status] || charge.status}
                                                        color={statusColors[charge.status] || "default"}
                                                        size="small"
                                                    />
                                                    {charge.aguardando_novo_boleto && (
                                                        <Chip
                                                            label="Boleto vencido — enviar novo"
                                                            color="error"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ fontWeight: 700 }}
                                                        />
                                                    )}
                                                </Stack>
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
                                        <TableCell colSpan={8}>
                                            <Typography textAlign="center" color="text.secondary">
                                                Nenhuma cobrança encontrada.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        </TableContainer>

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

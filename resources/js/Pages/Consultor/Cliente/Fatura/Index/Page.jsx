import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { IconEye, IconFileInvoice, IconFilter, IconPlus, IconX } from "@tabler/icons-react";

const Page = ({ bills, filters = {}, reviewStatuses = [], parserStatuses = [], importSources = [] }) => {
    const items = bills?.data ?? [];

    const [form, setForm] = useState({
        search: filters.search || "",
        review_status: filters.review_status || "",
        parser_status: filters.parser_status || "",
        import_source: filters.import_source || "",
    });

    const submit = (e) => {
        e.preventDefault();

        router.get(route("consultor.cliente.faturas.index"), form, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route("consultor.cliente.faturas.index"));
    };

    return (
        <Layout titlePage="Faturas" menu="clientes" subMenu="cliente-faturas">
            <Head title="Faturas" />

            <Card>
                <CardHeader
                    title="Lista de Faturas"
                    avatar={<IconFileInvoice />}
                    action={
                        <Link href={route("consultor.cliente.faturas.create")}>
                            <Button startIcon={<IconPlus />} color="success">
                                Cadastrar Fatura
                            </Button>
                        </Link>
                    }
                />

                <CardContent>
                    <form onSubmit={submit}>
                        <Grid container spacing={2} mb={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Buscar"
                                    value={form.search}
                                    onChange={(e) => setForm({ ...form, search: e.target.value })}
                                    placeholder="UC, cliente, CPF, CNPJ..."
                                />
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Revisão</InputLabel>
                                    <Select
                                        label="Revisão"
                                        value={form.review_status}
                                        onChange={(e) => setForm({ ...form, review_status: e.target.value })}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {reviewStatuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Parser</InputLabel>
                                    <Select
                                        label="Parser"
                                        value={form.parser_status}
                                        onChange={(e) => setForm({ ...form, parser_status: e.target.value })}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {parserStatuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Origem</InputLabel>
                                    <Select
                                        label="Origem"
                                        value={form.import_source}
                                        onChange={(e) => setForm({ ...form, import_source: e.target.value })}
                                    >
                                        <MenuItem value="">Todas</MenuItem>
                                        {importSources.map((source) => (
                                            <MenuItem key={source} value={source}>
                                                {source}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2} display="flex" gap={1}>
                                <Button type="submit" variant="contained" startIcon={<IconFilter />}>
                                    Filtrar
                                </Button>

                                <Button variant="outlined" color="inherit" onClick={clearFilters} startIcon={<IconX />}>
                                    Limpar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>UC</TableCell>
                                    <TableCell>Vencimento</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Revisão</TableCell>
                                    <TableCell>Parser</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>{bill.id}</TableCell>
                                        <TableCell>
                                            {bill.client_profile?.nome ||
                                                bill.client_profile?.razao_social ||
                                                "Não informado"}
                                        </TableCell>
                                        <TableCell>{bill.uc || bill.usina?.uc || "Não informado"}</TableCell>
                                        <TableCell>{bill.due_date || "Não informado"}</TableCell>
                                        <TableCell>
                                            {bill.total_amount
                                                ? Number(bill.total_amount).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })
                                                : "Não informado"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={bill.review_status || "Sem status"} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={bill.parser_status || "Sem status"} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.cliente.faturas.show", bill.id)}>
                                                <Button size="small" variant="outlined" startIcon={<IconEye />}>
                                                    Ver
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            Nenhuma fatura encontrada.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex justify-center gap-2">
                        {bills?.links?.map((link, index) => (
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

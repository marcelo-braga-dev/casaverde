import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

const providerLabels = {
    cora: "Cora",
    mercado_pago: "Mercado Pago",
    asaas: "Asaas",
};

const environmentLabels = {
    sandbox: "Sandbox",
    production: "Produção",
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

export default function Page({ accounts }) {
    return (
        <Layout titlePage="Contas de Pagamento" menu="financeiro" subMenu="financeiro-bancos">
            <Head title="Contas de Pagamento" />

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
                                    Contas de pagamento
                                </Typography>

                                <Typography color="text.secondary">
                                    Configure provedores como Cora, Mercado Pago e outros.
                                </Typography>
                            </Stack>

                            <Link href={route("admin.financeiro.payment-provider-accounts.create")}>
                                <Button variant="contained">
                                    Nova conta
                                </Button>
                            </Link>
                        </Stack>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Banco</TableCell>
                                    <TableCell>Ambiente</TableCell>
                                    <TableCell>Padrão</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {accounts?.data?.length > 0 ? (
                                    accounts.data.map((account) => (
                                        <TableRow key={account.id}>
                                            <TableCell>{account.id}</TableCell>

                                            <TableCell>{account.name}</TableCell>

                                            <TableCell>
                                                {providerLabels[account.provider] || account.provider}
                                            </TableCell>

                                            <TableCell>
                                                {environmentLabels[account.environment] || account.environment}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={account.is_default ? "Padrão" : "Não"}
                                                    color={account.is_default ? "success" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={account.is_active ? "Ativa" : "Inativa"}
                                                    color={account.is_active ? "success" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Link href={route("admin.financeiro.payment-provider-accounts.show", account.id)}>
                                                        <Button variant="outlined" size="small">
                                                            Ver
                                                        </Button>
                                                    </Link>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <Typography textAlign="center" color="text.secondary">
                                                Nenhuma conta de pagamento cadastrada.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {accounts?.links?.length > 0 && (
                            <Stack direction="row" spacing={1} marginTop={3} flexWrap="wrap">
                                {accounts.links.map((link, index) => (
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

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
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

function JsonBlock({ value }) {
    if (!value) {
        return (
            <Typography color="text.secondary">
                Nenhum dado registrado.
            </Typography>
        );
    }

    return (
        <TextField
            value={JSON.stringify(value, null, 2)}
            multiline
            minRows={8}
            fullWidth
            InputProps={{
                readOnly: true,
                sx: {
                    fontFamily: "monospace",
                    fontSize: 13,
                },
            }}
        />
    );
}

export default function Page({ payment }) {
    return (
        <Layout titlePage="Detalhes do Pagamento" menu="financeiro" subMenu="clientes-pagamentos">
            <Head title={`Pagamento #${payment.id}`} />

            <Stack direction="row" spacing={1}>
                <Chip
                    label={statusLabels[payment.status] || payment.status}
                    color={statusColors[payment.status] || "default"}
                />

                {payment.status !== "paid" && (
                    <Button
                        variant="outlined"
                        onClick={() => router.post(route("admin.pagamentos.sync", payment.id))}
                    >
                        Sincronizar
                    </Button>
                )}

                {!["paid", "cancelled", "expired"].includes(payment.status) && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            if (confirm("Deseja realmente cancelar este pagamento?")) {
                                router.post(route("admin.pagamentos.cancel", payment.id));
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                )}
            </Stack>

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
                                    Pagamento #{payment.id}
                                </Typography>

                                <Typography color="text.secondary">
                                    Cliente: {getClientName(payment)}
                                </Typography>

                                <Typography color="text.secondary">
                                    Provider: {providerLabels[payment.provider] || payment.provider}
                                </Typography>
                            </Stack>

                            <Chip
                                label={statusLabels[payment.status] || payment.status}
                                color={statusColors[payment.status] || "default"}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Dados do pagamento
                                </Typography>

                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Valor</TableCell>
                                            <TableCell align="right">
                                                <strong>{money(payment.amount)}</strong>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Método</TableCell>
                                            <TableCell align="right">
                                                {paymentMethodLabels[payment.payment_method] || payment.payment_method}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Vencimento</TableCell>
                                            <TableCell align="right">
                                                {payment.due_date || "-"}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>ID no provider</TableCell>
                                            <TableCell align="right">
                                                {payment.provider_payment_id || "-"}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Status no provider</TableCell>
                                            <TableCell align="right">
                                                {payment.provider_status || "-"}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Gerado em</TableCell>
                                            <TableCell align="right">
                                                {payment.generated_at || "-"}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Pago em</TableCell>
                                            <TableCell align="right">
                                                {payment.paid_at || "-"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                <Divider sx={{ my: 3 }} />

                                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                    {payment.charge && (
                                        <Link href={route("admin.financeiro.cobrancas.show", payment.charge.id)}>
                                            <Button variant="outlined">
                                                Ver cobrança
                                            </Button>
                                        </Link>
                                    )}

                                    {payment.checkout_url && (
                                        <Button
                                            variant="contained"
                                            component="a"
                                            href={payment.checkout_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Abrir checkout
                                        </Button>
                                    )}

                                    {payment.pdf_url && (
                                        <Button
                                            variant="outlined"
                                            component="a"
                                            href={payment.pdf_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Abrir boleto PDF
                                        </Button>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Informações úteis
                                </Typography>

                                <Stack spacing={2}>
                                    <TextField
                                        label="Linha digitável"
                                        value={payment.digitable_line || ""}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />

                                    <TextField
                                        label="Código de barras"
                                        value={payment.barcode || ""}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />

                                    <TextField
                                        label="Pix copia e cola"
                                        value={payment.pix_copy_paste || ""}
                                        multiline
                                        minRows={4}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Transações
                        </Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Provider</TableCell>
                                    <TableCell>ID transação</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Pago em</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {payment.transactions?.length > 0 ? (
                                    payment.transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.id}</TableCell>
                                            <TableCell>{transaction.provider}</TableCell>
                                            <TableCell>{transaction.provider_transaction_id || "-"}</TableCell>
                                            <TableCell>{money(transaction.amount)}</TableCell>
                                            <TableCell>{transaction.status}</TableCell>
                                            <TableCell>{transaction.paid_at || "-"}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Typography textAlign="center" color="text.secondary">
                                                Nenhuma transação registrada.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Payload enviado
                                </Typography>

                                <JsonBlock value={payment.request_payload} />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Resposta do provider
                                </Typography>

                                <JsonBlock value={payment.response_payload} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

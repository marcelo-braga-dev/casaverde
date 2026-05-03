import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, Link, router, useForm} from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
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

const adjustmentLabels = {
    discount: "Desconto manual",
    addition: "Acréscimo manual",
};

const adjustmentColors = {
    discount: "success",
    addition: "warning",
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

export default function Page({charge}) {
    const adjustmentForm = useForm({
        type: "discount",
        amount: "",
        description: "",
    });

    const hasActivePayment = charge.payment_slips?.some((payment) =>
        ["pending", "generated"].includes(payment.status)
    );

    const submitAdjustment = (e) => {
        e.preventDefault();

        adjustmentForm.post(route("admin.financeiro.cobrancas.adjustments.store", charge.id), {
            preserveScroll: true,
            onSuccess: () => {
                adjustmentForm.reset("amount", "description");
                adjustmentForm.setData("type", "discount");
            },
        });
    };

    const approveCharge = () => {
        router.post(route("admin.financeiro.cobrancas.approve", charge.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <Layout titlePage="Detalhes da Cobrança" menu="financeiro" subMenu="clientes-cobrancas" backPage>
            <Head title={`Cobrança #${charge.id}`}/>

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Stack
                            direction={{xs: "column", md: "row"}}
                            justifyContent="space-between"
                            alignItems={{xs: "flex-start", md: "center"}}
                            spacing={2}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h5">
                                    Cobrança #{charge.id}
                                </Typography>

                                <Typography color="text.secondary">
                                    Cliente: {getClientName(charge)}
                                </Typography>

                                <Typography color="text.secondary">
                                    Referência: {charge.reference_label ||
                                    `${charge.reference_month}/${charge.reference_year}`}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={statusLabels[charge.status] || charge.status}
                                    color={statusColors[charge.status] || "default"}
                                />

                                {charge.status === "draft" && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={approveCharge}
                                    >
                                        Abrir cobrança
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Pagamentos gerados
                        </Typography>

                        {charge.payment_slips?.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Provider</TableCell>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Vencimento</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {charge.payment_slips.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.id}</TableCell>
                                            <TableCell>{payment.provider}</TableCell>
                                            <TableCell>{money(payment.amount)}</TableCell>
                                            <TableCell>{payment.status}</TableCell>
                                            <TableCell>{payment.due_date || "-"}</TableCell>
                                            <TableCell align="right">
                                                <Link href={route("admin.pagamentos.show", payment.id)}>
                                                    <Button variant="outlined" size="small">
                                                        Ver pagamento
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography color="text.secondary">
                                Nenhum pagamento gerado para esta cobrança.
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        {["open", "waiting_payment"].includes(charge.status) && !hasActivePayment && (
                            <Button
                                variant="contained"
                                onClick={() => router.post(route("admin.pagamentos.generate-from-charge", charge.id))}
                            >
                                Gerar boleto/Pix Cora
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 8}}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Resumo financeiro
                                </Typography>

                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Valor original</TableCell>
                                            <TableCell align="right">
                                                {money(charge.original_amount)}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Desconto contratual ({charge.discount_percent || 0}%)
                                            </TableCell>
                                            <TableCell align="right">
                                                - {money(charge.discount_amount)}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Desconto manual</TableCell>
                                            <TableCell align="right">
                                                - {money(charge.manual_discount_amount)}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Acréscimo manual</TableCell>
                                            <TableCell align="right">
                                                + {money(charge.manual_addition_amount)}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <strong>Valor final</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>{money(charge.final_amount)}</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Dados da cobrança
                                </Typography>

                                <Stack spacing={1}>
                                    <Typography>
                                        Vencimento: {charge.due_date || "-"}
                                    </Typography>

                                    <Typography>
                                        Usina: {charge.usina?.uc || "-"}
                                    </Typography>

                                    <Typography>
                                        Concessionária: {charge.concessionaria?.nome || "-"}
                                    </Typography>

                                    <Typography>
                                        Gerada por: {charge.generated_by?.name || "-"}
                                    </Typography>

                                    <Typography>
                                        Aprovada por: {charge.approved_by?.name || "-"}
                                    </Typography>

                                    <Typography>
                                        Aprovada em: {charge.approved_at || "-"}
                                    </Typography>

                                    <Typography>
                                        Paga em: {charge.paid_at || "-"}
                                    </Typography>
                                </Stack>

                                {charge.bill && (
                                    <>
                                        <Divider sx={{my: 2}}/>

                                        <Link href={route("consultor.cliente.faturas.show", charge.bill.id)}>
                                            <Button variant="outlined" fullWidth>
                                                Ver fatura
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {charge.status === "draft" && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" marginBottom={2}>
                                Adicionar ajuste manual
                            </Typography>

                            <form onSubmit={submitAdjustment}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 12, md: 3}}>
                                        <TextField
                                            select
                                            label="Tipo"
                                            value={adjustmentForm.data.type}
                                            onChange={(e) => adjustmentForm.setData("type", e.target.value)}
                                            error={!!adjustmentForm.errors.type}
                                            helperText={adjustmentForm.errors.type}
                                            fullWidth
                                        >
                                            <MenuItem value="discount">Desconto</MenuItem>
                                            <MenuItem value="addition">Acréscimo</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid size={{xs: 12, md: 3}}>
                                        <TextField
                                            label="Valor"
                                            value={adjustmentForm.data.amount}
                                            onChange={(e) => adjustmentForm.setData("amount", e.target.value)}
                                            error={!!adjustmentForm.errors.amount}
                                            helperText={adjustmentForm.errors.amount}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{xs: 12, md: 6}}>
                                        <TextField
                                            label="Descrição"
                                            value={adjustmentForm.data.description}
                                            onChange={(e) => adjustmentForm.setData("description", e.target.value)}
                                            error={!!adjustmentForm.errors.description}
                                            helperText={adjustmentForm.errors.description}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={adjustmentForm.processing}
                                        >
                                            Adicionar ajuste
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Histórico de ajustes
                        </Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Criado por</TableCell>
                                    <TableCell>Data</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {charge.adjustments?.length > 0 ? (
                                    charge.adjustments.map((adjustment) => (
                                        <TableRow key={adjustment.id}>
                                            <TableCell>
                                                <Chip
                                                    label={adjustmentLabels[adjustment.type] || adjustment.type}
                                                    color={adjustmentColors[adjustment.type] || "default"}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                {money(adjustment.amount)}
                                            </TableCell>

                                            <TableCell>
                                                {adjustment.description || "-"}
                                            </TableCell>

                                            <TableCell>
                                                {adjustment.created_by?.name || "-"}
                                            </TableCell>

                                            <TableCell>
                                                {adjustment.created_at || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography textAlign="center" color="text.secondary">
                                                Nenhum ajuste lançado.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

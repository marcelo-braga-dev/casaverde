import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
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
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import DateText from "@/Components/Admin/DateText.jsx";
import ConfirmActionButton from "@/Components/Admin/ConfirmActionButton.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";

function getClientName(charge) {
    return (
        charge.client_profile?.display_name ||
        charge.client_profile?.nome ||
        charge.client_profile?.razao_social ||
        `Cliente #${charge.client_profile_id}`
    );
}

export default function Page({ charge }) {
    const hasActivePayment = charge.payment_slips?.some((payment) =>
        ["pending", "generated"].includes(payment.status)
    );

    const adjustmentForm = useForm({
        type: "discount",
        amount: "",
        description: "",
    });

    const cancelForm = useForm({
        reason: "",
    });

    const paidForm = useForm({
        note: "",
    });

    const submitAdjustment = (e) => {
        e.preventDefault();

        adjustmentForm.post(route("admin.cobrancas.adjustments.store", charge.id), {
            preserveScroll: true,
            onSuccess: () => {
                adjustmentForm.reset("amount", "description");
                adjustmentForm.setData("type", "discount");
            },
        });
    };

    const approveCharge = () => {
        router.post(route("admin.cobrancas.approve", charge.id), {}, {
            preserveScroll: true,
        });
    };

    const generatePayment = () => {
        router.post(route("admin.pagamentos.generate-from-charge", charge.id), {}, {
            preserveScroll: true,
        });
    };

    const cancelCharge = () => {
        cancelForm.post(route("admin.cobrancas.cancel", charge.id), {
            preserveScroll: true,
        });
    };

    const markPaid = () => {
        paidForm.post(route("admin.cobrancas.mark-paid", charge.id), {
            preserveScroll: true,
        });
    };

    const markOverdue = () => {
        router.post(route("admin.cobrancas.mark-overdue", charge.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <Layout titlePage="Detalhes da Cobrança" menu="financeiro">
            <Head title={`Cobrança #${charge.id}`} />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", md: "center" }}
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
                                    Referência: {charge.reference_label || `${charge.reference_month}/${charge.reference_year}`}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <StatusChip status={charge.status} />

                                {charge.status === "draft" && (
                                    <ConfirmActionButton
                                        color="success"
                                        message="Deseja abrir esta cobrança?"
                                        onConfirm={approveCharge}
                                    >
                                        Abrir cobrança
                                    </ConfirmActionButton>
                                )}

                                {["open", "waiting_payment"].includes(charge.status) && !hasActivePayment && (
                                    <ConfirmActionButton
                                        color="primary"
                                        message="Deseja gerar boleto/Pix para esta cobrança?"
                                        onConfirm={generatePayment}
                                    >
                                        Gerar boleto/Pix
                                    </ConfirmActionButton>
                                )}

                                {["open", "waiting_payment"].includes(charge.status) && (
                                    <ConfirmActionButton
                                        color="error"
                                        variant="outlined"
                                        message="Deseja marcar esta cobrança como atrasada?"
                                        onConfirm={markOverdue}
                                    >
                                        Marcar atrasada
                                    </ConfirmActionButton>
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
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
                                                <MoneyText value={charge.original_amount} />
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                Desconto contratual ({charge.discount_percent || 0}%)
                                            </TableCell>
                                            <TableCell align="right">
                                                - <MoneyText value={charge.discount_amount} />
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Desconto manual</TableCell>
                                            <TableCell align="right">
                                                - <MoneyText value={charge.manual_discount_amount} />
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Acréscimo manual</TableCell>
                                            <TableCell align="right">
                                                + <MoneyText value={charge.manual_addition_amount} />
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <strong>Valor final</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <MoneyText value={charge.final_amount} bold />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Dados da cobrança
                                </Typography>

                                <Stack spacing={1}>
                                    <Typography>
                                        Vencimento: <DateText value={charge.due_date} />
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
                                        Aprovada em: <DateText value={charge.approved_at} />
                                    </Typography>

                                    <Typography>
                                        Paga em: <DateText value={charge.paid_at} />
                                    </Typography>
                                </Stack>

                                {charge.bill && (
                                    <>
                                        <Divider sx={{ my: 2 }} />

                                        <Link href={route("admin.faturas.show", charge.bill.id)}>
                                            <Button variant="outlined" fullWidth>
                                                Ver fatura origem
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
                                    <Grid size={{ xs: 12, md: 3 }}>
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

                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="Valor"
                                            value={adjustmentForm.data.amount}
                                            onChange={(e) => adjustmentForm.setData("amount", e.target.value)}
                                            error={!!adjustmentForm.errors.amount}
                                            helperText={adjustmentForm.errors.amount}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
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
                                            <TableCell>
                                                <MoneyText value={payment.amount} />
                                            </TableCell>
                                            <TableCell>
                                                <StatusChip status={payment.status} />
                                            </TableCell>
                                            <TableCell>
                                                <DateText value={payment.due_date} />
                                            </TableCell>
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
                            <EmptyState title="Nenhum pagamento gerado para esta cobrança." />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Histórico de ajustes
                        </Typography>

                        {charge.adjustments?.length > 0 ? (
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
                                    {charge.adjustments.map((adjustment) => (
                                        <TableRow key={adjustment.id}>
                                            <TableCell>
                                                <StatusChip
                                                    status={adjustment.type}
                                                    label={adjustment.type === "discount" ? "Desconto" : "Acréscimo"}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <MoneyText value={adjustment.amount} />
                                            </TableCell>

                                            <TableCell>{adjustment.description || "-"}</TableCell>

                                            <TableCell>{adjustment.created_by?.name || "-"}</TableCell>

                                            <TableCell>
                                                <DateText value={adjustment.created_at} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState title="Nenhum ajuste lançado." />
                        )}
                    </CardContent>
                </Card>

                {!["paid", "cancelled"].includes(charge.status) && (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" marginBottom={2}>
                                        Marcar como paga manualmente
                                    </Typography>

                                    <Stack spacing={2}>
                                        <TextField
                                            label="Observação"
                                            value={paidForm.data.note}
                                            onChange={(e) => paidForm.setData("note", e.target.value)}
                                            error={!!paidForm.errors.note}
                                            helperText={paidForm.errors.note}
                                            multiline
                                            minRows={3}
                                            fullWidth
                                        />

                                        <ConfirmActionButton
                                            color="success"
                                            message="Deseja marcar esta cobrança como paga manualmente?"
                                            onConfirm={markPaid}
                                            disabled={paidForm.processing}
                                        >
                                            Marcar como paga
                                        </ConfirmActionButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" marginBottom={2}>
                                        Cancelar cobrança
                                    </Typography>

                                    <Stack spacing={2}>
                                        <TextField
                                            label="Motivo do cancelamento"
                                            value={cancelForm.data.reason}
                                            onChange={(e) => cancelForm.setData("reason", e.target.value)}
                                            error={!!cancelForm.errors.reason}
                                            helperText={cancelForm.errors.reason}
                                            multiline
                                            minRows={3}
                                            fullWidth
                                        />

                                        <ConfirmActionButton
                                            color="error"
                                            message="Deseja realmente cancelar esta cobrança?"
                                            onConfirm={cancelCharge}
                                            disabled={cancelForm.processing}
                                        >
                                            Cancelar cobrança
                                        </ConfirmActionButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Stack>
        </Layout>
    );
}

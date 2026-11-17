import Layout from "@/Layouts/UserLayout/Layout.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import StatusChip from "@/Components/Admin/StatusChip.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import { getStatusLabel } from "@/Utils/statusLabels.js";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    CardContent,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle, IconCircleCheck, IconEye, IconFileExcel, IconFileTypePdf, IconPlus } from "@tabler/icons-react";

function MetricCard({ title, value, money = false }) {
    return (
        <Card sx={{ height: "100%" }}>
            <CardContent>
                <Typography color="text.secondary">{title}</Typography>
                {money ? (
                    <MoneyText value={value} bold variant="h5" component="div" />
                ) : (
                    <Typography variant="h5" fontWeight={700}>{value || 0}</Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default function Page({
                                 report,
                                 filters = {},
                                 reviewStatuses = [],
                                 parserStatuses = [],
                             }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || report?.range?.start_date || "",
        end_date: filters.end_date || report?.range?.end_date || "",
        review_status: filters.review_status || "",
        parser_status: filters.parser_status || "",
        reference_month: filters.reference_month || "",
        reference_year: filters.reference_year || "",
        client_name: filters.client_name || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.relatorios.faturas"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get(route("admin.relatorios.faturas"));
    };

    const { flash, errors: pageErrors } = usePage().props;
    const summary = report?.summary || {};

    const items = report?.items || [];
    const eligibleIds = useMemo(
        () => items.filter((b) => b.review_status === "pending_review" && b.approval_blockers.length === 0).map((b) => b.id),
        [items],
    );
    const [selected, setSelected] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [injectedConfirmed, setInjectedConfirmed] = useState(false);
    const [approving, setApproving] = useState(false);
    const [chargeDueDate, setChargeDueDate] = useState("");

    const selectedVisible = selected.filter((id) => eligibleIds.includes(id));
    const selectedTotal = items
        .filter((b) => selectedVisible.includes(b.id))
        .reduce((sum, b) => sum + (b.charge_estimate || 0), 0);
    const allSelected = eligibleIds.length > 0 && selectedVisible.length === eligibleIds.length;
    // vencimento chega como "dd/mm/aaaa"
    const isPast = (date) => {
        if (!date) return false;
        const [d, m, y] = date.split("/").map(Number);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(y, m - 1, d) < today;
    };
    const selectedPastDue = items.filter((b) => selectedVisible.includes(b.id) && isPast(b.vencimento)).length;

    const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    const toggleAll = () => setSelected(allSelected ? [] : eligibleIds);

    const approveSelected = () => {
        router.post(
            route("consultor.cliente.faturas.approve-batch"),
            { ids: selectedVisible, injected_values_confirmed: injectedConfirmed, charge_due_date: chargeDueDate || null },
            {
                preserveScroll: true,
                onStart: () => setApproving(true),
                onFinish: () => setApproving(false),
                onSuccess: () => { setSelected([]); setConfirmOpen(false); setInjectedConfirmed(false); setChargeDueDate(""); },
            },
        );
    };

    return (
        <Layout titlePage="Faturas de Concessionárias" menu="financeiro" subMenu="financeiro-faturas">
            <Head title="Faturas de Concessionárias" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                        >
                            <Grid size="grow">
                                <Typography variant="h5" fontWeight={700}>
                                    Faturas de Concessionárias
                                </Typography>

                                <Typography color="text.secondary">
                                    Período: {report?.range?.label}
                                </Typography>
                            </Grid>
                            <Grid size="auto">
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                                    <Button
                                        color="success"
                                        component={Link}
                                        startIcon={<IconPlus />}
                                        href={route("consultor.cliente.faturas.create")}
                                    >
                                        Cadastrar Fatura de Concessionária
                                    </Button>

                                    <Button
                                        color="error"
                                        component="a"
                                        startIcon={<IconFileTypePdf />}
                                        href={route("admin.relatorios.faturas.export-pdf", data)}
                                    >
                                        Exportar PDF
                                    </Button>

                                    <Button
                                        color="success"
                                        component="a"
                                        startIcon={<IconFileExcel />}
                                        href={route("admin.relatorios.faturas.export", data)}
                                    >
                                        Exportar Excel
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <form onSubmit={submit}>
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
                                        type="date"
                                        label="Data inicial"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        type="date"
                                        label="Data final"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        select
                                        label="Revisão"
                                        value={data.review_status}
                                        onChange={(e) => setData("review_status", e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {reviewStatuses.map((status) => (
                                            <MenuItem key={status} value={status}>{getStatusLabel(status)}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        select
                                        label="Extração de Dados"
                                        value={data.parser_status}
                                        onChange={(e) => setData("parser_status", e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {parserStatuses.map((status) => (
                                            <MenuItem key={status} value={status}>{getStatusLabel(status)}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Mês ref."
                                        value={data.reference_month}
                                        onChange={(e) => setData("reference_month", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Ano ref."
                                        value={data.reference_year}
                                        onChange={(e) => setData("reference_year", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={12}>
                                    <Stack direction="row" spacing={2}>
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
                        <MetricCard title="Faturas de Concessionárias" value={summary.total} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Aprovadas" value={summary.approved} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Pendentes" value={summary.pending_review} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard title="Valor total" value={summary.total_amount} money />
                    </Grid>
                </Grid>

                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                {flash?.warning && <Alert severity="warning">{flash.warning}</Alert>}
                {flash?.error && <Alert severity="error">{flash.error}</Alert>}
                {(pageErrors?.ids || pageErrors?.injected_values_confirmed || pageErrors?.charge_due_date) && (
                    <Alert severity="error">{pageErrors.injected_values_confirmed || pageErrors.charge_due_date || pageErrors.ids}</Alert>
                )}

                {!summary.whole_queue && summary.pending_queue_total > 0 && (
                    <Alert
                        severity="warning"
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                                onClick={() => router.get(route("admin.relatorios.faturas"), { review_status: "pending_review" })}
                            >
                                Ver fila de revisão
                            </Button>
                        }
                    >
                        {summary.pending_queue_total} fatura(s) aguardando revisão no total, de qualquer período.
                    </Alert>
                )}

                {eligibleIds.length > 0 && (
                    <Alert
                        severity={selectedVisible.length > 0 ? "success" : "info"}
                        variant="outlined"
                        action={
                            <Button
                                color="success"
                                variant="contained"
                                size="small"
                                startIcon={<IconCircleCheck size={16} />}
                                disabled={selectedVisible.length === 0}
                                onClick={() => setConfirmOpen(true)}
                                sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                            >
                                Aprovar selecionadas
                            </Button>
                        }
                    >
                        {selectedVisible.length > 0 ? (
                            <>
                                <strong>{selectedVisible.length}</strong> fatura(s) selecionada(s), cobrança estimada de{" "}
                                <MoneyText value={selectedTotal} bold component="span" />.
                            </>
                        ) : (
                            <>{eligibleIds.length} fatura(s) aguardando revisão prontas para aprovar. Selecione na tabela abaixo.</>
                        )}
                    </Alert>
                )}

                <Card>
                    <CardContent>
                        {items.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={allSelected}
                                                indeterminate={selectedVisible.length > 0 && !allSelected}
                                                disabled={eligibleIds.length === 0}
                                                onChange={toggleAll}
                                                inputProps={{ "aria-label": "Selecionar todas as faturas prontas para aprovar" }}
                                            />
                                        </TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>UC</TableCell>
                                        <TableCell>Referência</TableCell>
                                        <TableCell>Revisão</TableCell>
                                        <TableCell>Extração de Dados</TableCell>
                                        <TableCell>Consumo</TableCell>
                                        <TableCell align="right">Valor</TableCell>
                                        <TableCell align="right">A cobrar (estim.)</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((bill) => (
                                        <TableRow key={bill.id} selected={selectedVisible.includes(bill.id)}>
                                            <TableCell padding="checkbox">
                                                {eligibleIds.includes(bill.id) ? (
                                                    <Checkbox
                                                        checked={selectedVisible.includes(bill.id)}
                                                        onChange={() => toggle(bill.id)}
                                                        inputProps={{ "aria-label": `Selecionar fatura #${bill.id}` }}
                                                    />
                                                ) : bill.approval_blockers.length > 0 ? (
                                                    <Tooltip title={`Não pode ser aprovada: ${bill.approval_blockers.join("; ")}`}>
                                                        <IconAlertTriangle size={18} color="#d97706" style={{ marginLeft: 11 }} />
                                                    </Tooltip>
                                                ) : null}
                                            </TableCell>
                                            <TableCell>#{bill.id}</TableCell>
                                            <TableCell>{bill.client_name}</TableCell>
                                            <TableCell>{bill.unidade_consumidora || "-"}</TableCell>
                                            <TableCell>{bill.reference_label || "-"}</TableCell>
                                            <TableCell><StatusChip status={bill.review_status} /></TableCell>
                                            <TableCell><StatusChip status={bill.parser_status} /></TableCell>
                                            <TableCell>{bill.consumo_kwh || 0} kWh</TableCell>
                                            <TableCell align="right"><MoneyText value={bill.valor_total} /></TableCell>
                                            <TableCell align="right"><MoneyText value={bill.charge_estimate} /></TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    component={Link}
                                                    href={route("consultor.cliente.faturas.show", bill.id)}
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<IconEye size={15} />}
                                                >
                                                    Ver
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState title="Nenhuma fatura de concessionária encontrada." />
                        )}
                    </CardContent>
                </Card>
            </Stack>

            <Dialog open={confirmOpen} onClose={() => !approving && setConfirmOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Aprovar {selectedVisible.length} fatura(s)?</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography>
                            As cobranças são geradas e abertas na hora, totalizando cerca de{" "}
                            <MoneyText value={selectedTotal} bold component="span" />. Depois é só gerar o boleto/Pix de cada uma.
                        </Typography>
                        {selectedPastDue > 0 && (
                            <>
                                <Alert severity="warning">
                                    {selectedPastDue} fatura(s) com vencimento já passado. Informe o vencimento das cobranças delas;
                                    sem data, essas ficam em rascunho. As demais usam o vencimento da própria fatura.
                                </Alert>
                                <TextField
                                    type="date"
                                    label="Vencimento das cobranças vencidas"
                                    value={chargeDueDate}
                                    onChange={(e) => setChargeDueDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                />
                            </>
                        )}
                        <FormControlLabel
                            control={<Checkbox checked={injectedConfirmed} onChange={(e) => setInjectedConfirmed(e.target.checked)} />}
                            label="Conferi os valores de consumo injetado destas faturas."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={approving}>Cancelar</Button>
                    <Button color="success" variant="contained" onClick={approveSelected} disabled={!injectedConfirmed || approving} sx={{ fontWeight: 700 }}>
                        {approving ? "Aprovando..." : "Aprovar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

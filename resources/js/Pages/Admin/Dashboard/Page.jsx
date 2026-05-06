import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import MoneyText from "@/Components/Admin/MoneyText.jsx";
import StatusChip from "@/Components/Admin/StatusChip.jsx";

function MetricCard({ title, value, helper, money = false, color }) {
    return (
        <Card sx={{ height: "100%" }}>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>

                {money ? (
                    <MoneyText
                        value={value}
                        bold
                        variant="h5"
                        component="div"
                        color={color}
                    />
                ) : (
                    <Typography variant="h5" fontWeight={700} color={color}>
                        {value ?? 0}
                    </Typography>
                )}

                {helper && (
                    <Typography variant="caption" color="text.secondary">
                        {helper}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

function SectionCard({ title, action, children }) {
    return (
        <Card sx={{ height: "100%" }}>
            <CardContent>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    marginBottom={2}
                >
                    <Typography variant="h6">{title}</Typography>
                    {action}
                </Stack>

                {children}
            </CardContent>
        </Card>
    );
}

function StatusSummaryTable({ rows = [], showAmount = false }) {
    if (!rows.length) {
        return <EmptyState title="Nenhum dado encontrado." />;
    }

    const max = Math.max(...rows.map((row) => Number(row.total || 0)), 1);

    return (
        <Stack spacing={2}>
            {rows.map((row) => {
                const progress = (Number(row.total || 0) / max) * 100;

                return (
                    <Stack key={row.status} spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <StatusChip status={row.status} />
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2">
                                    {row.total} registro(s)
                                </Typography>

                                {showAmount && (
                                    <MoneyText value={row.amount} bold />
                                )}
                            </Stack>
                        </Stack>

                        <LinearProgress variant="determinate" value={progress} />
                    </Stack>
                );
            })}
        </Stack>
    );
}

export default function Page({ dashboard }) {
    const summary = dashboard?.summary || {};

    return (
        <Layout titlePage="Dashboard Administrativo" menu="dashboard">
            <Head title="Dashboard Administrativo" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" fontWeight={700}>
                            Dashboard Administrativo
                        </Typography>

                        <Typography color="text.secondary">
                            Visão geral financeira, operacional e comercial da Casa Verde.
                        </Typography>
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Clientes ativos"
                            value={summary.active_clients}
                            helper="Clientes com acesso/contrato ativo"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Prospects"
                            value={summary.prospect_clients}
                            helper="Clientes ainda não ativados"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Usinas"
                            value={summary.usinas}
                            helper="Usinas cadastradas"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Produtores"
                            value={summary.producers}
                            helper="Produtores cadastrados"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="A receber"
                            value={summary.amount_receivable}
                            money
                            color="primary.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Recebido no mês"
                            value={summary.amount_received_month}
                            money
                            color="success.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Em atraso"
                            value={summary.amount_overdue}
                            money
                            color="error.main"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Pagamentos com falha"
                            value={summary.failed_payments}
                            helper="Pagamentos que exigem atenção"
                            color={summary.failed_payments > 0 ? "error.main" : undefined}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <SectionCard
                            title="Cobranças por status"
                            action={
                                <Link href={route("admin.financeiro.cobrancas.index")}>
                                    <Button size="small" variant="outlined">
                                        Ver cobranças
                                    </Button>
                                </Link>
                            }
                        >
                            <StatusSummaryTable
                                rows={dashboard?.chargesByStatus || []}
                                showAmount
                            />
                        </SectionCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <SectionCard title="Faturas por status">
                            <StatusSummaryTable rows={dashboard?.billsByStatus || []} />
                        </SectionCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <SectionCard
                            title="Pagamentos por status"
                            action={
                                <Link href={route("admin.financeiro.pagamentos.index")}>
                                    <Button size="small" variant="outlined">
                                        Ver pagamentos
                                    </Button>
                                </Link>
                            }
                        >
                            <StatusSummaryTable
                                rows={dashboard?.paymentsByStatus || []}
                                showAmount
                            />
                        </SectionCard>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SectionCard
                            title="Últimas cobranças"
                            action={
                                <Link href={route("admin.financeiro.cobrancas.index")}>
                                    <Button size="small" variant="outlined">
                                        Abrir módulo
                                    </Button>
                                </Link>
                            }
                        >
                            {dashboard?.latestCharges?.length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Referência</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Valor</TableCell>
                                            <TableCell align="right">Ação</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {dashboard.latestCharges.map((charge) => (
                                            <TableRow key={charge.id}>
                                                <TableCell>{charge.client_name}</TableCell>
                                                <TableCell>{charge.reference_label || "-"}</TableCell>
                                                <TableCell>
                                                    <StatusChip status={charge.status} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <MoneyText value={charge.final_amount} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Link href={route("admin.financeiro.cobrancas.show", charge.id)}>
                                                        <Button size="small" variant="outlined">
                                                            Ver
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <EmptyState title="Nenhuma cobrança encontrada." />
                            )}
                        </SectionCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <SectionCard
                            title="Últimos pagamentos"
                            action={
                                <Link href={route("admin.financeiro.pagamentos.index")}>
                                    <Button size="small" variant="outlined">
                                        Abrir módulo
                                    </Button>
                                </Link>
                            }
                        >
                            {dashboard?.latestPayments?.length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Provider</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Valor</TableCell>
                                            <TableCell align="right">Ação</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {dashboard.latestPayments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>{payment.client_name}</TableCell>
                                                <TableCell>{payment.provider}</TableCell>
                                                <TableCell>
                                                    <StatusChip status={payment.status} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <MoneyText value={payment.amount} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Link href={route("admin.financeiro.pagamentos.show", payment.id)}>
                                                        <Button size="small" variant="outlined">
                                                            Ver
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <EmptyState title="Nenhum pagamento encontrado." />
                            )}
                        </SectionCard>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SectionCard title="Faturas pendentes de revisão">
                            {dashboard?.pendingBills?.length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Referência</TableCell>
                                            <TableCell align="right">Valor</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {dashboard.pendingBills.map((bill) => (
                                            <TableRow key={bill.id}>
                                                <TableCell>{bill.client_name}</TableCell>
                                                <TableCell>{bill.reference_label || "-"}</TableCell>
                                                <TableCell align="right">
                                                    <MoneyText value={bill.valor_total} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <EmptyState title="Nenhuma fatura pendente." />
                            )}
                        </SectionCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <SectionCard
                            title="Webhooks com falha"
                            action={
                                <Link href={route("admin.financeiro.payment-webhooks.index")}>
                                    <Button size="small" variant="outlined">
                                        Ver webhooks
                                    </Button>
                                </Link>
                            }
                        >
                            {dashboard?.failedWebhooks?.length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Provider</TableCell>
                                            <TableCell>Evento</TableCell>
                                            <TableCell>Erro</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {dashboard.failedWebhooks.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{event.provider}</TableCell>
                                                <TableCell>{event.event_type || "-"}</TableCell>
                                                <TableCell>{event.error_message || "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <EmptyState title="Nenhum webhook com falha." />
                            )}
                        </SectionCard>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import ReportMetricCard from '@/Components/Reports/ReportMetricCard';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Button,
    Chip,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconAlertTriangle, IconCash, IconEye, IconWallet } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    draft:           { label: 'Rascunho',     color: 'default' },
    open:            { label: 'Em Aberto',    color: 'warning' },
    waiting_payment: { label: 'Ag. Pgto',     color: 'info' },
    paid:            { label: 'Pago',         color: 'success' },
    overdue:         { label: 'Vencido',      color: 'error' },
    cancelled:       { label: 'Cancelado',    color: 'default' },
};

const YEARS = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
});

export default function Page({ cobrancas, filters = {}, totais = {} }) {
    const items = cobrancas?.data ?? [];

    const { data, setData, processing } = useForm({
        status: filters.status ?? '',
        year:   filters.year   ?? '',
    });

    function submit() {
        router.get(safeRoute('cliente.cobrancas.index'), { status: data.status, year: data.year }, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    }

    function clear() {
        router.get(safeRoute('cliente.cobrancas.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    return (
        <Layout titlePage="Minhas Cobranças" menu="cliente-cobrancas" subMenu="cliente-cobrancas-index"
            subtitle="Acompanhe seus pagamentos e pendências."
            breadcrumbs={[{ label: 'Cliente' }, { label: 'Cobranças' }]}>
            <Head title="Minhas Cobranças" />

            <Stack spacing={3}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <ReportMetricCard
                            title="Em aberto"
                            value={formatMoney(totais.pendente ?? 0)}
                            helper="Cobranças pendentes"
                            icon={IconWallet}
                            color={(totais.pendente ?? 0) > 0 ? 'warning.main' : 'success.main'}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <ReportMetricCard
                            title="Em atraso"
                            value={formatMoney(totais.vencido ?? 0)}
                            helper="Cobranças vencidas"
                            icon={IconAlertTriangle}
                            color={(totais.vencido ?? 0) > 0 ? 'error.main' : 'success.main'}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <ReportMetricCard
                            title={`Pago em ${new Date().getFullYear()}`}
                            value={formatMoney(totais.pago_ano ?? 0)}
                            helper="Total quitado no ano"
                            icon={IconCash}
                            color="success.main"
                        />
                    </Grid>
                </Grid>

                <DataTableCard
                    title="Cobranças"
                    icon={IconWallet}
                    isEmpty={items.length === 0}
                    filters={
                        <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                            <FilterSelect label="Status" value={data.status} onChange={v => setData('status', v)}
                                options={[
                                    { value: 'open',            label: 'Em Aberto' },
                                    { value: 'waiting_payment', label: 'Aguardando Pagamento' },
                                    { value: 'paid',            label: 'Pago' },
                                    { value: 'overdue',         label: 'Vencido' },
                                    { value: 'cancelled',       label: 'Cancelado' },
                                ]}
                            />
                            <FilterSelect label="Ano" value={data.year} onChange={v => setData('year', v)} options={YEARS} />
                        </FilterBar>
                    }
                    empty={
                        <DataTableEmpty
                            title="Nenhuma cobrança encontrada"
                            description="Quando cobranças forem geradas, aparecerão aqui."
                            icon={IconWallet}
                        />
                    }
                    head={
                        <TableRow>
                            <TableCell>Competência</TableCell>
                            <TableCell align="right">Consumo Injetado</TableCell>
                            <TableCell align="right">Desconto</TableCell>
                            <TableCell align="right">Valor Final</TableCell>
                            <TableCell>Vencimento</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ação</TableCell>
                        </TableRow>
                    }
                    pagination={
                        <DataTablePagination
                            links={cobrancas?.links}
                            meta={{ from: cobrancas?.from, to: cobrancas?.to, total: cobrancas?.total }}
                        />
                    }
                >
                    {items.map(c => {
                        const st = STATUS_MAP[c.status] ?? { label: c.status, color: 'default' };
                        return (
                            <TableRow key={c.id} hover>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {c.reference_label ?? `${c.reference_month}/${c.reference_year}`}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2">{formatMoney(c.original_amount ?? 0)}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" color="success.main">
                                        -{formatMoney(c.discount_amount ?? 0)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: 900 }}>{formatMoney(c.final_amount ?? 0)}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {c.due_date ? new Date(c.due_date).toLocaleDateString('pt-BR') : '—'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={st.label} color={st.color} size="small" />
                                </TableCell>
                                <TableCell align="right">
                                    <Button component={Link} href={safeRoute('cliente.cobrancas.show', c.id)} size="small" variant="outlined" startIcon={<IconEye size={15} />}>
                                        Ver
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </DataTableCard>
            </Stack>
        </Layout>
    );
}

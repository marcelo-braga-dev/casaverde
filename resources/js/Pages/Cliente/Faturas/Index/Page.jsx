import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { IconDownload, IconEye, IconFileInvoice } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    approved:       { label: 'Aprovada',   color: 'success' },
    pending_review: { label: 'Em Revisão', color: 'warning' },
    reviewed:       { label: 'Revisada',   color: 'info' },
    corrected:      { label: 'Corrigida',  color: 'info' },
    rejected:       { label: 'Rejeitada',  color: 'error' },
};

const YEARS = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
});

export default function Page({ faturas, filters = {} }) {
    const items = faturas?.data ?? [];

    const { data, setData, processing } = useForm({
        status: filters.status ?? '',
        year:   filters.year   ?? '',
    });

    function submit() {
        router.get(safeRoute('cliente.faturas.index'), { status: data.status, year: data.year }, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    }

    function clear() {
        router.get(safeRoute('cliente.faturas.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    return (
        <Layout titlePage="Minhas Faturas" menu="cliente-faturas" subMenu="cliente-faturas-index"
            subtitle="Histórico de faturas de energia elétrica."
            breadcrumbs={[{ label: 'Cliente' }, { label: 'Faturas' }]}>
            <Head title="Minhas Faturas" />

            <DataTableCard
                title="Faturas de Energia"
                icon={IconFileInvoice}
                isEmpty={items.length === 0}
                filters={
                    <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                        <FilterSelect label="Status" value={data.status} onChange={v => setData('status', v)}
                            options={[
                                { value: 'approved',       label: 'Aprovada' },
                                { value: 'pending_review', label: 'Em Revisão' },
                                { value: 'rejected',       label: 'Rejeitada' },
                            ]}
                        />
                        <FilterSelect label="Ano" value={data.year} onChange={v => setData('year', v)} options={YEARS} />
                    </FilterBar>
                }
                empty={
                    <DataTableEmpty
                        title="Nenhuma fatura encontrada"
                        description="Quando suas faturas forem importadas, aparecerão aqui."
                        icon={IconFileInvoice}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Competência</TableCell>
                        <TableCell>Concessionária</TableCell>
                        <TableCell align="right">kWh</TableCell>
                        <TableCell align="right">Valor Total</TableCell>
                        <TableCell>Vencimento</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                }
                pagination={
                    <DataTablePagination
                        links={faturas?.links}
                        meta={{ from: faturas?.from, to: faturas?.to, total: faturas?.total }}
                    />
                }
            >
                {items.map(f => {
                    const st = STATUS_MAP[f.review_status] ?? { label: f.review_status, color: 'default' };
                    return (
                        <TableRow key={f.id} hover>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {f.reference_label ?? `${f.reference_month}/${f.reference_year}`}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">{f.concessionaria?.nome ?? '—'}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2">{f.consumo_kwh ?? '—'}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatMoney(f.valor_total ?? 0)}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {f.vencimento ? new Date(f.vencimento).toLocaleDateString('pt-BR') : '—'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={st.label} color={st.color} size="small" />
                            </TableCell>
                            <TableCell align="right">
                                <Stack direction="row" gap={0.5} justifyContent="flex-end">
                                    <Button component={Link} href={safeRoute('cliente.faturas.show', f.id)} size="small" variant="outlined" startIcon={<IconEye size={15} />}>
                                        Ver
                                    </Button>
                                    {f.pdf_url && (
                                        <Button component="a" href={f.pdf_url} target="_blank" size="small" variant="text" startIcon={<IconDownload size={15} />}>
                                            PDF
                                        </Button>
                                    )}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </DataTableCard>
        </Layout>
    );
}

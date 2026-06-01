import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import FilterTextField from '@/Components/Filters/FilterTextField';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button, Chip, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { IconEye, IconFileText, IconPlus } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_OPTS = [
    { value: 'emitida',    label: 'Emitida' },
    { value: 'enviada',    label: 'Enviada' },
    { value: 'aprovada',   label: 'Aprovada' },
    { value: 'rejeitada',  label: 'Rejeitada' },
    { value: 'pendente',   label: 'Pendente' },
];

const STATUS_COLORS = {
    emitida: 'info', enviada: 'primary', aprovada: 'success',
    rejeitada: 'error', pendente: 'default',
};

function clientName(proposal) {
    const c = proposal?.client_profile;
    return c?.nome || c?.razao_social || c?.nome_fantasia || '—';
}

export default function Page({ proposals, filters = {} }) {
    const items = proposals?.data ?? [];

    const { data, setData, processing } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    function submit() {
        router.get(safeRoute('consultor.propostas.cliente.index'),
            { search: data.search, status: data.status },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function clear() {
        router.get(safeRoute('consultor.propostas.cliente.index'), {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    return (
        <Layout
            titlePage="Propostas de Cliente"
            menu="clientes"
            subMenu="propostas-cliente-index"
            breadcrumbs={[{ label: 'Clientes' }, { label: 'Propostas' }]}
        >
            <Head title="Propostas de Cliente" />

            <DataTableCard
                title="Propostas Comerciais"
                icon={IconFileText}
                actions={
                    <Button component={Link} href={safeRoute('consultor.propostas.cliente.create')}
                        variant="contained" startIcon={<IconPlus size={17} />}>
                        Nova Proposta
                    </Button>
                }
                filters={
                    <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                        <FilterTextField
                            label="Buscar cliente" placeholder="Nome, CPF, CNPJ..."
                            value={data.search} onChange={v => setData('search', v)}
                        />
                        <FilterSelect
                            label="Status" value={data.status}
                            onChange={v => setData('status', v)} options={STATUS_OPTS}
                        />
                    </FilterBar>
                }
                isEmpty={items.length === 0}
                empty={
                    <DataTableEmpty
                        title="Nenhuma proposta encontrada"
                        description="Crie a primeira proposta ou ajuste os filtros."
                        icon={IconFileText}
                        actionLabel="Nova Proposta"
                        actionHref={safeRoute('consultor.propostas.cliente.create')}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Consultor</TableCell>
                        <TableCell align="right">Consumo (kWh)</TableCell>
                        <TableCell align="right">Valor Médio</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ação</TableCell>
                    </TableRow>
                }
                pagination={
                    <DataTablePagination
                        links={proposals?.links}
                        meta={{ from: proposals?.from, to: proposals?.to, total: proposals?.total }}
                    />
                }
            >
                {items.map(p => (
                    <TableRow key={p.id} hover>
                        <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}>
                                {p.proposal_code ?? `#${p.id}`}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{clientName(p)}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" color="text.secondary">{p.consultor?.name ?? '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="body2">{p.media_consumo ?? '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {p.valor_medio ? `R$ ${Number(p.valor_medio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Chip label={p.status ?? '—'} color={STATUS_COLORS[p.status] ?? 'default'} size="small" />
                        </TableCell>
                        <TableCell align="right">
                            <Stack direction="row" gap={0.5} justifyContent="flex-end">
                                <Button component={Link} href={safeRoute('consultor.propostas.cliente.show', p.id)}
                                    size="small" variant="outlined" startIcon={<IconEye size={15} />}>
                                    Ver
                                </Button>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </DataTableCard>
        </Layout>
    );
}

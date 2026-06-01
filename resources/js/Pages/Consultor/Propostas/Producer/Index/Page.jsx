import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import FilterTextField from '@/Components/Filters/FilterTextField';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button, Chip, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { IconBolt, IconEye, IconPlus } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_OPTS = [
    { value: 'emitida',   label: 'Emitida' },
    { value: 'enviada',   label: 'Enviada' },
    { value: 'aprovada',  label: 'Aprovada' },
    { value: 'rejeitada', label: 'Rejeitada' },
    { value: 'pendente',  label: 'Pendente' },
];

const STATUS_COLORS = {
    emitida: 'info', enviada: 'primary', aprovada: 'success',
    rejeitada: 'error', pendente: 'default',
};

function producerName(p) {
    const pr = p?.producer_profile;
    return pr?.nome || pr?.razao_social || pr?.nome_fantasia || '—';
}

export default function Page({ proposals, filters = {} }) {
    const items = proposals?.data ?? [];

    const { data, setData, processing } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    function submit() {
        router.get(safeRoute('consultor.propostas.produtor.index'),
            { search: data.search, status: data.status },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function clear() {
        router.get(safeRoute('consultor.propostas.produtor.index'), {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    return (
        <Layout
            titlePage="Propostas de Produtor"
            menu="produtores"
            subMenu="produtores-propostas"
            breadcrumbs={[{ label: 'Produtores' }, { label: 'Propostas' }]}
        >
            <Head title="Propostas de Produtor" />

            <DataTableCard
                title="Propostas de Produtor Solar"
                icon={IconBolt}
                actions={
                    <Button component={Link} href={safeRoute('consultor.propostas.produtor.create')}
                        variant="contained" startIcon={<IconPlus size={17} />}>
                        Nova Proposta
                    </Button>
                }
                filters={
                    <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                        <FilterTextField
                            label="Buscar produtor" placeholder="Nome, CPF, CNPJ..."
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
                        description="Crie a primeira proposta de produtor ou ajuste os filtros."
                        icon={IconBolt}
                        actionLabel="Nova Proposta"
                        actionHref={safeRoute('consultor.propostas.produtor.create')}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Produtor</TableCell>
                        <TableCell>Consultor</TableCell>
                        <TableCell align="right">Potência</TableCell>
                        <TableCell align="right">Geração Média</TableCell>
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
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{producerName(p)}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" color="text.secondary">{p.consultor?.name ?? '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="body2">{p.potencia_usina ? `${p.potencia_usina} kWp` : '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="body2">{p.media_geracao ? `${p.media_geracao} kWh` : '—'}</Typography>
                        </TableCell>
                        <TableCell>
                            <Chip label={p.status ?? '—'} color={STATUS_COLORS[p.status] ?? 'default'} size="small" />
                        </TableCell>
                        <TableCell align="right">
                            <Button component={Link} href={safeRoute('consultor.propostas.produtor.show', p.id)}
                                size="small" variant="outlined" startIcon={<IconEye size={15} />}>
                                Ver
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </DataTableCard>
        </Layout>
    );
}

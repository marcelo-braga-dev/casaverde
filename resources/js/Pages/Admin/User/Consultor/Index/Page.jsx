import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import InfoCell from '@/Components/DataDisplay/InfoCell';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import FilterTextField from '@/Components/Filters/FilterTextField';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button, Chip, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { IconArrowRight, IconPlus, IconUserDollar } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    '1': { label: 'Ativo',     color: 'success' },
    '0': { label: 'Bloqueado', color: 'error' },
};

export default function Page({ consultores = [], filters = {} }) {
    const items = consultores?.data ?? (Array.isArray(consultores) ? consultores : []);

    const { data, setData, processing } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    function submit() {
        router.get(safeRoute('admin.user.consultor.index'),
            { search: data.search, status: data.status },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function clear() {
        router.get(safeRoute('admin.user.consultor.index'), {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    return (
        <Layout
            titlePage="Consultores"
            menu="consultores"
            subMenu="consultores-cadastrados"
            breadcrumbs={[{ label: 'Admin' }, { label: 'Consultores' }]}
        >
            <Head title="Consultores" />

            <DataTableCard
                title="Consultores Cadastrados"
                icon={IconUserDollar}
                actions={
                    <Button component={Link} href={safeRoute('admin.user.consultor.create')}
                        variant="contained" startIcon={<IconPlus size={17} />}>
                        Novo Consultor
                    </Button>
                }
                filters={
                    <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                        <FilterTextField
                            label="Buscar" placeholder="Nome ou e-mail..."
                            value={data.search} onChange={v => setData('search', v)}
                        />
                        <FilterSelect
                            label="Status" value={data.status}
                            onChange={v => setData('status', v)}
                            options={[{ value: '1', label: 'Ativo' }, { value: '0', label: 'Bloqueado' }]}
                        />
                    </FilterBar>
                }
                isEmpty={items.length === 0}
                empty={
                    <DataTableEmpty
                        title="Nenhum consultor encontrado"
                        description="Cadastre o primeiro consultor ou ajuste os filtros."
                        icon={IconUserDollar}
                        actionLabel="Novo Consultor"
                        actionHref={safeRoute('admin.user.consultor.create')}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Consultor</TableCell>
                        <TableCell>E-mail</TableCell>
                        <TableCell align="right">Clientes</TableCell>
                        <TableCell align="right">Produtores</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ação</TableCell>
                    </TableRow>
                }
                pagination={
                    consultores?.links ? (
                        <DataTablePagination
                            links={consultores.links}
                            meta={{ from: consultores.from, to: consultores.to, total: consultores.total }}
                        />
                    ) : null
                }
            >
                {items.map(c => {
                    const st = STATUS_MAP[String(c.status)] ?? { label: c.status_nome ?? c.status ?? '—', color: 'default' };
                    return (
                        <TableRow key={c.id} hover>
                            <TableCell>
                                <InfoCell title={c.name} subtitle={`#${c.id}`} color="primary.main" />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">{c.email}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.clientes_count ?? 0}</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.produtores_count ?? 0}</Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={st.label} color={st.color} size="small" />
                            </TableCell>
                            <TableCell align="right">
                                <Stack direction="row" gap={0.5} justifyContent="flex-end">
                                    <Button component={Link} href={safeRoute('admin.user.consultor.show', c.id)}
                                        size="small" variant="outlined" startIcon={<IconArrowRight size={14} />}>
                                        Ver
                                    </Button>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </DataTableCard>
        </Layout>
    );
}

import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import FilterTextField from '@/Components/Filters/FilterTextField';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { IconEye, IconPlus, IconSolarPanel2 } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

export default function Page({ usinas, filters = {} }) {
    const items = usinas?.data ?? [];

    const { data, setData, processing } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    function submit() {
        router.get(safeRoute('consultor.producer.usinas.index'),
            { search: data.search, status: data.status },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function clear() {
        router.get(safeRoute('consultor.producer.usinas.index'), {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    return (
        <Layout
            titlePage="Usinas Fotovoltaicas"
            menu="usinas-solar"
            subMenu="usinas-index"
            breadcrumbs={[{ label: 'Usinas' }, { label: 'Cadastros' }]}
        >
            <Head title="Usinas" />

            <DataTableCard
                title="Usinas Cadastradas"
                icon={IconSolarPanel2}
                actions={
                    <Button component={Link} href={safeRoute('consultor.producer.usinas.create')}
                        variant="contained" startIcon={<IconPlus size={17} />}>
                        Cadastrar Usina
                    </Button>
                }
                filters={
                    <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                        <FilterTextField
                            label="Buscar" placeholder="Nome, UC, concessionária, produtor..."
                            value={data.search} onChange={v => setData('search', v)}
                        />
                        <FilterSelect
                            label="Status" value={data.status}
                            onChange={v => setData('status', v)}
                            options={[{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }]}
                        />
                    </FilterBar>
                }
                isEmpty={items.length === 0}
                empty={
                    <DataTableEmpty
                        title="Nenhuma usina encontrada"
                        description="Cadastre a primeira usina ou ajuste os filtros."
                        icon={IconSolarPanel2}
                        actionLabel="Cadastrar Usina"
                        actionHref={safeRoute('consultor.producer.usinas.create')}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Usina</TableCell>
                        <TableCell>UC</TableCell>
                        <TableCell>Produtor</TableCell>
                        <TableCell>Concessionária</TableCell>
                        <TableCell>Bloco</TableCell>
                        <TableCell align="right">Potência</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ação</TableCell>
                    </TableRow>
                }
                pagination={
                    <DataTablePagination
                        links={usinas?.links}
                        meta={{ from: usinas?.from, to: usinas?.to, total: usinas?.total }}
                    />
                }
            >
                {items.map(u => (
                    <TableRow key={u.id} hover>
                        <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {u.usina_nome ?? `Usina #${u.id}`}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" color="text.secondary">{u.uc ?? '—'}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2">{u.produtor?.nome ?? u.produtor?.razao_social ?? '—'}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2">{u.concessionaria?.nome ?? '—'}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" color="text.secondary">{u.block?.nome ?? '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {u.potencia_usina ? `${u.potencia_usina} kWp` : '—'}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Chip
                                label={u.status ?? '—'}
                                color={u.status === 'ativo' ? 'success' : 'default'}
                                size="small"
                            />
                        </TableCell>
                        <TableCell align="right">
                            <Button component={Link} href={safeRoute('consultor.producer.usinas.show', u.id)}
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

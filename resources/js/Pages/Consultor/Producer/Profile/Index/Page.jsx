import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import InfoCell from '@/Components/DataDisplay/InfoCell';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import FilterTextField from '@/Components/Filters/FilterTextField';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { IconEye, IconPlus, IconUserBolt } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_COLORS = {
    ativo: 'success', prospect: 'warning', lead: 'info',
    em_integracao: 'secondary', inativo: 'default',
};

export default function Page({ producers, filters = {} }) {
    const items = producers?.data ?? [];

    const { data, setData, processing } = useForm({
        search:     filters.search     ?? '',
        status:     filters.status     ?? '',
        tipo_pessoa: filters.tipo_pessoa ?? '',
    });

    function submit() {
        router.get(safeRoute('consultor.producer.profiles.index'),
            { search: data.search, status: data.status, tipo_pessoa: data.tipo_pessoa },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function clear() {
        router.get(safeRoute('consultor.producer.profiles.index'), {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    return (
        <Layout
            titlePage="Produtores"
            menu="produtores"
            subMenu="produtores-profile"
            breadcrumbs={[{ label: 'Produtores' }, { label: 'Cadastros' }]}
        >
            <Head title="Produtores" />

            <DataTableCard
                title="Produtores Cadastrados"
                icon={IconUserBolt}
                actions={
                    <Button component={Link} href={safeRoute('consultor.producer.profiles.create')}
                        variant="contained" startIcon={<IconPlus size={17} />}>
                        Novo Produtor
                    </Button>
                }
                filters={
                    <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                        <FilterTextField
                            label="Buscar" placeholder="Nome, CPF, CNPJ, e-mail..."
                            value={data.search} onChange={v => setData('search', v)}
                        />
                        <FilterSelect
                            label="Tipo" value={data.tipo_pessoa}
                            onChange={v => setData('tipo_pessoa', v)}
                            options={[{ value: 'pf', label: 'Pessoa Física' }, { value: 'pj', label: 'Pessoa Jurídica' }]}
                        />
                        <FilterSelect
                            label="Status" value={data.status}
                            onChange={v => setData('status', v)}
                            options={[
                                { value: 'ativo',          label: 'Ativo' },
                                { value: 'prospect',       label: 'Prospecto' },
                                { value: 'lead',           label: 'Lead' },
                                { value: 'em_integracao',  label: 'Em Integração' },
                                { value: 'inativo',        label: 'Inativo' },
                            ]}
                        />
                    </FilterBar>
                }
                isEmpty={items.length === 0}
                empty={
                    <DataTableEmpty
                        title="Nenhum produtor encontrado"
                        description="Cadastre o primeiro produtor ou ajuste os filtros."
                        icon={IconUserBolt}
                        actionLabel="Novo Produtor"
                        actionHref={safeRoute('consultor.producer.profiles.create')}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Produtor</TableCell>
                        <TableCell>Documento</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Consultor</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ação</TableCell>
                    </TableRow>
                }
                pagination={
                    <DataTablePagination
                        links={producers?.links}
                        meta={{ from: producers?.from, to: producers?.to, total: producers?.total }}
                    />
                }
            >
                {items.map(p => {
                    const nome = p.nome || p.razao_social || p.nome_fantasia || '—';
                    return (
                        <TableRow key={p.id} hover>
                            <TableCell>
                                <InfoCell
                                    title={nome}
                                    subtitle={`P${p.id}`}
                                    color="primary.main"
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">{p.cpf ?? p.cnpj ?? '—'}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {p.tipo_pessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {p.consultor?.name ?? '—'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={p.status ?? '—'}
                                    color={STATUS_COLORS[p.status] ?? 'default'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Button component={Link} href={safeRoute('consultor.producer.profiles.show', p.id)}
                                    size="small" variant="outlined" startIcon={<IconEye size={15} />}>
                                    Ver
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </DataTableCard>
        </Layout>
    );
}

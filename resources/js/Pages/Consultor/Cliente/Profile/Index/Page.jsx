import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import InfoCell from '@/Components/DataDisplay/InfoCell';
import StatusChip from '@/Components/UI/StatusChip';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterTextField from '@/Components/Filters/FilterTextField';
import FilterSelect from '@/Components/Filters/FilterSelect';

import {Head, Link, router, useForm} from '@inertiajs/react';
import {
    Box,
    Button,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import {
    IconEye,
    IconUserPlus,
    IconUsers,
} from '@tabler/icons-react';
import Layout from "@/Layouts/UserLayout/Layout.jsx";

const getClientName = (client) => {
    if (client?.tipo_pessoa === 'pf') {
        return client?.nome;
    }

    return client?.razao_social || client?.nome_fantasia;
};

const getClientDocument = (client) => {
    if (client?.tipo_pessoa === 'pf') {
        return client?.cpf;
    }

    return client?.cnpj;
};

export default function Page({clients, filters = {}}) {
    const items = clients?.data ?? [];

    const {data, setData, processing} = useForm({
        search: filters?.search ?? '',
        status: filters?.status ?? '',
        tipo_pessoa: filters?.tipo_pessoa ?? '',
    });

    function submitFilters() {
        router.get(
            route('consultor.user.cliente.index'),
            {
                search: data.search,
                status: data.status,
                tipo_pessoa: data.tipo_pessoa,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function clearFilters() {
        router.get(
            route('consultor.user.cliente.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    return (

        <Layout titlePage="Clientes Cadastrados" menu="clientes" subMenu="cliente-index" backPage>
            <Head title="Clientes Cadastrados"/>

            <DataTableCard
                title="Carteira de clientes"
                icon={IconUsers}
                actions={
                    <Button
                        component={Link}
                        href={route('consultor.user.cliente.create')}
                        variant="contained"
                        startIcon={<IconUserPlus size={18}/>}
                    >
                        Cadastrar cliente
                    </Button>
                }
                filters={
                    <FilterBar
                        onSubmit={submitFilters}
                        onClear={clearFilters}
                        processing={processing}
                    >
                        <FilterTextField
                            label="Buscar"
                            placeholder="Nome, documento, e-mail..."
                            value={data.search}
                            onChange={(value) => setData('search', value)}
                        />

                        <FilterSelect
                            label="Tipo"
                            value={data.tipo_pessoa}
                            onChange={(value) => setData('tipo_pessoa', value)}
                            options={[
                                {value: 'pf', label: 'Pessoa Física'},
                                {value: 'pj', label: 'Pessoa Jurídica'},
                            ]}
                        />

                        <FilterSelect
                            label="Status"
                            value={data.status}
                            onChange={(value) => setData('status', value)}
                            options={[
                                {value: 'active', label: 'Ativo'},
                                {value: 'inactive', label: 'Inativo'},
                                {value: 'contrato_assinado', label: 'Contrato Fechado'},
                            ]}
                        />
                    </FilterBar>
                }
                isEmpty={items.length === 0}
                empty={
                    <DataTableEmpty
                        title="Nenhum cliente encontrado"
                        description="Cadastre o primeiro cliente ou ajuste os filtros de busca."
                        actionLabel="Cadastrar cliente"
                        actionHref={route('consultor.user.cliente.create')}
                        icon={IconUsers}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Documento</TableCell>
                        <TableCell align="center">Contato</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                }
                pagination={
                    <DataTablePagination
                        links={clients?.links}
                        meta={{
                            from: clients?.from,
                            to: clients?.to,
                            total: clients?.total,
                        }}
                    />
                }
            >
                {items.map((client) => {
                    const name = getClientName(client);
                    const document = getClientDocument(client);

                    return (
                        <TableRow key={client.id}>
                            <TableCell>
                                <InfoCell
                                    title={name || 'Não informado'}
                                    subtitle={`ID #${client.id}`}
                                    color="primary.main"
                                />
                            </TableCell>

                            <TableCell>
                                <Typography variant="body2">
                                    {document || 'Não informado'}
                                </Typography>
                            </TableCell>

                            <TableCell align="center">
                                <Box>
                                    {client?.contacts?.celular && (
                                        <Typography variant="body2">
                                            {client?.contacts?.celular || 'Não informado'}
                                        </Typography>
                                    )}
                                    {client?.contacts?.telefone && (
                                        <Typography variant="body2">
                                            {client?.contacts?.telefone || 'Não informado'}
                                        </Typography>
                                    )}
                                    {(client?.contacts?.celular == null &&  client?.contacts?.telefone == null) && '-'}
                                </Box>
                            </TableCell>

                            <TableCell>
                                <StatusChip status={client?.status}/>
                            </TableCell>

                            <TableCell align="right">
                                <Stack direction="row" justifyContent="flex-end" gap={1}>
                                    <Button
                                        component={Link}
                                        href={route('consultor.user.cliente.show', client.id)}
                                        size="small"
                                        variant="outlined"
                                        startIcon={<IconEye size={17}/>}
                                    >
                                        Ver
                                    </Button>

                                    {/*<RowActions*/}
                                    {/*    actions={[*/}
                                    {/*        {*/}
                                    {/*            label: 'Visualizar',*/}
                                    {/*            icon: IconEye,*/}
                                    {/*            component: Link,*/}
                                    {/*            href: route('consultor.user.cliente.show', client.id),*/}
                                    {/*        },*/}
                                    {/*        {*/}
                                    {/*            label: 'Nova proposta',*/}
                                    {/*            icon: IconSearch,*/}
                                    {/*            component: Link,*/}
                                    {/*            href: route('consultor.propostas.cliente.create', {*/}
                                    {/*                client_profile_id: client.id,*/}
                                    {/*            }),*/}
                                    {/*        },*/}
                                    {/*    ]}*/}
                                    {/*/>*/}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </DataTableCard>
            {/*</AppShell>*/}
        </Layout>
    );
}

import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import FilterBar from '@/Components/Filters/FilterBar';
import FilterSelect from '@/Components/Filters/FilterSelect';
import FilterTextField from '@/Components/Filters/FilterTextField';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconEye,
    IconHeadset,
    IconPlus,
    IconTicket,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_COLORS = {
    novo:               'info',
    em_atendimento:     'warning',
    aguardando_cliente: 'secondary',
    resolvido:          'success',
    fechado:            'default',
    cancelado:          'error',
};

const STATUS_LABELS = {
    novo:               'Novo',
    em_atendimento:     'Em Atendimento',
    aguardando_cliente: 'Aguardando Cliente',
    resolvido:          'Resolvido',
    fechado:            'Fechado',
    cancelado:          'Cancelado',
};

const PRIORITY_COLORS = {
    baixa:   'default',
    normal:  'info',
    alta:    'warning',
    urgente: 'error',
};

function SummaryCard({ label, value, color = 'primary.main' }) {
    return (
        <Card sx={{ borderRadius: 3, border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
            <CardContent sx={{ py: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                    {label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-0.05em', color, mt: 0.3 }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default function Page({ tickets, filters = {}, summary = {}, statusOpts = [], roleId }) {
    const { flash } = usePage().props;
    const items = tickets?.data ?? [];

    const isStaff = roleId === 1 || roleId === 2;
    const canOpen = roleId === 4 || roleId === 3; // cliente ou produtor

    const { data, setData, processing } = useForm({
        search:   filters.search   ?? '',
        status:   filters.status   ?? '',
        priority: filters.priority ?? '',
        category: filters.category ?? '',
    });

    function submit() {
        router.get(safeRoute('support.tickets.index'), {
            search: data.search, status: data.status,
            priority: data.priority, category: data.category,
        }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function clear() {
        router.get(safeRoute('support.tickets.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    }

    return (
        <Layout
            titlePage="Central de Suporte"
            menu="suporte"
            subMenu="suporte-produtores"
            subtitle={isStaff ? 'Gerencie os chamados da sua carteira.' : 'Abra e acompanhe seus chamados.'}
            breadcrumbs={[{ label: 'Suporte' }, { label: 'Chamados' }]}
        >
            <Head title="Suporte" />

            <Stack spacing={3}>
                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error">{flash.error}</Alert>}

                {/* ── Resumo ────────────────────────────────────────────── */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <SummaryCard label="Total" value={summary.total ?? 0} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <SummaryCard label="Abertos" value={summary.abertos ?? 0} color="warning.main" />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <SummaryCard label="Novos" value={summary.novos ?? 0} color="info.main" />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <SummaryCard label="Em Atendimento" value={summary.em_atendimento ?? 0} color="warning.main" />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <SummaryCard label="Resolvidos" value={summary.resolvidos ?? 0} color="success.main" />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <SummaryCard label="Fechados" value={summary.fechados ?? 0} color="text.secondary" />
                    </Grid>
                </Grid>

                {/* ── Tabela de chamados ────────────────────────────────── */}
                <DataTableCard
                    title="Chamados"
                    icon={IconTicket}
                    actions={
                        canOpen && (
                            <Button
                                component={Link}
                                href={safeRoute('support.tickets.create')}
                                variant="contained"
                                startIcon={<IconPlus size={17} />}
                            >
                                Abrir chamado
                            </Button>
                        )
                    }
                    filters={
                        <FilterBar onSubmit={submit} onClear={clear} processing={processing}>
                            <FilterTextField
                                label="Buscar"
                                placeholder="Título, código..."
                                value={data.search}
                                onChange={v => setData('search', v)}
                            />
                            <FilterSelect
                                label="Status"
                                value={data.status}
                                onChange={v => setData('status', v)}
                                options={statusOpts.map(s => ({ value: s.value, label: s.label }))}
                            />
                            <FilterSelect
                                label="Prioridade"
                                value={data.priority}
                                onChange={v => setData('priority', v)}
                                options={[
                                    { value: 'baixa',   label: 'Baixa' },
                                    { value: 'normal',  label: 'Normal' },
                                    { value: 'alta',    label: 'Alta' },
                                    { value: 'urgente', label: 'Urgente' },
                                ]}
                            />
                        </FilterBar>
                    }
                    isEmpty={items.length === 0}
                    empty={
                        <DataTableEmpty
                            title={canOpen ? 'Nenhum chamado aberto' : 'Nenhum chamado encontrado'}
                            description={canOpen ? 'Clique em "Abrir chamado" para registrar sua solicitação.' : 'Nenhum chamado corresponde aos filtros.'}
                            icon={IconHeadset}
                            actionLabel={canOpen ? 'Abrir chamado' : undefined}
                            actionHref={canOpen ? safeRoute('support.tickets.create') : undefined}
                        />
                    }
                    head={
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Título</TableCell>
                            {isStaff && <TableCell>Solicitante</TableCell>}
                            <TableCell>Categoria</TableCell>
                            <TableCell>Prioridade</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Abertura</TableCell>
                            <TableCell align="right">Ação</TableCell>
                        </TableRow>
                    }
                    pagination={
                        <DataTablePagination
                            links={tickets?.links}
                            meta={{ from: tickets?.from, to: tickets?.to, total: tickets?.total }}
                        />
                    }
                >
                    {items.map(ticket => (
                        <TableRow key={ticket.id} hover sx={{ cursor: 'pointer' }} onClick={() => router.visit(safeRoute('support.tickets.show', ticket.id))}>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}>
                                    {ticket.ticket_code}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 700, maxWidth: 240 }} noWrap>
                                    {ticket.title}
                                </Typography>
                                {ticket.last_message && (
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 240 }}>
                                        Última msg: {ticket.last_message.user?.name}
                                    </Typography>
                                )}
                            </TableCell>
                            {isStaff && (
                                <TableCell>
                                    <Typography variant="body2">
                                        {ticket.requester_name ?? ticket.opened_by?.name ?? '—'}
                                    </Typography>
                                </TableCell>
                            )}
                            <TableCell>
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {ticket.category ?? '—'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={ticket.priority ?? 'normal'}
                                    color={PRIORITY_COLORS[ticket.priority] ?? 'default'}
                                    size="small"
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={STATUS_LABELS[ticket.status] ?? ticket.status}
                                    color={STATUS_COLORS[ticket.status] ?? 'default'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-BR') : '—'}
                                </Typography>
                            </TableCell>
                            <TableCell align="right" onClick={e => e.stopPropagation()}>
                                <Button
                                    component={Link}
                                    href={safeRoute('support.tickets.show', ticket.id)}
                                    size="small"
                                    variant="outlined"
                                    startIcon={<IconEye size={15} />}
                                >
                                    Ver
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </DataTableCard>
            </Stack>
        </Layout>
    );
}

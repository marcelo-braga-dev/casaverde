import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import { Head, Link } from '@inertiajs/react';
import {
    Button,
    Chip,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { IconBolt, IconEye } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    emitido:          { label: 'Emitido',        color: 'info' },
    aguardando_assina: { label: 'Ag. Assinatura', color: 'warning' },
    assinado:         { label: 'Assinado',       color: 'success' },
    cancelado:        { label: 'Cancelado',      color: 'default' },
};

export default function Page({ contratos = [] }) {
    return (
        <Layout titlePage="Meus Contratos" menu="cliente-contratos" subMenu="cliente-contratos-index"
            subtitle="Contratos de energia solar vinculados à sua conta."
            breadcrumbs={[{ label: 'Cliente' }, { label: 'Contratos' }]}>
            <Head title="Meus Contratos" />

            <DataTableCard
                title="Contratos"
                icon={IconBolt}
                isEmpty={contratos.length === 0}
                empty={
                    <DataTableEmpty
                        title="Nenhum contrato encontrado"
                        description="Seus contratos de energia solar aparecerão aqui."
                        icon={IconBolt}
                    />
                }
                head={
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Proposta</TableCell>
                        <TableCell>Emissão</TableCell>
                        <TableCell>Assinatura</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ação</TableCell>
                    </TableRow>
                }
            >
                {contratos.map(c => {
                    const st = STATUS_MAP[c.status] ?? { label: c.status ?? 'Sem status', color: 'default' };
                    return (
                        <TableRow key={c.id} hover>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.contract_code ?? `#${c.id}`}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">{c.proposal?.proposal_code ?? '—'}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {c.issued_at ? new Date(c.issued_at).toLocaleDateString('pt-BR') : '—'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {c.signed_at ? new Date(c.signed_at).toLocaleDateString('pt-BR') : '—'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={st.label} color={st.color} size="small" />
                            </TableCell>
                            <TableCell align="right">
                                <Button component={Link} href={safeRoute('cliente.contratos.show', c.id)} size="small" variant="outlined" startIcon={<IconEye size={15} />}>
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

import { Link } from '@inertiajs/react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { IconEye, IconFileInvoice } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    approved: { label: 'Aprovada', color: 'success' },
    pending_review: { label: 'Aguardando Revisão', color: 'warning' },
    reviewed: { label: 'Revisada', color: 'info' },
    corrected: { label: 'Corrigida', color: 'info' },
    rejected: { label: 'Rejeitada', color: 'error' },
};

function formatMoney(value) {
    return Number(value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}

const ConcessionaireBillsList = ({ bills = [], admin = false }) => {
    const items = bills;

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Faturas de Concessionária" avatar={<IconFileInvoice />} />

            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Competência</TableCell>
                                <TableCell>Concessionária</TableCell>
                                <TableCell>UC</TableCell>
                                <TableCell align="right">kWh</TableCell>
                                <TableCell align="right">Valor Total</TableCell>
                                <TableCell>Vencimento</TableCell>
                                <TableCell>Status</TableCell>
                                {admin && <TableCell align="center">Ações</TableCell>}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={admin ? 8 : 7}>
                                        Nenhuma fatura de concessionária encontrada para este cliente.
                                    </TableCell>
                                </TableRow>
                            )}

                            {items.map((bill) => {
                                const status = STATUS_MAP[bill.review_status] ?? { label: bill.review_status ?? '—', color: 'default' };

                                return (
                                    <TableRow key={bill.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {bill.reference_label ?? `${bill.reference_month}/${bill.reference_year}`}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{bill.concessionaria?.nome ?? '—'}</TableCell>
                                        <TableCell>
                                            {(bill.consumer_unit ?? bill.consumerUnit)?.uc_code ?? bill.unidade_consumidora ?? '—'}
                                        </TableCell>
                                        <TableCell align="right">{bill.consumo_kwh ?? '—'}</TableCell>
                                        <TableCell align="right">{formatMoney(bill.valor_total)}</TableCell>
                                        <TableCell>{formatDate(bill.vencimento)}</TableCell>
                                        <TableCell>
                                            <Chip label={status.label} color={status.color} size="small" />
                                        </TableCell>
                                        {admin && (
                                            <TableCell align="center">
                                                <Button
                                                    component={Link}
                                                    href={safeRoute('consultor.cliente.faturas.show', bill.id)}
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<IconEye size={15} />}
                                                >
                                                    Ver
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default ConcessionaireBillsList;

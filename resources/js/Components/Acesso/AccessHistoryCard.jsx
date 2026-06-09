import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {
    IconCheck,
    IconHistory,
    IconKey,
    IconLock,
    IconLogin,
    IconLogout,
    IconUserCheck,
    IconUserPlus,
    IconX,
} from '@tabler/icons-react';

const EVENT_ICONS = {
    login:            <IconLogin   size={14} />,
    logout:           <IconLogout  size={14} />,
    blocked:          <IconLock    size={14} />,
    unblocked:        <IconCheck   size={14} />,
    password_changed: <IconKey     size={14} />,
    access_created:   <IconUserPlus size={14} />,
    access_updated:   <IconUserCheck size={14} />,
};

const EVENT_COLORS = {
    login:            'success',
    logout:           'info',
    blocked:          'error',
    unblocked:        'success',
    password_changed: 'warning',
    access_created:   'primary',
    access_updated:   'secondary',
};

export default function AccessHistoryCard({ history = [], title = 'Histórico de Acesso' }) {
    return (
        <Card>
            <Box sx={{ px: 2.5, py: 1.8, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <IconHistory size={17} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {history.length > 0 ? `${history.length} registros recentes` : 'Sem registros'}
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ p: 0 }}>
                {history.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <IconHistory size={36} style={{ opacity: 0.2 }} />
                        <Typography color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>
                            Nenhum registro de acesso encontrado.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Evento</TableCell>
                                    <TableCell>IP</TableCell>
                                    <TableCell>Navegador</TableCell>
                                    <TableCell>Executado por</TableCell>
                                    <TableCell>Data / Hora</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((log, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell>
                                            <Chip
                                                icon={EVENT_ICONS[log.event]}
                                                label={log.event_label}
                                                color={EVENT_COLORS[log.event] ?? 'default'}
                                                size="small"
                                                variant={['blocked', 'login'].includes(log.event) ? 'filled' : 'outlined'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                                {log.ip_address ?? '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {log.user_agent ?? '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {log.performed_by ?? '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                                {log.created_at ?? '—'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
}

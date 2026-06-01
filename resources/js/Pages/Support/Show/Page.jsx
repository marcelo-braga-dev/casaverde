import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconArrowLeft,
    IconCheck,
    IconHeadset,
    IconLock,
    IconSend,
    IconShieldOff,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

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
    baixa: 'default', normal: 'info', alta: 'warning', urgente: 'error',
};

const CATEGORY_LABELS = {
    financeiro: 'Financeiro', tecnico: 'Técnico', comercial: 'Comercial',
    fatura: 'Fatura', usina: 'Usina', acesso: 'Acesso', contrato: 'Contrato', outros: 'Outros',
};

function initials(name = '') {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

function MessageBubble({ message, currentUserId, isStaff }) {
    const isOwn = message.user_id === currentUserId;
    const fromStaff = message.user?.role_id === 1 || message.user?.role_id === 2;

    return (
        <Stack
            direction={isOwn ? 'row-reverse' : 'row'}
            alignItems="flex-start"
            gap={1.2}
            sx={{ opacity: message.is_internal ? 0.75 : 1 }}
        >
            <Tooltip title={message.user?.name ?? '?'}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        fontSize: 13,
                        fontWeight: 900,
                        bgcolor: fromStaff ? '#1d4ed8' : '#047857',
                        flexShrink: 0,
                    }}
                >
                    {initials(message.user?.name ?? '?')}
                </Avatar>
            </Tooltip>

            <Box sx={{ maxWidth: '72%' }}>
                <Stack
                    direction={isOwn ? 'row-reverse' : 'row'}
                    alignItems="center"
                    gap={0.8}
                    sx={{ mb: 0.4 }}
                >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {message.user?.name ?? '?'}
                    </Typography>
                    {fromStaff && (
                        <Chip label="Staff" size="small" sx={{ height: 16, fontSize: 9, bgcolor: '#dbeafe', color: '#1d4ed8' }} />
                    )}
                    {message.is_internal && (
                        <Chip label="Nota interna" size="small" icon={<IconLock size={10} />}
                            sx={{ height: 16, fontSize: 9, bgcolor: '#fef3c7', color: '#92400e' }} />
                    )}
                    <Typography variant="caption" color="text.secondary">
                        {new Date(message.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                </Stack>

                <Box sx={{
                    bgcolor: message.is_internal
                        ? '#fffbeb'
                        : isOwn ? 'primary.main' : 'grey.100',
                    color: isOwn && !message.is_internal ? '#fff' : 'text.primary',
                    border: message.is_internal ? '1px dashed #fbbf24' : 'none',
                    borderRadius: isOwn ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    p: 1.5,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                }}>
                    <Typography variant="body2">{message.message}</Typography>
                </Box>
            </Box>
        </Stack>
    );
}

export default function Page({ ticket, statusOpts = [], isStaff, roleId, allowedTransitions = [] }) {
    const { flash, auth } = usePage().props;
    const currentUserId = auth?.user?.id;

    const [showStatusForm, setShowStatusForm] = useState(false);

    const msgForm = useForm({ message: '', is_internal: false });
    const statusForm = useForm({ status: '', note: '' });

    function sendMessage(e) {
        e.preventDefault();
        msgForm.post(safeRoute('support.tickets.message', ticket.id), {
            preserveScroll: true,
            onSuccess: () => msgForm.reset(),
        });
    }

    function updateStatus(e) {
        e.preventDefault();
        statusForm.put(safeRoute('support.tickets.status', ticket.id), {
            preserveScroll: true,
            onSuccess: () => { setShowStatusForm(false); statusForm.reset(); },
        });
    }

    const isClosed = ticket.status === 'fechado' || ticket.status === 'cancelado';
    const messages = ticket.messages ?? [];

    const allowedOpts = statusOpts.filter(s => allowedTransitions.includes(s.value));

    return (
        <Layout
            titlePage={`Chamado ${ticket.ticket_code}`}
            menu="suporte"
            subMenu="suporte-produtores"
            breadcrumbs={[
                { label: 'Suporte' },
                { label: 'Chamados', href: safeRoute('support.tickets.index') },
                { label: ticket.ticket_code },
            ]}
        >
            <Head title={`Chamado ${ticket.ticket_code}`} />

            <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button component={Link} href={safeRoute('support.tickets.index')} startIcon={<IconArrowLeft size={16} />} variant="text" size="small">
                        Voltar
                    </Button>

                    {/* Ações de staff */}
                    {isStaff && !isClosed && (
                        <Stack direction="row" gap={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<IconCheck size={16} />}
                                onClick={() => setShowStatusForm(s => !s)}
                            >
                                Alterar Status
                            </Button>
                        </Stack>
                    )}

                    {/* Cancelar — pelo autor */}
                    {!isClosed && ticket.opened_by_user_id === currentUserId && !isStaff && (
                        <Button
                            component={Link}
                            href={safeRoute('support.tickets.cancel', ticket.id)}
                            method="post"
                            as="button"
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<IconX size={16} />}
                        >
                            Cancelar chamado
                        </Button>
                    )}
                </Stack>

                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error">{flash.error}</Alert>}

                {/* ── Form de status ──────────────────────────────────── */}
                {showStatusForm && isStaff && (
                    <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: 'warning.light', boxShadow: 'var(--cv-shadow-md)' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Alterar Status do Chamado</Typography>
                            <Box component="form" onSubmit={updateStatus}>
                                <Stack spacing={2}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                                        <TextField
                                            fullWidth select size="small"
                                            label="Novo status *"
                                            value={statusForm.data.status}
                                            onChange={e => statusForm.setData('status', e.target.value)}
                                            error={!!statusForm.errors.status}
                                            helperText={statusForm.errors.status}
                                        >
                                            {allowedOpts.map(s => (
                                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            fullWidth size="small"
                                            label="Nota interna (opcional)"
                                            value={statusForm.data.note}
                                            onChange={e => statusForm.setData('note', e.target.value)}
                                            placeholder="Explique o motivo da mudança..."
                                        />
                                    </Stack>
                                    <Stack direction="row" gap={1} justifyContent="flex-end">
                                        <Button variant="outlined" color="inherit" size="small" onClick={() => setShowStatusForm(false)}>Cancelar</Button>
                                        <Button type="submit" variant="contained" size="small" disabled={!statusForm.data.status || statusForm.processing}
                                            startIcon={statusForm.processing ? <CircularProgress size={14} color="inherit" /> : <IconCheck size={15} />}>
                                            Confirmar
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                <Grid container spacing={3}>
                    {/* ── Detalhes do chamado ─────────────────────────── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            <Card sx={{ borderRadius: 3, border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconHeadset size={18} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>Chamado</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 1.5 }} />

                                    <Stack spacing={1.2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Código</Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main' }}>
                                                {ticket.ticket_code}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Status</Typography>
                                            <Box sx={{ mt: 0.3 }}>
                                                <Chip
                                                    label={STATUS_LABELS[ticket.status] ?? ticket.status}
                                                    color={STATUS_COLORS[ticket.status] ?? 'default'}
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Prioridade</Typography>
                                            <Box sx={{ mt: 0.3 }}>
                                                <Chip
                                                    label={ticket.priority}
                                                    color={PRIORITY_COLORS[ticket.priority] ?? 'default'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Categoria</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Aberto por</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {ticket.opened_by?.name ?? '—'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Data de abertura</Typography>
                                            <Typography variant="body2">
                                                {ticket.created_at ? new Date(ticket.created_at).toLocaleString('pt-BR') : '—'}
                                            </Typography>
                                        </Box>
                                        {ticket.consultor && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Consultor</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {ticket.consultor.name}
                                                </Typography>
                                            </Box>
                                        )}
                                        {ticket.first_response_at && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">1ª resposta</Typography>
                                                <Typography variant="body2">
                                                    {new Date(ticket.first_response_at).toLocaleString('pt-BR')}
                                                </Typography>
                                            </Box>
                                        )}
                                        {ticket.resolved_at && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Resolvido em</Typography>
                                                <Typography variant="body2">
                                                    {new Date(ticket.resolved_at).toLocaleString('pt-BR')}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Descrição original */}
                            <Card sx={{ borderRadius: 3, border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>Descrição</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                                        {ticket.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* ── Thread de mensagens ─────────────────────────── */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 3, border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconUser size={18} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 950 }}>
                                        Conversa ({messages.length} mensagen{messages.length !== 1 ? 's' : ''})
                                    </Typography>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                {/* Mensagens */}
                                <Stack spacing={2} sx={{ minHeight: 200, mb: 3 }}>
                                    {messages.length === 0 ? (
                                        <Box sx={{ py: 4, textAlign: 'center' }}>
                                            <Typography color="text.secondary">
                                                Nenhuma mensagem ainda. Inicie a conversa abaixo.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        messages.map(msg => (
                                            <MessageBubble
                                                key={msg.id}
                                                message={msg}
                                                currentUserId={currentUserId}
                                                isStaff={isStaff}
                                            />
                                        ))
                                    )}
                                </Stack>

                                {/* Form de resposta */}
                                {isClosed ? (
                                    <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, textAlign: 'center' }}>
                                        <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
                                            <IconShieldOff size={16} style={{ opacity: 0.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Este chamado está encerrado. Abra um novo se precisar de ajuda.
                                            </Typography>
                                        </Stack>
                                        <Button
                                            component={Link}
                                            href={safeRoute('support.tickets.create')}
                                            size="small"
                                            variant="outlined"
                                            sx={{ mt: 1 }}
                                        >
                                            Abrir novo chamado
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box component="form" onSubmit={sendMessage}>
                                        <Stack spacing={1.5}>
                                            {msgForm.errors.message && (
                                                <Alert severity="error" sx={{ py: 0.5 }}>{msgForm.errors.message}</Alert>
                                            )}

                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder={isStaff
                                                    ? 'Digite sua resposta ao cliente...'
                                                    : 'Digite sua mensagem...'
                                                }
                                                value={msgForm.data.message}
                                                onChange={e => msgForm.setData('message', e.target.value)}
                                                error={!!msgForm.errors.message}
                                            />

                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                {isStaff ? (
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                size="small"
                                                                checked={msgForm.data.is_internal}
                                                                onChange={e => msgForm.setData('is_internal', e.target.checked)}
                                                            />
                                                        }
                                                        label={
                                                            <Typography variant="caption">
                                                                Nota interna (não visível ao cliente)
                                                            </Typography>
                                                        }
                                                    />
                                                ) : <Box />}

                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={msgForm.processing || !msgForm.data.message.trim()}
                                                    startIcon={msgForm.processing
                                                        ? <CircularProgress size={14} color="inherit" />
                                                        : <IconSend size={16} />
                                                    }
                                                >
                                                    Enviar
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

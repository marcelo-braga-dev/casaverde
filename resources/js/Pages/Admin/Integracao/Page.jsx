import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconCheck,
    IconCloud,
    IconCopy,
    IconEdit,
    IconEye,
    IconEyeOff,
    IconLink,
    IconLinkOff,
    IconMail,
    IconMailCog,
    IconMailOpened,
    IconPlus,
    IconRefresh,
    IconServer,
    IconSettings,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const STATUS_MAP = {
    available: { label: 'Disponível', color: 'success' },
    assigned:  { label: 'Vinculado',  color: 'warning' },
    inactive:  { label: 'Inativo',    color: 'default' },
};

function getStatus(email) {
    if (!email.is_active) return 'inactive';
    if (email.client_profile_id) return 'assigned';
    return 'available';
}

function PasswordField({ label, name, value, onChange, helperText }) {
    const [show, setShow] = useState(false);
    return (
        <TextField
            fullWidth size="small" label={label} name={name}
            type={show ? 'text' : 'password'} value={value} onChange={onChange}
            helperText={helperText}
            InputProps={{ endAdornment: (
                <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShow(s => !s)} tabIndex={-1}>
                        {show ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                    </IconButton>
                </InputAdornment>
            )}}
        />
    );
}

// ── Exibição de senha (mostrar/ocultar + copiar) na tabela ────────────────
function PasswordCell({ value }) {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!value) return <Typography variant="caption" color="text.disabled">—</Typography>;

    function copy() {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    }

    return (
        <Stack direction="row" alignItems="center" gap={0.25}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', minWidth: 90 }}>
                {show ? value : '••••••••'}
            </Typography>
            <Tooltip title={show ? 'Ocultar senha' : 'Mostrar senha'}>
                <IconButton size="small" onClick={() => setShow(s => !s)}>
                    {show ? <IconEyeOff size={13} /> : <IconEye size={13} />}
                </IconButton>
            </Tooltip>
            <Tooltip title={copied ? 'Copiado!' : 'Copiar senha'}>
                <IconButton size="small" onClick={copy}>
                    <IconCopy size={13} />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}

// ── Geradores de usuário/senha "uniq" para contas via cPanel ──────────────
const PASSWORD_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';

function generatePassword(length = 16) {
    let pass = '';
    for (let i = 0; i < length; i++) {
        pass += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
    }
    return pass;
}

function generateLocalPart() {
    return 'fatura.' + Math.random().toString(36).slice(2, 8);
}

// ── Formulário de adicionar/editar email ─────────────────────────────────
function EmailFormDialog({ open, onClose, editTarget }) {
    const isEdit = !!editTarget;
    const form   = useForm({
        email:          editTarget?.email          ?? '',
        label:          editTarget?.label          ?? '',
        imap_password:  '',
        webmail_url:    editTarget?.webmail_url    ?? '',
        sender_filter:  editTarget?.sender_filter  ?? '',
        subject_filter: editTarget?.subject_filter ?? '',
        notes:          editTarget?.notes          ?? '',
        is_active:      editTarget?.is_active      ?? true,
    });

    function submit(e) {
        e.preventDefault();
        const url = isEdit
            ? safeRoute('admin.integracao.emails.update', editTarget.id)
            : safeRoute('admin.integracao.emails.store');
        const method = isEdit ? form.put : form.post;
        method(url, { preserveScroll: true, onSuccess: onClose });
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 900 }}>
                <Stack direction="row" alignItems="center" gap={1}>
                    <IconMail size={20} />
                    {isEdit ? 'Editar Email' : 'Adicionar Email ao Pool'}
                </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
                <Stack component="form" id="email-form" onSubmit={submit} spacing={2.5}>
                    {Object.keys(form.errors).length > 0 && (
                        <Alert severity="error">{Object.values(form.errors)[0]}</Alert>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                        <TextField
                            fullWidth size="small" label="Endereço de email *"
                            value={form.data.email} onChange={e => form.setData('email', e.target.value)}
                            error={!!form.errors.email} helperText={form.errors.email}
                            disabled={isEdit} type="email"
                            InputProps={{ startAdornment: <InputAdornment position="start"><IconMail size={15} style={{ opacity: 0.45 }} /></InputAdornment> }}
                        />
                        <TextField
                            fullWidth size="small" label="Nome amigável"
                            value={form.data.label} onChange={e => form.setData('label', e.target.value)}
                            helperText="Ex: Email fatura Curitiba"
                        />
                    </Stack>

                    <PasswordField
                        label={isEdit ? 'Nova senha do email (IMAP)' : 'Senha do email (IMAP) *'}
                        name="imap_password"
                        value={form.data.imap_password}
                        onChange={e => form.setData('imap_password', e.target.value)}
                        helperText={isEdit ? 'Deixe em branco para manter a senha atual.' : 'Senha desta conta de email no servidor IMAP.'}
                    />

                    <TextField
                        fullWidth size="small" label="Domínio do Webmail (Roundcube)"
                        value={form.data.webmail_url} onChange={e => form.setData('webmail_url', e.target.value)}
                        placeholder="webmail.casaverde.com.br"
                        helperText="Usado pelo botão 'Abrir Roundcube' na tabela de emails."
                    />

                    <Divider>
                        <Typography variant="caption" color="text.secondary">Filtros opcionais</Typography>
                    </Divider>

                    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                        <TextField
                            fullWidth size="small" label="Filtro por remetente (FROM)"
                            value={form.data.sender_filter} onChange={e => form.setData('sender_filter', e.target.value)}
                            placeholder="faturas@copel.com"
                        />
                        <TextField
                            fullWidth size="small" label="Filtro por assunto (SUBJECT)"
                            value={form.data.subject_filter} onChange={e => form.setData('subject_filter', e.target.value)}
                            placeholder="Fatura de Energia"
                        />
                    </Stack>

                    <TextField
                        fullWidth size="small" label="Observações"
                        value={form.data.notes} onChange={e => form.setData('notes', e.target.value)}
                        multiline rows={2}
                    />
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" color="inherit" startIcon={<IconX size={16} />} onClick={onClose} disabled={form.processing}>
                    Cancelar
                </Button>
                <Button type="submit" form="email-form" variant="contained" disabled={form.processing}
                    startIcon={form.processing ? <CircularProgress size={14} color="inherit" /> : <IconCheck size={16} />}>
                    {isEdit ? 'Salvar alterações' : 'Adicionar email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Formulário de criação de conta de email via cPanel ────────────────────
function CpanelEmailFormDialog({ open, onClose, cpanelConfigured, defaultDomain, defaultQuotaMb, defaultWebmailUrl }) {
    const form = useForm({
        domain:         defaultDomain ?? '',
        local_part:     '',
        password:       '',
        quota_mb:       defaultQuotaMb ?? 0,
        webmail_url:    defaultWebmailUrl ?? '',
        sender_filter:  '',
        subject_filter: '',
        notes:          '',
    });

    useEffect(() => {
        if (!open) return;
        form.setData(data => ({
            ...data,
            domain:      defaultDomain ?? '',
            quota_mb:    defaultQuotaMb ?? 0,
            webmail_url: defaultWebmailUrl ?? '',
        }));
    }, [open]);

    function submit(e) {
        e.preventDefault();
        form.post(safeRoute('admin.integracao.emails.cpanel-store'), {
            preserveScroll: true,
            onSuccess: () => { form.reset(); onClose(); },
        });
    }

    const previewEmail = (form.data.local_part && form.data.domain)
        ? `${form.data.local_part}@${form.data.domain}`
        : null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 900 }}>
                <Stack direction="row" alignItems="center" gap={1}>
                    <IconCloud size={20} />
                    Criar Conta de Email via cPanel
                </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
                <Stack component="form" id="cpanel-email-form" onSubmit={submit} spacing={2.5}>
                    {!cpanelConfigured && (
                        <Alert severity="warning">
                            Configure o acesso ao cPanel (host, usuário e token) antes de criar contas por aqui.
                        </Alert>
                    )}
                    {Object.keys(form.errors).length > 0 && (
                        <Alert severity="error">{Object.values(form.errors)[0]}</Alert>
                    )}

                    <Stack direction="row" gap={1} alignItems="flex-start">
                        <TextField
                            fullWidth size="small" label="Usuário do email"
                            value={form.data.local_part} onChange={e => form.setData('local_part', e.target.value)}
                            error={!!form.errors.local_part}
                            helperText={form.errors.local_part ?? 'Parte antes do @. Deixe em branco para gerar automaticamente.'}
                            placeholder="faturas"
                        />
                        <Button variant="outlined" size="small" startIcon={<IconRefresh size={14} />}
                            onClick={() => form.setData('local_part', generateLocalPart())}
                            sx={{ mt: '4px', whiteSpace: 'nowrap' }}>
                            Gerar
                        </Button>
                    </Stack>

                    <Stack direction="row" gap={1} alignItems="flex-start">
                        <Box sx={{ width: '100%' }}>
                            <PasswordField
                                label="Senha"
                                value={form.data.password}
                                onChange={e => form.setData('password', e.target.value)}
                                helperText={form.errors.password ?? 'Deixe em branco para gerar uma senha forte automaticamente.'}
                            />
                        </Box>
                        <Button variant="outlined" size="small" startIcon={<IconRefresh size={14} />}
                            onClick={() => form.setData('password', generatePassword())}
                            sx={{ mt: '4px', whiteSpace: 'nowrap' }}>
                            Gerar
                        </Button>
                    </Stack>

                    {previewEmail && (
                        <Alert severity="info" icon={<IconMail size={18} />}>
                            Conta a ser criada: <strong>{previewEmail}</strong>
                        </Alert>
                    )}

                    <Divider>
                        <Typography variant="caption" color="text.secondary">Filtros opcionais</Typography>
                    </Divider>

                    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                        <TextField
                            fullWidth size="small" label="Filtro por remetente (FROM)"
                            value={form.data.sender_filter} onChange={e => form.setData('sender_filter', e.target.value)}
                            placeholder="faturas@copel.com"
                        />
                        <TextField
                            fullWidth size="small" label="Filtro por assunto (SUBJECT)"
                            value={form.data.subject_filter} onChange={e => form.setData('subject_filter', e.target.value)}
                            placeholder="Fatura de Energia"
                        />
                    </Stack>

                    <TextField
                        fullWidth size="small" label="Observações"
                        value={form.data.notes} onChange={e => form.setData('notes', e.target.value)}
                        multiline rows={2}
                    />
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" color="inherit" startIcon={<IconX size={16} />} onClick={onClose} disabled={form.processing}>
                    Cancelar
                </Button>
                <Button type="submit" form="cpanel-email-form" variant="contained" disabled={form.processing || !cpanelConfigured}
                    startIcon={form.processing ? <CircularProgress size={14} color="inherit" /> : <IconCloud size={16} />}>
                    Criar conta no cPanel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Componente principal ──────────────────────────────────────────────────
export default function Page({ settings, emails, stats }) {
    const { flash } = usePage().props;

    // Form das configurações IMAP
    const imapForm = useForm({
        imap_default_host:       settings?.imap_default_host       ?? '',
        imap_default_port:       settings?.imap_default_port       ?? 993,
        imap_default_encryption: settings?.imap_default_encryption ?? 'ssl',
    });

    function submitImap(e) {
        e.preventDefault();
        imapForm.put(safeRoute('admin.integracao.settings.update'), { preserveScroll: true });
    }

    // Form das configurações do cPanel
    const cpanelForm = useForm({
        cpanel_host:             settings?.cpanel_host             ?? '',
        cpanel_port:             settings?.cpanel_port             ?? 2083,
        cpanel_username:         settings?.cpanel_username         ?? '',
        cpanel_email_domain:     settings?.cpanel_email_domain     ?? '',
        cpanel_default_quota_mb: settings?.cpanel_default_quota_mb ?? 0,
        cpanel_webmail_domain:   settings?.cpanel_webmail_domain   ?? '',
        cpanel_api_token:        '',
    });

    function submitCpanel(e) {
        e.preventDefault();
        cpanelForm.put(safeRoute('admin.integracao.cpanel-settings.update'), {
            preserveScroll: true,
            onSuccess: () => cpanelForm.setData('cpanel_api_token', ''),
        });
    }

    // Dialogs
    const [emailDialog, setEmailDialog] = useState(null); // null | 'add' | email object
    const [cpanelDialogOpen, setCpanelDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [unassignTarget, setUnassignTarget] = useState(null);

    const cpanelConfigured = !!(settings?.cpanel_host && settings?.cpanel_username && settings?.cpanel_email_domain && settings?.cpanel_token_configured);

    function doDelete() {
        router.delete(safeRoute('admin.integracao.emails.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function doUnassign() {
        router.post(safeRoute('admin.integracao.emails.unassign', unassignTarget.id), {}, {
            preserveScroll: true,
            onSuccess: () => setUnassignTarget(null),
        });
    }

    return (
        <Layout
            titlePage="Configurações de Integração"
            menu="integracoes"
            subMenu="config-integracao"
            subtitle="Gerencie o servidor IMAP e o pool de emails para importação de faturas."
            breadcrumbs={[{ label: 'Configurações' }, { label: 'Integração' }]}
        >
            <Head title="Configurações de Integração" />

            <Stack spacing={3}>
                {flash?.success && <Alert severity="success" icon={<IconCheck size={18} />}>{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error">{flash.error}</Alert>}

                {/* ── KPIs ───────────────────────────────────────────── */}
                <Grid container spacing={2}>
                    {[
                        { label: 'Total de emails',   value: stats.total,     color: 'text.primary' },
                        { label: 'Disponíveis',       value: stats.available, color: 'success.main' },
                        { label: 'Vinculados',        value: stats.assigned,  color: 'warning.main' },
                        { label: 'Inativos',          value: stats.inactive,  color: 'text.disabled' },
                    ].map(s => (
                        <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
                            <Card>
                                <CardContent sx={{ py: '12px !important' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                                        {s.label}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-0.05em', color: s.color }}>
                                        {s.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>

                    {/* ── Config IMAP + cPanel ─────────────────────────── */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack spacing={3}>
                            <Card>
                                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                                    <Stack direction="row" alignItems="center" gap={1.5}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconServer size={18} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.9375rem' }}>Servidor IMAP Padrão</Typography>
                                            <Typography variant="caption" color="text.secondary">Usado por todos os emails do pool</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                                <CardContent>
                                    <Box component="form" onSubmit={submitImap}>
                                        <Stack spacing={2}>
                                            <TextField
                                                fullWidth size="small" label="Servidor IMAP *"
                                                value={imapForm.data.imap_default_host}
                                                onChange={e => imapForm.setData('imap_default_host', e.target.value)}
                                                error={!!imapForm.errors.imap_default_host}
                                                helperText={imapForm.errors.imap_default_host ?? 'Ex: mail.casaverde.com.br'}
                                                placeholder="mail.casaverde.com.br"
                                            />
                                            <Stack direction="row" gap={1.5}>
                                                <TextField
                                                    size="small" label="Porta *" type="number"
                                                    value={imapForm.data.imap_default_port}
                                                    onChange={e => imapForm.setData('imap_default_port', Number(e.target.value))}
                                                    error={!!imapForm.errors.imap_default_port}
                                                    sx={{ width: 110 }}
                                                />
                                                <TextField
                                                    fullWidth select size="small" label="Criptografia *"
                                                    value={imapForm.data.imap_default_encryption}
                                                    onChange={e => imapForm.setData('imap_default_encryption', e.target.value)}
                                                    error={!!imapForm.errors.imap_default_encryption}
                                                >
                                                    <MenuItem value="ssl">SSL</MenuItem>
                                                    <MenuItem value="tls">TLS</MenuItem>
                                                    <MenuItem value="none">Nenhuma</MenuItem>
                                                </TextField>
                                            </Stack>

                                            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5, border: '1px solid', borderColor: 'grey.200' }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                    Estas configurações são usadas como padrão para conectar a todos os emails do pool.
                                                    A senha é individual por email — configure em cada conta do pool.
                                                </Typography>
                                            </Box>

                                            <Button type="submit" variant="contained" disabled={imapForm.processing}
                                                startIcon={imapForm.processing ? <CircularProgress size={14} color="inherit" /> : <IconCheck size={16} />}
                                                fullWidth>
                                                Salvar configurações IMAP
                                            </Button>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* ── Config cPanel ─────────────────────────── */}
                            <Card>
                                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                                    <Stack direction="row" alignItems="center" gap={1.5}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconCloud size={18} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.9375rem' }}>Acesso ao cPanel</Typography>
                                            <Typography variant="caption" color="text.secondary">Usado para criar contas de email automaticamente</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                                <CardContent>
                                    <Box component="form" onSubmit={submitCpanel}>
                                        <Stack spacing={2}>
                                            <TextField
                                                fullWidth size="small" label="Host / IP do servidor *"
                                                value={cpanelForm.data.cpanel_host}
                                                onChange={e => cpanelForm.setData('cpanel_host', e.target.value)}
                                                error={!!cpanelForm.errors.cpanel_host}
                                                helperText={cpanelForm.errors.cpanel_host ?? 'Ex: srv123.hostgator.com.br'}
                                                placeholder="srv123.hostgator.com.br"
                                            />
                                            <Stack direction="row" gap={1.5}>
                                                <TextField
                                                    size="small" label="Porta *" type="number"
                                                    value={cpanelForm.data.cpanel_port}
                                                    onChange={e => cpanelForm.setData('cpanel_port', Number(e.target.value))}
                                                    error={!!cpanelForm.errors.cpanel_port}
                                                    sx={{ width: 110 }}
                                                />
                                                <TextField
                                                    fullWidth size="small" label="Usuário cPanel *"
                                                    value={cpanelForm.data.cpanel_username}
                                                    onChange={e => cpanelForm.setData('cpanel_username', e.target.value)}
                                                    error={!!cpanelForm.errors.cpanel_username}
                                                />
                                            </Stack>

                                            <TextField
                                                fullWidth size="small" label="Domínio de Email *"
                                                value={cpanelForm.data.cpanel_email_domain}
                                                onChange={e => cpanelForm.setData('cpanel_email_domain', e.target.value)}
                                                error={!!cpanelForm.errors.cpanel_email_domain}
                                                helperText={cpanelForm.errors.cpanel_email_domain ?? 'Domínio usado para criar as contas de email via API (Ex: casaverde.com.br)'}
                                                placeholder="casaverde.com.br"
                                            />

                                            <TextField
                                                fullWidth size="small" type="number" label="Cota padrão (MB)"
                                                value={cpanelForm.data.cpanel_default_quota_mb}
                                                onChange={e => cpanelForm.setData('cpanel_default_quota_mb', Number(e.target.value))}
                                                error={!!cpanelForm.errors.cpanel_default_quota_mb}
                                                helperText={cpanelForm.errors.cpanel_default_quota_mb ?? 'Cota usada ao criar novas contas de email no cPanel. 0 = ilimitado.'}
                                            />

                                            <TextField
                                                fullWidth size="small" label="Domínio do Webmail (Roundcube)"
                                                value={cpanelForm.data.cpanel_webmail_domain}
                                                onChange={e => cpanelForm.setData('cpanel_webmail_domain', e.target.value)}
                                                error={!!cpanelForm.errors.cpanel_webmail_domain}
                                                helperText={cpanelForm.errors.cpanel_webmail_domain ?? "Usado pelo botão 'Abrir Roundcube' nas contas criadas via cPanel."}
                                                placeholder="webmail.casaverde.com.br"
                                            />

                                            <PasswordField
                                                label="Token de API (UAPI)"
                                                value={cpanelForm.data.cpanel_api_token}
                                                onChange={e => cpanelForm.setData('cpanel_api_token', e.target.value)}
                                                helperText={cpanelForm.errors.cpanel_api_token ?? (
                                                    settings?.cpanel_token_configured
                                                        ? 'Token salvo. Deixe em branco para manter o atual.'
                                                        : 'Token de acesso gerado em cPanel → Security → Manage API Tokens.'
                                                )}
                                            />

                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <Chip
                                                    size="small"
                                                    label={settings?.cpanel_token_configured ? 'Token configurado' : 'Token não configurado'}
                                                    color={settings?.cpanel_token_configured ? 'success' : 'default'}
                                                    icon={settings?.cpanel_token_configured ? <IconCheck size={14} /> : undefined}
                                                />
                                            </Stack>

                                            <Button type="submit" variant="contained" disabled={cpanelForm.processing}
                                                startIcon={cpanelForm.processing ? <CircularProgress size={14} color="inherit" /> : <IconCheck size={16} />}
                                                fullWidth>
                                                Salvar configurações do cPanel
                                            </Button>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* ── Pool de Emails ──────────────────────────────── */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Card>
                            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Stack direction="row" alignItems="center" gap={1.5}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconMailCog size={18} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.9375rem' }}>Pool de Emails</Typography>
                                        <Typography variant="caption" color="text.secondary">Emails cadastrados no servidor de email da plataforma</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" gap={1}>
                                    <Button
                                        variant="outlined" size="small"
                                        startIcon={<IconCloud size={16} />}
                                        onClick={() => setCpanelDialogOpen(true)}
                                    >
                                        Criar via cPanel
                                    </Button>
                                    <Button
                                        variant="contained" size="small"
                                        startIcon={<IconPlus size={16} />}
                                        onClick={() => setEmailDialog('add')}
                                    >
                                        Adicionar email
                                    </Button>
                                </Stack>
                            </Box>

                            <CardContent sx={{ p: 0 }}>
                                {emails.length === 0 ? (
                                    <Box sx={{ py: 5, textAlign: 'center' }}>
                                        <IconMail size={40} style={{ opacity: 0.2 }} />
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            Nenhum email cadastrado no pool.
                                        </Typography>
                                        <Button size="small" variant="outlined" sx={{ mt: 1.5 }} onClick={() => setEmailDialog('add')}>
                                            Adicionar primeiro email
                                        </Button>
                                    </Box>
                                ) : (
                                    <TableContainer sx={{ overflowX: 'auto' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Email / Label</TableCell>
                                                    <TableCell>Senha</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Cliente vinculado</TableCell>
                                                    <TableCell>Filtros</TableCell>
                                                    <TableCell align="right">Ações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {emails.map(email => {
                                                    const status = getStatus(email);
                                                    const st     = STATUS_MAP[status];
                                                    return (
                                                        <TableRow key={email.id} hover>
                                                            <TableCell>
                                                                <Stack direction="row" alignItems="center" gap={1}>
                                                                    <Avatar sx={{ width: 30, height: 30, fontSize: 11, bgcolor: status === 'available' ? 'success.main' : status === 'assigned' ? 'warning.main' : 'grey.400' }}>
                                                                        <IconMail size={14} />
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                                                            {email.email}
                                                                        </Typography>
                                                                        {email.label && (
                                                                            <Typography variant="caption" color="text.secondary">{email.label}</Typography>
                                                                        )}
                                                                    </Box>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <PasswordCell value={email.imap_password} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip label={st.label} color={st.color} size="small" />
                                                            </TableCell>
                                                            <TableCell>
                                                                {email.client_profile ? (
                                                                    <Stack>
                                                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                            {email.client_profile.nome ?? email.client_profile.razao_social ?? '—'}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {email.client_profile.client_code}
                                                                        </Typography>
                                                                    </Stack>
                                                                ) : (
                                                                    <Typography variant="caption" color="text.disabled">Livre</Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {(email.sender_filter || email.subject_filter) ? (
                                                                    <Stack spacing={0.2}>
                                                                        {email.sender_filter  && <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>FROM: {email.sender_filter}</Typography>}
                                                                        {email.subject_filter && <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>SUBJ: {email.subject_filter}</Typography>}
                                                                    </Stack>
                                                                ) : (
                                                                    <Typography variant="caption" color="text.disabled">—</Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Stack direction="row" gap={0.5} justifyContent="flex-end">
                                                                    <Tooltip title={email.webmail_url ? 'Abrir Roundcube' : 'Configure o domínio do webmail (editar email) para habilitar'}>
                                                                        <span>
                                                                            <IconButton
                                                                                size="small"
                                                                                component="a"
                                                                                href={email.webmail_url ? safeRoute('admin.integracao.emails.roundcube', email.id) : undefined}
                                                                                target="_blank" rel="noopener"
                                                                                disabled={!email.webmail_url}
                                                                                sx={{ borderRadius: 1.5, border: '1.5px solid', borderColor: 'grey.200' }}
                                                                            >
                                                                                <IconMailOpened size={14} />
                                                                            </IconButton>
                                                                        </span>
                                                                    </Tooltip>
                                                                    <Tooltip title="Editar">
                                                                        <IconButton size="small" onClick={() => setEmailDialog(email)}
                                                                            sx={{ borderRadius: 1.5, border: '1.5px solid', borderColor: 'grey.200' }}>
                                                                            <IconEdit size={14} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {email.client_profile_id && (
                                                                        <Tooltip title="Desvincular do cliente">
                                                                            <IconButton size="small" color="warning" onClick={() => setUnassignTarget(email)}
                                                                                sx={{ borderRadius: 1.5, border: '1.5px solid', borderColor: 'warning.main' }}>
                                                                                <IconLinkOff size={14} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}
                                                                    <Tooltip title="Excluir">
                                                                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(email)}
                                                                            sx={{ borderRadius: 1.5, border: '1.5px solid', borderColor: 'error.main' }}>
                                                                            <IconTrash size={14} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>

            {/* ── Dialog: Adicionar/Editar email ────────────────────── */}
            <EmailFormDialog
                open={!!emailDialog}
                onClose={() => setEmailDialog(null)}
                editTarget={emailDialog !== 'add' ? emailDialog : null}
            />

            {/* ── Dialog: Criar conta de email via cPanel ────────────── */}
            <CpanelEmailFormDialog
                open={cpanelDialogOpen}
                onClose={() => setCpanelDialogOpen(false)}
                cpanelConfigured={cpanelConfigured}
                defaultDomain={settings?.cpanel_email_domain}
                defaultQuotaMb={settings?.cpanel_default_quota_mb}
                defaultWebmailUrl={settings?.cpanel_webmail_domain}
            />

            {/* ── Dialog: Excluir email ──────────────────────────────── */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>Excluir Email</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography sx={{ mt: 1 }}>
                        Deseja excluir o email <strong>{deleteTarget?.email}</strong> do pool?
                    </Typography>
                    {deleteTarget?.client_profile_id && (
                        <Alert severity="error" sx={{ mt: 1.5 }}>
                            Este email está vinculado a um cliente. Desvincule primeiro para poder excluir.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={doDelete} disabled={!!deleteTarget?.client_profile_id}>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: Desvincular email ──────────────────────────── */}
            <Dialog open={!!unassignTarget} onClose={() => setUnassignTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>Desvincular Email</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography sx={{ mt: 1 }}>
                        Deseja desvincular o email <strong>{unassignTarget?.email}</strong> do cliente{' '}
                        <strong>{unassignTarget?.client_profile?.nome ?? unassignTarget?.client_profile?.razao_social}</strong>?
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 1.5 }}>
                        A importação automática deste cliente será desativada até que um novo email seja vinculado.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setUnassignTarget(null)}>Cancelar</Button>
                    <Button variant="contained" color="warning" onClick={doUnassign}>Desvincular</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

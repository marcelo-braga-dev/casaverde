import { useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconCheck,
    IconDeviceFloppy,
    IconEye,
    IconEyeOff,
    IconInfoCircle,
    IconMail,
    IconMailCog,
} from '@tabler/icons-react';
import { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

function PasswordField({ label, value, onChange, helperText }) {
    const [show, setShow] = useState(false);
    return (
        <TextField
            fullWidth size="small" label={label}
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

const ClientEmailImportSettingForm = ({
    profile,
    concessionarias = [],
    setting          = null,
    availableEmails  = [],   // emails livres do pool
}) => {
    // O email atual do cliente (pode estar vinculado e "indisponível" no pool)
    const currentAccountId = setting?.import_email_account_id ?? '';
    const currentAccount   = setting?.email_account ?? null;

    // Lista para o select: emails disponíveis + o atual (se existir)
    const emailOptions = [
        ...(currentAccount && currentAccountId
            ? [{ id: currentAccountId, email: currentAccount.email, label: currentAccount.label }]
            : []),
        ...availableEmails.filter(e => e.id !== currentAccountId),
    ];

    const { data, setData, post, processing, errors } = useForm({
        client_profile_id:       profile?.id ?? '',
        import_email_account_id: currentAccountId,
        concessionaria_id:       setting?.concessionaria_id ?? '',
        pdf_password:            '',
        sender_filter:           setting?.sender_filter  ?? '',
        subject_filter:          setting?.subject_filter ?? '',
        is_active:               setting?.is_active ?? true,
    });

    function submit(e) {
        e.preventDefault();
        post(safeRoute('consultor.user.cliente.email-import-setting.store'), {
            preserveScroll: true,
        });
    }

    const selectedEmail = emailOptions.find(e => e.id === data.import_email_account_id);

    return (
        <Card sx={{ mb: 4 }}>
            <Box sx={{ px: 2.5, py: 1.8, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <IconMailCog size={18} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Configuração de Importação por Email</Typography>
                    <Typography variant="caption" color="text.secondary">Importação automática de faturas da concessionária</Typography>
                </Box>
                {setting?.is_active && (
                    <Chip label="Ativa" color="success" size="small" icon={<IconCheck size={12} />} sx={{ ml: 'auto' }} />
                )}
            </Box>

            <CardContent>
                <form onSubmit={submit}>
                    <Grid container spacing={2.5}>

                        {/* Email do pool */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth select size="small"
                                label="Email de recebimento de faturas"
                                value={data.import_email_account_id}
                                onChange={e => setData('import_email_account_id', e.target.value)}
                                error={!!errors.import_email_account_id}
                                helperText={errors.import_email_account_id ?? 'Selecione o email que receberá as faturas desta concessionária.'}
                            >
                                <MenuItem value="">— Não configurado —</MenuItem>
                                {emailOptions.map(email => (
                                    <MenuItem key={email.id} value={email.id}>
                                        <Stack direction="row" alignItems="center" gap={1}>
                                            <IconMail size={14} style={{ opacity: 0.6 }} />
                                            <span>{email.email}</span>
                                            {email.label && (
                                                <Typography variant="caption" color="text.secondary">· {email.label}</Typography>
                                            )}
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </TextField>

                            {availableEmails.length === 0 && !currentAccountId && (
                                <Alert severity="warning" sx={{ mt: 1, py: 0.5 }}>
                                    Nenhum email disponível no pool. Peça ao administrador para adicionar emails em <strong>Configurações → Integração</strong>.
                                </Alert>
                            )}
                        </Grid>

                        {/* Concessionária */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth select size="small"
                                label="Concessionária"
                                value={data.concessionaria_id}
                                onChange={e => setData('concessionaria_id', e.target.value)}
                                error={!!errors.concessionaria_id}
                                helperText={errors.concessionaria_id}
                            >
                                <MenuItem value="">— Selecione —</MenuItem>
                                {concessionarias.map(c => (
                                    <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Senha do PDF */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <PasswordField
                                label="Senha para desbloquear PDF"
                                value={data.pdf_password}
                                onChange={e => setData('pdf_password', e.target.value)}
                                helperText={setting ? 'Preencha apenas se quiser alterar a senha do PDF.' : 'Senha usada para desbloquear o PDF da fatura (se protegido).'}
                            />
                        </Grid>

                        {/* Filtros avançados */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth size="small" label="Filtro de remetente (avançado)"
                                value={data.sender_filter}
                                onChange={e => setData('sender_filter', e.target.value)}
                                placeholder="faturas@copel.com.br"
                                helperText="Filtra emails pelo campo FROM. Deixe em branco para buscar todos."
                            />
                        </Grid>

                        {/* Status */}
                        <Grid size={12}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between"
                                sx={{ bgcolor: data.is_active ? 'success.50' : 'grey.50', border: '1px solid', borderColor: data.is_active ? 'success.200' : 'grey.200', borderRadius: 2, px: 2, py: 1.2 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Importação automática
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {data.is_active
                                            ? 'Ativa — o sistema verificará novos emails automaticamente.'
                                            : 'Desativada — nenhuma importação será executada.'}
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={<Switch checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} color="success" />}
                                    label={data.is_active ? 'Ativa' : 'Desativada'}
                                    sx={{ m: 0 }}
                                />
                            </Stack>
                        </Grid>

                        {/* Info do servidor IMAP */}
                        <Grid size={12}>
                            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5, border: '1px dashed', borderColor: 'grey.300', display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <IconInfoCircle size={16} style={{ opacity: 0.5, flexShrink: 0, marginTop: 1 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    As configurações do servidor IMAP (host, porta, criptografia e senha do email) são gerenciadas pelo administrador em{' '}
                                    <strong>Configurações → Configurações de Integração</strong>.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={processing ? null : <IconDeviceFloppy size={17} />}
                                disabled={processing}
                            >
                                Salvar configuração de importação
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default ClientEmailImportSettingForm;

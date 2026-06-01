import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, useForm, usePage } from '@inertiajs/react';
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
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconCalendar,
    IconCheck,
    IconEye,
    IconEyeOff,
    IconKey,
    IconMail,
    IconShield,
    IconUser,
    IconUserCircle,
} from '@tabler/icons-react';
import { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

// ── Mapas ────────────────────────────────────────────────────────────────

const ROLE_MAP = {
    admin:     { label: 'Administrador',       color: '#7c3aed', bg: '#ede9fe' },
    consultor: { label: 'Consultor Comercial', color: '#1d4ed8', bg: '#dbeafe' },
    produtor:  { label: 'Produtor Solar',      color: '#047857', bg: '#d1fae5' },
    cliente:   { label: 'Cliente',             color: '#b45309', bg: '#fef3c7' },
};

const STATUS_MAP = {
    '1':                    { label: 'Ativo',                    color: 'success' },
    '0':                    { label: 'Bloqueado',                color: 'error' },
    'novo':                 { label: 'Aguardando Análise',       color: 'warning' },
    'documentacao-aprovada':{ label: 'Documentação Aprovada',    color: 'info' },
    'assinar_contrato':     { label: 'Assinar Contrato',         color: 'info' },
};

// ── Helpers ───────────────────────────────────────────────────────────────

function initials(name = '') {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

function PasswordField({ label, name, value, onChange, error }) {
    const [show, setShow] = useState(false);
    return (
        <TextField
            fullWidth
            size="small"
            label={label}
            name={name}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShow(s => !s)} tabIndex={-1}>
                            {show ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}

function SectionCard({ icon: Icon, title, subtitle, color = 'var(--cv-gradient-primary)', children }) {
    return (
        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2.5 }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: 2, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        <Icon size={19} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.2 }}>{title}</Typography>
                        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>{subtitle}</Typography>}
                    </Box>
                </Stack>
                <Divider sx={{ mb: 2.5 }} />
                {children}
            </CardContent>
        </Card>
    );
}

function InfoRow({ label, value, icon: Icon }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" py={0.8}>
            <Stack direction="row" alignItems="center" gap={1}>
                {Icon && <Icon size={14} style={{ opacity: 0.45 }} />}
                <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value ?? '—'}</Typography>
        </Stack>
    );
}

// ── Componente principal ──────────────────────────────────────────────────

export default function Page({ user, extra }) {
    const { flash } = usePage().props;

    const role = ROLE_MAP[user?.role_name] ?? { label: user?.role_name ?? '—', color: '#6b7280', bg: '#f3f4f6' };
    const st   = STATUS_MAP[user?.status] ?? { label: user?.status ?? '—', color: 'default' };

    // Apenas admin e consultor podem alterar nome/email pelo perfil
    const canEditInfo = user?.role_id === 1 || user?.role_id === 2;

    // ── Form: informações pessoais ───────────────────────────────────────
    const info = useForm({
        name:  user?.name  ?? '',
        email: user?.email ?? '',
    });

    function submitInfo(e) {
        e.preventDefault();
        info.put(safeRoute('auth.perfil.usuario.update-info'), { preserveScroll: true });
    }

    // ── Form: senha ──────────────────────────────────────────────────────
    const pwd = useForm({
        password:              '',
        password_confirmation: '',
    });

    function submitPassword(e) {
        e.preventDefault();
        pwd.put(safeRoute('auth.perfil.usuario.update-password'), {
            preserveScroll: true,
            onSuccess: () => pwd.reset(),
        });
    }

    // ── Render ───────────────────────────────────────────────────────────
    return (
        <Layout
            titlePage="Meu Perfil"
            menu="perfil"
            subMenu="perfil-usuario"
            subtitle="Gerencie suas informações e segurança da conta."
            breadcrumbs={[{ label: 'Configurações' }, { label: 'Meu Perfil' }]}
        >
            <Head title="Meu Perfil" />

            <Stack spacing={3}>

                {/* ── Flash messages ────────────────────────────────────── */}
                {flash?.success && (
                    <Alert severity="success" icon={<IconCheck size={18} />} onClose={() => {}}>
                        {flash.success}
                    </Alert>
                )}
                {flash?.success_senha && (
                    <Alert severity="success" icon={<IconKey size={18} />} onClose={() => {}}>
                        {flash.success_senha}
                    </Alert>
                )}

                <Grid container spacing={3}>

                    {/* ── Coluna esquerda: cartão de identidade ───────────── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>

                            {/* Avatar card */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)', textAlign: 'center' }}>
                                <CardContent sx={{ py: 4 }}>
                                    <Avatar
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            mx: 'auto',
                                            mb: 2,
                                            fontSize: 32,
                                            fontWeight: 950,
                                            background: 'var(--cv-gradient-primary)',
                                            boxShadow: 'var(--cv-shadow-primary)',
                                        }}
                                    >
                                        {initials(user?.name)}
                                    </Avatar>

                                    <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                        {user?.name}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                        {user?.email}
                                    </Typography>

                                    <Stack direction="row" gap={1} justifyContent="center" sx={{ mt: 2 }}>
                                        <Chip
                                            label={role.label}
                                            size="small"
                                            sx={{ bgcolor: role.bg, color: role.color, fontWeight: 800 }}
                                        />
                                        <Chip
                                            label={st.label}
                                            color={st.color}
                                            size="small"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Metadados */}
                            <SectionCard icon={IconCalendar} title="Dados da Conta" subtitle="Informações geradas pelo sistema">
                                <Stack spacing={0} divider={<Divider />}>
                                    <InfoRow label="ID do usuário"   value={`#${user?.id}`} />
                                    <InfoRow label="Cadastrado em"   value={user?.cadastrado_em} icon={IconCalendar} />
                                    <InfoRow label="E-mail verificado" value={user?.email_verified_at ?? 'Não verificado'} icon={IconMail} />
                                    {user?.consultor && (
                                        <InfoRow label="Consultor responsável" value={user.consultor.name} icon={IconUser} />
                                    )}
                                </Stack>
                            </SectionCard>

                            {/* Stats do role */}
                            {extra?.stats?.length > 0 && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: role.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconUserCircle size={18} style={{ color: role.color }} />
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                                                {extra?.label}
                                            </Typography>
                                        </Stack>
                                        <Divider sx={{ mb: 1.5 }} />
                                        <Grid container spacing={1.5}>
                                            {extra.stats.map(s => (
                                                <Grid key={s.label} size={{ xs: 6 }}>
                                                    <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em', color: role.color }}>
                                                            {s.value}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {s.label}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>

                    {/* ── Coluna direita: formulários ──────────────────────── */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={3}>

                            {/* Informações pessoais — apenas admin e consultor */}
                            {canEditInfo && <SectionCard
                                icon={IconUser}
                                title="Informações Pessoais"
                                subtitle="Altere seu nome e e-mail de acesso."
                            >
                                <Box component="form" onSubmit={submitInfo}>
                                    <Stack spacing={2}>
                                        {info.errors.name && (
                                            <Alert severity="error" sx={{ py: 0.5 }}>{info.errors.name}</Alert>
                                        )}
                                        {info.errors.email && (
                                            <Alert severity="error" sx={{ py: 0.5 }}>{info.errors.email}</Alert>
                                        )}

                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Nome completo"
                                            value={info.data.name}
                                            onChange={e => info.setData('name', e.target.value)}
                                            error={!!info.errors.name}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconUser size={16} style={{ opacity: 0.45 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="E-mail"
                                            type="email"
                                            value={info.data.email}
                                            onChange={e => info.setData('email', e.target.value)}
                                            error={!!info.errors.email}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconMail size={16} style={{ opacity: 0.45 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={info.processing}
                                                startIcon={info.processing ? <CircularProgress size={14} color="inherit" /> : <IconCheck size={16} />}
                                            >
                                                Salvar informações
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </SectionCard>}

                            {/* Para cliente/produtor: aviso sobre quem pode alterar nome/email */}
                            {!canEditInfo && (
                                <Alert severity="info" sx={{ borderRadius: 2 }}>
                                    Para alterar seu nome ou e-mail de cadastro, entre em contato com seu consultor responsável.
                                </Alert>
                            )}

                            {/* Segurança / Senha */}
                            <SectionCard
                                icon={IconShield}
                                title="Segurança"
                                subtitle="Defina uma nova senha para sua conta. Nenhuma senha anterior é necessária."
                                color="linear-gradient(135deg,#7c3aed,#5b21b6)"
                            >
                                <Box component="form" onSubmit={submitPassword}>
                                    <Stack spacing={2}>
                                        {pwd.errors.password && (
                                            <Alert severity="error" sx={{ py: 0.5 }}>{pwd.errors.password}</Alert>
                                        )}
                                        {pwd.errors.password_confirmation && (
                                            <Alert severity="error" sx={{ py: 0.5 }}>{pwd.errors.password_confirmation}</Alert>
                                        )}

                                        {/* Dicas de senha */}
                                        <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                A senha deve ter <strong>mínimo 6 caracteres</strong>, contendo <strong>letras e números</strong>.
                                            </Typography>
                                        </Box>

                                        <PasswordField
                                            label="Nova senha"
                                            name="password"
                                            value={pwd.data.password}
                                            onChange={e => pwd.setData('password', e.target.value)}
                                            error={pwd.errors.password}
                                        />

                                        <PasswordField
                                            label="Confirmar nova senha"
                                            name="password_confirmation"
                                            value={pwd.data.password_confirmation}
                                            onChange={e => pwd.setData('password_confirmation', e.target.value)}
                                            error={pwd.errors.password_confirmation}
                                        />

                                        {/* Barra de força da senha */}
                                        {pwd.data.password.length > 0 && (
                                            <PasswordStrengthBar password={pwd.data.password} />
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={pwd.processing || !pwd.data.password || !pwd.data.password_confirmation}
                                                startIcon={pwd.processing ? <CircularProgress size={14} color="inherit" /> : <IconKey size={16} />}
                                                sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#5b21b6' } }}
                                            >
                                                Alterar senha
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </SectionCard>

                            {/* Informações de acesso (readonly) */}
                            <SectionCard
                                icon={IconShield}
                                title="Informações de Acesso"
                                subtitle="Dados do sistema — somente leitura."
                                color="linear-gradient(135deg,#374151,#111827)"
                            >
                                <Grid container spacing={2}>
                                    {[
                                        { label: 'Perfil de acesso', value: role.label },
                                        { label: 'Status da conta',  value: st.label },
                                        { label: 'ID do sistema',    value: `#${user?.id}` },
                                        { label: 'Cadastrado em',    value: user?.cadastrado_em },
                                    ].map(item => (
                                        <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                                            <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                                    {item.label}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                                    {item.value ?? '—'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </SectionCard>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

// ── Barra de força da senha ───────────────────────────────────────────────

function PasswordStrengthBar({ password }) {
    const strength = getStrength(password);
    const colors   = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels   = ['Muito fraca', 'Fraca', 'Boa', 'Forte'];
    const color    = colors[strength - 1] ?? '#e5e7eb';
    const label    = labels[strength - 1] ?? '';

    return (
        <Box>
            <Stack direction="row" gap={0.5} sx={{ mb: 0.5 }}>
                {[1, 2, 3, 4].map(i => (
                    <Box key={i} sx={{
                        flex: 1,
                        height: 5,
                        borderRadius: 1,
                        bgcolor: i <= strength ? color : 'grey.200',
                        transition: 'background-color 200ms',
                    }} />
                ))}
            </Stack>
            <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
                {label}
            </Typography>
        </Box>
    );
}

function getStrength(password) {
    let score = 0;
    if (password.length >= 6)  score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.max(1, Math.min(4, score));
}

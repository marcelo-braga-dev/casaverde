import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { IconArrowLeft, IconEye, IconEyeOff, IconMail, IconShield, IconUser, IconUserCog } from '@tabler/icons-react';
import { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

export default function Page() {
    const [showPwd, setShowPwd]     = useState(false);
    const [showConf, setShowConf]   = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        status:                '1',
    });

    function submit(e) {
        e.preventDefault();
        post(safeRoute('admin.user.admin.store'));
    }

    return (
        <Layout
            titlePage="Novo Administrador"
            menu="admin"
            subMenu="admin-cadastrar"
            breadcrumbs={[{ label: 'Admin' }, { label: 'Administradores', href: safeRoute('admin.user.admin.index') }, { label: 'Novo' }]}
        >
            <Head title="Novo Administrador" />

            <Stack spacing={3} sx={{ maxWidth: 680, mx: 'auto' }}>
                <Button component={Link} href={safeRoute('admin.user.admin.index')} startIcon={<IconArrowLeft size={16} />} variant="text" size="small" sx={{ alignSelf: 'flex-start' }}>
                    Voltar
                </Button>

                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2.5 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <IconUserCog size={20} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Novo Administrador</Typography>
                                <Typography variant="body2" color="text.secondary">Apenas administradores podem criar outras contas admin.</Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Box component="form" onSubmit={submit}>
                            <Stack spacing={2.5}>
                                {Object.keys(errors).length > 0 && (
                                    <Alert severity="error">{Object.values(errors)[0]}</Alert>
                                )}

                                <TextField
                                    fullWidth label="Nome completo *"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={!!errors.name} helperText={errors.name}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><IconUser size={16} style={{ opacity: 0.45 }} /></InputAdornment> }}
                                />

                                <TextField
                                    fullWidth label="E-mail *" type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={!!errors.email} helperText={errors.email}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><IconMail size={16} style={{ opacity: 0.45 }} /></InputAdornment> }}
                                />

                                <TextField
                                    fullWidth select label="Status *"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    error={!!errors.status} helperText={errors.status}
                                >
                                    <MenuItem value="1">Ativo</MenuItem>
                                    <MenuItem value="0">Bloqueado</MenuItem>
                                </TextField>

                                <Divider>
                                    <Typography variant="caption" color="text.secondary">Senha de acesso</Typography>
                                </Divider>

                                <TextField
                                    fullWidth label="Senha *"
                                    type={showPwd ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password ?? 'Mínimo 6 caracteres com letras e números.'}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><IconShield size={16} style={{ opacity: 0.45 }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPwd(s => !s)} tabIndex={-1}>{showPwd ? <IconEyeOff size={16} /> : <IconEye size={16} />}</IconButton></InputAdornment>,
                                    }}
                                />

                                <TextField
                                    fullWidth label="Confirmar senha *"
                                    type={showConf ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    error={!!errors.password_confirmation}
                                    helperText={errors.password_confirmation}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><IconShield size={16} style={{ opacity: 0.45 }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowConf(s => !s)} tabIndex={-1}>{showConf ? <IconEyeOff size={16} /> : <IconEye size={16} />}</IconButton></InputAdornment>,
                                    }}
                                />

                                <Divider />

                                <Stack direction="row" justifyContent="flex-end" gap={1.5}>
                                    <Button component={Link} href={safeRoute('admin.user.admin.index')} variant="outlined" color="inherit">Cancelar</Button>
                                    <Button
                                        type="submit" variant="contained"
                                        disabled={processing || !data.name || !data.email || !data.password}
                                        sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#5b21b6' } }}
                                        startIcon={processing ? <CircularProgress size={14} color="inherit" /> : <IconUserCog size={16} />}
                                    >
                                        Criar administrador
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

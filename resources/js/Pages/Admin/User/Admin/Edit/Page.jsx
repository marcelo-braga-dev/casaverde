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
import { IconArrowLeft, IconCheck, IconEye, IconEyeOff, IconMail, IconShield, IconUser, IconUserCog } from '@tabler/icons-react';
import { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

export default function Page({ admin }) {
    const [showPwd,  setShowPwd]  = useState(false);
    const [showConf, setShowConf] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name:                  admin?.name  ?? '',
        email:                 admin?.email ?? '',
        status:                String(admin?.status ?? '1'),
        password:              '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        put(safeRoute('admin.user.admin.update', admin?.id));
    }

    return (
        <Layout
            titlePage={`Editar: ${admin?.name}`}
            menu="admin"
            subMenu="admin-cadastrados"
            breadcrumbs={[
                { label: 'Admin' },
                { label: 'Administradores', href: safeRoute('admin.user.admin.index') },
                { label: admin?.name ?? 'Editar', href: safeRoute('admin.user.admin.show', admin?.id) },
                { label: 'Editar' },
            ]}
        >
            <Head title={`Editar ${admin?.name}`} />

            <Stack spacing={3} sx={{ maxWidth: 680, mx: 'auto' }}>
                <Button component={Link} href={safeRoute('admin.user.admin.show', admin?.id)} startIcon={<IconArrowLeft size={16} />} variant="text" size="small" sx={{ alignSelf: 'flex-start' }}>
                    Voltar
                </Button>

                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2.5 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <IconUserCog size={20} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>Editar Administrador</Typography>
                                <Typography variant="body2" color="text.secondary">Altere os dados da conta de <strong>{admin?.name}</strong>.</Typography>
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
                                    error={!!errors.status}
                                >
                                    <MenuItem value="1">Ativo</MenuItem>
                                    <MenuItem value="0">Bloqueado</MenuItem>
                                </TextField>

                                <Divider>
                                    <Typography variant="caption" color="text.secondary">
                                        Alterar senha (deixe em branco para manter a atual)
                                    </Typography>
                                </Divider>

                                <TextField
                                    fullWidth label="Nova senha"
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
                                    fullWidth label="Confirmar nova senha"
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
                                    <Button component={Link} href={safeRoute('admin.user.admin.show', admin?.id)} variant="outlined" color="inherit">Cancelar</Button>
                                    <Button
                                        type="submit" variant="contained"
                                        disabled={processing || !data.name || !data.email}
                                        sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                                        startIcon={processing ? <CircularProgress size={14} color="inherit" /> : <IconCheck size={16} />}
                                    >
                                        Salvar alterações
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

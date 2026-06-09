import {router, useForm, usePage} from '@inertiajs/react';
import {
    Alert,
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
import {
    IconCheck,
    IconDeviceFloppy,
    IconEye,
    IconEyeOff,
    IconKey,
    IconLock,
    IconLockOpen,
    IconMail,
    IconShield,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import {useState} from 'react';

function safeRoute(n, p) {
    try {
        return route(n, p);
    } catch {
        return '#';
    }
}

const STATUS_LABEL = {
    '1': {label: 'Ativo', color: 'success'},
    '0': {label: 'Bloqueado', color: 'error'},
};

export default function PlataformaAcessoForm({
                                                 platformUser,       // objeto User ou null
                                                 storeRoute,         // nome da rota para criar/atualizar (ex: 'admin.acesso.cliente.store')
                                                 storeRouteParam,    // parâmetro da rota (ex: clienteId)
                                                 entityName = 'Usuário',
                                             }) {
    const {auth} = usePage().props;
    const isAdmin = auth?.user?.role_id === 1;

    const [showPwd, setShowPwd] = useState(false);
    const [blocking, setBlocking] = useState(false);

    const hasAccess = !!platformUser;
    const isBlocked = String(platformUser?.status) === '0';
    const st = STATUS_LABEL[String(platformUser?.status)] ?? {label: platformUser?.status ?? '—', color: 'default'};

    const {data, setData, post, processing, errors} = useForm({
        name: platformUser?.name ?? '',
        email: platformUser?.email ?? '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post(safeRoute(storeRoute, storeRouteParam), {preserveScroll: true});
    }

    function toggleBlock() {
        setBlocking(true);
        const routeName = isBlocked ? 'admin.acesso.liberar' : 'admin.acesso.bloquear';
        router.post(safeRoute(routeName, platformUser?.id), {}, {
            preserveScroll: true,
            onFinish: () => setBlocking(false),
        });
    }

    if (!isAdmin) {
        return;
    }

    return (
        <Card>
            <Box sx={{
                px: 2.5,
                py: 1.8,
                borderBottom: '1px solid',
                borderColor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5
            }}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    <Box sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                    }}>
                        <IconShield size={17}/>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{fontWeight: 800}}>
                            Acesso à Plataforma
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {hasAccess ? `Usuário: ${platformUser?.email}` : `${entityName} sem acesso cadastrado`}
                        </Typography>
                    </Box>
                </Stack>

                {hasAccess && (
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Chip label={st.label} color={st.color} size="small"/>
                        <Tooltip title={isBlocked ? 'Liberar acesso' : 'Bloquear acesso'}>
                            <Button
                                size="small"
                                variant="outlined"
                                color={isBlocked ? 'success' : 'error'}
                                startIcon={blocking
                                    ? <CircularProgress size={13} color="inherit"/>
                                    : isBlocked ? <IconLockOpen size={15}/> : <IconLock size={15}/>
                                }
                                onClick={toggleBlock}
                                disabled={blocking}
                            >
                                {isBlocked ? 'Liberar' : 'Bloquear'}
                            </Button>
                        </Tooltip>
                    </Stack>
                )}
            </Box>

            <CardContent>
                <Box component="form" onSubmit={submit}>
                    <Stack spacing={2.5}>
                        {Object.keys(errors).length > 0 && (
                            <Alert severity="error">{Object.values(errors)[0]}</Alert>
                        )}

                        {/* Info do usuário existente */}
                        {hasAccess && (
                            <Box sx={{bgcolor: 'grey.50', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'grey.200'}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack spacing={0.3}>
                                        <Typography variant="caption" color="text.secondary" sx={{fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                            Conta atual
                                        </Typography>
                                        <Typography variant="body2" sx={{fontWeight: 700}}>{platformUser?.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{platformUser?.email}</Typography>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        ID #{platformUser?.id}
                                    </Typography>
                                </Stack>
                            </Box>
                        )}

                        <Stack direction={{xs: 'column', sm: 'row'}} gap={2}>
                            <TextField
                                fullWidth size="small" label="Nome completo *"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={!!errors.name} helperText={errors.name}
                                InputProps={{startAdornment: <InputAdornment position="start"><IconUser size={15} style={{opacity: 0.45}}/></InputAdornment>}}
                            />
                            <TextField
                                fullWidth size="small" label="E-mail de acesso *"
                                type="email" value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={!!errors.email} helperText={errors.email}
                                InputProps={{startAdornment: <InputAdornment position="start"><IconMail size={15} style={{opacity: 0.45}}/></InputAdornment>}}
                            />
                        </Stack>

                        <TextField
                            fullWidth size="small"
                            label={hasAccess ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}
                            type={showPwd ? 'text' : 'password'}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password ?? (hasAccess ? 'Mínimo 6 caracteres com letras e números.' : undefined)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><IconKey size={15} style={{opacity: 0.45}}/></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setShowPwd(s => !s)} tabIndex={-1}>
                                            {showPwd ? <IconEyeOff size={15}/> : <IconEye size={15}/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Divider/>

                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button
                                type="submit" variant="contained"
                                disabled={processing || !data.name || !data.email || (!hasAccess && !data.password)}
                                startIcon={processing ? <CircularProgress size={14} color="inherit"/> : <IconDeviceFloppy size={16}/>}
                                sx={{bgcolor: '#7c3aed', '&:hover': {bgcolor: '#5b21b6'}}}
                            >
                                {hasAccess ? 'Atualizar credenciais' : `Criar acesso para ${entityName}`}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    ButtonBase,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Snackbar,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    IconArrowDown,
    IconBuildingFactory2,
    IconChevronDown,
    IconChevronUp,
    IconFlask,
    IconLock,
    IconLogout,
    IconShieldCheck,
    IconUser,
    IconUserStar,
} from '@tabler/icons-react';
import { DEMO_BLOCKED_EVENT } from '@/Demo/demoGuard';

const ROLE_META = {
    admin: { icon: IconShieldCheck },
    consultor: { icon: IconUserStar },
    cliente: { icon: IconUser },
    produtor: { icon: IconBuildingFactory2 },
};

const BLOCKED_MESSAGE = 'Acesso de teste: criar, editar e excluir estão desativados nesta demonstração.';
const AMBER = '#F59E0B';

function readSession(key) {
    try { return window.sessionStorage.getItem(key); } catch { return null; }
}

function writeSession(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch { /* sem armazenamento: só não lembra */ }
}

export default function DemoBar() {
    const { demo, auth, flash } = usePage().props;
    const dockRef = useRef(null);
    const [blocked, setBlocked] = useState(false);
    const [switching, setSwitching] = useState(null);
    const [minimized, setMinimized] = useState(() => readSession('demo-dock-min') === '1');
    const [welcome, setWelcome] = useState(() => readSession('demo-welcome-seen') !== '1');

    const active = Boolean(demo?.enabled && auth?.user);

    useEffect(() => {
        const show = () => setBlocked(true);
        window.addEventListener(DEMO_BLOCKED_EVENT, show);
        return () => window.removeEventListener(DEMO_BLOCKED_EVENT, show);
    }, []);

    useEffect(() => {
        if (flash?.warning) setBlocked(true);
    }, [flash?.warning]);

    // A altura do painel vira espaço reservado na página e no menu lateral.
    useLayoutEffect(() => {
        const root = document.documentElement;
        if (!active || !dockRef.current) {
            root.style.removeProperty('--cv-demo-dock');
            document.body.style.paddingBottom = '';
            return undefined;
        }
        const apply = () => {
            const height = Math.ceil(dockRef.current?.getBoundingClientRect().height ?? 0);
            root.style.setProperty('--cv-demo-dock', `${height}px`);
            document.body.style.paddingBottom = `${height + 8}px`;
        };
        apply();
        const observer = new ResizeObserver(apply);
        observer.observe(dockRef.current);
        return () => observer.disconnect();
    }, [active, minimized]);

    if (!active) return null;

    const currentRole = demo.roles.find((role) => role.key === demo.role);

    const switchTo = (role) => {
        if (role === demo.role || switching) return;
        setSwitching(role);
        router.post(route('demo.switch', role), {}, { onFinish: () => setSwitching(null) });
    };

    const toggleMinimized = () => {
        const next = !minimized;
        setMinimized(next);
        writeSession('demo-dock-min', next ? '1' : '0');
    };

    const closeWelcome = () => {
        setWelcome(false);
        writeSession('demo-welcome-seen', '1');
    };

    const firstName = (demo.visitor?.name || '').split(' ')[0];

    return (
        <>
            <Box
                ref={dockRef}
                data-demo-allow
                role="region"
                aria-label="Modo demonstração: troca de perfil"
                sx={{
                    position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1400,
                    bgcolor: '#0B1220', color: '#fff',
                    borderTop: `4px solid ${AMBER}`,
                    boxShadow: '0 -10px 30px rgba(11,18,32,0.35)',
                    pb: 'env(safe-area-inset-bottom, 0px)',
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap={{ xs: 'wrap', md: 'nowrap' }}
                    gap={{ xs: 1, md: 2 }}
                    sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 1.5, md: 3 }, py: 1.25 }}
                >
                    {/* Identificação do modo */}
                    <Stack direction="row" alignItems="center" gap={1.25} sx={{ flexShrink: 0, mr: { md: 1 } }}>
                        <Box sx={{ bgcolor: AMBER, color: '#111827', borderRadius: 1.5, px: 1.1, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.6 }}>
                            <IconFlask size={17} />
                            <Typography sx={{ fontWeight: 900, fontSize: '0.78rem', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>MODO DEMONSTRAÇÃO</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
                            <IconLock size={14} /> Somente visualização
                        </Typography>
                    </Stack>

                    {/* Troca de perfil */}
                    {!minimized && (
                        <Stack
                            direction="row"
                            alignItems="center"
                            gap={1}
                            sx={{ order: { xs: 3, md: 0 }, flexBasis: { xs: '100%', md: 'auto' }, flex: { md: 1 }, justifyContent: { md: 'center' }, minWidth: 0 }}
                        >
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', display: { xs: 'none', md: 'block' }, whiteSpace: 'nowrap' }}>
                                Ver como:
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 0.75, flex: { xs: 1, md: '0 1 680px' } }}>
                                {demo.roles.map(({ key, label }) => {
                                    const Icon = (ROLE_META[key] ?? ROLE_META.admin).icon;
                                    const isActive = key === demo.role;
                                    return (
                                        <ButtonBase
                                            key={key}
                                            onClick={() => switchTo(key)}
                                            disabled={switching !== null}
                                            aria-pressed={isActive}
                                            aria-label={`Ver como ${label}`}
                                            sx={{
                                                gap: 0.75, px: 1, py: 0.9, borderRadius: 2, minWidth: 0,
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                border: '2px solid', borderColor: isActive ? AMBER : 'rgba(255,255,255,0.16)',
                                                bgcolor: isActive ? '#fff' : 'rgba(255,255,255,0.06)',
                                                color: isActive ? '#0B1220' : '#fff',
                                                fontWeight: 800,
                                                transition: 'background-color 150ms, border-color 150ms',
                                                '&:hover': { bgcolor: isActive ? '#fff' : 'rgba(255,255,255,0.14)' },
                                                '&:focus-visible': { outline: `2px solid ${AMBER}`, outlineOffset: 2 },
                                            }}
                                        >
                                            <Icon size={18} color={isActive ? '#B45309' : 'currentColor'} />
                                            <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.7rem', sm: '0.82rem' }, lineHeight: 1.1 }} noWrap>
                                                {switching === key ? 'Abrindo…' : label}
                                            </Typography>
                                        </ButtonBase>
                                    );
                                })}
                            </Box>
                        </Stack>
                    )}

                    {minimized && (
                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', flex: 1, whiteSpace: 'nowrap' }} noWrap>
                            Vendo como <strong style={{ color: '#fff' }}>{currentRole?.label}</strong>
                        </Typography>
                    )}

                    {/* Ações */}
                    <Stack direction="row" alignItems="center" gap={0.75} sx={{ flexShrink: 0, ml: 'auto' }}>
                        <Tooltip title={minimized ? 'Mostrar perfis' : 'Minimizar'}>
                            <IconButton
                                onClick={toggleMinimized}
                                size="small"
                                aria-label={minimized ? 'Mostrar perfis' : 'Minimizar barra'}
                                sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                            >
                                {minimized ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Sair da demonstração">
                            <IconButton
                                onClick={() => router.post(route('logout'))}
                                size="small"
                                aria-label="Sair da demonstração"
                                sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                            >
                                <IconLogout size={18} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>

            <Dialog open={welcome} onClose={closeWelcome} maxWidth="sm" fullWidth data-demo-allow PaperProps={{ sx: { borderRadius: 4, borderTop: `6px solid ${AMBER}` } }}>
                <DialogContent sx={{ pt: 3.5 }}>
                    <Stack spacing={2.25}>
                        <Box sx={{ alignSelf: 'flex-start', bgcolor: AMBER, color: '#111827', borderRadius: 2, px: 1.25, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <IconFlask size={16} />
                            <Typography sx={{ fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.06em' }}>MODO DEMONSTRAÇÃO</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>
                            {firstName ? `Bem-vindo(a), ${firstName}!` : 'Bem-vindo(a)!'}
                        </Typography>
                        <Typography color="text.secondary">
                            Você está em um ambiente de teste com dados fictícios. Explore à vontade: nada que você fizer altera a plataforma.
                        </Typography>
                        <Alert severity="warning" icon={<IconArrowDown size={20} />} sx={{ borderRadius: 2, fontWeight: 600 }}>
                            Use a barra no rodapé para ver a plataforma como Administrador, Consultor, Cliente ou Produtor.
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button variant="contained" onClick={closeWelcome} size="large" sx={{ px: 4 }}>
                        Começar a explorar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={blocked}
                autoHideDuration={5000}
                onClose={() => setBlocked(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="warning" variant="filled" icon={<IconLock size={20} />} onClose={() => setBlocked(false)} sx={{ fontWeight: 700, alignItems: 'center' }}>
                    {flash?.warning || BLOCKED_MESSAGE}
                </Alert>
            </Snackbar>
        </>
    );
}

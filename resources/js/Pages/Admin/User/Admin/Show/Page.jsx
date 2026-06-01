import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconArrowLeft, IconEdit, IconShield, IconTrash, IconUserCog, IconX } from '@tabler/icons-react';
import { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

function initials(name = '') {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
}

function InfoRow({ label, value }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.8}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value ?? '—'}</Typography>
        </Stack>
    );
}

export default function Page({ admin }) {
    const { flash, auth } = usePage().props;
    const isSelf = admin?.id === auth?.user?.id;
    const [confirmDelete, setConfirmDelete] = useState(false);

    function doDelete() {
        router.delete(safeRoute('admin.user.admin.destroy', admin.id), {
            onSuccess: () => setConfirmDelete(false),
        });
    }

    const statusColor = String(admin?.status) === '1' ? 'success' : 'error';
    const statusLabel = String(admin?.status) === '1' ? 'Ativo' : 'Bloqueado';

    return (
        <Layout
            titlePage={admin?.name ?? 'Administrador'}
            menu="admin"
            subMenu="admin-cadastrados"
            breadcrumbs={[
                { label: 'Admin' },
                { label: 'Administradores', href: safeRoute('admin.user.admin.index') },
                { label: admin?.name ?? 'Detalhe' },
            ]}
        >
            <Head title={admin?.name} />

            <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Button component={Link} href={safeRoute('admin.user.admin.index')} startIcon={<IconArrowLeft size={16} />} variant="text" size="small">
                        Voltar
                    </Button>
                    <Stack direction="row" gap={1}>
                        <Button component={Link} href={safeRoute('admin.user.admin.edit', admin?.id)} variant="outlined" color="warning" startIcon={<IconEdit size={16} />}>
                            Editar
                        </Button>
                        {!isSelf && (
                            <Button variant="outlined" color="error" startIcon={<IconTrash size={16} />} onClick={() => setConfirmDelete(true)}>
                                Excluir
                            </Button>
                        )}
                    </Stack>
                </Stack>

                {flash?.success && <Alert severity="success">{flash.success}</Alert>}

                <Grid container spacing={3}>
                    {/* Avatar + identidade */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)', textAlign: 'center' }}>
                            <CardContent sx={{ py: 4 }}>
                                <Avatar
                                    sx={{
                                        width: 88,
                                        height: 88,
                                        mx: 'auto',
                                        mb: 2,
                                        fontSize: 30,
                                        fontWeight: 950,
                                        background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                                        boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
                                    }}
                                >
                                    {initials(admin?.name)}
                                </Avatar>

                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                    {admin?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                    {admin?.email}
                                </Typography>

                                <Stack direction="row" gap={1} justifyContent="center" sx={{ mt: 2 }}>
                                    <Chip label="Administrador" size="small" sx={{ bgcolor: '#ede9fe', color: '#7c3aed', fontWeight: 800 }} />
                                    <Chip label={statusLabel} color={statusColor} size="small" />
                                    {isSelf && <Chip label="Você" size="small" variant="outlined" />}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dados detalhados */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconUserCog size={18} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 950 }}>Dados da Conta</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={0} divider={<Divider />}>
                                    <InfoRow label="ID"              value={`#${admin?.id}`} />
                                    <InfoRow label="Nome"            value={admin?.name} />
                                    <InfoRow label="E-mail"          value={admin?.email} />
                                    <InfoRow label="Perfil"          value="Administrador" />
                                    <InfoRow label="Status"          value={statusLabel} />
                                    <InfoRow label="Cadastrado em"   value={admin?.cadastrado_em} />
                                    <InfoRow label="E-mail verificado" value={admin?.email_verified_at ?? 'Não verificado'} />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Aviso de permissões */}
                        <Card sx={{ mt: 2, borderRadius: 3, border: '1px solid #ede9fe', bgcolor: '#faf5ff', boxShadow: 'none' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="flex-start" gap={1.5}>
                                    <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <IconShield size={17} style={{ color: '#7c3aed' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#7c3aed' }}>
                                            Permissões de Administrador
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                            Administradores têm acesso total à plataforma: gerenciar usuários, clientes, produtores, usinas, financeiro e configurações do sistema.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>

            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <IconTrash size={20} style={{ color: '#ef4444' }} />
                        Excluir Administrador
                    </Stack>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography sx={{ mt: 1 }}>Deseja excluir <strong>{admin?.name}</strong>?</Typography>
                    <Alert severity="warning" sx={{ mt: 1.5 }}>Esta ação não pode ser desfeita.</Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button variant="outlined" color="inherit" startIcon={<IconX size={16} />} onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                    <Button variant="contained" color="error" startIcon={<IconTrash size={16} />} onClick={doDelete}>Excluir</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

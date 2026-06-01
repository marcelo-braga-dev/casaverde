import Layout from '@/Layouts/UserLayout/Layout.jsx';
import DataTableCard from '@/Components/DataDisplay/DataTableCard';
import DataTableEmpty from '@/Components/DataDisplay/DataTableEmpty';
import DataTablePagination from '@/Components/DataDisplay/DataTablePagination';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { IconEdit, IconEye, IconPlus, IconTrash, IconUserCog, IconX } from '@tabler/icons-react';
import { useState } from 'react';
function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }
function initials(name = '') { return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'; }
const STATUS_MAP = { '1': { label: 'Ativo', color: 'success' }, '0': { label: 'Bloqueado', color: 'error' } };
export default function Page({ admins }) {
    const { flash, auth } = usePage().props;
    const items = admins?.data ?? [];
    const currentUserId = auth?.user?.id;
    const [deleteTarget, setDeleteTarget] = useState(null);
    function confirmDelete() { router.delete(safeRoute('admin.user.admin.destroy', deleteTarget.id), { onSuccess: () => setDeleteTarget(null) }); }
    return (
        <Layout titlePage="Administradores" menu="admin" subMenu="admin-cadastrados" subtitle="Gerencie as contas de administrador." breadcrumbs={[{ label: 'Admin' }, { label: 'Administradores' }]}>
            <Head title="Administradores" />
            <Stack spacing={3}>
                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                <DataTableCard title="Contas de Administrador" icon={IconUserCog}
                    actions={<Button component={Link} href={safeRoute('admin.user.admin.create')} variant="contained" startIcon={<IconPlus size={17} />}>Novo Admin</Button>}
                    isEmpty={items.length === 0}
                    empty={<DataTableEmpty title="Nenhum administrador cadastrado" description="Clique em Novo Admin para adicionar o primeiro." icon={IconUserCog} actionLabel="Novo Admin" actionHref={safeRoute('admin.user.admin.create')} />}
                    head={<TableRow><TableCell>Administrador</TableCell><TableCell>E-mail</TableCell><TableCell>Status</TableCell><TableCell>Cadastrado em</TableCell><TableCell align="right">Ações</TableCell></TableRow>}
                    pagination={<DataTablePagination links={admins?.links} meta={{ from: admins?.from, to: admins?.to, total: admins?.total }} />}
                >
                    {items.map(admin => {
                        const st = STATUS_MAP[String(admin.status)] ?? { label: admin.status ?? '—', color: 'default' };
                        const isSelf = admin.id === currentUserId;
                        return (
                            <TableRow key={admin.id} hover>
                                <TableCell><Stack direction="row" alignItems="center" gap={1.5}><Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 900, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>{initials(admin.name)}</Avatar><Box><Stack direction="row" alignItems="center" gap={0.8}><Typography variant="body2" sx={{ fontWeight: 700 }}>{admin.name}</Typography>{isSelf && <Chip label="Você" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#ede9fe', color: '#7c3aed' }} />}</Stack><Typography variant="caption" color="text.secondary">#{admin.id}</Typography></Box></Stack></TableCell>
                                <TableCell><Typography variant="body2">{admin.email}</Typography></TableCell>
                                <TableCell><Chip label={st.label} color={st.color} size="small" /></TableCell>
                                <TableCell><Typography variant="body2" color="text.secondary">{admin.cadastrado_em ?? '—'}</Typography></TableCell>
                                <TableCell align="right"><Stack direction="row" gap={0.5} justifyContent="flex-end"><Button component={Link} href={safeRoute('admin.user.admin.show', admin.id)} size="small" variant="outlined" startIcon={<IconEye size={14} />}>Ver</Button><Button component={Link} href={safeRoute('admin.user.admin.edit', admin.id)} size="small" variant="outlined" color="warning" startIcon={<IconEdit size={14} />}>Editar</Button>{!isSelf && <Button size="small" variant="outlined" color="error" startIcon={<IconTrash size={14} />} onClick={() => setDeleteTarget(admin)}>Excluir</Button>}</Stack></TableCell>
                            </TableRow>
                        );
                    })}
                </DataTableCard>
            </Stack>
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}><Stack direction="row" alignItems="center" gap={1}><IconTrash size={20} style={{ color: '#ef4444' }} />Excluir Administrador</Stack></DialogTitle>
                <Divider />
                <DialogContent><Typography sx={{ mt: 1 }}>Deseja realmente excluir <strong>{deleteTarget?.name}</strong>?</Typography><Alert severity="warning" sx={{ mt: 1.5 }}>Esta ação não pode ser desfeita. O usuário perderá acesso imediatamente.</Alert></DialogContent>
                <DialogActions sx={{ p: 2.5 }}><Button variant="outlined" color="inherit" startIcon={<IconX size={16} />} onClick={() => setDeleteTarget(null)}>Cancelar</Button><Button variant="contained" color="error" startIcon={<IconTrash size={16} />} onClick={confirmDelete}>Excluir</Button></DialogActions>
            </Dialog>
        </Layout>
    );
}

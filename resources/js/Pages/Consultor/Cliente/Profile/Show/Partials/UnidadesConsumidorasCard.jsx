import { useForm } from '@inertiajs/react';
import {
    Alert,
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
    IconButton,
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
    IconBolt,
    IconEdit,
    IconPlus,
    IconSolarPanel2,
    IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';

const STATUS_MAP = {
    active:    { label: 'Ativa',     color: 'success' },
    inactive:  { label: 'Inativa',   color: 'warning' },
    cancelled: { label: 'Cancelada', color: 'error' },
};

function safeRoute(n, ...params) {
    try { return route(n, ...params); } catch { return '#'; }
}

function UcForm({ profile, uc = null, concessionarias = [], onClose }) {
    const isEdit = !!uc;

    const form = useForm({
        uc_code:           uc?.uc_code ?? '',
        label:             uc?.label ?? '',
        concessionaria_id: uc?.concessionaria_id ?? '',
        status:            uc?.status ?? 'active',
        notes:             uc?.notes ?? '',
    });

    function submit(e) {
        e.preventDefault();
        const routeName = isEdit
            ? 'consultor.user.cliente.consumer-unit.update'
            : 'consultor.user.cliente.consumer-unit.store';
        const routeParams = isEdit
            ? { clientProfile: profile.id, consumerUnit: uc.id }
            : { clientProfile: profile.id };

        const method = isEdit ? form.put : form.post;
        method(safeRoute(routeName, routeParams), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    }

    return (
        <form onSubmit={submit}>
            <DialogContent>
                <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Nome / Rótulo"
                            value={form.data.label}
                            onChange={e => form.setData('label', e.target.value)}
                            error={!!form.errors.label}
                            helperText={form.errors.label ?? 'Ex: Casa Principal'}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Código UC"
                            value={form.data.uc_code}
                            onChange={e => form.setData('uc_code', e.target.value)}
                            error={!!form.errors.uc_code}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Concessionária"
                            value={form.data.concessionaria_id}
                            onChange={e => form.setData('concessionaria_id', e.target.value)}
                            error={!!form.errors.concessionaria_id}
                            helperText={form.errors.concessionaria_id}
                            select
                            fullWidth
                        >
                            <MenuItem value="">Selecione...</MenuItem>
                            {concessionarias.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            label="Observações"
                            value={form.data.notes}
                            onChange={e => form.setData('notes', e.target.value)}
                            error={!!form.errors.notes}
                            helperText={form.errors.notes}
                            multiline
                            rows={2}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={form.processing}>
                    {isEdit ? 'Salvar alterações' : 'Cadastrar UC'}
                </Button>
            </DialogActions>
        </form>
    );
}

function DeleteConfirmDialog({ uc, profile, open, onClose }) {
    const { delete: destroy, processing } = useForm({});

    function confirm() {
        destroy(safeRoute('consultor.user.cliente.consumer-unit.destroy', {
            clientProfile: profile.id,
            consumerUnit: uc.id,
        }), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Remover UC</DialogTitle>
            <DialogContent>
                <Typography>
                    Deseja remover a UC <strong>{uc?.display_label ?? uc?.uc_code}</strong>?
                    Esta ação não pode ser desfeita se não houver vínculos ativos.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>Cancelar</Button>
                <Button variant="contained" color="error" onClick={confirm} disabled={processing}>
                    Remover
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function UnidadesConsumidorasCard({ profile, concessionarias = [] }) {
    const consumerUnits = profile?.consumer_units ?? profile?.consumerUnits ?? [];

    const [openCreate, setOpenCreate] = useState(false);
    const [editingUc, setEditingUc] = useState(null);
    const [deletingUc, setDeletingUc] = useState(null);

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Box sx={{
                            width: 36, height: 36, borderRadius: 2,
                            background: 'var(--cv-gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        }}>
                            <IconBolt size={18} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 950 }}>
                                Unidades Consumidoras
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {consumerUnits.length} UC{consumerUnits.length !== 1 ? 's' : ''} cadastrada{consumerUnits.length !== 1 ? 's' : ''}
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<IconPlus size={16} />}
                        onClick={() => setOpenCreate(true)}
                    >
                        Nova UC
                    </Button>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {consumerUnits.length === 0 ? (
                    <Box py={4} textAlign="center">
                        <IconBolt size={40} style={{ opacity: 0.2, marginBottom: 8 }} />
                        <Typography color="text.secondary">
                            Nenhuma Unidade Consumidora cadastrada.
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<IconPlus size={14} />}
                            onClick={() => setOpenCreate(true)}
                            sx={{ mt: 1.5 }}
                        >
                            Cadastrar primeira UC
                        </Button>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Código UC</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Rótulo</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Concessionária</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Usina Vinculada</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {consumerUnits.map(uc => {
                                    const statusInfo = STATUS_MAP[uc.status] ?? { label: uc.status, color: 'default' };
                                    const activeLink = uc.active_usina_link ?? uc.activeUsinaLink ?? null;
                                    const usina = activeLink?.usina ?? null;
                                    const produtor = usina?.produtor ?? null;

                                    return (
                                        <TableRow key={uc.id} hover>
                                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                                {uc.uc_code}
                                            </TableCell>
                                            <TableCell>
                                                {uc.label ?? <Typography variant="body2" color="text.secondary">—</Typography>}
                                            </TableCell>
                                            <TableCell>
                                                {uc.concessionaria?.nome ?? <Typography variant="body2" color="text.secondary">—</Typography>}
                                            </TableCell>
                                            <TableCell>
                                                {usina ? (
                                                    <Stack>
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            {usina.usina_nome}
                                                        </Typography>
                                                        {produtor && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {produtor.nome_fantasia ?? produtor.nome ?? '—'}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                ) : (
                                                    <Chip
                                                        label="Sem vínculo"
                                                        size="small"
                                                        variant="outlined"
                                                        icon={<IconSolarPanel2 size={12} />}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={statusInfo.label}
                                                    color={statusInfo.color}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" gap={0.5} justifyContent="flex-end">
                                                    <Tooltip title="Editar UC">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setEditingUc(uc)}
                                                        >
                                                            <IconEdit size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Remover UC">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => setDeletingUc(uc)}
                                                        >
                                                            <IconTrash size={16} />
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

            {/* Criar UC */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nova Unidade Consumidora</DialogTitle>
                <UcForm
                    profile={profile}
                    concessionarias={concessionarias}
                    onClose={() => setOpenCreate(false)}
                />
            </Dialog>

            {/* Editar UC */}
            <Dialog open={!!editingUc} onClose={() => setEditingUc(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Unidade Consumidora</DialogTitle>
                <UcForm
                    profile={profile}
                    uc={editingUc}
                    concessionarias={concessionarias}
                    onClose={() => setEditingUc(null)}
                />
            </Dialog>

            {/* Confirmar remoção */}
            {deletingUc && (
                <DeleteConfirmDialog
                    uc={deletingUc}
                    profile={profile}
                    open={!!deletingUc}
                    onClose={() => setDeletingUc(null)}
                />
            )}
        </Card>
    );
}

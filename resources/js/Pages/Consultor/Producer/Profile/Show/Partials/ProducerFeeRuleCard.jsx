import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconEdit, IconPercentage, IconX } from "@tabler/icons-react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import useAuthUser from "@/Hooks/useAuthUser.js";
import { isAdmin } from "@/Utils/permissions.js";

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const fmtPercent = v => v != null ? `${Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%` : '—';

const fmtDate = v => {
    if (!v) return '—';
    try {
        return String(v).substring(0, 10).split('-').reverse().join('/');
    } catch {
        return v;
    }
};

const ProducerFeeRuleCard = ({ profile, defaultFeePercentage }) => {
    const admin = isAdmin(useAuthUser());
    const [openEdit, setOpenEdit] = useState(false);

    const activeRule = profile?.active_fee_rule;
    const currentFeePercent = activeRule?.fee_percent ?? defaultFeePercentage;

    const form = useForm({
        fee_percent: currentFeePercent ?? '',
        notes: '',
    });

    if (!admin) {
        return null;
    }

    function openEditModal() {
        form.reset();
        form.setData({
            fee_percent: currentFeePercent ?? '',
            notes: '',
        });
        setOpenEdit(true);
    }

    function submit(e) {
        e.preventDefault();
        form.put(safeRoute('consultor.producer.profiles.fee-rule.update', profile.id), {
            preserveScroll: true,
            onSuccess: () => setOpenEdit(false),
        });
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardHeader
                title="Taxa de Administração"
                avatar={<IconPercentage />}
                action={admin && (
                    <Button
                        startIcon={<IconEdit size={16} />}
                        variant="contained"
                        size="small"
                        onClick={openEditModal}
                    >
                        Editar
                    </Button>
                )}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Taxa atual</Typography>
                        <Typography>{fmtPercent(currentFeePercent)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Vigente desde</Typography>
                        <Typography>{activeRule ? fmtDate(activeRule.starts_on) : '—'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Origem</Typography>
                        <Chip
                            label={activeRule ? 'Regra específica do produtor' : 'Taxa padrão do sistema'}
                            size="small"
                            color={activeRule ? 'primary' : 'default'}
                        />
                    </Grid>
                </Grid>
            </CardContent>

            {/* ── Dialog: Editar taxa ─────────────────────────────────── */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <IconPercentage size={20} />
                        Editar Taxa de Administração
                    </Stack>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 3 }}>
                    <Stack component="form" id="form-edit-fee-rule" onSubmit={submit} spacing={2.5}>
                        {Object.keys(form.errors).length > 0 && (
                            <Alert severity="error">{Object.values(form.errors)[0]}</Alert>
                        )}

                        <Alert severity="info">
                            Esta alteração cria uma nova regra de taxa ativa para este produtor a partir de agora,
                            substituindo a regra atual. Propostas futuras usarão a nova taxa.
                        </Alert>

                        <TextField
                            fullWidth size="small"
                            label="Taxa de Administração"
                            type="number"
                            value={form.data.fee_percent}
                            onChange={e => form.setData('fee_percent', e.target.value)}
                            error={!!form.errors.fee_percent}
                            helperText={form.errors.fee_percent}
                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        />

                        <TextField
                            fullWidth size="small"
                            label="Observações"
                            multiline
                            rows={3}
                            value={form.data.notes}
                            onChange={e => form.setData('notes', e.target.value)}
                            error={!!form.errors.notes}
                            helperText={form.errors.notes}
                        />
                    </Stack>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" color="inherit" startIcon={<IconX size={16} />} onClick={() => setOpenEdit(false)} disabled={form.processing}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit" form="form-edit-fee-rule" variant="contained"
                        disabled={form.processing}
                        startIcon={form.processing ? <CircularProgress size={14} color="inherit" /> : <IconEdit size={16} />}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default ProducerFeeRuleCard;

import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
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
import {
    IconEdit,
    IconMail,
    IconPhone,
    IconTrash,
    IconTrashX,
    IconUser,
    IconUserBolt,
    IconUserEdit,
    IconX,
} from "@tabler/icons-react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const ClientInfoCard = ({ profile }) => {
    const { flash } = usePage().props;
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit,   setOpenEdit]   = useState(false);

    const tipoPessoa = profile?.tipo_pessoa;

    const form = useForm({
        nome:          profile?.nome          ?? '',
        razao_social:  profile?.razao_social  ?? '',
        nome_fantasia: profile?.nome_fantasia ?? '',
        email:         profile?.contacts?.email   ?? '',
        celular:       profile?.contacts?.celular ?? '',
    });

    function submitEdit(e) {
        e.preventDefault();
        form.put(safeRoute('consultor.user.cliente.identidade.update', profile.id), {
            preserveScroll: true,
            onSuccess: () => setOpenEdit(false),
        });
    }

    function openEditModal() {
        form.reset();
        form.setData({
            nome:          profile?.nome          ?? '',
            razao_social:  profile?.razao_social  ?? '',
            nome_fantasia: profile?.nome_fantasia ?? '',
            email:         profile?.contacts?.email   ?? '',
            celular:       profile?.contacts?.celular ?? '',
        });
        setOpenEdit(true);
    }

    return (
        <>
            {flash?.success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    {flash.success}
                </Alert>
            )}

            {/* ── Informações ────────────────────────────────────────────── */}
            <Card sx={{ mb: 3 }}>
                <CardHeader
                    title="Informações do Cliente"
                    subheader={`Consultor: ${profile?.consultor?.nome ?? profile?.consultor?.name ?? 'Não informado'}`}
                    avatar={<IconUserBolt />}
                    action={
                        <Stack direction="row" gap={1}>
                            <Button
                                startIcon={<IconUserEdit size={16} />}
                                variant="contained"
                                size="small"
                                onClick={openEditModal}
                            >
                                Editar dados
                            </Button>
                            <Link href={safeRoute("consultor.user.cliente.edit", profile.id)}>
                                <Button startIcon={<IconEdit size={16} />} color="success" variant="outlined" size="small">
                                    Edição completa
                                </Button>
                            </Link>
                            <Button
                                startIcon={<IconTrashX size={16} />}
                                color="error"
                                size="small"
                                variant="outlined"
                                onClick={() => setOpenDelete(true)}
                            >
                                Excluir
                            </Button>
                        </Stack>
                    }
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        {tipoPessoa === 'pf' && (
                            <>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">Nome</Typography>
                                    <Typography>{profile?.nome ?? "Não informado"}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">CPF</Typography>
                                    <Typography>{profile?.cpf ?? "Não informado"}</Typography>
                                </Grid>
                            </>
                        )}
                        {tipoPessoa === 'pj' && (
                            <>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">CNPJ</Typography>
                                    <Typography>{profile?.cnpj ?? "Não informado"}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">Nome Fantasia</Typography>
                                    <Typography>{profile?.nome_fantasia ?? "Não informado"}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">Razão Social</Typography>
                                    <Typography>{profile?.razao_social ?? "Não informado"}</Typography>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* ── Contatos ────────────────────────────────────────────────── */}
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Contatos" avatar={<IconPhone />} />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Celular</Typography>
                            <Typography>{profile?.contacts?.celular ?? "Não informado"}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Telefone</Typography>
                            <Typography>{profile?.contacts?.telefone ?? "Não informado"}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">E-mail</Typography>
                            <Typography>{profile?.contacts?.email ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ── Dialog: Editar dados ─────────────────────────────────── */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <IconUserEdit size={20} />
                        Editar Dados do Cliente
                    </Stack>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 3 }}>
                    <Stack component="form" id="form-edit-client" onSubmit={submitEdit} spacing={2.5}>

                        {Object.keys(form.errors).length > 0 && (
                            <Alert severity="error">{Object.values(form.errors)[0]}</Alert>
                        )}

                        {tipoPessoa === 'pf' ? (
                            <TextField
                                fullWidth size="small"
                                label="Nome completo *"
                                value={form.data.nome}
                                onChange={e => form.setData('nome', e.target.value)}
                                error={!!form.errors.nome}
                                helperText={form.errors.nome}
                                InputProps={{ startAdornment: <InputAdornment position="start"><IconUser size={16} style={{ opacity: 0.45 }} /></InputAdornment> }}
                            />
                        ) : (
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth size="small"
                                    label="Razão Social *"
                                    value={form.data.razao_social}
                                    onChange={e => form.setData('razao_social', e.target.value)}
                                    error={!!form.errors.razao_social}
                                    helperText={form.errors.razao_social}
                                />
                                <TextField
                                    fullWidth size="small"
                                    label="Nome Fantasia"
                                    value={form.data.nome_fantasia}
                                    onChange={e => form.setData('nome_fantasia', e.target.value)}
                                    error={!!form.errors.nome_fantasia}
                                    helperText={form.errors.nome_fantasia}
                                />
                            </Stack>
                        )}

                        <Divider>
                            <Typography variant="caption" color="text.secondary">Contato</Typography>
                        </Divider>

                        <TextField
                            fullWidth size="small"
                            label="E-mail"
                            type="email"
                            value={form.data.email}
                            onChange={e => form.setData('email', e.target.value)}
                            error={!!form.errors.email}
                            helperText={form.errors.email ?? 'Usado para envio de convites de acesso.'}
                            InputProps={{ startAdornment: <InputAdornment position="start"><IconMail size={16} style={{ opacity: 0.45 }} /></InputAdornment> }}
                        />

                        <TextField
                            fullWidth size="small"
                            label="Celular"
                            value={form.data.celular}
                            onChange={e => form.setData('celular', e.target.value)}
                            error={!!form.errors.celular}
                            helperText={form.errors.celular}
                            InputProps={{ startAdornment: <InputAdornment position="start"><IconPhone size={16} style={{ opacity: 0.45 }} /></InputAdornment> }}
                        />
                    </Stack>
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" color="inherit" startIcon={<IconX size={16} />} onClick={() => setOpenEdit(false)} disabled={form.processing}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit" form="form-edit-client" variant="contained"
                        disabled={form.processing}
                        startIcon={form.processing ? <CircularProgress size={14} color="inherit" /> : <IconUserEdit size={16} />}
                    >
                        Salvar alterações
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Dialog: Excluir ───────────────────────────────────────── */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Excluir Cliente</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mt: 1 }}>
                        Deseja realmente excluir este cliente? Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button variant="outlined" color="inherit" startIcon={<IconX size={18} />} onClick={() => setOpenDelete(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained" color="error" startIcon={<IconTrash size={18} />}
                        onClick={() => router.delete(safeRoute('consultor.user.cliente.destroy', profile.id))}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ClientInfoCard;

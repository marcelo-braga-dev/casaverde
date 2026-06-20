import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { router } from "@inertiajs/react";
import { IconLinkOff, IconSolarPanel2 } from "@tabler/icons-react";
import { useState } from "react";

const formatDate = (value) => {
    if (!value) return "—";
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value.replace("Z", "")));
};

const UsinaList = ({ profile, usinaLinks = [] }) => {
    const sortedLinks = [...usinaLinks].sort((a, b) =>
        new Date(b.started_at ?? b.created_at ?? 0) - new Date(a.started_at ?? a.created_at ?? 0)
    );

    const [unlinkTarget, setUnlinkTarget] = useState(null);
    const [processing, setProcessing] = useState(false);

    function confirmUnlink() {
        setProcessing(true);
        router.delete(route("consultor.user.cliente.usina.destroy", [profile.id, unlinkTarget.id]), {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setUnlinkTarget(null);
            },
        });
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    }}>
                        <IconSolarPanel2 size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 950 }}>
                        Histórico de Vínculos
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                {sortedLinks.length === 0 ? (
                    <Box py={3} textAlign="center">
                        <Typography color="text.secondary">Nenhum vínculo registrado.</Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Unidade Consumidora</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Usina</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Produtor</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>% Consumo Previsto</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Início</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Fim</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }} align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedLinks.map((item) => {
                                    const uc = item.consumer_unit ?? item.consumerUnit ?? null;
                                    const usina = item.usina ?? null;
                                    const produtor = usina?.produtor ?? null;

                                    return (
                                        <TableRow key={item.id} hover>
                                            <TableCell>
                                                {uc ? (
                                                    <Stack>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                                            {uc.uc_code}
                                                        </Typography>
                                                        {uc.label && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {uc.label}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">—</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {usina ? (
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {usina.usina_nome}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.usina_id ? `#${item.usina_id}` : '—'}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {produtor ? (
                                                    <Typography variant="body2">
                                                        {produtor.nome_fantasia ?? produtor.nome ?? '—'}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">—</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{`${Number(item.consumption_percentage ?? 0)}%`}</TableCell>
                                            <TableCell>{formatDate(item.started_at)}</TableCell>
                                            <TableCell>{item.ended_at ? formatDate(item.ended_at) : "Em aberto"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.is_active ? "Ativo" : "Encerrado"}
                                                    color={item.is_active ? "success" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.is_active && (
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="outlined"
                                                        startIcon={<IconLinkOff size={14} />}
                                                        onClick={() => setUnlinkTarget(item)}
                                                    >
                                                        Desvincular
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>

            <Dialog open={!!unlinkTarget} onClose={() => setUnlinkTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 900 }}>Desvincular Usina</DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                    <Typography>
                        Deseja desvincular o cliente da usina{" "}
                        <strong>{unlinkTarget?.usina?.usina_nome ?? `#${unlinkTarget?.usina_id}`}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button variant="outlined" color="inherit" onClick={() => setUnlinkTarget(null)} disabled={processing}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmUnlink}
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        Desvincular
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default UsinaList;

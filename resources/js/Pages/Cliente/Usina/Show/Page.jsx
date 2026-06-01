import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head } from '@inertiajs/react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { IconBolt, IconSolarPanel, IconSun } from '@tabler/icons-react';

function InfoRow({ label, value, highlight = false }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.7}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: highlight ? 900 : 700, color: highlight ? 'primary.main' : undefined }}>
                {value ?? '—'}
            </Typography>
        </Stack>
    );
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Page({ profile, usina, link, historico = [] }) {
    const discount = profile?.active_discount_rule?.discount_percent ?? link?.discount_percentage ?? 0;

    return (
        <Layout
            titlePage="Minha Usina"
            menu="cliente-usina"
            subMenu="cliente-usina-show"
            subtitle="Dados da sua usina solar vinculada."
            breadcrumbs={[{ label: 'Cliente' }, { label: 'Minha Usina' }]}
        >
            <Head title="Minha Usina" />

            {!usina ? (
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)' }}>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <IconSolarPanel size={56} style={{ opacity: 0.2 }} />
                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>Nenhuma usina vinculada</Typography>
                        <Typography color="text.secondary">Entre em contato com seu consultor para mais informações.</Typography>
                    </CardContent>
                </Card>
            ) : (
                <Stack spacing={3}>

                    {/* Hero da usina */}
                    <Card sx={{ background: 'linear-gradient(135deg,#064e3b,#065f46,#047857)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap={2}>
                                <Stack direction="row" alignItems="center" gap={2}>
                                    <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconSolarPanel size={28} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            {usina.usina_nome ?? 'Usina Solar'}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>
                                            {usina.concessionaria?.nome ?? '—'} · UC: {usina.uc ?? '—'}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Chip
                                    label={usina.operational_status?.label ?? usina.status ?? 'Ativo'}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}
                                />
                            </Stack>

                            {/* Barra de utilização */}
                            <Box sx={{ mt: 3 }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Capacidade utilizada</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 900 }}>{usina.utilization_percentage ?? 0}%</Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(100, usina.utilization_percentage ?? 0)}
                                    sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#fff' } }}
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    <Grid container spacing={3}>
                        {/* Dados técnicos */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%', borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconSun size={18} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>Dados Técnicos</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={0}>
                                        <InfoRow label="Potência instalada"  value={usina.potencia_usina ? `${usina.potencia_usina} kWp` : null} />
                                        <InfoRow label="Geração média"       value={usina.media_geracao ? `${usina.media_geracao} kWh/mês` : null} />
                                        <InfoRow label="Energia disponível"  value={usina.energia_disponivel_kwh ? `${usina.energia_disponivel_kwh} kWh` : null} />
                                        <InfoRow label="Energia alocada"     value={usina.energia_alocada_kwh ? `${usina.energia_alocada_kwh} kWh` : null} />
                                        <InfoRow label="Prazo de locação"    value={usina.prazo_locacao ? `${usina.prazo_locacao} anos` : null} />
                                        <InfoRow label="Inversores"          value={usina.inversores} />
                                        <InfoRow label="Módulos"             value={usina.modulos} />
                                        <InfoRow label="Início da operação"  value={usina.operation_started_at ? new Date(usina.operation_started_at).toLocaleDateString('pt-BR') : null} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Seu vínculo */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%', borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconBolt size={18} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>Seu Vínculo</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={0}>
                                        <InfoRow label="Energia alocada" value={link?.allocated_energy_kwh ? `${link.allocated_energy_kwh} kWh` : null} highlight />
                                        <InfoRow label="Desconto ativo"  value={`${discount}%`} highlight />
                                        <InfoRow label="Status"          value={link?.status ?? '—'} />
                                        <InfoRow label="Início do vínculo" value={link?.started_at ? new Date(link.started_at).toLocaleDateString('pt-BR') : null} />
                                        {link?.ended_at && <InfoRow label="Fim do vínculo" value={new Date(link.ended_at).toLocaleDateString('pt-BR')} />}
                                    </Stack>

                                    <Box sx={{ mt: 3, bgcolor: 'success.50', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'success.200' }}>
                                        <Typography variant="body2" color="success.dark" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            Estimativa de economia anual
                                        </Typography>
                                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 950 }}>
                                            {discount}% de desconto na fatura
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Baseado no seu desconto ativo sobre o valor total das faturas.
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Histórico de geração */}
                        {historico.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em', mb: 2 }}>
                                            Histórico de Geração
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Competência</TableCell>
                                                        <TableCell align="right">Gerado (kWh)</TableCell>
                                                        <TableCell align="right">Compensado (kWh)</TableCell>
                                                        <TableCell align="right">Disponível (kWh)</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {historico.map((h, i) => (
                                                        <TableRow key={i} hover>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                                    {MONTHS[(h.reference_month ?? 1) - 1]}/{h.reference_year}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2">{h.generated_energy_kwh ?? '—'}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2">{h.compensated_energy_kwh ?? '—'}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                                                                    {h.available_energy_kwh ?? '—'}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Stack>
            )}
        </Layout>
    );
}

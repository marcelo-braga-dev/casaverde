import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
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
import { IconEye, IconSolarPanel } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

function UsinaStatusChip({ status }) {
    const map = {
        ativo:    { label: 'Ativo',    color: 'success' },
        inativo:  { label: 'Inativo', color: 'default' },
    };
    const c = map[status] ?? { label: status ?? '—', color: 'default' };
    return <Chip label={c.label} color={c.color} size="small" />;
}

export default function Page({ usinas, profile }) {
    const items = usinas?.data ?? usinas ?? [];

    return (
        <Layout
            titlePage="Minhas Usinas"
            menu="produtor-usinas"
            subMenu="produtor-usinas-index"
            subtitle="Usinas solares cadastradas no seu perfil."
            breadcrumbs={[{ label: 'Produtor' }, { label: 'Minhas Usinas' }]}
        >
            <Head title="Minhas Usinas" />

            <Stack spacing={3}>

                {/* ── Resumo ─────────────────────────────────────────────── */}
                {items.length > 0 && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                        {[
                            {
                                label: 'Total de usinas',
                                value: items.length,
                            },
                            {
                                label: 'Potência total',
                                value: items.reduce((s, u) => s + parseFloat(u.potencia_usina ?? 0), 0).toFixed(1) + ' kWp',
                            },
                            {
                                label: 'Energia disponível',
                                value: items.reduce((s, u) => s + parseFloat(u.energia_disponivel_kwh ?? 0), 0).toFixed(0) + ' kWh',
                            },
                        ].map(item => (
                            <Card key={item.label} sx={{ flex: 1, borderRadius: 3, border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ py: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em', color: 'primary.main', mt: 0.3 }}>
                                        {item.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}

                {/* ── Tabela ─────────────────────────────────────────────── */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <IconSolarPanel size={18} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                    Usinas Cadastradas
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Somente leitura — para alterações entre em contato com seu consultor.
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 1.5 }} />

                        {items.length === 0 ? (
                            <Box sx={{ py: 5, textAlign: 'center' }}>
                                <IconSolarPanel size={48} style={{ opacity: 0.18 }} />
                                <Typography variant="h6" color="text.secondary" sx={{ mt: 1.5, fontWeight: 700 }}>
                                    Nenhuma usina cadastrada
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Suas usinas aparecerão aqui assim que forem cadastradas pelo consultor.
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Usina</TableCell>
                                            <TableCell>Concessionária</TableCell>
                                            <TableCell align="right">Potência (kWp)</TableCell>
                                            <TableCell>Utilização</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Ação</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map(usina => {
                                            const disponivel = parseFloat(usina.energia_disponivel_kwh ?? 0);
                                            const alocado    = parseFloat(usina.energia_alocada_kwh    ?? 0);
                                            const pct        = disponivel > 0 ? Math.min(100, (alocado / disponivel) * 100) : 0;

                                            return (
                                                <TableRow key={usina.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            {usina.usina_nome ?? `Usina #${usina.id}`}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            UC: {usina.uc ?? '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {usina.concessionaria?.nome ?? '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            {usina.potencia_usina ?? '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 160 }}>
                                                        <Stack direction="row" alignItems="center" gap={1}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={pct}
                                                                    sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200',
                                                                        '& .MuiLinearProgress-bar': { background: 'var(--cv-gradient-primary)' } }}
                                                                />
                                                            </Box>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 36 }}>
                                                                {pct.toFixed(0)}%
                                                            </Typography>
                                                        </Stack>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {alocado.toFixed(0)} / {disponivel.toFixed(0)} kWh
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <UsinaStatusChip status={usina.status} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            component={Link}
                                                            href={safeRoute('produtor.usinas.show', usina.id)}
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<IconEye size={15} />}
                                                        >
                                                            Ver
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

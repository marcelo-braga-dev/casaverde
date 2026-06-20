import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import {
    Avatar,
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
    Tooltip,
    Typography,
} from "@mui/material";
import {
    IconArrowLeft,
    IconBolt,
    IconBuildingFactory,
    IconEdit,
    IconMapPin,
    IconSolarElectricity,
    IconSolarPanel2,
    IconUsers,
} from "@tabler/icons-react";
import useAuthUser from "@/Hooks/useAuthUser.js";
import { isAdmin } from "@/Utils/permissions.js";

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

function InfoRow({ label, children }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            py={0.8} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>{children ?? '—'}</Typography>
        </Stack>
    );
}

function SectionHeader({ icon, title, gradient = 'var(--cv-gradient-primary)' }) {
    return (
        <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
            <Box sx={{
                width: 36, height: 36, borderRadius: 2, background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
            }}>
                {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>{title}</Typography>
        </Stack>
    );
}

const STATUS_MAP = {
    ativo:    { label: 'Ativa',    color: 'success' },
    inativo:  { label: 'Inativa',  color: 'error' },
    manutencao: { label: 'Manutenção', color: 'warning' },
};

const Page = ({ usina }) => {
    const admin = isAdmin(useAuthUser());
    const st = STATUS_MAP[usina?.status] ?? { label: usina?.status ?? 'Sem status', color: 'default' };

    const disponivel = parseFloat(usina?.energia_disponivel_kwh ?? 0);
    const alocado    = parseFloat(usina?.energia_alocada_kwh    ?? 0);
    const saldo      = parseFloat(usina?.energia_saldo_kwh      ?? 0);
    const alocPct    = disponivel > 0 ? Math.min(100, (alocado / disponivel) * 100) : 0;

    const clients    = usina?.active_client_links ?? usina?.clientLinks ?? [];

    const fmtKwh = (v) => v != null ? `${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kWh` : '—';

    const addressLabel = (a) => {
        if (!a) return '—';
        return [a.rua, a.numero && `nº ${a.numero}`, a.bairro, a.cidade && `${a.cidade}/${a.estado}`]
            .filter(Boolean).join(', ');
    };

    return (
        <Layout
            titlePage="Detalhes da Usina"
            menu="usinas-solar"
            subMenu="usinas-index"
            breadcrumbs={[
                { label: 'Usinas', href: safeRoute('consultor.producer.usinas.index') },
                { label: usina?.usina_nome ?? 'Detalhe' },
            ]}
        >
            <Head title={usina?.usina_nome ?? 'Usina'} />

            <Stack spacing={3}>

                {/* ── Hero Card ───────────────────────────────────────── */}
                <Card sx={{
                    background: 'linear-gradient(135deg,#064e3b 0%,#065f46 60%,#047857 100%)',
                    color: '#fff', borderRadius: 'var(--cv-radius-xl)',
                    boxShadow: '0 12px 40px rgba(6,78,59,0.35)',
                    overflow: 'hidden',
                }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
                            <Stack direction="row" alignItems="center" gap={2.5}>
                                <Box sx={{
                                    width: 60, height: 60, borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(8px)',
                                }}>
                                    <IconSolarElectricity size={30} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                                        {usina?.usina_nome ?? 'Usina Solar'}
                                    </Typography>
                                    <Stack direction="row" gap={1} alignItems="center" mt={0.8} flexWrap="wrap">
                                        <Chip label={st.label} color={st.color} size="small"
                                            sx={{ fontWeight: 700, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }} />
                                        {usina?.uc && (
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>
                                                UC: {usina.uc}
                                            </Typography>
                                        )}
                                        {usina?.concessionaria?.nome && (
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                                                · {usina.concessionaria.nome}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>

                            <Stack direction="row" gap={1}>
                                <Button component={Link} href={safeRoute('consultor.producer.usinas.index')}
                                    variant="outlined" size="small" startIcon={<IconArrowLeft size={15} />}
                                    sx={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#fff' } }}>
                                    Voltar
                                </Button>
                                <Button component={Link} href={safeRoute('consultor.producer.usinas.edit', usina?.id)}
                                    variant="contained" size="small" startIcon={<IconEdit size={15} />}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                                    Editar
                                </Button>
                            </Stack>
                        </Stack>

                        {/* Energy allocation bar */}
                        {disponivel > 0 && (
                            <Box mt={3} sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Alocação de Energia
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#6ee7b7', fontWeight: 900 }}>
                                        {alocPct.toFixed(0)}% alocado
                                    </Typography>
                                </Stack>
                                <LinearProgress variant="determinate" value={alocPct}
                                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.15)',
                                        '& .MuiLinearProgress-bar': { bgcolor: alocPct > 90 ? '#fbbf24' : '#34d399', borderRadius: 4 } }}
                                />
                                <Stack direction="row" justifyContent="space-between" mt={1}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                        Disponível: {fmtKwh(disponivel)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                        Saldo livre: {fmtKwh(saldo)}
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* ── Stats Row ───────────────────────────────────────── */}
                <Grid container spacing={2}>
                    {[
                        { label: 'Potência', value: usina?.potencia_usina ? `${usina.potencia_usina} kWp` : '—', gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', icon: <IconBolt size={20} /> },
                        { label: 'Média de Geração', value: usina?.media_geracao ? `${usina.media_geracao} kWh` : '—', gradient: 'linear-gradient(135deg,#10b981,#059669)', icon: <IconSolarPanel2 size={20} /> },
                        { label: 'Energia Alocada', value: fmtKwh(alocado), gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: <IconBolt size={20} /> },
                        { label: 'Clientes Ativos', value: clients.length, gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', icon: <IconUsers size={20} /> },
                    ].map(s => (
                        <Grid key={s.label} size={{ xs: 6, md: 3 }}>
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                                            <Typography variant="h6" fontWeight={950} letterSpacing="-0.03em" mt={0.5}>{s.value}</Typography>
                                        </Box>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                                            {s.icon}
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Main Content ─────────────────────────────────────── */}
                <Grid container spacing={3}>

                    {/* LEFT: Detalhes técnicos + endereço */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={3}>
                            {/* Técnico */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader icon={<IconSolarElectricity size={18} />} title="Dados Técnicos"
                                        gradient="linear-gradient(135deg,#10b981,#059669)" />
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={0}>
                                        <InfoRow label="Nome da Usina">{usina?.usina_nome}</InfoRow>
                                        <InfoRow label="Unidade Consumidora (UC)">{usina?.uc}</InfoRow>
                                        <InfoRow label="Potência Instalada">{usina?.potencia_usina ? `${usina.potencia_usina} kWp` : null}</InfoRow>
                                        <InfoRow label="Média de Geração">{usina?.media_geracao ? `${usina.media_geracao} kWh/mês` : null}</InfoRow>
                                        <InfoRow label="Prazo de Locação">{usina?.prazo_locacao ? `${usina.prazo_locacao} meses` : null}</InfoRow>
                                        <InfoRow label="Taxa de Comissão">{usina?.taxa_comissao ? `${usina.taxa_comissao}%` : null}</InfoRow>
                                        <InfoRow label="Concessionária">{usina?.concessionaria?.nome}</InfoRow>
                                        <InfoRow label="Grupo de Usinas">{usina?.block?.nome ?? 'Sem grupo'}</InfoRow>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Equipamentos */}
                            {(usina?.inversores || usina?.modulos) && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader icon={<IconSolarPanel2 size={18} />} title="Equipamentos"
                                            gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" />
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack spacing={0}>
                                            {usina?.inversores && <InfoRow label="Inversores">{usina.inversores}</InfoRow>}
                                            {usina?.modulos    && <InfoRow label="Módulos">{usina.modulos}</InfoRow>}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Endereço */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader icon={<IconMapPin size={18} />} title="Localização"
                                        gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                                    <Divider sx={{ mb: 2 }} />
                                    {usina?.address ? (
                                        <Stack spacing={0}>
                                            <InfoRow label="Endereço completo">{addressLabel(usina.address)}</InfoRow>
                                            <InfoRow label="CEP">{usina.address.cep}</InfoRow>
                                            <InfoRow label="Bairro">{usina.address.bairro}</InfoRow>
                                            <InfoRow label="Cidade">{usina.address.cidade ? `${usina.address.cidade}/${usina.address.estado}` : null}</InfoRow>
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Endereço não cadastrado.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* RIGHT: Produtor + Energia */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={3}>
                            {/* Produtor */}
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader icon={<IconBuildingFactory size={18} />} title="Produtor"
                                        gradient="var(--cv-gradient-primary)" />
                                    <Divider sx={{ mb: 2 }} />
                                    {usina?.produtor ? (
                                        <Stack spacing={0}>
                                            <InfoRow label="Nome">{usina.produtor.nome_fantasia ?? usina.produtor.nome}</InfoRow>
                                            <InfoRow label="E-mail">{usina.produtor.email ?? '—'}</InfoRow>
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Nenhum produtor vinculado.</Typography>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Consultor */}
                            {usina?.consultor && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader icon={<IconUsers size={18} />} title="Consultor Responsável"
                                            gradient="linear-gradient(135deg,#64748b,#475569)" />
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack spacing={0}>
                                            <InfoRow label="Nome">{usina.consultor.name}</InfoRow>
                                            <InfoRow label="E-mail">{usina.consultor.email}</InfoRow>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Energia */}
                            {disponivel > 0 && (
                                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid #d1fae5', boxShadow: 'var(--cv-shadow-md)', bgcolor: '#f0fdf4' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader icon={<IconBolt size={18} />} title="Balanço de Energia"
                                            gradient="linear-gradient(135deg,#10b981,#059669)" />
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack spacing={1.5}>
                                            {[
                                                { label: 'Disponível', value: fmtKwh(disponivel), color: 'text.secondary' },
                                                { label: 'Alocado', value: fmtKwh(alocado), color: 'warning.main' },
                                                { label: 'Saldo livre', value: fmtKwh(saldo), color: 'success.main' },
                                            ].map(e => (
                                                <Stack key={e.label} direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" color="text.secondary">{e.label}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 900, color: e.color }}>{e.value}</Typography>
                                                </Stack>
                                            ))}
                                            <Box mt={0.5}>
                                                <LinearProgress variant="determinate" value={alocPct}
                                                    color={alocPct > 90 ? 'warning' : 'success'}
                                                    sx={{ height: 6, borderRadius: 3 }} />
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {alocPct.toFixed(0)}% da capacidade alocada
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>
                </Grid>

                {/* ── Clientes vinculados ──────────────────────────────── */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                            <SectionHeader icon={<IconUsers size={18} />} title="Clientes Vinculados"
                                gradient="linear-gradient(135deg,#8b5cf6,#6d28d9)" />
                            <Chip label={`${clients.length} ativo${clients.length !== 1 ? 's' : ''}`}
                                size="small" color="secondary" variant="outlined" />
                        </Stack>
                        <Divider sx={{ mb: 2 }} />

                        {clients.length === 0 ? (
                            <Box py={3} textAlign="center">
                                <IconUsers size={36} style={{ opacity: 0.2, display: 'block', margin: '0 auto 8px' }} />
                                <Typography color="text.secondary">Nenhum cliente vinculado a esta usina.</Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Cliente</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Documento</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Energia Alocada</TableCell>
                                            {admin && <TableCell sx={{ fontWeight: 800 }}>Desconto</TableCell>}
                                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {clients.map((link) => {
                                            const client = link.client_profile ?? link.clientProfile;
                                            return (
                                                <TableRow key={link.id} hover>
                                                    <TableCell>
                                                        <Stack spacing={0.2}>
                                                            <Typography variant="body2" fontWeight={700}>
                                                                {client?.nome ?? client?.razao_social ?? client?.display_name ?? '—'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {client?.client_code ?? ''}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                                            {client?.cpf ?? client?.cnpj ?? '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {link.allocated_energy_kwh ? `${link.allocated_energy_kwh} kWh` : '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    {admin && (
                                                        <TableCell>
                                                            <Typography variant="body2" color="success.main" fontWeight={700}>
                                                                {link.discount_percentage ? `${link.discount_percentage}%` : '—'}
                                                            </Typography>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <Chip label={link.is_active ? 'Ativo' : 'Inativo'}
                                                            color={link.is_active ? 'success' : 'default'}
                                                            size="small" />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Ver cliente">
                                                            <Button component={Link}
                                                                href={safeRoute('consultor.user.cliente.show', client?.id)}
                                                                size="small" variant="outlined">
                                                                Ver
                                                            </Button>
                                                        </Tooltip>
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
};

export default Page;

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconArrowLeft,
    IconBuildingBank,
    IconCode,
    IconEdit,
    IconKey,
    IconSettings,
} from "@tabler/icons-react";

const PROVIDER_LABELS = { cora: 'Cora', mercado_pago: 'Mercado Pago', asaas: 'Asaas' };
const ENV_LABELS = { sandbox: 'Sandbox', production: 'Produção' };

function InfoRow({ label, children }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            py={0.8} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{children ?? '—'}</Typography>
        </Stack>
    );
}

function SectionHeader({ icon, title, gradient = 'var(--cv-gradient-primary)' }) {
    return (
        <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>{title}</Typography>
        </Stack>
    );
}

function JsonBlock({ value }) {
    if (!value) return <Typography variant="body2" color="text.secondary">Nenhuma configuração adicional.</Typography>;
    return (
        <TextField
            value={JSON.stringify(value, null, 2)}
            multiline
            minRows={8}
            fullWidth
            slotProps={{ input: { readOnly: true, sx: { fontFamily: 'monospace', fontSize: 12 } } }}
        />
    );
}

function formatDate(v) {
    if (!v) return '—';
    try { return new Date(v).toLocaleString('pt-BR'); } catch { return v; }
}

export default function Page({ account }) {
    return (
        <Layout
            titlePage="Conta de Pagamento"
            menu="financeiro"
            subMenu="financeiro-bancos"
            breadcrumbs={[
                { label: 'Financeiro' },
                { label: 'Contas de Pagamento', href: route('admin.financeiro.payment-provider-accounts.index') },
                { label: account.name ?? 'Detalhe' },
            ]}
        >
            <Head title={account.name ?? 'Conta de Pagamento'} />

            <Stack spacing={3}>
                <Button component={Link} href={route('admin.financeiro.payment-provider-accounts.index')}
                    startIcon={<IconArrowLeft size={16} />} variant="text" size="small" sx={{ alignSelf: 'flex-start' }}>
                    Voltar
                </Button>

                {/* Hero */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(30,64,175,0.2)' }}>
                    <Box sx={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', p: { xs: 2.5, md: 3 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap={2}>
                            <Stack direction="row" alignItems="center" gap={2}>
                                <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconBuildingBank size={28} style={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 950, color: '#fff', letterSpacing: '-0.04em' }}>
                                        {account.name}
                                    </Typography>
                                    <Stack direction="row" gap={1} mt={0.5} flexWrap="wrap" alignItems="center">
                                        <Chip
                                            label={account.is_active ? 'Ativa' : 'Inativa'}
                                            color={account.is_active ? 'success' : 'default'}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700 }}
                                        />
                                        {account.is_default && (
                                            <Chip label="Conta Padrão" color="warning" size="small"
                                                sx={{ bgcolor: 'rgba(251,191,36,0.25)', color: '#fef3c7', border: '1px solid rgba(251,191,36,0.4)', fontWeight: 700 }} />
                                        )}
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            {PROVIDER_LABELS[account.provider] ?? account.provider}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                            <Button component={Link} href={route('admin.financeiro.payment-provider-accounts.edit', account.id)}
                                variant="contained" size="small" startIcon={<IconEdit size={15} />}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, fontWeight: 700 }}>
                                Editar
                            </Button>
                        </Stack>
                    </Box>
                </Card>

                <Grid container spacing={3}>
                    {/* Dados gerais */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconSettings size={18} />} title="Dados Gerais"
                                    gradient="linear-gradient(135deg,#1e3a8a,#1d4ed8)" />
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={0}>
                                    <InfoRow label="ID">{`#${account.id}`}</InfoRow>
                                    <InfoRow label="Nome">{account.name}</InfoRow>
                                    <InfoRow label="Provider">{PROVIDER_LABELS[account.provider] ?? account.provider}</InfoRow>
                                    <InfoRow label="Ambiente">
                                        <Chip label={ENV_LABELS[account.environment] ?? account.environment}
                                            size="small"
                                            color={account.environment === 'production' ? 'success' : 'warning'}
                                        />
                                    </InfoRow>
                                    <InfoRow label="Status">
                                        <Chip label={account.is_active ? 'Ativa' : 'Inativa'} size="small"
                                            color={account.is_active ? 'success' : 'default'} />
                                    </InfoRow>
                                    <InfoRow label="Conta padrão">{account.is_default ? 'Sim' : 'Não'}</InfoRow>
                                    <InfoRow label="Criado em">{formatDate(account.created_at)}</InfoRow>
                                    <InfoRow label="Atualizado em">{formatDate(account.updated_at)}</InfoRow>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Credenciais */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<IconKey size={18} />} title="Credenciais de Acesso"
                                    gradient="linear-gradient(135deg,#64748b,#475569)" />
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={0}>
                                    <InfoRow label="Base URL">{account.base_url}</InfoRow>
                                    <InfoRow label="Client ID">{account.client_id}</InfoRow>
                                </Stack>
                                <Box mt={2} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                                    <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 700 }}>
                                        Segurança: chaves e segredos são armazenados de forma criptografada e não são exibidos aqui.
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Settings JSON */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent sx={{ p: 3 }}>
                        <SectionHeader icon={<IconCode size={18} />} title="Configurações Adicionais"
                            gradient="linear-gradient(135deg,#64748b,#475569)" />
                        <Divider sx={{ mb: 2 }} />
                        <JsonBlock value={account.settings} />
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

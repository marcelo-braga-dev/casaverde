import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link } from '@inertiajs/react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconBolt,
    IconMail,
    IconPhone,
    IconUser,
    IconUserSquare,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const CLIENT_STATUS = {
    prospect:          { label: 'Prospecto',        color: 'default' },
    proposta_emitida:  { label: 'Proposta Emitida', color: 'info' },
    contrato_assinado: { label: 'Ativo',            color: 'success' },
    active:            { label: 'Ativo',            color: 'success' },
    inactive:          { label: 'Inativo',          color: 'error' },
};

function InfoRow({ label, value }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.7}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value ?? '—'}</Typography>
        </Stack>
    );
}

export default function Page({ profile, user }) {
    const cs = CLIENT_STATUS[profile?.status] ?? { label: profile?.status ?? '-', color: 'default' };
    const name = profile?.tipo_pessoa === 'pf' ? profile?.nome : (profile?.razao_social ?? profile?.nome_fantasia);

    return (
        <Layout
            titlePage="Meu Perfil"
            menu="cliente-perfil"
            subMenu="cliente-perfil-show"
            subtitle="Seus dados cadastrais e informações da conta."
            breadcrumbs={[{ label: 'Cliente' }, { label: 'Meu Perfil' }]}
        >
            <Head title="Meu Perfil" />

            <Stack spacing={3}>
                <Grid container spacing={3}>
                    {/* Hero do perfil */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={3}>
                                    <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28, fontWeight: 900 }}>
                                        {(name ?? user?.name ?? 'C').charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                                            <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                                {name ?? user?.name ?? 'Cliente'}
                                            </Typography>
                                            <Chip label={cs.label} color={cs.color} size="small" />
                                            {profile?.client_code && (
                                                <Chip label={profile.client_code} variant="outlined" size="small" />
                                            )}
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {user?.email ?? '—'} · {profile?.tipo_pessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href={safeRoute('auth.perfil.usuario.index')}
                                        variant="outlined"
                                        startIcon={<IconUser size={16} />}
                                    >
                                        Editar Acesso
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dados pessoais */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <IconUserSquare size={18} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 950 }}>Dados Pessoais</Typography>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={0}>
                                    {profile?.tipo_pessoa === 'pf' ? (
                                        <>
                                            <InfoRow label="Nome completo" value={profile?.nome} />
                                            <InfoRow label="CPF"           value={profile?.cpf} />
                                        </>
                                    ) : (
                                        <>
                                            <InfoRow label="Razão social"  value={profile?.razao_social} />
                                            <InfoRow label="Nome fantasia" value={profile?.nome_fantasia} />
                                            <InfoRow label="CNPJ"          value={profile?.cnpj} />
                                        </>
                                    )}
                                    <InfoRow label="Tipo"       value={profile?.tipo_pessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'} />
                                    <InfoRow label="Código"     value={profile?.client_code} />
                                    <InfoRow label="Status"     value={cs.label} />
                                    {profile?.activated_at && (
                                        <InfoRow label="Cliente desde" value={new Date(profile.activated_at).toLocaleDateString('pt-BR')} />
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Contatos */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconPhone size={18} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950 }}>Contatos</Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1.5}>
                                        {profile?.contacts?.email && (
                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <IconMail size={16} style={{ opacity: 0.5 }} />
                                                <Typography variant="body2">{profile.contacts.email}</Typography>
                                            </Stack>
                                        )}
                                        {profile?.contacts?.celular && (
                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <IconPhone size={16} style={{ opacity: 0.5 }} />
                                                <Typography variant="body2">{profile.contacts.celular}</Typography>
                                            </Stack>
                                        )}
                                        {profile?.contacts?.telefone && (
                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <IconPhone size={16} style={{ opacity: 0.5 }} />
                                                <Typography variant="body2">{profile.contacts.telefone}</Typography>
                                            </Stack>
                                        )}
                                        {!profile?.contacts?.email && !profile?.contacts?.celular && (
                                            <Typography variant="body2" color="text.secondary">Nenhum contato cadastrado.</Typography>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Links rápidos */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 950, mb: 2 }}>Acesso Rápido</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    {[
                                        { label: 'Minhas Faturas',   route: 'cliente.faturas.index',    icon: <IconBolt size={20} /> },
                                        { label: 'Minhas Cobranças', route: 'cliente.cobrancas.index', icon: <IconBolt size={20} /> },
                                                        { label: 'Meus Contratos',   route: 'cliente.contratos.index', icon: <IconBolt size={20} /> },
                                    ].map(item => (
                                        <Grid key={item.route} size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Button
                                                fullWidth
                                                component={Link}
                                                href={safeRoute(item.route)}
                                                variant="outlined"
                                                startIcon={item.icon}
                                                sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                            >
                                                {item.label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

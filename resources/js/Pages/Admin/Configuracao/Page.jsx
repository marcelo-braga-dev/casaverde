import { Head, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/UserLayout/Layout.jsx';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconCheck,
    IconLeaf,
    IconPercentage,
    IconSettings,
    IconSolarPanel,
    IconUsers,
} from '@tabler/icons-react';

function safeRoute(n) { try { return route(n); } catch { return '#'; } }

function SectionCard({ icon: Icon, color, title, description, children }) {
    return (
        <Card>
            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        background: color,
                        flexShrink: 0,
                    }}
                >
                    <Icon size={18} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {description}
                    </Typography>
                </Box>
            </Box>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export default function Page({ settings }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        default_discount_percentage:     settings?.default_discount_percentage     ?? 20,
        default_producer_fee_percentage: settings?.default_producer_fee_percentage ?? 15,
    });

    function submit(e) {
        e.preventDefault();
        put(safeRoute('admin.settings.update'));
    }

    return (
        <Layout
            titlePage="Configurações da Plataforma"
            menu="config"
            subMenu="config-defaults"
            subtitle="Parâmetros globais aplicados automaticamente a novos cadastros."
            breadcrumbs={[{ label: 'Admin' }, { label: 'Configurações' }]}
        >
            <Head title="Configurações da Plataforma" />

            <Stack spacing={3} sx={{ maxWidth: 860 }}>

                {flash?.success && (
                    <Alert severity="success" icon={<IconCheck size={18} />}>
                        {flash.success}
                    </Alert>
                )}

                {/* ── Cabeçalho explicativo ───────────────────────── */}
                <Card sx={{ background: 'var(--cv-gradient-hero)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconSettings size={24} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                    Taxas Padrão da Plataforma
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, mt: 0.3 }}>
                                    Estes valores são aplicados automaticamente ao criar novos clientes ou produtores.
                                    Cada cadastro pode ter sua taxa ajustada individualmente depois.
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ── Formulário ──────────────────────────────────── */}
                <Box component="form" onSubmit={submit}>
                    <Stack spacing={3}>

                        {/* Taxa do Cliente */}
                        <SectionCard
                            icon={IconUsers}
                            color="linear-gradient(135deg,#166534,#15803D)"
                            title="Taxa de Desconto Padrão — Cliente Consumidor"
                            description="Desconto aplicado automaticamente na fatura de energia do cliente."
                        >
                            <Stack spacing={2}>
                                <Grid container spacing={3} alignItems="flex-start">
                                    <Grid size={{ xs: 12, sm: 5 }}>
                                        <TextField
                                            fullWidth
                                            label="Taxa de desconto (%)"
                                            type="number"
                                            value={data.default_discount_percentage}
                                            onChange={e => setData('default_discount_percentage', Number(e.target.value))}
                                            error={!!errors.default_discount_percentage}
                                            helperText={errors.default_discount_percentage}
                                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconPercentage size={16} style={{ opacity: 0.5 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 7 }}>
                                        <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                                                Como funciona
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                                                Ao criar um novo cliente, o sistema gera automaticamente uma regra de desconto com este percentual.
                                                Este desconto é deduzido do valor da fatura da concessionária na hora de gerar a cobrança.
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1, color: 'success.main', fontWeight: 700 }}>
                                                Exemplo: Fatura R$ 500 × {data.default_discount_percentage}% = R$ {(500 * data.default_discount_percentage / 100).toFixed(2)} de desconto → Cliente paga R$ {(500 - 500 * data.default_discount_percentage / 100).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Alert severity="info" sx={{ py: 0.5 }}>
                                    Esta configuração se aplica apenas a <strong>novos clientes</strong>. Clientes já cadastrados mantêm suas próprias regras de desconto.
                                </Alert>
                            </Stack>
                        </SectionCard>

                        {/* Taxa do Produtor */}
                        <SectionCard
                            icon={IconSolarPanel}
                            color="linear-gradient(135deg,#1e3a5f,#1e40af)"
                            title="Taxa de Administração Padrão — Produtor Solar"
                            description="Taxa de administração cobrada sobre a operação das usinas do produtor."
                        >
                            <Stack spacing={2}>
                                <Grid container spacing={3} alignItems="flex-start">
                                    <Grid size={{ xs: 12, sm: 5 }}>
                                        <TextField
                                            fullWidth
                                            label="Taxa de administração (%)"
                                            type="number"
                                            value={data.default_producer_fee_percentage}
                                            onChange={e => setData('default_producer_fee_percentage', Number(e.target.value))}
                                            error={!!errors.default_producer_fee_percentage}
                                            helperText={errors.default_producer_fee_percentage}
                                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconPercentage size={16} style={{ opacity: 0.5 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 7 }}>
                                        <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                                                Como funciona
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                                                Ao cadastrar um novo produtor, o sistema cria automaticamente uma regra de taxa de administração com este percentual.
                                                Esta taxa representa a remuneração da Casa Verde pela gestão e operação da energia gerada.
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 700 }}>
                                                Taxa atual: {data.default_producer_fee_percentage}% sobre o valor operado
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Alert severity="info" sx={{ py: 0.5 }}>
                                    Esta configuração se aplica apenas a <strong>novos produtores</strong>. Produtores já cadastrados mantêm suas próprias regras de taxa.
                                </Alert>
                            </Stack>
                        </SectionCard>

                        {/* Botão de salvar */}
                        <Divider />

                        <Stack direction="row" justifyContent="flex-end" gap={1.5}>
                            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, px: 2, py: 1, border: '1px solid', borderColor: 'grey.200' }}>
                                <Typography variant="caption" color="text.secondary">
                                    <IconLeaf size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                    Apenas administradores podem alterar estas configurações.
                                </Typography>
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                startIcon={processing ? <CircularProgress size={15} color="inherit" /> : <IconCheck size={17} />}
                                sx={{ px: 3 }}
                            >
                                Salvar configurações
                            </Button>
                        </Stack>

                    </Stack>
                </Box>
            </Stack>
        </Layout>
    );
}

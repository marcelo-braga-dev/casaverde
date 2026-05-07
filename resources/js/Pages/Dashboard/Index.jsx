import {
    Box,
    Button,
    Grid,
    LinearProgress,
    Stack,
    Typography,
} from '@mui/material';
import {
    IconCircleCheck,
    IconFileInvoice,
    IconFileText,
    IconPlus,
    IconSolarPanel,
    IconUsers,
} from '@tabler/icons-react';

import AppShell from '@/Layouts/AppShell/AppShell';
import DataCard from '@/Components/UI/DataCard';
import SectionCard from '@/Components/Dashboard/SectionCard';
import StatusChip from '@/Components/UI/StatusChip';
import RevenueAreaChart from '@/Components/Charts/RevenueAreaChart';
import ProposalStatusChart from '@/Components/Charts/ProposalStatusChart';
import EnergyGenerationChart from '@/Components/Charts/EnergyGenerationChart';
import formatCurrency from '@/Utils/formatCurrency';

export default function DashboardIndex({
                                           metrics = {},
                                           revenueChart = [],
                                           proposalsChart = [],
                                           energyChart = [],
                                           recentBills = [],
                                       }) {
    const cards = [
        {
            title: 'Clientes ativos',
            value: metrics.activeClients ?? 128,
            helper: 'Base de clientes em operação',
            icon: IconUsers,
            color: 'primary.main',
        },
        {
            title: 'Propostas',
            value: metrics.proposals ?? 86,
            helper: 'Emitidas no ciclo atual',
            icon: IconFileText,
            color: 'secondary.main',
        },
        {
            title: 'Contratos',
            value: metrics.contracts ?? 43,
            helper: 'Assinados ou ativos',
            icon: IconCircleCheck,
            color: 'success.main',
        },
        {
            title: 'Faturas em revisão',
            value: metrics.pendingBills ?? 14,
            helper: 'Aguardando validação',
            icon: IconFileInvoice,
            color: 'warning.main',
        },
    ];

    const bills = recentBills.length
        ? recentBills
        : [
            {
                id: 1,
                client: 'Cliente exemplo',
                status: 'pending_review',
                amount: 428.9,
            },
            {
                id: 2,
                client: 'Unidade consumidora A',
                status: 'approved',
                amount: 712.2,
            },
            {
                id: 3,
                client: 'Cliente energia solar',
                status: 'issued',
                amount: 389.7,
            },
        ];

    return (
        <AppShell
            title="Dashboard"
            subtitle="Visão executiva da operação Casa Verde."
            breadcrumbs={[
                { label: 'Casa Verde' },
                { label: 'Dashboard' },
            ]}
            actions={
                <Button
                    variant="contained"
                    startIcon={<IconPlus size={18} />}
                >
                    Nova ação
                </Button>
            }
        >
            <Box
                sx={{
                    mb: 3,
                    p: {
                        xs: 2.5,
                        md: 4,
                    },
                    borderRadius: 6,
                    color: '#FFFFFF',
                    position: 'relative',
                    overflow: 'hidden',
                    background: (theme) => theme.palette.casaVerde.gradientHero,
                    boxShadow: '0 26px 70px rgba(15,23,42,0.20)',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: -100,
                        top: -100,
                        width: 280,
                        height: 280,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                    }}
                />

                <Grid container spacing={3} alignItems="center" sx={{ position: 'relative' }}>
                    <Grid item xs={12} lg={7}>
                        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(255,255,255,0.12)',
                                }}
                            >
                                <IconSolarPanel size={22} />
                            </Box>

                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'rgba(255,255,255,0.72)',
                                }}
                            >
                                Casa Verde OS
                            </Typography>
                        </Stack>

                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 950,
                                letterSpacing: '-0.06em',
                                maxWidth: 780,
                            }}
                        >
                            Gestão completa de energia por assinatura em uma interface premium.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mt: 1.4,
                                maxWidth: 720,
                                color: 'rgba(255,255,255,0.72)',
                            }}
                        >
                            Clientes, produtores, usinas, contratos, propostas, importação de faturas
                            e validação operacional integrados em um painel moderno e rápido.
                        </Typography>

                        <Stack direction="row" gap={1.2} flexWrap="wrap" sx={{ mt: 2.6 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#FFFFFF',
                                    color: '#064E3B',
                                    '&:hover': {
                                        bgcolor: '#F8FAFC',
                                    },
                                }}
                            >
                                Criar cliente
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    color: '#FFFFFF',
                                    borderColor: 'rgba(255,255,255,0.28)',
                                    '&:hover': {
                                        borderColor: '#FFFFFF',
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                    },
                                }}
                            >
                                Emitir proposta
                            </Button>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} lg={5}>
                        <Box
                            sx={{
                                p: 2.2,
                                borderRadius: 5,
                                bgcolor: 'rgba(255,255,255,0.10)',
                                border: '1px solid rgba(255,255,255,0.16)',
                                backdropFilter: 'blur(16px)',
                            }}
                        >
                            <Stack gap={2}>
                                <Box>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                                            Meta comercial
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                                            74%
                                        </Typography>
                                    </Stack>

                                    <LinearProgress
                                        variant="determinate"
                                        value={74}
                                        sx={{
                                            mt: 1,
                                            height: 9,
                                            borderRadius: 999,
                                            bgcolor: 'rgba(255,255,255,0.16)',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 999,
                                                bgcolor: '#10B981',
                                            },
                                        }}
                                    />
                                </Box>

                                <Stack direction="row" justifyContent="space-between" gap={2}>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'rgba(255,255,255,0.64)' }}
                                        >
                                            Receita prevista
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 950 }}>
                                            {formatCurrency(metrics.forecastRevenue ?? 148600)}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'rgba(255,255,255,0.64)' }}
                                        >
                                            Energia compensada
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 950 }}>
                                            {metrics.energyCompensated ?? 48200} kWh
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={2.5}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} lg={3} key={card.title}>
                        <DataCard {...card} />
                    </Grid>
                ))}

                <Grid item xs={12} lg={8}>
                    <SectionCard
                        title="Receita e evolução comercial"
                        subtitle="Acompanhamento do desempenho mensal."
                    >
                        <RevenueAreaChart data={revenueChart?.length ? revenueChart : undefined} />
                    </SectionCard>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <SectionCard
                        title="Status das propostas"
                        subtitle="Distribuição por etapa comercial."
                    >
                        <ProposalStatusChart data={proposalsChart?.length ? proposalsChart : undefined} />
                    </SectionCard>
                </Grid>

                <Grid item xs={12} lg={7}>
                    <SectionCard
                        title="Energia gerada"
                        subtitle="Volume mensal de geração e compensação."
                    >
                        <EnergyGenerationChart data={energyChart?.length ? energyChart : undefined} />
                    </SectionCard>
                </Grid>

                <Grid item xs={12} lg={5}>
                    <SectionCard
                        title="Faturas recentes"
                        subtitle="Últimas faturas importadas ou revisadas."
                        action={
                            <Button size="small" variant="outlined">
                                Ver todas
                            </Button>
                        }
                    >
                        <Stack gap={1.3}>
                            {bills.map((bill) => (
                                <Stack
                                    key={bill.id}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    gap={2}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 3.5,
                                        bgcolor: 'grey.50',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 850 }}>
                                            {bill.client}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatCurrency(bill.amount)}
                                        </Typography>
                                    </Box>

                                    <StatusChip status={bill.status} />
                                </Stack>
                            ))}
                        </Stack>
                    </SectionCard>
                </Grid>
            </Grid>
        </AppShell>
    );
}

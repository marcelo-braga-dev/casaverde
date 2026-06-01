import Layout from '@/Layouts/UserLayout/Layout.jsx';
import ReportMetricCard from '@/Components/Reports/ReportMetricCard';
import ReportChartCard from '@/Components/Reports/ReportChartCard';
import ClientBillEconomyChart from '@/Components/Reports/charts/ClientBillEconomyChart';
import ClientConsumptionChart from '@/Components/Reports/charts/ClientConsumptionChart';
import GaugeProgressChart from '@/Components/Reports/charts/GaugeProgressChart';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconAlertCircle,
    IconArrowRight,
    IconCalendar,
    IconCash,
    IconDownload,
    IconFileExport,
    IconFileInvoice,
    IconLeaf,
    IconTableExport,
    IconTrendingUp,
} from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const MONTHS_PT = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const STATUS_MAP = {
    paid:            { label: 'Pago',          color: 'success' },
    open:            { label: 'Em Aberto',     color: 'warning' },
    waiting_payment: { label: 'Ag. Pgto',      color: 'info' },
    overdue:         { label: 'Vencido',       color: 'error' },
    cancelled:       { label: 'Cancelado',     color: 'default' },
};

function MonthSelector({ value, onChange }) {
    return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
                size="small"
                variant={!value ? 'contained' : 'outlined'}
                onClick={() => onChange(null)}
                sx={{ minWidth: 80 }}
            >
                Todos
            </Button>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <Button
                    key={m}
                    size="small"
                    variant={value === m ? 'contained' : 'outlined'}
                    onClick={() => onChange(m)}
                    sx={{ minWidth: 56 }}
                >
                    {MONTHS_PT[m].slice(0, 3)}
                </Button>
            ))}
        </Box>
    );
}

export default function Page({ report }) {
    const { data, setData } = useForm({
        year:  report?.filters?.year  ?? new Date().getFullYear(),
        month: report?.filters?.month ?? '',
    });

    function applyFilters(overrides = {}) {
        const params = { year: data.year, month: data.month, ...overrides };
        if (!params.month) delete params.month;
        router.get(safeRoute('cliente.relatorios.economia'), params, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    }

    const profile  = report?.profile;
    const summary  = report?.summary ?? {};
    const monthly  = report?.monthly ?? [];
    const selected = report?.selected;
    const allTime  = report?.allTime ?? {};
    const years    = report?.years ?? [];

    const chartData = monthly
        .filter(m => m.has_data)
        .map(m => ({
            label:           m.label,
            original_amount: m.original_amount,
            final_amount:    m.final_amount,
            net_savings:     m.net_savings,
            consumo_kwh:     m.consumo_kwh,
        }));

    const savingsPct = summary.savings_percent_year ?? 0;
    const hasData    = (summary.months_with_data ?? 0) > 0;

    return (
        <Layout
            titlePage="Relatório de Economia"
            menu="cliente-relatorios"
            subMenu="cliente-relatorio-economia"
            subtitle="Compare o que pagaria à concessionária com o que paga com a Casa Verde."
            breadcrumbs={[
                { label: 'Cliente' },
                { label: 'Relatórios', href: safeRoute('cliente.relatorios.index') },
                { label: 'Economia' },
            ]}
        >
            <Head title="Relatório de Economia" />

            <Stack spacing={3}>

                {/* ── Filtros + Exportação ─────────────────────────────── */}
                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
                            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <IconCalendar size={18} style={{ opacity: 0.5 }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Ano:</Typography>
                                </Stack>

                                <TextField
                                    select
                                    size="small"
                                    value={data.year}
                                    onChange={e => {
                                        setData('year', e.target.value);
                                        applyFilters({ year: e.target.value });
                                    }}
                                    sx={{ minWidth: 110 }}
                                >
                                    {years.length > 0
                                        ? years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)
                                        : <MenuItem value={data.year}>{data.year}</MenuItem>
                                    }
                                </TextField>

                                <Typography variant="body2" color="text.secondary">
                                    Selecione um mês para ver o detalhe:
                                </Typography>
                            </Stack>

                            <Stack direction="row" gap={1}>
                                <Tooltip title="Exportar Excel">
                                    <Button
                                        component="a"
                                        href={`${safeRoute('cliente.relatorios.economia.excel')}?year=${data.year}`}
                                        variant="outlined"
                                        startIcon={<IconTableExport size={16} />}
                                        size="small"
                                    >
                                        Excel
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Exportar PDF">
                                    <Button
                                        component="a"
                                        href={`${safeRoute('cliente.relatorios.economia.pdf')}?year=${data.year}`}
                                        variant="contained"
                                        startIcon={<IconFileExport size={16} />}
                                        size="small"
                                    >
                                        PDF
                                    </Button>
                                </Tooltip>
                            </Stack>
                        </Stack>

                        <Box sx={{ mt: 2 }}>
                            <MonthSelector
                                value={report?.filters?.month ?? null}
                                onChange={m => applyFilters({ month: m ?? '' })}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* ── Banner do cliente ──────────────────────────────────── */}
                {profile && (
                    <Card sx={{ background: 'linear-gradient(135deg,#064e3b,#065f46)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                        <CardContent>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
                                <Stack direction="row" alignItems="center" gap={2}>
                                    <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconLeaf size={24} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            {profile.display_name}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                            Código: {profile.client_code} · Desconto: {profile.discount}%
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                        Análise: {data.year}
                                    </Typography>
                                    {hasData && (
                                        <Typography sx={{ fontWeight: 950, fontSize: 20, color: '#6ee7b7', letterSpacing: '-0.04em' }}>
                                            {formatMoney(summary.total_savings ?? 0)} economizados
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                {!hasData && (
                    <Alert severity="info" icon={<IconAlertCircle />}>
                        Nenhuma fatura ou cobrança encontrada para o ano {data.year}. Selecione outro ano ou aguarde o processamento das faturas.
                    </Alert>
                )}

                {hasData && (
                    <>
                        {/* ── KPIs principais ───────────────────────────── */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <ReportMetricCard
                                    title="Sem Casa Verde pagaria"
                                    value={formatMoney(summary.total_original_amount ?? 0)}
                                    helper="Valor cheio das faturas"
                                    icon={IconFileInvoice}
                                    color="warning.main"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <ReportMetricCard
                                    title="Com Casa Verde você paga"
                                    value={formatMoney(summary.total_final_amount ?? 0)}
                                    helper={`Desconto de ${summary.avg_discount_percent ?? 0}%`}
                                    icon={IconLeaf}
                                    color="primary.main"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <ReportMetricCard
                                    title="Total economizado"
                                    value={formatMoney(summary.total_savings ?? 0)}
                                    helper={`${summary.savings_percent_year ?? 0}% do valor total`}
                                    icon={IconLeaf}
                                    color="success.main"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <ReportMetricCard
                                    title="Economia média/mês"
                                    value={formatMoney(summary.avg_savings_month ?? 0)}
                                    helper={`Em ${summary.months_with_data ?? 0} meses com dados`}
                                    icon={IconTrendingUp}
                                    color="success.main"
                                />
                            </Grid>
                        </Grid>

                        {/* ── Gráficos ──────────────────────────────────── */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, lg: 8 }}>
                                <ReportChartCard
                                    title="Comparativo Mensal: Concessionária × Casa Verde"
                                    subtitle="Barras: valor original e valor com desconto. Linha: sua economia."
                                    height={320}
                                >
                                    <ClientBillEconomyChart data={chartData} />
                                </ReportChartCard>
                            </Grid>

                            <Grid size={{ xs: 12, lg: 4 }}>
                                <ReportChartCard
                                    title="Taxa de Economia"
                                    subtitle="Percentual economizado sobre o valor total das faturas."
                                    height={320}
                                >
                                    <GaugeProgressChart
                                        value={savingsPct}
                                        label="Economizou"
                                        helper={`${formatMoney(summary.total_savings ?? 0)} de ${formatMoney(summary.total_original_amount ?? 0)}`}
                                    />
                                </ReportChartCard>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <ReportChartCard
                                    title="Histórico de Consumo (kWh)"
                                    subtitle="Seu consumo de energia mês a mês."
                                    height={240}
                                >
                                    <ClientConsumptionChart data={chartData} />
                                </ReportChartCard>
                            </Grid>
                        </Grid>

                        {/* ── Detalhe do mês selecionado ────────────────── */}
                        {selected && Object.keys(selected).length > 0 && (
                            <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '2px solid #10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.12)' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                            <IconCalendar size={20} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                                Detalhe: {MONTHS_PT[selected.month]} de {selected.year}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selected.concessionaria && `Concessionária: ${selected.concessionaria}`}
                                                {selected.unidade_consumidora && ` · UC: ${selected.unidade_consumidora}`}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={3}>
                                        {/* Cálculo visual */}
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2.5 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2 }}>
                                                    Cálculo da economia
                                                </Typography>

                                                <Stack spacing={1.5}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Stack>
                                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>Fatura da concessionária</Typography>
                                                            <Typography variant="caption" color="text.secondary">Valor cheio, sem desconto</Typography>
                                                        </Stack>
                                                        <Typography variant="body1" sx={{ fontWeight: 900, color: 'warning.main' }}>
                                                            {formatMoney(selected.original_amount ?? 0)}
                                                        </Typography>
                                                    </Stack>

                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Stack>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                                                                Desconto Casa Verde ({selected.discount_percent ?? 0}%)
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">Desconto contratual</Typography>
                                                        </Stack>
                                                        <Typography variant="body1" sx={{ fontWeight: 900, color: 'success.main' }}>
                                                            -{formatMoney(selected.discount_amount ?? 0)}
                                                        </Typography>
                                                    </Stack>

                                                    {(selected.manual_discount ?? 0) > 0 && (
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography variant="body2" color="success.dark">Desconto manual</Typography>
                                                            <Typography variant="body2" color="success.dark">-{formatMoney(selected.manual_discount)}</Typography>
                                                        </Stack>
                                                    )}

                                                    <Divider />

                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Stack>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Valor Casa Verde</Typography>
                                                            <Typography variant="caption" color="text.secondary">O que você paga</Typography>
                                                        </Stack>
                                                        <Typography variant="h6" sx={{ fontWeight: 950, color: 'primary.main', letterSpacing: '-0.04em' }}>
                                                            {formatMoney(selected.final_amount ?? 0)}
                                                        </Typography>
                                                    </Stack>

                                                    <Box sx={{ bgcolor: '#f0fdf4', borderRadius: 1.5, p: 1.5, border: '1px solid #d1fae5' }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.dark' }}>
                                                                Você economizou
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 950, color: 'success.main', letterSpacing: '-0.04em' }}>
                                                                {formatMoney(selected.net_savings ?? 0)}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography variant="caption" color="success.dark">
                                                            {selected.savings_percent ?? 0}% do valor original
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Grid>

                                        {/* Info do mês */}
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>Informações do mês</Typography>
                                                    {[
                                                        ['Consumo', selected.consumo_kwh ? `${selected.consumo_kwh} kWh` : '—'],
                                                        ['Vencimento', selected.vencimento ?? '—'],
                                                        ['Status', null],
                                                        ['Pago em', selected.paid_at ?? '—'],
                                                    ].map(([label, val]) => (
                                                        <Stack key={label} direction="row" justifyContent="space-between" alignItems="center" py={0.6}>
                                                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                                                            {label === 'Status' ? (
                                                                <Chip
                                                                    label={STATUS_MAP[selected.status]?.label ?? selected.status ?? '—'}
                                                                    color={STATUS_MAP[selected.status]?.color ?? 'default'}
                                                                    size="small"
                                                                />
                                                            ) : (
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{val}</Typography>
                                                            )}
                                                        </Stack>
                                                    ))}
                                                </Box>

                                                <Stack direction="row" gap={1}>
                                                    {selected.bill_id && (
                                                        <Button
                                                            component={Link}
                                                            href={safeRoute('cliente.faturas.show', selected.bill_id)}
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<IconFileInvoice size={15} />}
                                                        >
                                                            Ver fatura
                                                        </Button>
                                                    )}
                                                    {selected.charge_id && (
                                                        <Button
                                                            component={Link}
                                                            href={safeRoute('cliente.cobrancas.show', selected.charge_id)}
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<IconCash size={15} />}
                                                        >
                                                            Ver cobrança
                                                        </Button>
                                                    )}
                                                    {selected.pdf_url && (
                                                        <Button
                                                            component="a"
                                                            href={selected.pdf_url}
                                                            target="_blank"
                                                            variant="text"
                                                            size="small"
                                                            startIcon={<IconDownload size={15} />}
                                                        >
                                                            PDF fatura
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Tabela mensal completa ─────────────────────── */}
                        <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                            Detalhamento Mensal
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Clique em um mês para ver o detalhe completo.
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" gap={1}>
                                        <Button component="a" href={`${safeRoute('cliente.relatorios.economia.excel')}?year=${data.year}`} size="small" variant="outlined" startIcon={<IconTableExport size={15} />}>
                                            Excel
                                        </Button>
                                        <Button component="a" href={`${safeRoute('cliente.relatorios.economia.pdf')}?year=${data.year}`} size="small" variant="contained" startIcon={<IconFileExport size={15} />}>
                                            PDF
                                        </Button>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ mb: 1.5 }} />

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Mês</TableCell>
                                                <TableCell align="right">kWh</TableCell>
                                                <TableCell align="right" sx={{ color: 'warning.dark', fontWeight: 700 }}>Fatura Concessionária</TableCell>
                                                <TableCell align="right">Desconto</TableCell>
                                                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 700 }}>Valor Casa Verde</TableCell>
                                                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 700 }}>Economia</TableCell>
                                                <TableCell align="right">%</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right" />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {monthly.map(m => {
                                                const st = STATUS_MAP[m.status] ?? null;
                                                const isSelected = report?.filters?.month === m.month;
                                                return (
                                                    <TableRow
                                                        key={m.month}
                                                        hover={m.has_data}
                                                        sx={{
                                                            opacity: m.has_data ? 1 : 0.4,
                                                            bgcolor: isSelected ? 'rgba(16,185,129,0.06)' : 'inherit',
                                                            cursor: m.has_data ? 'pointer' : 'default',
                                                        }}
                                                        onClick={() => m.has_data && applyFilters({ month: m.month })}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                                {m.month_name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2">{m.consumo_kwh > 0 ? m.consumo_kwh : '—'}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {m.has_data
                                                                ? <Typography variant="body2" sx={{ color: 'warning.dark', fontWeight: 700 }}>{formatMoney(m.original_amount)}</Typography>
                                                                : <Typography variant="body2" color="text.disabled">—</Typography>
                                                            }
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {m.has_data && <Typography variant="body2" color="success.main">-{m.discount_percent}%</Typography>}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {m.has_data
                                                                ? <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 900 }}>{formatMoney(m.final_amount)}</Typography>
                                                                : <Typography variant="body2" color="text.disabled">—</Typography>
                                                            }
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {m.has_data
                                                                ? <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>{formatMoney(m.net_savings)}</Typography>
                                                                : <Typography variant="body2" color="text.disabled">—</Typography>
                                                            }
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {m.has_data && <Chip label={`${m.savings_percent}%`} color="success" size="small" variant="outlined" />}
                                                        </TableCell>
                                                        <TableCell>
                                                            {st && <Chip label={st.label} color={st.color} size="small" />}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {m.has_data && (
                                                                <Button
                                                                    size="small"
                                                                    variant="text"
                                                                    endIcon={<IconArrowRight size={13} />}
                                                                    onClick={e => { e.stopPropagation(); applyFilters({ month: m.month }); }}
                                                                >
                                                                    Ver
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Totais */}
                                {hasData && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: '#064e3b', borderRadius: 2, color: '#fff' }}>
                                        <Grid container spacing={2}>
                                            {[
                                                { label: 'Total concessionária', value: formatMoney(summary.total_original_amount ?? 0), highlight: false },
                                                { label: 'Total Casa Verde', value: formatMoney(summary.total_final_amount ?? 0), highlight: true },
                                                { label: 'Total economizado', value: formatMoney(summary.total_savings ?? 0), highlight: true },
                                                { label: 'Desconto médio', value: `${summary.savings_percent_year ?? 0}%`, highlight: false },
                                            ].map(item => (
                                                <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', display: 'block' }}>{item.label}</Typography>
                                                    <Typography sx={{ fontWeight: 950, fontSize: 15, color: item.highlight ? '#6ee7b7' : '#fff' }}>{item.value}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* ── Histórico geral + call to action ─────────── */}
                        {allTime.total_charges > 0 && (
                            <Card sx={{ background: 'linear-gradient(135deg,#064e3b,#065f46)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                                <CardContent>
                                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" gap={3}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                                {formatMoney(allTime.total_savings ?? 0)}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 0.4 }}>
                                                Economizados no total desde que você é cliente Casa Verde
                                            </Typography>
                                            <Typography sx={{ color: '#6ee7b7', fontWeight: 700, mt: 1, fontSize: 14 }}>
                                                Isso é {allTime.overall_savings_pct ?? 0}% de economia sobre {formatMoney(allTime.total_original ?? 0)} que você pagaria à concessionária.
                                            </Typography>
                                        </Box>

                                        <Stack direction="row" gap={1.5}>
                                            <Button
                                                component="a"
                                                href={`${safeRoute('cliente.relatorios.economia.pdf')}?year=${data.year}`}
                                                variant="contained"
                                                startIcon={<IconFileExport size={17} />}
                                                sx={{ bgcolor: '#fff', color: '#064e3b', '&:hover': { bgcolor: 'grey.100' } }}
                                            >
                                                Exportar PDF
                                            </Button>
                                            <Button
                                                component="a"
                                                href={`${safeRoute('cliente.relatorios.economia.excel')}?year=${data.year}`}
                                                variant="outlined"
                                                startIcon={<IconTableExport size={17} />}
                                                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                                            >
                                                Excel
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </Stack>
        </Layout>
    );
}

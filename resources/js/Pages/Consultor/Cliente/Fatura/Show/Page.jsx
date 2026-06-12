import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import { getStatusLabel } from "@/Utils/statusLabels.js";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
    Tab,
    LinearProgress,
    Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
    IconAlertTriangle,
    IconCheck,
    IconCircleCheck,
    IconDeviceFloppy,
    IconExternalLink,
    IconFileInvoice,
    IconInfoCircle,
    IconListCheck,
    IconPencil,
    IconReceipt,
    IconWallet,
    IconX,
} from "@tabler/icons-react";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const isInvalid = (v) => v === null || v === undefined || String(v).trim() === "" || v === "-";

const parseBrazilianNumber = (value) => {
    if (value === null || value === undefined || value === "") return NaN;
    if (typeof value === "number") return value;
    let n = String(value).replace("R$", "").replace(/\s/g, "").trim();
    const hasComma = n.includes(","), hasDot = n.includes(".");
    if (hasComma && hasDot) n = n.replace(/\./g, "").replace(",", ".");
    else if (hasComma) n = n.replace(",", ".");
    return Number(n);
};
const isInvalidNumber = (v) => { if (isInvalid(v)) return true; const n = parseBrazilianNumber(v); return Number.isNaN(n) || n <= 0; };
const isInvalidField = ({ value, validation = "text" }) => validation === "money" || validation === "positive" ? isInvalidNumber(value) : isInvalid(value);
const normalizeNumberForCompare = (v) => { const n = parseBrazilianNumber(v); return Number.isNaN(n) ? "" : n.toFixed(2); };
const normalizeDecimalTyping = (v) => String(v).replace(/[^\d.,]/g, "").replace(/(,.*),/g, "$1").replace(/(\..*)\./g, "$1");
const inputDecimalValue = (v) => { const n = parseBrazilianNumber(v); return (Number.isNaN(n) || n <= 0) ? "" : String(v); };
const formatMoney = (v) => { if (isInvalid(v)) return ""; const n = parseBrazilianNumber(v); if (Number.isNaN(n)) return v; return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
const formatNumber = (v) => { if (isInvalid(v)) return ""; const n = parseBrazilianNumber(v); if (Number.isNaN(n)) return v; return n.toLocaleString("pt-BR"); };
const formatDate = (v) => {
    if (isInvalid(v)) return "";
    const s = String(v);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const [y, m, d] = s.split("-"); return `${d}/${m}/${y}`; }
    const dt = new Date(v);
    return Number.isNaN(dt.getTime()) ? v : dt.toLocaleDateString("pt-BR");
};
const toInputDate = (v) => {
    if (isInvalid(v)) return "";
    const s = String(v);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const dt = new Date(v);
    return Number.isNaN(dt.getTime()) ? v : dt.toISOString().slice(0, 10);
};

/* ─── sub-components ──────────────────────────────────────────────────── */
const SectionHeader = ({ icon, label, gradient }) => (
    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        <Box sx={{ width: 36, height: 36, borderRadius: 1.5, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icon}
        </Box>
        <Typography variant="h6" fontWeight={950} letterSpacing="-0.02em">{label}</Typography>
        <Divider sx={{ flex: 1 }} />
    </Stack>
);

const InfoRow = ({ label, children }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.8} sx={{ borderBottom: "1px solid", borderColor: "divider", "&:last-child": { border: 0 } }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Box sx={{ textAlign: "right", maxWidth: "60%" }}>{typeof children === "string" || typeof children === "number" ? <Typography variant="body2" fontWeight={700}>{children || "—"}</Typography> : children}</Box>
    </Stack>
);

const ExtractedField = ({ label, value, validation = "text" }) => {
    const invalid = isInvalidField({ value, validation });
    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 1.5, height: "100%", borderRadius: 2, borderColor: invalid ? "error.main" : "divider", bgcolor: invalid ? "rgba(239,68,68,0.04)" : "transparent", transition: "all .2s" }}>
                <Typography variant="caption" color={invalid ? "error.main" : "text.secondary"} fontWeight={600}>{label}</Typography>
                <Typography fontWeight={700} color={invalid ? "error.main" : "text.primary"} sx={{ mt: 0.25, fontSize: "0.9rem", wordBreak: "break-word" }}>
                    {invalid ? <Stack direction="row" alignItems="center" spacing={0.5}><IconX size={14} /><span>Inválido</span></Stack> : (value || "—")}
                </Typography>
            </Paper>
        </Grid>
    );
};

/* ─── Page ────────────────────────────────────────────────────────────── */
const Page = ({ bill, suggestedUsinaId, reviewStatuses = [], usinas = [], consumerUnits = [] }) => {
    const [tab, setTab] = useState("dados");

    const initialData = useMemo(() => ({
        review_status: bill.review_status ?? "pending_review",
        consumer_unit_id: bill.consumer_unit_id ?? "",
        usina_id: bill.usina_id ?? suggestedUsinaId ?? "",
        concessionaria_id: bill.concessionaria_id ?? bill.concessionaria?.id ?? "",
        review_notes: bill.review_notes ?? "",
        nome: bill.nome ?? bill.extracted_payload?.nome ?? "",
        unidade_consumidora: bill.unidade_consumidora ?? bill.extracted_payload?.unidade_consumidora ?? "",
        numero_instalacao: bill.numero_instalacao ?? bill.extracted_payload?.numero_instalacao ?? "",
        reference_label: bill.reference_label ?? bill.extracted_payload?.reference_label ?? "",
        reference_month: bill.reference_month ?? bill.extracted_payload?.reference_month ?? "",
        reference_year: bill.reference_year ?? bill.extracted_payload?.reference_year ?? "",
        vencimento: toInputDate(bill.vencimento ?? bill.extracted_payload?.vencimento),
        valor_total: inputDecimalValue(bill.valor_total ?? bill.extracted_payload?.valor_total),
        consumo_kwh: inputDecimalValue(bill.consumo_kwh ?? bill.extracted_payload?.consumo_kwh),
    }), [bill, suggestedUsinaId]);

    const { data, setData, put, processing, errors } = useForm(initialData);
    const [savedData, setSavedData] = useState(initialData);

    useEffect(() => { setSavedData(initialData); setData(initialData); }, [initialData]);

    const requiredFields = [
        { label: "Nome do titular", value: data.nome, validation: "text" },
        { label: "Unidade Consumidora", value: data.unidade_consumidora, validation: "positive" },
        { label: "Número da instalação", value: data.numero_instalacao, validation: "text" },
        { label: "Referência / Mês-Ano", value: data.reference_label, validation: "text" },
        { label: "Mês de referência", value: data.reference_month, validation: "positive" },
        { label: "Ano de referência", value: data.reference_year, validation: "positive" },
        { label: "Vencimento", value: formatDate(data.vencimento), validation: "text" },
        { label: "Valor total / Valor cobrado", value: formatMoney(data.valor_total), validation: "money" },
        { label: "Consumo kWh", value: formatNumber(data.consumo_kwh), validation: "positive" },
        { label: "Concessionária", value: bill.concessionaria?.nome, validation: "text" },
        { label: "PDF", value: bill.pdf_original_name, validation: "text" },
        { label: "Origem da importação", value: bill.import_source, validation: "text" },
    ];

    const invalidFields = requiredFields.filter((f) => isInvalidField(f));
    const pendingIssues = (bill.issues ?? []).filter((i) => !i.is_resolved);

    const hasUnsavedChanges = Object.keys(savedData).some((key) => {
        if (["valor_total", "consumo_kwh"].includes(key)) return normalizeNumberForCompare(savedData[key]) !== normalizeNumberForCompare(data[key]);
        return String(savedData[key] ?? "") !== String(data[key] ?? "");
    });

    const canApprove = data.review_status === "pending_review" && invalidFields.length === 0 && !hasUnsavedChanges && !processing;

    const submit = (e) => {
        e.preventDefault();
        put(route("consultor.cliente.faturas.update", bill.id), { preserveScroll: true, onSuccess: () => setSavedData({ ...data }) });
    };

    const approve = () => { if (!canApprove) return; router.post(route("consultor.cliente.faturas.approve", bill.id), {}, { preserveScroll: true }); };
    const resolveIssue = (issueId) => router.post(route("consultor.cliente.faturas.issues.resolve", issueId), {}, { preserveScroll: true });
    const clearInvalidDecimalOnFocus = (field) => { if (isInvalidNumber(data[field])) setData(field, ""); };
    const formatDecimalOnBlur = (field) => { const n = parseBrazilianNumber(data[field]); if (!Number.isNaN(n) && n > 0) setData(field, n.toFixed(2)); };

    const reviewStatusColor = bill.review_status === "approved" ? "success" : bill.review_status === "pending_review" ? "warning" : "default";
    const parserStatusColor = bill.parser_status === "success" ? "success" : bill.parser_status === "error" ? "error" : "default";

    return (
        <Layout titlePage={`Fatura #${bill.id}`} menu="financeiro" subMenu="financeiro-faturas" backPage>
            <Head title={`Fatura #${bill.id}`} />

            {/* ── Hero Card ──────────────────────────────────────────── */}
            <Card sx={{ mb: 3, borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)", overflow: "hidden" }}>
                <Box sx={{ background: "linear-gradient(135deg,#f59e0b22,#d9770622)", p: { xs: 2.5, md: 3 } }}>
                    <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ width: 52, height: 52, borderRadius: 2, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <IconFileInvoice size={26} color="#fff" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={900} letterSpacing="-0.03em">Fatura #{bill.id}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bill.client_profile?.nome || bill.client_profile?.razao_social || "Cliente não vinculado"} · {bill.reference_label || `${bill.reference_month}/${bill.reference_year}` || "Referência não definida"}
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip label={getStatusLabel(bill.review_status)} color={reviewStatusColor} size="small" sx={{ fontWeight: 700 }} />
                            <Chip label={`Parser: ${getStatusLabel(bill.parser_status)}`} color={parserStatusColor} size="small" variant="outlined" />
                        </Stack>
                    </Stack>

                    {/* progress bar: fields complete */}
                    <Box sx={{ mt: 2 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Completude dos dados</Typography>
                            <Typography variant="caption" fontWeight={700} color={invalidFields.length === 0 ? "success.main" : "warning.main"}>
                                {requiredFields.length - invalidFields.length}/{requiredFields.length} campos válidos
                            </Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={((requiredFields.length - invalidFields.length) / requiredFields.length) * 100}
                            color={invalidFields.length === 0 ? "success" : "warning"}
                            sx={{ height: 6, borderRadius: 3 }}
                        />
                    </Box>
                </Box>
            </Card>

            {/* ── Alerts ────────────────────────────────────────────── */}
            <Stack spacing={1} mb={3}>
                {invalidFields.length > 0 ? (
                    <Alert severity="warning" icon={<IconAlertTriangle size={18} />} sx={{ borderRadius: 2 }}>
                        <strong>{invalidFields.length} campo(s) inválido(s):</strong> {invalidFields.map(f => f.label).join(", ")}. Corrija antes de aprovar.
                    </Alert>
                ) : (
                    <Alert severity="success" sx={{ borderRadius: 2 }}>Todos os dados obrigatórios estão preenchidos e válidos.</Alert>
                )}
                {hasUnsavedChanges && (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>Você possui alterações não salvas. Salve antes de aprovar a fatura.</Alert>
                )}
                {pendingIssues.length > 0 && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        <strong>{pendingIssues.length} pendência(s) não resolvida(s)</strong> precisam de atenção.
                    </Alert>
                )}
            </Stack>

            {/* ── Stats Row ─────────────────────────────────────────── */}
            <Grid container spacing={2} mb={3}>
                {[
                    { label: "Valor Total", value: formatMoney(data.valor_total) || "—", color: "#f59e0b" },
                    { label: "Consumo kWh", value: formatNumber(data.consumo_kwh) ? `${formatNumber(data.consumo_kwh)} kWh` : "—", color: "#10b981" },
                    { label: "Vencimento", value: formatDate(data.vencimento) || "—", color: "#3b82f6" },
                    { label: "Pendências", value: pendingIssues.length === 0 ? "Nenhuma" : `${pendingIssues.length} aberta(s)`, color: pendingIssues.length > 0 ? "#ef4444" : "#64748b" },
                ].map((s) => (
                    <Grid key={s.label} size={{ xs: 6, md: 3 }}>
                        <Card sx={{ borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)", p: 2, textAlign: "center" }}>
                            <Typography variant="h6" fontWeight={900} color={s.color}>{s.value}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ── Main Content ──────────────────────────────────────── */}
            <Grid container spacing={3}>
                {/* LEFT COLUMN */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)" }}>
                        <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                            <TabContext value={tab}>
                                <Box sx={{ px: 2 }}>
                                    <TabList onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
                                        <Tab icon={<IconInfoCircle size={16} />} iconPosition="start" label="Dados" value="dados" />
                                        <Tab icon={<IconPencil size={16} />} iconPosition="start" label={`Edição Manual${hasUnsavedChanges ? " *" : ""}`} value="edicao" />
                                        <Tab
                                            icon={pendingIssues.length > 0 ? <IconAlertTriangle size={16} /> : <IconListCheck size={16} />}
                                            iconPosition="start"
                                            label={`Pendências (${bill.issues?.length ?? 0})`}
                                            value="pendencias"
                                        />
                                    </TabList>
                                </Box>

                                {/* TAB: Dados extraídos */}
                                <TabPanel value="dados" sx={{ p: 2.5 }}>
                                    <SectionHeader icon={<IconFileInvoice size={18} color="#fff" />} label="Campos Extraídos do PDF" gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                                    <Grid container spacing={1.5}>
                                        {requiredFields.map((field) => (
                                            <ExtractedField key={field.label} label={field.label} value={field.value} validation={field.validation} />
                                        ))}
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    <SectionHeader icon={<IconReceipt size={18} color="#fff" />} label="Vínculo e Metadados" gradient="linear-gradient(135deg,#64748b,#475569)" />
                                    <Stack spacing={0}>
                                        <InfoRow label="Cliente">{bill.client_profile?.nome || bill.client_profile?.razao_social || "—"}</InfoRow>
                                        <InfoRow label="Código do cliente">{bill.client_profile?.client_code || "—"}</InfoRow>
                                        <InfoRow label="Unidade Consumidora">
                                            {bill.consumer_unit?.display_label || bill.consumer_unit?.uc_code || (
                                                <Typography variant="body2" fontWeight={700} color="error.main">Não vinculada</Typography>
                                            )}
                                        </InfoRow>
                                        <InfoRow label="Usina vinculada">{bill.usina?.uc || "—"}</InfoRow>
                                        <InfoRow label="Usina sugerida">{suggestedUsinaId || "—"}</InfoRow>
                                        <InfoRow label="Parser">
                                            <Chip label={getStatusLabel(bill.parser_status)} color={parserStatusColor} size="small" />
                                        </InfoRow>
                                        <InfoRow label="Criado por">{bill.created_by?.name || "—"}</InfoRow>
                                        <InfoRow label="Revisado por">{bill.reviewed_by?.name || "—"}</InfoRow>
                                        <InfoRow label="Arquivo PDF">{bill.pdf_original_name || "—"}</InfoRow>
                                    </Stack>

                                    <Divider sx={{ my: 2.5 }} />
                                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                                        {bill.review_status !== "approved" && (
                                            <Tooltip title={!canApprove ? "Corrija os campos inválidos e salve antes de aprovar" : ""}>
                                                <span>
                                                    <Button color="success" variant="contained" startIcon={<IconCircleCheck size={18} />} onClick={approve} disabled={!canApprove} sx={{ fontWeight: 700 }}>
                                                        Aprovar Fatura
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        )}
                                        {bill.review_status === "approved" && (
                                            <Button variant="contained" startIcon={<IconWallet size={18} />} color="warning" onClick={() => router.post(route("admin.financeiro.cobrancas.generate-from-bill", bill.id))} sx={{ fontWeight: 700 }}>
                                                Gerar Cobrança
                                            </Button>
                                        )}
                                        <Button href={route("consultor.cliente.faturas.pdf", bill.id)} target="_blank" variant="outlined" startIcon={<IconExternalLink size={18} />}>
                                            Abrir PDF
                                        </Button>
                                    </Stack>
                                </TabPanel>

                                {/* TAB: Edição Manual */}
                                <TabPanel value="edicao" sx={{ p: 2.5 }}>
                                    <SectionHeader icon={<IconPencil size={18} color="#fff" />} label="Correção Manual dos Dados" gradient="linear-gradient(135deg,#3b82f6,#1d4ed8)" />
                                    <form onSubmit={submit}>
                                        <Stack spacing={2}>
                                            <TextField fullWidth label="Nome do titular" value={data.nome} error={Boolean(errors.nome)} helperText={errors.nome} onChange={(e) => setData("nome", e.target.value)} size="small" />
                                            <Grid container spacing={1.5}>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth label="Unidade Consumidora" value={data.unidade_consumidora} error={Boolean(errors.unidade_consumidora)} helperText={errors.unidade_consumidora} onChange={(e) => setData("unidade_consumidora", e.target.value)} size="small" />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth label="Número da instalação" value={data.numero_instalacao} error={Boolean(errors.numero_instalacao)} helperText={errors.numero_instalacao} onChange={(e) => setData("numero_instalacao", e.target.value)} size="small" />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth label="Referência / Mês-Ano" value={data.reference_label} error={Boolean(errors.reference_label)} helperText={errors.reference_label} onChange={(e) => setData("reference_label", e.target.value)} size="small" />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth type="date" label="Vencimento" value={data.vencimento} error={Boolean(errors.vencimento)} helperText={errors.vencimento} InputLabelProps={{ shrink: true }} onChange={(e) => setData("vencimento", e.target.value)} size="small" />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth type="number" label="Mês de referência" value={data.reference_month} error={Boolean(errors.reference_month)} helperText={errors.reference_month} onChange={(e) => setData("reference_month", e.target.value)} size="small" />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth type="number" label="Ano de referência" value={data.reference_year} error={Boolean(errors.reference_year)} helperText={errors.reference_year} onChange={(e) => setData("reference_year", e.target.value)} size="small" />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth label="Valor total" value={data.valor_total} error={Boolean(errors.valor_total)} helperText={errors.valor_total || "Ex: 50415.00"} onFocus={() => clearInvalidDecimalOnFocus("valor_total")} onBlur={() => formatDecimalOnBlur("valor_total")} onChange={(e) => setData("valor_total", normalizeDecimalTyping(e.target.value))} size="small" />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField fullWidth label="Consumo kWh" value={data.consumo_kwh} error={Boolean(errors.consumo_kwh)} helperText={errors.consumo_kwh || "Ex: 100 ou 100.50"} onFocus={() => clearInvalidDecimalOnFocus("consumo_kwh")} onBlur={() => formatDecimalOnBlur("consumo_kwh")} onChange={(e) => setData("consumo_kwh", normalizeDecimalTyping(e.target.value))} size="small" />
                                                </Grid>
                                            </Grid>

                                            <Divider />

                                            <FormControl fullWidth size="small" error={Boolean(errors.review_status)}>
                                                <InputLabel>Status da revisão</InputLabel>
                                                <Select label="Status da revisão" value={data.review_status} onChange={(e) => setData("review_status", e.target.value)}>
                                                    {reviewStatuses.map((s) => <MenuItem key={s} value={s}>{getStatusLabel(s)}</MenuItem>)}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth size="small" error={Boolean(errors.consumer_unit_id)}>
                                                <InputLabel>Unidade Consumidora</InputLabel>
                                                <Select label="Unidade Consumidora" value={data.consumer_unit_id} onChange={(e) => setData("consumer_unit_id", e.target.value)}>
                                                    <MenuItem value="">Nenhuma</MenuItem>
                                                    {consumerUnits.map((uc) => <MenuItem key={uc.id} value={uc.id}>{uc.display_label || uc.uc_code}</MenuItem>)}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth size="small" error={Boolean(errors.usina_id)}>
                                                <InputLabel>Usina vinculada</InputLabel>
                                                <Select label="Usina vinculada" value={data.usina_id} onChange={(e) => setData("usina_id", e.target.value)}>
                                                    <MenuItem value="">Nenhuma</MenuItem>
                                                    {usinas.map((u) => <MenuItem key={u.id} value={u.id}>UC {u.uc || u.id}{suggestedUsinaId === u.id ? " — sugerida" : ""}</MenuItem>)}
                                                </Select>
                                            </FormControl>

                                            <TextField fullWidth multiline rows={4} label="Observações da revisão" value={data.review_notes} error={Boolean(errors.review_notes)} helperText={errors.review_notes} onChange={(e) => setData("review_notes", e.target.value)} size="small" />

                                            <Button fullWidth type="submit" variant="contained" disabled={processing || !hasUnsavedChanges} startIcon={<IconDeviceFloppy size={18} />} sx={{ fontWeight: 700, py: 1.2 }}>
                                                {processing ? "Salvando..." : "Salvar Correções"}
                                            </Button>
                                        </Stack>
                                    </form>
                                </TabPanel>

                                {/* TAB: Pendências */}
                                <TabPanel value="pendencias" sx={{ p: 2.5 }}>
                                    <SectionHeader icon={<IconListCheck size={18} color="#fff" />} label="Pendências da Fatura" gradient={pendingIssues.length > 0 ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#10b981,#059669)"} />
                                    {bill.issues?.length > 0 ? (
                                        <Stack spacing={1.5}>
                                            {bill.issues.map((issue) => (
                                                <Paper key={issue.id} variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: issue.is_resolved ? "success.light" : "warning.light", bgcolor: issue.is_resolved ? "rgba(16,185,129,0.04)" : "rgba(245,158,11,0.04)" }}>
                                                    <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2}>
                                                        <Box>
                                                            <Stack direction="row" alignItems="center" spacing={1} mb={0.25}>
                                                                {issue.is_resolved ? <IconCircleCheck size={16} color="#10b981" /> : <IconAlertTriangle size={16} color="#f59e0b" />}
                                                                <Typography fontWeight={700} variant="body2">
                                                                    {issue.message || issue.description || issue.type || `Pendência #${issue.id}`}
                                                                </Typography>
                                                            </Stack>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {issue.is_resolved ? "Resolvida" : "Pendente de resolução"}
                                                            </Typography>
                                                        </Box>
                                                        {!issue.is_resolved && (
                                                            <Button size="small" color="success" variant="outlined" startIcon={<IconCheck size={14} />} onClick={() => resolveIssue(issue.id)} sx={{ flexShrink: 0, fontWeight: 700 }}>
                                                                Resolver
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Stack alignItems="center" py={4} spacing={1}>
                                            <IconCircleCheck size={48} color="#10b981" />
                                            <Typography color="text.secondary">Nenhuma pendência encontrada.</Typography>
                                        </Stack>
                                    )}
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Card>
                </Grid>

                {/* RIGHT COLUMN */}
                <Grid size={{ xs: 12, md: 5 }}>
                    {/* Resumo técnico */}
                    <Card sx={{ borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)", mb: 3 }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <SectionHeader icon={<IconInfoCircle size={18} color="#fff" />} label="Resumo Técnico" gradient="linear-gradient(135deg,#64748b,#475569)" />
                            <Stack spacing={0}>
                                <InfoRow label="Campos analisados">{requiredFields.length}</InfoRow>
                                <InfoRow label="Campos inválidos">
                                    <Typography variant="body2" fontWeight={700} color={invalidFields.length > 0 ? "error.main" : "success.main"}>
                                        {invalidFields.length}
                                    </Typography>
                                </InfoRow>
                                <InfoRow label="Alterações pendentes">
                                    <Typography variant="body2" fontWeight={700} color={hasUnsavedChanges ? "warning.main" : "text.primary"}>
                                        {hasUnsavedChanges ? "Sim" : "Não"}
                                    </Typography>
                                </InfoRow>
                                <InfoRow label="Status do parser">{bill.parser_status || "Sem status"}</InfoRow>
                                <InfoRow label="Arquivo PDF">
                                    <Typography variant="body2" fontWeight={700} color={!bill.pdf_original_name ? "error.main" : "text.primary"} noWrap sx={{ maxWidth: 180 }}>
                                        {bill.pdf_original_name || "Inválido"}
                                    </Typography>
                                </InfoRow>
                                <InfoRow label="Origem">{bill.import_source || "—"}</InfoRow>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* PDF viewer */}
                    <Card sx={{ borderRadius: "var(--cv-radius-xl)", border: "1px solid var(--cv-border-soft)", boxShadow: "var(--cv-shadow-md)" }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <SectionHeader icon={<IconFileInvoice size={18} color="#fff" />} label="PDF da Fatura" gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
                                <iframe
                                    src={route("consultor.cliente.faturas.pdf", bill.id)}
                                    title="PDF da fatura"
                                    style={{ width: "100%", height: "560px", border: "none", display: "block" }}
                                />
                            </Box>
                            <Button fullWidth href={route("consultor.cliente.faturas.pdf", bill.id)} target="_blank" variant="outlined" startIcon={<IconExternalLink size={16} />} sx={{ mt: 1.5, fontWeight: 700 }}>
                                Abrir em nova aba
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Page;

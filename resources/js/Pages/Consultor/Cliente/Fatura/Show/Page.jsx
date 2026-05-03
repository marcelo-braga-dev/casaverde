import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import { getStatusColor, getStatusLabel } from "@/Utils/statusLabels.js";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    IconAlertTriangle,
    IconCheck,
    IconCircleCheck,
    IconDeviceFloppy,
    IconExternalLink,
    IconFileInvoice,
    IconReceipt,
} from "@tabler/icons-react";

const Page = ({ bill, suggestedUsinaId, reviewStatuses = [], usinas = [] }) => {
    const initialData = useMemo(() => ({
        review_status: bill.review_status ?? "pending_review",
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

    useEffect(() => {
        setSavedData(initialData);
        setData(initialData);
    }, [initialData]);

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

    const invalidFields = requiredFields.filter((field) => isInvalidField(field));

    const hasUnsavedChanges = Object.keys(savedData).some((key) => {
        if (["valor_total", "consumo_kwh"].includes(key)) {
            return normalizeNumberForCompare(savedData[key]) !== normalizeNumberForCompare(data[key]);
        }

        return String(savedData[key] ?? "") !== String(data[key] ?? "");
    });

    const canApprove =
        data.review_status === "pending_review" &&
        invalidFields.length === 0 &&
        !hasUnsavedChanges &&
        !processing;

    const submit = (e) => {
        e.preventDefault();

        put(route("consultor.cliente.faturas.update", bill.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSavedData({ ...data });
            },
        });
    };

    const approve = () => {
        if (!canApprove) return;

        router.post(route("consultor.cliente.faturas.approve", bill.id), {}, {
            preserveScroll: true,
        });
    };

    const resolveIssue = (issueId) => {
        router.post(route("consultor.cliente.faturas.issues.resolve", issueId), {}, {
            preserveScroll: true,
        });
    };

    const clearInvalidDecimalOnFocus = (field) => {
        if (isInvalidNumber(data[field])) {
            setData(field, "");
        }
    };

    const formatDecimalOnBlur = (field) => {
        const number = parseBrazilianNumber(data[field]);

        if (!Number.isNaN(number) && number > 0) {
            setData(field, number.toFixed(2));
        }
    };

    return (
        <Layout titlePage={`Fatura #${bill.id}`} menu="clientes" subMenu="cliente-faturas" backPage>
            <Head title={`Fatura #${bill.id}`} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack spacing={1}>
                        {invalidFields.length > 0 ? (
                            <Alert severity="warning" icon={<IconAlertTriangle />}>
                                Existem {invalidFields.length} campo(s) inválido(s). Corrija manualmente antes de aprovar.
                            </Alert>
                        ) : (
                            <Alert severity="success">
                                Todos os principais dados da fatura estão preenchidos.
                            </Alert>
                        )}

                        {hasUnsavedChanges && (
                            <Alert severity="info">
                                Você possui alterações não salvas. Salve as correções antes de aprovar a fatura.
                            </Alert>
                        )}
                    </Stack>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Card>
                        <CardHeader
                            title="Dados da Fatura"
                            subheader="Campos extraídos do PDF e atualizados conforme correção manual"
                            avatar={<IconFileInvoice />}
                        />

                        <CardContent>
                            <Grid container spacing={2}>
                                {requiredFields.map((field) => (
                                    <ExtractedField
                                        key={field.label}
                                        label={field.label}
                                        value={field.value}
                                        validation={field.validation}
                                    />
                                ))}
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Button
                                    color="success"
                                    variant="contained"
                                    startIcon={<IconCircleCheck />}
                                    onClick={approve}
                                    disabled={!canApprove}
                                >
                                    Aprovar Fatura
                                </Button>

                                <Button
                                    href={route("consultor.cliente.faturas.pdf", bill.id)}
                                    target="_blank"
                                    variant="outlined"
                                    startIcon={<IconExternalLink />}
                                >
                                    Abrir PDF
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 2 }}>
                        <CardHeader title="Cliente e vínculo" avatar={<IconReceipt />} />

                        <CardContent>
                            <Grid container spacing={2}>
                                <Info label="Cliente">
                                    {bill.client_profile?.nome || bill.client_profile?.razao_social || "-"}
                                </Info>

                                <Info label="Código do cliente">
                                    {bill.client_profile?.client_code || "-"}
                                </Info>

                                <Info label="Usina vinculada">
                                    {bill.usina?.uc || "-"}
                                </Info>

                                <Info label="Usina sugerida">
                                    {suggestedUsinaId || "-"}
                                </Info>

                                <Info label="Parser">
                                    <Chip
                                        label={getStatusLabel(bill.parser_status)}
                                        color={getStatusColor(bill.parser_status)}
                                        size="small"
                                    />
                                </Info>

                                <Info label="Status da revisão">
                                    <Chip
                                        label={getStatusLabel(bill.review_status)}
                                        color={getStatusColor(bill.review_status)}
                                        size="small"
                                    />
                                </Info>

                                <Info label="Criado por">
                                    {bill.created_by?.name || "-"}
                                </Info>

                                <Info label="Revisado por">
                                    {bill.reviewed_by?.name || "-"}
                                </Info>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 2 }}>
                        <CardHeader title="Pendências" />

                        <CardContent>
                            {bill.issues?.length > 0 ? (
                                <Stack spacing={1}>
                                    {bill.issues.map((issue) => (
                                        <Paper key={issue.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                alignItems={{ xs: "flex-start", sm: "center" }}
                                                justifyContent="space-between"
                                                spacing={2}
                                            >
                                                <Box>
                                                    <Typography fontWeight={600}>
                                                        {issue.message ||
                                                            issue.description ||
                                                            issue.type ||
                                                            `Pendência #${issue.id}`}
                                                    </Typography>

                                                    <Typography variant="caption" color="text.secondary">
                                                        {issue.is_resolved ? "Resolvida" : "Pendente"}
                                                    </Typography>
                                                </Box>

                                                {!issue.is_resolved && (
                                                    <Button
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        startIcon={<IconCheck />}
                                                        onClick={() => resolveIssue(issue.id)}
                                                    >
                                                        Resolver
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography>Nenhuma pendência encontrada.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card>
                        <CardHeader
                            title="Correção e Revisão da Fatura"
                            subheader="Edite manualmente os campos inválidos ou incompletos"
                        />

                        <CardContent>
                            <form onSubmit={submit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography fontWeight={700}>Dados principais</Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Nome do titular"
                                            value={data.nome}
                                            error={Boolean(errors.nome)}
                                            helperText={errors.nome}
                                            onChange={(e) => setData("nome", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Unidade Consumidora"
                                            value={data.unidade_consumidora}
                                            error={Boolean(errors.unidade_consumidora)}
                                            helperText={errors.unidade_consumidora}
                                            onChange={(e) => setData("unidade_consumidora", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Número da instalação"
                                            value={data.numero_instalacao}
                                            error={Boolean(errors.numero_instalacao)}
                                            helperText={errors.numero_instalacao}
                                            onChange={(e) => setData("numero_instalacao", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Referência / Mês-Ano"
                                            value={data.reference_label}
                                            error={Boolean(errors.reference_label)}
                                            helperText={errors.reference_label}
                                            onChange={(e) => setData("reference_label", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Vencimento"
                                            value={data.vencimento}
                                            error={Boolean(errors.vencimento)}
                                            helperText={errors.vencimento}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={(e) => setData("vencimento", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Mês de referência"
                                            value={data.reference_month}
                                            error={Boolean(errors.reference_month)}
                                            helperText={errors.reference_month}
                                            onChange={(e) => setData("reference_month", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Ano de referência"
                                            value={data.reference_year}
                                            error={Boolean(errors.reference_year)}
                                            helperText={errors.reference_year}
                                            onChange={(e) => setData("reference_year", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            label="Valor total"
                                            value={data.valor_total}
                                            error={Boolean(errors.valor_total)}
                                            helperText={errors.valor_total || "Exemplo: 50415.00 ou 50.415,00"}
                                            onFocus={() => clearInvalidDecimalOnFocus("valor_total")}
                                            onBlur={() => formatDecimalOnBlur("valor_total")}
                                            onChange={(e) => setData("valor_total", normalizeDecimalTyping(e.target.value))}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            label="Consumo kWh"
                                            value={data.consumo_kwh}
                                            error={Boolean(errors.consumo_kwh)}
                                            helperText={errors.consumo_kwh || "Exemplo: 100 ou 100.50"}
                                            onFocus={() => clearInvalidDecimalOnFocus("consumo_kwh")}
                                            onBlur={() => formatDecimalOnBlur("consumo_kwh")}
                                            onChange={(e) => setData("consumo_kwh", normalizeDecimalTyping(e.target.value))}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth error={Boolean(errors.review_status)}>
                                            <InputLabel>Status da revisão</InputLabel>
                                            <Select
                                                label="Status da revisão"
                                                value={data.review_status}
                                                onChange={(e) => setData("review_status", e.target.value)}
                                            >
                                                {reviewStatuses.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {getStatusLabel(status)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth error={Boolean(errors.usina_id)}>
                                            <InputLabel>Usina vinculada</InputLabel>
                                            <Select
                                                label="Usina vinculada"
                                                value={data.usina_id}
                                                onChange={(e) => setData("usina_id", e.target.value)}
                                            >
                                                <MenuItem value="">Nenhuma</MenuItem>

                                                {usinas.map((usina) => (
                                                    <MenuItem key={usina.id} value={usina.id}>
                                                        UC {usina.uc || usina.id}
                                                        {suggestedUsinaId === usina.id ? " - sugerida" : ""}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            label="Observações da revisão"
                                            value={data.review_notes}
                                            error={Boolean(errors.review_notes)}
                                            helperText={errors.review_notes}
                                            onChange={(e) => setData("review_notes", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            disabled={processing || !hasUnsavedChanges}
                                            startIcon={<IconDeviceFloppy />}
                                        >
                                            Salvar Correções e Revisão
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 2 }}>
                        <CardHeader title="Resumo técnico" />

                        <CardContent>
                            <Stack spacing={1}>
                                <SummaryLine label="Campos analisados" value={requiredFields.length} />
                                <SummaryLine
                                    label="Campos inválidos"
                                    value={invalidFields.length}
                                    danger={invalidFields.length > 0}
                                />
                                <SummaryLine
                                    label="Alterações pendentes"
                                    value={hasUnsavedChanges ? "Sim" : "Não"}
                                    danger={hasUnsavedChanges}
                                />
                                <SummaryLine label="Status do parser" value={bill.parser_status || "Sem status"} />
                                <SummaryLine
                                    label="Arquivo"
                                    value={bill.pdf_original_name || "Inválido"}
                                    danger={!bill.pdf_original_name}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="PDF da Fatura" />

                        <CardContent>
                            <iframe
                                src={route("consultor.cliente.faturas.pdf", bill.id)}
                                title="PDF da fatura"
                                style={{
                                    width: "100%",
                                    height: "720px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
};

const ExtractedField = ({ label, value, validation = "text" }) => {
    const invalid = isInvalidField({ value, validation });

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    borderColor: invalid ? "error.main" : "divider",
                    backgroundColor: invalid ? "rgba(211, 47, 47, 0.04)" : "background.paper",
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>

                <Typography
                    fontWeight={700}
                    color={invalid ? "error.main" : "text.primary"}
                    sx={{ mt: 0.5, wordBreak: "break-word" }}
                >
                    {invalid ? "Inválido" : value}
                </Typography>
            </Paper>
        </Grid>
    );
};

const Info = ({ label, children }) => (
    <Grid item xs={12} md={6}>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>

        <Box sx={{ mt: 0.25 }}>
            {children}
        </Box>
    </Grid>
);

const SummaryLine = ({ label, value, danger = false }) => (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography fontWeight={700} color={danger ? "error.main" : "text.primary"}>
            {value}
        </Typography>
    </Stack>
);

const isInvalid = (value) => {
    return value === null || value === undefined || String(value).trim() === "" || value === "-";
};

const isInvalidNumber = (value) => {
    if (isInvalid(value)) return true;

    const number = parseBrazilianNumber(value);

    return Number.isNaN(number) || number <= 0;
};

const isInvalidField = ({ value, validation = "text" }) => {
    if (validation === "money" || validation === "positive") {
        return isInvalidNumber(value);
    }

    return isInvalid(value);
};

const parseBrazilianNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return NaN;
    }

    if (typeof value === "number") {
        return value;
    }

    let normalized = String(value)
        .replace("R$", "")
        .replace(/\s/g, "")
        .trim();

    const hasComma = normalized.includes(",");
    const hasDot = normalized.includes(".");

    if (hasComma && hasDot) {
        normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else if (hasComma) {
        normalized = normalized.replace(",", ".");
    }

    return Number(normalized);
};

const normalizeNumberForCompare = (value) => {
    const number = parseBrazilianNumber(value);

    return Number.isNaN(number) ? "" : number.toFixed(2);
};

const normalizeDecimalTyping = (value) => {
    return String(value)
        .replace(/[^\d.,]/g, "")
        .replace(/(,.*),/g, "$1")
        .replace(/(\..*)\./g, "$1");
};

const inputDecimalValue = (value) => {
    const number = parseBrazilianNumber(value);

    if (Number.isNaN(number) || number <= 0) {
        return "";
    }

    return String(value);
};

const formatMoney = (value) => {
    if (isInvalid(value)) return "";

    const number = parseBrazilianNumber(value);

    if (Number.isNaN(number)) return value;

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

const formatNumber = (value) => {
    if (isInvalid(value)) return "";

    const number = parseBrazilianNumber(value);

    if (Number.isNaN(number)) return value;

    return number.toLocaleString("pt-BR");
};

const formatDate = (value) => {
    if (isInvalid(value)) return "";

    const valueString = String(value);

    if (/^\d{4}-\d{2}-\d{2}$/.test(valueString)) {
        const [year, month, day] = valueString.split("-");
        return `${day}/${month}/${year}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("pt-BR");
};

const toInputDate = (value) => {
    if (isInvalid(value)) return "";

    const valueString = String(value);

    if (/^\d{4}-\d{2}-\d{2}$/.test(valueString)) {
        return valueString;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toISOString().slice(0, 10);
};

export default Page;

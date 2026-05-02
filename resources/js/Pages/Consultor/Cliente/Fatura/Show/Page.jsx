import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, router, useForm } from "@inertiajs/react";
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
    const { data, setData, put, processing, errors } = useForm({
        review_status: bill.review_status || "pending_review",
        usina_id: bill.usina_id || suggestedUsinaId || "",
        review_notes: bill.review_notes || "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("consultor.cliente.faturas.update", bill.id), {
            preserveScroll: true,
        });
    };

    const approve = () => {
        router.post(route("consultor.cliente.faturas.approve", bill.id), {}, {
            preserveScroll: true,
        });
    };

    const resolveIssue = (issueId) => {
        router.post(route("consultor.cliente.faturas.issues.resolve", issueId), {}, {
            preserveScroll: true,
        });
    };

    const requiredFields = [
        {
            label: "Nome do titular",
            value: bill.nome || bill.extracted_payload?.nome,
        },
        {
            label: "Unidade Consumidora",
            value: bill.unidade_consumidora || bill.extracted_payload?.unidade_consumidora,
        },
        {
            label: "Número da instalação",
            value: bill.numero_instalacao || bill.extracted_payload?.numero_instalacao,
        },
        {
            label: "Referência / Mês-Ano",
            value: bill.reference_label || bill.extracted_payload?.reference_label,
        },
        {
            label: "Mês de referência",
            value: bill.reference_month || bill.extracted_payload?.reference_month,
        },
        {
            label: "Ano de referência",
            value: bill.reference_year || bill.extracted_payload?.reference_year,
        },
        {
            label: "Vencimento",
            value: formatDate(bill.vencimento || bill.extracted_payload?.vencimento),
        },
        {
            label: "Valor total / Valor cobrado",
            value: formatMoney(bill.valor_total || bill.extracted_payload?.valor_total),
        },
        {
            label: "Consumo kWh",
            value: formatNumber(bill.consumo_kwh || bill.extracted_payload?.consumo_kwh),
        },
        {
            label: "Concessionária",
            value: bill.concessionaria?.nome,
        },
        {
            label: "PDF",
            value: bill.pdf_original_name,
        },
        {
            label: "Origem da importação",
            value: bill.import_source,
        },
    ];

    const invalidFields = requiredFields.filter((field) => isInvalid(field.value));

    return (
        <Layout titlePage={`Fatura #${bill.id}`} menu="faturas" subMenu="faturas-show" backPage>
            <Head title={`Fatura #${bill.id}`} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {invalidFields.length > 0 ? (
                        <Alert severity="warning" icon={<IconAlertTriangle />}>
                            Existem {invalidFields.length} campo(s) que não foram extraídos corretamente do PDF.
                        </Alert>
                    ) : (
                        <Alert severity="success">
                            Todos os principais dados da fatura foram extraídos com sucesso.
                        </Alert>
                    )}
                </Grid>

                <Grid item xs={12} md={7}>
                    <Card>
                        <CardHeader
                            title="Dados extraídos do PDF"
                            subheader="Campos principais que precisam ser lidos automaticamente"
                            avatar={<IconFileInvoice />}
                        />

                        <CardContent>
                            <Grid container spacing={2}>
                                {requiredFields.map((field) => (
                                    <ExtractedField
                                        key={field.label}
                                        label={field.label}
                                        value={field.value}
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
                                    disabled={invalidFields.length > 0}
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
                        <CardHeader
                            title="Cliente e vínculo"
                            avatar={<IconReceipt />}
                        />

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
                                    <Chip label={bill.parser_status || "Sem status"} size="small" />
                                </Info>

                                <Info label="Status da revisão">
                                    <Chip label={bill.review_status || "Sem status"} size="small" />
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
                                        <Paper
                                            key={issue.id}
                                            variant="outlined"
                                            sx={{ p: 2, borderRadius: 2 }}
                                        >
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
                        <CardHeader title="Revisão da Fatura" />

                        <CardContent>
                            <form onSubmit={submit}>
                                <Grid container spacing={2}>
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
                                                        {translateStatus(status)}
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
                                            disabled={processing}
                                            startIcon={<IconDeviceFloppy />}
                                        >
                                            Salvar Revisão
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
                                <SummaryLine label="Campos inválidos" value={invalidFields.length} danger={invalidFields.length > 0} />
                                <SummaryLine label="Status do parser" value={bill.parser_status || "Sem status"} />
                                <SummaryLine label="Arquivo" value={bill.pdf_original_name || "Inválido"} danger={!bill.pdf_original_name} />
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

const ExtractedField = ({ label, value }) => {
    const invalid = isInvalid(value);

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

const Info = ({ label, children }) => {
    return (
        <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography>{children}</Typography>
        </Grid>
    );
};

const SummaryLine = ({ label, value, danger = false }) => {
    return (
        <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">{label}</Typography>
            <Typography fontWeight={700} color={danger ? "error.main" : "text.primary"}>
                {value}
            </Typography>
        </Stack>
    );
};

const isInvalid = (value) => {
    return value === null || value === undefined || value === "" || value === "-";
};

const formatMoney = (value) => {
    if (isInvalid(value)) {
        return "";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "";
    }

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

const formatNumber = (value) => {
    if (isInvalid(value)) {
        return "";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "";
    }

    return number.toLocaleString("pt-BR");
};

const formatDate = (value) => {
    if (isInvalid(value)) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("pt-BR");
};

const translateStatus = (status) => {
    const statuses = {
        pending_review: "Pendente de revisão",
        reviewed: "Revisada",
        corrected: "Corrigida",
        approved: "Aprovada",
    };

    return statuses[status] || status;
};

export default Page;

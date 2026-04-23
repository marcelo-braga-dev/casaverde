import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({ bill, suggestedUsinaId, reviewStatuses = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        usina_id: bill.usina_id || suggestedUsinaId || "",
        reference_month: bill.reference_month || "",
        reference_year: bill.reference_year || "",
        unidade_consumidora: bill.unidade_consumidora || "",
        numero_instalacao: bill.numero_instalacao || "",
        vencimento: bill.vencimento || "",
        valor_total: bill.valor_total || "",
        consumo_kwh: bill.consumo_kwh || "",
        notes: bill.notes || "",
        review_status: bill.review_status || "reviewed",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.faturas.update", bill.id));
    };

    const resolveIssue = (issueId) => {
        router.post(route("admin.faturas.issues.resolve", issueId));
    };

    return (
        <Layout titlePage="Revisão de Fatura" menu="financeiro">
            <Head title="Revisão de Fatura" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Dados gerais
                        </Typography>

<Button
    variant="contained"
    color="success"
    onClick={() => router.post(route("admin.faturas.approve", bill.id))}
>
    Aprovar fatura
</Button>

                        <Stack spacing={1}>
                            <Typography>Cliente: {bill.client_profile?.display_name}</Typography>
                            <Typography>Documento: {bill.client_profile?.documento}</Typography>
                            <Typography>Referência: {bill.reference_label}</Typography>
                            <Typography>Origem: {bill.import_source}</Typography>
                            <Typography>Parser: {bill.parser_status}</Typography>
                            <Typography>Status da revisão: {bill.review_status}</Typography>

                            {bill.pdf_link && (
                                <a href={bill.pdf_link} target="_blank" rel="noreferrer">
                                    Abrir PDF
                                </a>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {bill.issues?.length > 0 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" marginBottom={2}>
                                Divergências identificadas
                            </Typography>

                            <Stack spacing={2}>
                                {bill.issues.map((issue) => (
                                    <Card key={issue.id} variant="outlined">
                                        <CardContent>
                                            <Stack spacing={1}>
                                                <Chip
                                                    label={`${issue.issue_code} - ${issue.severity}`}
                                                    color={issue.severity === "error" ? "error" : "warning"}
                                                />
                                                <Typography>{issue.message}</Typography>

                                                {!issue.is_resolved && (
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => resolveIssue(issue.id)}
                                                    >
                                                        Marcar como resolvida
                                                    </Button>
                                                )}

                                                {issue.is_resolved && (
                                                    <Chip label="Resolvida" color="success" />
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent>
                        <Typography variant="h6" marginBottom={2}>
                            Revisar fatura
                        </Typography>

                        <form onSubmit={submit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Mês"
                                        value={data.reference_month}
                                        onChange={(e) => setData("reference_month", e.target.value)}
                                        error={!!errors.reference_month}
                                        helperText={errors.reference_month}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Ano"
                                        value={data.reference_year}
                                        onChange={(e) => setData("reference_year", e.target.value)}
                                        error={!!errors.reference_year}
                                        helperText={errors.reference_year}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Unidade consumidora"
                                        value={data.unidade_consumidora}
                                        onChange={(e) => setData("unidade_consumidora", e.target.value)}
                                        error={!!errors.unidade_consumidora}
                                        helperText={errors.unidade_consumidora}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Número da instalação"
                                        value={data.numero_instalacao}
                                        onChange={(e) => setData("numero_instalacao", e.target.value)}
                                        error={!!errors.numero_instalacao}
                                        helperText={errors.numero_instalacao}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Vencimento"
                                        type="date"
                                        value={data.vencimento}
                                        onChange={(e) => setData("vencimento", e.target.value)}
                                        error={!!errors.vencimento}
                                        helperText={errors.vencimento}
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Valor total"
                                        value={data.valor_total}
                                        onChange={(e) => setData("valor_total", e.target.value)}
                                        error={!!errors.valor_total}
                                        helperText={errors.valor_total}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Consumo kWh"
                                        value={data.consumo_kwh}
                                        onChange={(e) => setData("consumo_kwh", e.target.value)}
                                        error={!!errors.consumo_kwh}
                                        helperText={errors.consumo_kwh}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Status da revisão"
                                        select
                                        value={data.review_status}
                                        onChange={(e) => setData("review_status", e.target.value)}
                                        error={!!errors.review_status}
                                        helperText={errors.review_status}
                                        fullWidth
                                    >
                                        {reviewStatuses.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={12}>
                                    <TextField
                                        label="Observações"
                                        multiline
                                        minRows={4}
                                        value={data.notes}
                                        onChange={(e) => setData("notes", e.target.value)}
                                        error={!!errors.notes}
                                        helperText={errors.notes}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={12}>
                                    <Button type="submit" variant="contained" disabled={processing}>
                                        Salvar revisão
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

                        {bill.raw_text && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h6" marginBottom={2}>
                                    Texto extraído do PDF
                                </Typography>

                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography
                                            component="pre"
                                            sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12 }}
                                        >
                                            {bill.raw_text}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}
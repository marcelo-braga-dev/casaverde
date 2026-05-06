import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, router } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const statusLabels = {
    received: "Recebido",
    processed: "Processado",
    ignored: "Ignorado",
    failed: "Falhou",
};

const statusColors = {
    received: "default",
    processed: "success",
    ignored: "warning",
    failed: "error",
};

const providerLabels = {
    cora: "Cora",
};

function JsonBlock({ value }) {
    if (!value) {
        return (
            <Typography color="text.secondary">
                Nenhum dado registrado.
            </Typography>
        );
    }

    return (
        <TextField
            value={JSON.stringify(value, null, 2)}
            multiline
            minRows={10}
            fullWidth
            InputProps={{
                readOnly: true,
                sx: {
                    fontFamily: "monospace",
                    fontSize: 13,
                },
            }}
        />
    );
}

export default function Page({ event }) {
    const canReprocess = ["failed", "ignored", "received"].includes(event.status);

    const reprocess = () => {
        router.post(route("admin.financeiro.payment-webhooks.reprocess", event.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <Layout titlePage="Webhook de Pagamento" menu="financeiro">
            <Head title={`Webhook #${event.id}`} />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", md: "center" }}
                            spacing={2}
                        >
                            <Stack spacing={0.5}>
                                <Typography variant="h5">
                                    Webhook #{event.id}
                                </Typography>

                                <Typography color="text.secondary">
                                    Provider: {providerLabels[event.provider] || event.provider}
                                </Typography>

                                <Typography color="text.secondary">
                                    Evento: {event.event_type || "-"}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={statusLabels[event.status] || event.status}
                                    color={statusColors[event.status] || "default"}
                                />

                                {canReprocess && (
                                    <Button
                                        variant="contained"
                                        onClick={reprocess}
                                    >
                                        Reprocessar
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Dados do evento
                                </Typography>

                                <Stack spacing={1}>
                                    <Typography>ID externo do evento: {event.event_id || "-"}</Typography>
                                    <Typography>ID pagamento provider: {event.provider_payment_id || "-"}</Typography>
                                    <Typography>Tentativas: {event.attempts || 0}</Typography>
                                    <Typography>Última tentativa: {event.last_attempt_at || "-"}</Typography>
                                    <Typography>Processado em: {event.processed_at || "-"}</Typography>
                                    <Typography>Recebido em: {event.created_at || "-"}</Typography>
                                </Stack>

                                {event.error_message && (
                                    <TextField
                                        label="Erro / Observação"
                                        value={event.error_message}
                                        multiline
                                        minRows={3}
                                        fullWidth
                                        margin="normal"
                                        InputProps={{ readOnly: true }}
                                    />
                                )}

                                <Stack direction="row" spacing={2} marginTop={3}>
                                    {event.payment_slip && (
                                        <Link href={route("admin.financeiro.pagamentos.show", event.payment_slip.id)}>
                                            <Button variant="outlined">
                                                Ver pagamento
                                            </Button>
                                        </Link>
                                    )}

                                    <Link href={route("admin.financeiro.payment-webhooks.index")}>
                                        <Button variant="outlined">
                                            Voltar
                                        </Button>
                                    </Link>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Cliente / Cobrança
                                </Typography>

                                {event.payment_slip?.charge ? (
                                    <Stack spacing={1}>
                                        <Typography>
                                            Cobrança: #{event.payment_slip.charge.id}
                                        </Typography>

                                        <Typography>
                                            Cliente: {
                                            event.payment_slip.charge.client_profile?.display_name ||
                                            event.payment_slip.charge.client_profile?.nome ||
                                            event.payment_slip.charge.client_profile?.razao_social ||
                                            "-"
                                        }
                                        </Typography>

                                        <Link href={route("admin.cobrancas.show", event.payment_slip.charge.id)}>
                                            <Button variant="outlined">
                                                Ver cobrança
                                            </Button>
                                        </Link>
                                    </Stack>
                                ) : (
                                    <Typography color="text.secondary">
                                        Nenhum pagamento/cobrança vinculado a este webhook.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Headers
                                </Typography>

                                <JsonBlock value={event.headers} />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" marginBottom={2}>
                                    Payload
                                </Typography>

                                <JsonBlock value={event.payload} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

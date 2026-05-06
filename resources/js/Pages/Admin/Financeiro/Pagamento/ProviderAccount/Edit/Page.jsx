import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, router, useForm} from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function stringifySettings(settings) {
    if (!settings) {
        return "{}";
    }

    if (typeof settings === "string") {
        return settings;
    }

    return JSON.stringify(settings, null, 2);
}

export default function Page({ account }) {
    const { data, setData, processing, errors } = useForm({
        provider: account.provider || "cora",
        name: account.name || "",
        is_active: Boolean(account.is_active),
        is_default: Boolean(account.is_default),
        environment: account.environment || "sandbox",
        base_url: account.base_url || "",
        client_id: account.client_id || "",
        client_secret: "",
        webhook_secret: "",
        settings: stringifySettings(account.settings),
    });

    const submit = (e) => {
        e.preventDefault();

        router.post(route("admin.financeiro.payment-provider-accounts.update", account.id), {...data, _method: "PUT"})
    };

    return (
        <Layout titlePage="Editar Conta de Pagamento" menu="financeiro" subMenu="financeiro-bancos">
            <Head title="Editar Conta de Pagamento" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Editar provider de pagamento
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Provider"
                                    value={data.provider}
                                    onChange={(e) => setData("provider", e.target.value)}
                                    error={!!errors.provider}
                                    helperText={errors.provider}
                                    fullWidth
                                >
                                    <MenuItem value="cora">Cora</MenuItem>
                                    <MenuItem value="mercado_pago">Mercado Pago</MenuItem>
                                    <MenuItem value="asaas">Asaas</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Nome da conta"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Ambiente"
                                    value={data.environment}
                                    onChange={(e) => setData("environment", e.target.value)}
                                    error={!!errors.environment}
                                    helperText={errors.environment}
                                    fullWidth
                                >
                                    <MenuItem value="sandbox">Sandbox</MenuItem>
                                    <MenuItem value="production">Produção</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Base URL"
                                    value={data.base_url}
                                    onChange={(e) => setData("base_url", e.target.value)}
                                    error={!!errors.base_url}
                                    helperText={errors.base_url}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Client ID"
                                    value={data.client_id}
                                    onChange={(e) => setData("client_id", e.target.value)}
                                    error={!!errors.client_id}
                                    helperText={errors.client_id}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Novo Client Secret"
                                    type="password"
                                    value={data.client_secret}
                                    onChange={(e) => setData("client_secret", e.target.value)}
                                    error={!!errors.client_secret}
                                    helperText={errors.client_secret || "Deixe em branco para manter o atual."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Novo Webhook Secret"
                                    type="password"
                                    value={data.webhook_secret}
                                    onChange={(e) => setData("webhook_secret", e.target.value)}
                                    error={!!errors.webhook_secret}
                                    helperText={errors.webhook_secret || "Deixe em branco para manter o atual."}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Settings JSON"
                                    value={data.settings}
                                    onChange={(e) => setData("settings", e.target.value)}
                                    error={!!errors.settings}
                                    helperText={errors.settings || "Use JSON válido. Exemplo: {}"}
                                    multiline
                                    minRows={5}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.is_active}
                                                onChange={(e) => setData("is_active", e.target.checked)}
                                            />
                                        }
                                        label="Conta ativa"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.is_default}
                                                onChange={(e) => setData("is_default", e.target.checked)}
                                            />
                                        }
                                        label="Conta padrão deste provider"
                                    />
                                </Stack>
                            </Grid>

                            <Grid size={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={processing}
                                >
                                    Salvar alterações
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}

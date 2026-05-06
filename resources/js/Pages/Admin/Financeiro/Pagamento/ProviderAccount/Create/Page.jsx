import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
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

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        provider: "cora",
        name: "",
        is_active: true,
        is_default: false,
        environment: "sandbox",
        base_url: "https://api.stage.cora.com.br",
        client_id: "",
        client_secret: "",
        webhook_secret: "",
        settings: "{}",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.financeiro.payment-provider-accounts.store"));
    };

    return (
        <Layout titlePage="Nova Conta de Pagamento" menu="financeiro" subMenu="financeiro-bancos">
            <Head title="Nova Conta de Pagamento" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Configurar provider de pagamento
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
                                    label="Client Secret"
                                    type="password"
                                    value={data.client_secret}
                                    onChange={(e) => setData("client_secret", e.target.value)}
                                    error={!!errors.client_secret}
                                    helperText={errors.client_secret}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Webhook Secret"
                                    type="password"
                                    value={data.webhook_secret}
                                    onChange={(e) => setData("webhook_secret", e.target.value)}
                                    error={!!errors.webhook_secret}
                                    helperText={errors.webhook_secret}
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
                                    Salvar conta
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}

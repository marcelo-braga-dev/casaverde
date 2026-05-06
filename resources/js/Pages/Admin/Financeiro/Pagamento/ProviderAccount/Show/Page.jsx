import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const providerLabels = {
    cora: "Cora",
    mercado_pago: "Mercado Pago",
    asaas: "Asaas",
};

const environmentLabels = {
    sandbox: "Sandbox",
    production: "Produção",
};

function JsonBlock({ value }) {
    if (!value) {
        return (
            <Typography color="text.secondary">
                Nenhuma configuração adicional registrada.
            </Typography>
        );
    }

    return (
        <TextField
            value={JSON.stringify(value, null, 2)}
            multiline
            minRows={8}
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

export default function Page({ account }) {
    return (
        <Layout titlePage="Conta de Pagamento" menu="financeiro" subMenu="financeiro-bancos">
            <Head title={account.name || "Conta de Pagamento"} />

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
                                    {account.name}
                                </Typography>

                                <Typography color="text.secondary">
                                    Provider: {providerLabels[account.provider] || account.provider}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={account.is_active ? "Ativa" : "Inativa"}
                                    color={account.is_active ? "success" : "default"}
                                />

                                {account.is_default && (
                                    <Chip
                                        label="Padrão"
                                        color="primary"
                                    />
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
                                    Dados gerais
                                </Typography>

                                <Stack spacing={1}>
                                    <Typography>
                                        ID: {account.id}
                                    </Typography>

                                    <Typography>
                                        Provider: {providerLabels[account.provider] || account.provider}
                                    </Typography>

                                    <Typography>
                                        Ambiente: {environmentLabels[account.environment] || account.environment}
                                    </Typography>

                                    <Typography>
                                        Base URL: {account.base_url || "-"}
                                    </Typography>

                                    <Typography>
                                        Client ID: {account.client_id || "-"}
                                    </Typography>

                                    <Typography>
                                        Criado em: {account.created_at || "-"}
                                    </Typography>

                                    <Typography>
                                        Atualizado em: {account.updated_at || "-"}
                                    </Typography>
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                <Stack direction="row" spacing={2}>
                                    <Link href={route("admin.financeiro.payment-provider-accounts.edit", account.id)}>
                                        <Button variant="contained">
                                            Editar
                                        </Button>
                                    </Link>

                                    <Link href={route("admin.financeiro.payment-provider-accounts.index")}>
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
                                    Settings
                                </Typography>

                                <JsonBlock value={account.settings} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Layout>
    );
}

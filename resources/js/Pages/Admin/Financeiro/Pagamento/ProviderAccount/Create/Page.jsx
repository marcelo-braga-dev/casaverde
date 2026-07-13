import { useState } from "react";
import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    FormControlLabel,
    Link,
    MenuItem,
    Stack,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconExternalLink, IconChevronDown } from "@tabler/icons-react";

// Cada provider tem seu próprio nome para "client_id"/"client_secret" e sua própria
// Base URL por ambiente. Isso evita que o usuário precise adivinhar o que colar em
// cada campo genérico do banco (client_id/client_secret servem para credenciais bem
// diferentes dependendo do provider).
//
// Só o Mercado Pago tem o passo a passo detalhado (`walkthrough`) por enquanto — os
// demais providers usam a lista simples (`steps`) até serem documentados da mesma forma.
const PROVIDERS = {
    cora: {
        label: "Cora",
        idLabel: "Client ID",
        secretLabel: "Client Secret",
        baseUrlByEnvironment: {
            sandbox: "https://api.stage.cora.com.br",
            production: "https://api.cora.com.br",
        },
        webhookUrl: "/webhooks/payments/cora",
        panelUrl: "https://developers.cora.com.br",
        panelLabel: "developers.cora.com.br",
        steps: [
            "Crie a integração no painel de desenvolvedores da Cora e gere um Client ID + Client Secret (autenticação OAuth client_credentials).",
            "Use as credenciais de sandbox primeiro para testar sem mexer com dinheiro real.",
            "Em Webhooks, cadastre a URL abaixo e copie o segredo de assinatura gerado para o campo \"Webhook Secret\".",
        ],
    },
    mercado_pago: {
        label: "Mercado Pago",
        idLabel: "Public Key",
        secretLabel: "Access Token",
        baseUrlByEnvironment: {
            sandbox: "https://api.mercadopago.com",
            production: "https://api.mercadopago.com",
        },
        webhookUrl: "/webhooks/payments/mercado-pago",
        panelUrl: "https://www.mercadopago.com.br/developers/panel",
        panelLabel: "mercadopago.com.br/developers/panel",
        walkthrough: [
            {
                title: "Criar a aplicação no painel de desenvolvedores",
                items: [
                    "Acesse o link abaixo e faça login com a conta Mercado Pago da cooperativa (ou crie uma conta).",
                    "Vá em Suas integrações → Criar aplicação.",
                    "Dê um nome (ex.: Casa Verde CRM) e selecione o produto \"Pagamentos online\" → \"CheckoutAPI / Pagamentos\".",
                ],
            },
            {
                title: "Copiar Public Key e Access Token",
                items: [
                    "Dentro da aplicação criada, abra a aba \"Credenciais de teste\" para começar (ou \"Credenciais de produção\" quando for para valer).",
                    "Public Key → cole no campo \"Public Key\" logo abaixo.",
                    "Access Token → cole no campo \"Access Token\" logo abaixo.",
                    "Credenciais de teste começam com TEST-; as de produção começam com APP_USR-.",
                ],
            },
            {
                title: "Configurar o webhook de notificações",
                items: [
                    "Ainda na aplicação, vá em Webhooks → Configurar notificações.",
                    "Informe a URL de notificação mostrada no chip abaixo (troque pelo seu domínio real).",
                    "Marque o evento \"Pagamentos\" (payment) — é o único que este sistema processa.",
                    "Salve e copie a \"Chave secreta de assinatura\" gerada para o campo \"Webhook Secret\" logo abaixo.",
                ],
            },
            {
                title: "Sandbox x Produção",
                items: [
                    "A Base URL é sempre a mesma (api.mercadopago.com) — o que muda é só o Access Token usado.",
                    "Ao trocar o Ambiente para \"Produção\" aqui na tela, lembre de também trocar Public Key, Access Token e recadastrar a URL do webhook em modo produção no painel do Mercado Pago.",
                ],
            },
        ],
    },
    asaas: {
        label: "Asaas",
        disabled: true,
        idLabel: "Client ID",
        secretLabel: "Client Secret",
        baseUrlByEnvironment: { sandbox: "", production: "" },
    },
};

function defaultBaseUrl(provider, environment) {
    return PROVIDERS[provider]?.baseUrlByEnvironment?.[environment] || "";
}

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        provider: "cora",
        name: "",
        is_active: true,
        is_default: false,
        environment: "sandbox",
        base_url: defaultBaseUrl("cora", "sandbox"),
        client_id: "",
        client_secret: "",
        webhook_secret: "",
        settings: "{}",
    });

    const [advancedOpen, setAdvancedOpen] = useState(false);

    const providerInfo = PROVIDERS[data.provider] || {};

    const changeProvider = (provider) => {
        setData((current) => ({
            ...current,
            provider,
            base_url: defaultBaseUrl(provider, current.environment),
        }));
    };

    const changeEnvironment = (environment) => {
        setData((current) => ({
            ...current,
            environment,
            base_url: defaultBaseUrl(current.provider, environment),
        }));
    };

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
                                    onChange={(e) => changeProvider(e.target.value)}
                                    error={!!errors.provider}
                                    helperText={errors.provider}
                                    fullWidth
                                >
                                    <MenuItem value="cora">Cora</MenuItem>
                                    <MenuItem value="mercado_pago">Mercado Pago</MenuItem>
                                    <MenuItem value="asaas" disabled>
                                        Asaas (em breve)
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Nome da conta"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    placeholder={`${providerInfo.label || "Provider"} Principal`}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Ambiente"
                                    value={data.environment}
                                    onChange={(e) => changeEnvironment(e.target.value)}
                                    error={!!errors.environment}
                                    helperText={errors.environment}
                                    fullWidth
                                >
                                    <MenuItem value="sandbox">Sandbox (testes)</MenuItem>
                                    <MenuItem value="production">Produção</MenuItem>
                                </TextField>
                            </Grid>

                            {providerInfo.walkthrough && (
                                <Grid size={12}>
                                    <Box
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "info.main",
                                            borderRadius: 2,
                                            p: 2.5,
                                            bgcolor: "action.hover",
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                            Como conseguir as credenciais da {providerInfo.label} — passo a passo
                                        </Typography>

                                        <Stepper orientation="vertical" nonLinear sx={{ mt: 1 }}>
                                            {providerInfo.walkthrough.map((step, index) => (
                                                <Step key={step.title} active completed={false}>
                                                    <StepLabel>
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {step.title}
                                                        </Typography>
                                                    </StepLabel>
                                                    <StepContent TransitionProps={{ in: true }}>
                                                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                                            {step.items.map((item, itemIndex) => (
                                                                <li key={itemIndex}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {item}
                                                                    </Typography>
                                                                </li>
                                                            ))}
                                                        </Box>

                                                        {index === 2 && (
                                                            <Chip
                                                                size="small"
                                                                label={`URL: ${providerInfo.webhookUrl}`}
                                                                variant="outlined"
                                                                sx={{ mt: 1 }}
                                                            />
                                                        )}
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>

                                        <Link
                                            href={providerInfo.panelUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 1 }}
                                        >
                                            Abrir {providerInfo.panelLabel}
                                            <IconExternalLink size={14} />
                                        </Link>
                                    </Box>
                                </Grid>
                            )}

                            {providerInfo.steps && (
                                <Grid size={12}>
                                    <Alert severity="info" variant="outlined">
                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                            Onde pegar as credenciais da {providerInfo.label}
                                        </Typography>

                                        <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                                            {providerInfo.steps.map((step, index) => (
                                                <li key={index}>
                                                    <Typography variant="body2">{step}</Typography>
                                                </li>
                                            ))}
                                        </Box>

                                        <Stack direction="row" spacing={1} alignItems="center" mt={1.5} flexWrap="wrap" useFlexGap>
                                            <Link
                                                href={providerInfo.panelUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                                            >
                                                {providerInfo.panelLabel}
                                                <IconExternalLink size={14} />
                                            </Link>

                                            <Chip
                                                size="small"
                                                label={`Webhook: ${providerInfo.webhookUrl}`}
                                                variant="outlined"
                                            />
                                        </Stack>
                                    </Alert>
                                </Grid>
                            )}

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label={providerInfo.idLabel || "Client ID"}
                                    value={data.client_id}
                                    onChange={(e) => setData("client_id", e.target.value)}
                                    error={!!errors.client_id}
                                    helperText={errors.client_id}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label={providerInfo.secretLabel || "Client Secret"}
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
                                    helperText={
                                        errors.webhook_secret ||
                                        "Opcional. Deixe em branco em ambiente local — sem ela, o sistema aceita qualquer webhook sem validar assinatura."
                                    }
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
                                <Accordion
                                    expanded={advancedOpen}
                                    onChange={(_, expanded) => setAdvancedOpen(expanded)}
                                    variant="outlined"
                                    sx={{ "&:before": { display: "none" } }}
                                >
                                    <AccordionSummary expandIcon={<IconChevronDown size={18} />}>
                                        <Typography variant="body2" fontWeight={600}>
                                            Configurações avançadas
                                        </Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            <Grid size={12}>
                                                <TextField
                                                    label="Base URL"
                                                    value={data.base_url}
                                                    onChange={(e) => setData("base_url", e.target.value)}
                                                    error={!!errors.base_url}
                                                    helperText={
                                                        errors.base_url ||
                                                        "Preenchida automaticamente pelo provider + ambiente escolhidos. Só altere se souber o que está fazendo."
                                                    }
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
                                                    minRows={4}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
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

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";

export default function Page({ client }) {
    const inviteForm = useForm({
        email: client.email || "",
        expires_in_hours: 48,
    });

    const convertClient = () => {
        router.post(route("admin.user.cliente.convert", client.id));
    };

    const sendInvite = (e) => {
        e.preventDefault();
        inviteForm.post(route("admin.user.cliente.invite", client.id));
    };

    return (
        <Layout titlePage="Cliente" menu="clientes">
            <Head title="Cliente" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" marginBottom={2}>
                            {client.display_name}
                        </Typography>

                        <Stack spacing={1}>
                            <Typography>Código: {client.client_code}</Typography>
                            <Typography>Documento: {client.documento}</Typography>
                            <Typography>Cidade: {client.cidade}</Typography>
                            <Typography>Status: {client.status}</Typography>
                            <Typography>Cliente ativo: {client.is_active_client ? "Sim" : "Não"}</Typography>
                            <Typography>Consultor: {client.consultor?.nome || "-"}</Typography>
                            <Typography>Usuário de plataforma: {client.platform_user?.email || "-"}</Typography>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={1}>
                            <Typography variant="subtitle1">Usina ativa</Typography>
                            <Typography>
                                {client.active_usina_link?.usina?.uc || "Sem vínculo ativo"}
                            </Typography>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={1}>
                            <Typography variant="subtitle1">Desconto ativo</Typography>
                            <Typography>
                                {client.active_discount_rule?.discount_percent || 0}%
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} marginTop={3}>
                            {!client.is_active_client && (
                                <Button variant="contained" onClick={convertClient}>
                                    Converter em cliente ativo
                                </Button>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {client.is_active_client && !client.platform_user_id && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" marginBottom={2}>
                                Enviar convite de acesso
                            </Typography>

                            <form onSubmit={sendInvite}>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Email"
                                        value={inviteForm.data.email}
                                        onChange={(e) => inviteForm.setData("email", e.target.value)}
                                        error={!!inviteForm.errors.email}
                                        helperText={inviteForm.errors.email}
                                        fullWidth
                                    />

                                    <TextField
                                        label="Expira em (horas)"
                                        value={inviteForm.data.expires_in_hours}
                                        onChange={(e) => inviteForm.setData("expires_in_hours", e.target.value)}
                                        error={!!inviteForm.errors.expires_in_hours}
                                        helperText={inviteForm.errors.expires_in_hours}
                                        fullWidth
                                    />

                                    <Button type="submit" variant="contained" disabled={inviteForm.processing}>
                                        Enviar convite
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Layout>
    );
}
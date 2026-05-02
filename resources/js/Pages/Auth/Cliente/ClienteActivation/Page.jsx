import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({ token, invite }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        name: invite?.client_name || "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("cliente.activation.store"));
    };

    return (
        <>
            <Head title="Ativação de conta" />

            <Grid container justifyContent="center" sx={{ minHeight: "100vh", alignItems: "center", p: 2 }}>
                <Grid size={{ xs: 12, sm: 8, md: 5 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" marginBottom={2}>
                                Criar acesso à plataforma
                            </Typography>

                            <Stack spacing={1} marginBottom={3}>
                                <Typography>
                                    Cliente: {invite?.client_name}
                                </Typography>
                                <Typography>
                                    Email: {invite?.email}
                                </Typography>
                                <Typography>
                                    Expira em: {invite?.expires_at}
                                </Typography>
                            </Stack>

                            <form onSubmit={submit}>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Nome"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        fullWidth
                                    />

                                    <TextField
                                        label="Senha"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        fullWidth
                                    />

                                    <TextField
                                        label="Confirmar senha"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        error={!!errors.password_confirmation}
                                        helperText={errors.password_confirmation}
                                        fullWidth
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing}
                                    >
                                        Criar conta
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
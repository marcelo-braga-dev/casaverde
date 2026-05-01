import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({ user }) {
    const contact = user.contatos || {};

    const { data, setData, put, processing, errors } = useForm({
        user_id: user.id,
        email: contact.email || "",
        celular: contact.celular || "",
        celular_2: contact.celular_2 || "",
        telefone: contact.telefone || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.user.cliente.contact.update", user.id));
    };

    return (
        <Layout titlePage="Contatos do Cliente" menu="clientes">
            <Head title="Contatos do Cliente" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Contatos do cliente
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Celular"
                                    value={data.celular}
                                    onChange={(e) => setData("celular", e.target.value)}
                                    error={!!errors.celular}
                                    helperText={errors.celular}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Celular 2"
                                    value={data.celular_2}
                                    onChange={(e) => setData("celular_2", e.target.value)}
                                    error={!!errors.celular_2}
                                    helperText={errors.celular_2}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Telefone"
                                    value={data.telefone}
                                    onChange={(e) => setData("telefone", e.target.value)}
                                    error={!!errors.telefone}
                                    helperText={errors.telefone}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Salvar contatos
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
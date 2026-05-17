import {Head, router, useForm} from "@inertiajs/react";
import Layout from "@/Layouts/UserLayout/Layout.jsx";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default function Page({settings}) {
    const {data, setData, processing, errors} = useForm({
        default_discount_percentage:
            settings.default_discount_percentage ?? 20,
    });

    function submit(e) {
        e.preventDefault();

        router.post(route("admin.settings.update", {...data, _method: "PUT"}));
    }

    return (
        <Layout titlePage="Configurações" menu="config" subMenu="config-defaults">
            <Head title="Configurações"/>

            <Stack spacing={3}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Configurações da Plataforma
                    </Typography>

                    <Typography color="text.secondary">
                        Configurações globais utilizadas em toda a plataforma.
                    </Typography>
                </Box>

                <Card>
                    <CardContent>
                        <form onSubmit={submit}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                    >
                                        Taxa de Redução Padrão
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Todos os novos clientes receberão essa
                                        taxa automaticamente.
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Taxa de Redução (%)"
                                            type="number"
                                            value={
                                                data.default_discount_percentage
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "default_discount_percentage",
                                                    Number(e.target.value)
                                                )
                                            }
                                            error={
                                                !!errors.default_discount_percentage
                                            }
                                            helperText={
                                                errors.default_discount_percentage
                                            }
                                            inputProps={{
                                                min: 0,
                                                max: 100,
                                                step: 0.01,
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Alert severity="info">
                                    Essa configuração será aplicada apenas para
                                    novos clientes.
                                </Alert>

                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing}
                                    >
                                        Salvar Configurações
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}

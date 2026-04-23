import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head } from "@inertiajs/react";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export default function Page({ client }) {
    return (
        <Layout titlePage="Histórico de Desconto" menu="clientes">
            <Head title="Histórico de Desconto" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            {client.display_name}
                        </Typography>
                        <Typography>
                            Documento: {client.documento}
                        </Typography>
                    </CardContent>
                </Card>

                {client.discount_rules?.map((item) => (
                    <Card key={item.id}>
                        <CardContent>
                            <Stack spacing={1}>
                                <Typography>
                                    Desconto: {item.discount_percent}%
                                </Typography>
                                <Typography>
                                    Início: {item.starts_on || "-"}
                                </Typography>
                                <Typography>
                                    Fim: {item.ends_on || "-"}
                                </Typography>
                                <Chip
                                    label={item.is_active ? "Regra ativa" : "Histórico"}
                                    color={item.is_active ? "success" : "default"}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Layout>
    );
}
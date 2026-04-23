import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head } from "@inertiajs/react";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export default function Page({ client }) {
    return (
        <Layout titlePage="Histórico de Usinas do Cliente" menu="clientes">
            <Head title="Histórico de Usinas do Cliente" />

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

                {client.usina_links?.map((item) => (
                    <Card key={item.id}>
                        <CardContent>
                            <Stack spacing={1}>
                                <Typography>
                                    Usina: {item.usina?.uc || `Usina #${item.usina_id}`}
                                </Typography>
                                <Typography>
                                    Início: {item.started_at || "-"}
                                </Typography>
                                <Typography>
                                    Fim: {item.ended_at || "-"}
                                </Typography>
                                <Chip
                                    label={item.is_active ? "Vínculo ativo" : "Histórico"}
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
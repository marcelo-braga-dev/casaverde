import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Page({ producers }) {
    return (
        <Layout titlePage="Perfis de Produtor" menu="produtores">
            <Head title="Perfis de Produtor" />

            <Stack spacing={3}>
                <Link href={route("admin.producer-profiles.create")}>
                    <Button variant="contained">Novo perfil de produtor</Button>
                </Link>

                {producers?.data?.map((producer) => (
                    <Link key={producer.id} href={route("admin.producer-profiles.show", producer.id)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {producer.usina_nome || producer.admin_nome || `Produtor #${producer.id}`}
                                </Typography>
                                <Typography>Administrador: {producer.admin_nome || "-"}</Typography>
                                <Typography>UC: {producer.unidade_consumidora || "-"}</Typography>
                                <Typography>Status: {producer.status}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </Layout>
    );
}
import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export default function Page({ concessionaria }) {
    return (
        <Layout titlePage="Concessionária" menu="config">
            <Head title="Concessionária" />

            <Card>
                <CardContent>
                    <Typography variant="h5" marginBottom={2}>
                        {concessionaria.nome}
                    </Typography>

                    <Stack spacing={1}>
                        <Typography>Estado: {concessionaria.estado}</Typography>
                        <Typography>Tarifa GD2: {concessionaria.tarifa_gd2}</Typography>
                        <Typography>Status: {concessionaria.status}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Link href={route("admin.concessionarias.edit", concessionaria.id)}>
                        <Button variant="contained">Editar</Button>
                    </Link>
                </CardContent>
            </Card>
        </Layout>
    );
}
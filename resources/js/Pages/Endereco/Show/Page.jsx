import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export default function Page({ address }) {
    return (
        <Layout titlePage="Endereço" menu="config">
            <Head title="Endereço" />

            <Card>
                <CardContent>
                    <Typography variant="h5" marginBottom={2}>
                        Endereço #{address.id}
                    </Typography>

                    <Stack spacing={1}>
                        <Typography>CEP: {address.cep || "-"}</Typography>
                        <Typography>Rua: {address.rua || "-"}</Typography>
                        <Typography>Número: {address.numero || "-"}</Typography>
                        <Typography>Complemento: {address.complemento || "-"}</Typography>
                        <Typography>Bairro: {address.bairro || "-"}</Typography>
                        <Typography>Cidade: {address.cidade || "-"}</Typography>
                        <Typography>Estado: {address.estado || "-"}</Typography>
                        <Typography>Referência: {address.referencia || "-"}</Typography>
                        <Typography>Latitude: {address.latitude || "-"}</Typography>
                        <Typography>Longitude: {address.longitude || "-"}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Link href={route("admin.addresses.edit", address.id)}>
                        <Button variant="contained">Editar</Button>
                    </Link>
                </CardContent>
            </Card>
        </Layout>
    );
}
import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Page({ addresses }) {
    return (
        <Layout titlePage="Endereços" menu="config">
            <Head title="Endereços" />

            <Stack spacing={3}>
                <Link href={route("admin.addresses.create")}>
                    <Button variant="contained">Novo endereço</Button>
                </Link>

                {addresses?.data?.map((address) => (
                    <Link key={address.id} href={route("admin.addresses.show", address.id)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {address.rua || "-"}, {address.numero || "-"}
                                </Typography>
                                <Typography>
                                    {address.bairro || "-"} - {address.cidade || "-"} / {address.estado || "-"}
                                </Typography>
                                <Typography>CEP: {address.cep || "-"}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </Layout>
    );
}
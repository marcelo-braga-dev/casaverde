import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Page({ concessionarias }) {
    return (
        <Layout titlePage="Concessionárias" menu="config">
            <Head title="Concessionárias" />

            <Stack spacing={3}>
                <Link href={route("admin.concessionarias.create")}>
                    <Button variant="contained">Nova concessionária</Button>
                </Link>

                {concessionarias?.data?.map((item) => (
                    <Link key={item.id} href={route("admin.concessionarias.show", item.id)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{item.nome}</Typography>
                                <Typography>Estado: {item.estado}</Typography>
                                <Typography>Tarifa GD2: {item.tarifa_gd2}</Typography>
                                <Typography>Status: {item.status}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </Layout>
    );
}
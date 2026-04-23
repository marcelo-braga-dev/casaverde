import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Page({ usinas }) {
    return (
        <Layout titlePage="Usinas" menu="config">
            <Head title="Usinas" />

            <Stack spacing={3}>
                <Link href={route("admin.usinas.create")}>
                    <Button variant="contained">Nova usina</Button>
                </Link>

                {usinas?.data?.map((usina) => (
                    <Link key={usina.id} href={route("admin.usinas.show", usina.id)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {usina.uc || `Usina #${usina.id}`}
                                </Typography>
                                <Typography>Concessionária: {usina.concessionaria?.nome || "-"}</Typography>
                                <Typography>Bloco: {usina.block?.nome || "-"}</Typography>
                                <Typography>Status: {usina.status}</Typography>
                                <Typography>Potência: {usina.potencia_usina || "-"}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </Layout>
    );
}
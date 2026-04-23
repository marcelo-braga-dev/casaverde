import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export default function Page({ block }) {
    return (
        <Layout titlePage="Bloco de Usina" menu="config">
            <Head title="Bloco de Usina" />

            <Card>
                <CardContent>
                    <Typography variant="h5" marginBottom={2}>
                        {block.nome}
                    </Typography>

                    <Stack spacing={1}>
                        <Typography>Descrição: {block.descricao || "-"}</Typography>
                        <Typography>Status: {block.status}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" marginBottom={2}>
                        Usinas do bloco
                    </Typography>

                    <Stack spacing={1}>
                        {block.usinas?.length > 0 ? block.usinas.map((usina) => (
                            <Typography key={usina.id}>
                                {usina.uc || `Usina #${usina.id}`}
                            </Typography>
                        )) : (
                            <Typography>Nenhuma usina vinculada.</Typography>
                        )}
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Link href={route("admin.usina-blocks.edit", block.id)}>
                        <Button variant="contained">Editar</Button>
                    </Link>
                </CardContent>
            </Card>
        </Layout>
    );
}
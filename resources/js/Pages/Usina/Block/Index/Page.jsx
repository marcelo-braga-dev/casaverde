import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Page({ blocks }) {
    return (
        <Layout titlePage="Blocos de Usina" menu="config">
            <Head title="Blocos de Usina" />

            <Stack spacing={3}>
                <Link href={route("admin.usina-blocks.create")}>
                    <Button variant="contained">Novo bloco</Button>
                </Link>

                {blocks?.data?.map((block) => (
                    <Link key={block.id} href={route("admin.usina-blocks.show", block.id)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{block.nome}</Typography>
                                <Typography>Descrição: {block.descricao || "-"}</Typography>
                                <Typography>Status: {block.status}</Typography>
                                <Typography>Usinas: {block.usinas_count || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </Layout>
    );
}
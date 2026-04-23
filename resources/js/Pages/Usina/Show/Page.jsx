import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export default function Page({ usina }) {
    return (
        <Layout titlePage="Usina" menu="config">
            <Head title="Usina" />

            <Card>
                <CardContent>
                    <Typography variant="h5" marginBottom={2}>
                        {usina.uc || `Usina #${usina.id}`}
                    </Typography>

                    <Stack spacing={1}>
                        <Typography>Consultor: {usina.consultor?.name || "-"}</Typography>
                        <Typography>Concessionária: {usina.concessionaria?.nome || "-"}</Typography>
                        <Typography>Bloco: {usina.block?.nome || "-"}</Typography>
                        <Typography>Status: {usina.status}</Typography>
                        <Typography>Média de geração: {usina.media_geracao || "-"}</Typography>
                        <Typography>Prazo de locação: {usina.prazo_locacao || "-"}</Typography>
                        <Typography>Potência: {usina.potencia_usina || "-"}</Typography>
                        <Typography>Taxa de comissão: {usina.taxa_comissao || "-"}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" marginBottom={2}>
                        Equipamentos
                    </Typography>

                    <Stack spacing={1}>
                        <Typography>Inversores: {usina.inversores || "-"}</Typography>
                        <Typography>Módulos: {usina.modulos || "-"}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" marginBottom={2}>
                        Clientes vinculados
                    </Typography>

                    <Stack spacing={1}>
                        {usina.client_links?.length > 0 ? usina.client_links.map((link) => (
                            <Typography key={link.id}>
                                {link.client_profile?.display_name || `Cliente #${link.client_profile_id}`}
                            </Typography>
                        )) : (
                            <Typography>Nenhum cliente vinculado.</Typography>
                        )}
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Link href={route("admin.usinas.edit", usina.id)}>
                        <Button variant="contained">Editar</Button>
                    </Link>
                </CardContent>
            </Card>
        </Layout>
    );
}
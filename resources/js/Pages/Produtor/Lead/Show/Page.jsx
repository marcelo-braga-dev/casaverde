import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export default function Page({ lead }) {
    return (
        <Layout titlePage="Lead de Produtor" menu="produtores">
            <Head title="Lead de Produtor" />

            <Card>
                <CardContent>
                    <Typography variant="h5" marginBottom={2}>
                        {lead.producer_profile?.usina_nome || `Lead #${lead.id}`}
                    </Typography>

                    <Stack spacing={1}>
                        <Typography>Consultor: {lead.consultor?.name || "-"}</Typography>
                        <Typography>Concessionária: {lead.concessionaria?.nome || "-"}</Typography>
                        <Typography>Status: {lead.status}</Typography>
                        <Typography>Taxa de redução: {lead.taxa_reducao || "-"}</Typography>
                        <Typography>Prazo de locação: {lead.prazo_locacao || "-"}</Typography>
                        <Typography>Potência: {lead.potencia || "-"}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Typography>Observações: {lead.notes || "-"}</Typography>

                    <Divider sx={{ my: 3 }} />

                    <Link href={route("admin.producer-leads.edit", lead.id)}>
                        <Button variant="contained">Editar</Button>
                    </Link>
                </CardContent>
            </Card>
        </Layout>
    );
}
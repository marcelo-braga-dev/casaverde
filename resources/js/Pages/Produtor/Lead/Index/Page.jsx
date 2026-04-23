import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Page({ leads }) {
    return (
        <Layout titlePage="Leads de Produtor" menu="produtores">
            <Head title="Leads de Produtor" />

            <Stack spacing={3}>
                <Link href={route("admin.producer-leads.create")}>
                    <Button variant="contained">Novo lead</Button>
                </Link>

                {leads?.data?.map((lead) => (
                    <Link key={lead.id} href={route("admin.producer-leads.show", lead.id)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {lead.producer_profile?.usina_nome || `Lead #${lead.id}`}
                                </Typography>
                                <Typography>Consultor: {lead.consultor?.name || "-"}</Typography>
                                <Typography>Concessionária: {lead.concessionaria?.nome || "-"}</Typography>
                                <Typography>Status: {lead.status}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </Layout>
    );
}
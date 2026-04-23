import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export default function Page({ proposal }) {
    return (
        <Layout titlePage="Proposta Comercial" menu="propostas">
            <Head title="Proposta Comercial" />

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" marginBottom={2}>
                            Proposta {proposal.proposal_code}
                        </Typography>

                        <Stack spacing={1}>
                            <Typography>
                                Cliente: {proposal.client_profile?.display_name}
                            </Typography>
                            <Typography>
                                Documento: {proposal.client_profile?.documento}
                            </Typography>
                            <Typography>
                                Cidade: {proposal.client_profile?.cidade}
                            </Typography>
                            <Typography>
                                Consultor: {proposal.consultor?.nome}
                            </Typography>
                            <Typography>
                                Concessionária: {proposal.concessionaria?.nome || "-"}
                            </Typography>
                            <Typography>
                                Data de emissão: {proposal.issued_at}
                            </Typography>
                            <Typography>
                                Validade: {proposal.valid_until || "-"}
                            </Typography>
                            <Typography>
                                Status: {proposal.status}
                            </Typography>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={1}>
                            <Typography>
                                Média de consumo: {proposal.media_consumo || "-"} kWh
                            </Typography>
                            <Typography>
                                Taxa de redução: {proposal.taxa_reducao || "-"}%
                            </Typography>
                            <Typography>
                                Prazo de locação: {proposal.prazo_locacao || "-"} meses
                            </Typography>
                            <Typography>
                                Valor médio: {proposal.valor_medio || "-"}
                            </Typography>
                            <Typography>
                                Unidade consumidora: {proposal.unidade_consumidora || "-"}
                            </Typography>
                        </Stack>

                        {proposal.notes && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="subtitle1" marginBottom={1}>
                                    Observações
                                </Typography>
                                <Typography>{proposal.notes}</Typography>
                            </>
                        )}

                        <Stack direction="row" spacing={2} marginTop={3}>
                            <Link href={route("admin.propostas.pdf", proposal.id)} target="_blank">
                                <Button variant="contained">
                                    Abrir PDF
                                </Button>
                            </Link>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}